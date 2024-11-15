import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../firebase';
import { Trash2, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { useTheme } from '../contexts/ThemeContext';

interface Photo {
  id: string;
  imageUrl: string;
  originalUrl: string;
  caption: string;
  createdAt: any;
  userName: string;
}

type Tab = 'upload' | 'view';

const PhotoAlbum: React.FC = () => {
  const { theme } = useTheme();
  
  const textColor = theme === 'winxp' ? 'text-black' : 'text-white';
  const buttonTextColor = theme === 'winxp' ? 'text-black' : 'text-white';
  const buttonHoverColor = theme === 'winxp' ? 'hover:text-gray-700' : 'hover:text-gray-300';
  const activeButtonBg = theme === 'winxp' ? 'bg-gray-900' : 'bg-purple-600';

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('view');
  const [loading, setLoading] = useState(true);

  const resetForm = () => {
    setCaption('');
    setImage(null);
    if (document.getElementById('photoInput')) {
      (document.getElementById('photoInput') as HTMLInputElement).value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !auth.currentUser || uploading) return;

    try {
      setUploading(true);
      
      // Upload original image
      const originalRef = ref(storage, `photos/original_${Date.now()}_${image.name}`);
      await uploadBytes(originalRef, image);
      const originalUrl = await getDownloadURL(originalRef);
      
      // Create and upload thumbnail
      const thumbnail = await createThumbnail(image);
      const thumbnailRef = ref(storage, `photos/thumb_${Date.now()}_${image.name}`);
      await uploadBytes(thumbnailRef, thumbnail);
      const thumbnailUrl = await getDownloadURL(thumbnailRef);

      await addDoc(collection(db, 'photos'), {
        imageUrl: thumbnailUrl,
        originalUrl: originalUrl,
        caption,
        createdAt: serverTimestamp(),
        userName: auth.currentUser.displayName || 'Anonymous',
        userId: auth.currentUser.uid
      });

      resetForm();
      setActiveTab('view');
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    console.log('Current photos:', photos);
  }, [photos]);

  useEffect(() => {
    setLoading(true);
    try {
      const q = query(collection(db, 'photos'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newPhotos = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Photo[];
        setPhotos(newPhotos);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching photos:", error);
        setLoading(false);
      });

      return () => {
        try {
          unsubscribe();
        } catch (error) {
          console.error("Error unsubscribing:", error);
        }
      };
    } catch (error) {
      console.error("Error setting up photos listener:", error);
      setLoading(false);
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleDelete = async (photoId: string) => {
    if (!auth.currentUser) return;
    if (window.confirm('Are you sure you want to delete this photo?')) {
      try {
        await deleteDoc(doc(db, 'photos', photoId));
      } catch (error) {
        console.error('Error deleting photo:', error);
      }
    }
  };

  const createThumbnail = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const size = 500; // Fixed thumbnail size
        
        canvas.width = size;
        canvas.height = size;
        
        if (ctx) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, size, size);

          // Calculate dimensions to fit entire image in square
          const scale = Math.min(size / img.width, size / img.height);
          const scaledWidth = img.width * scale;
          const scaledHeight = img.height * scale;

          // Center the image
          const x = (size - scaledWidth) / 2;
          const y = (size - scaledHeight) / 2;
          
          ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
          
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
          }, 'image/jpeg', 0.8);
        }
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageClick = (originalUrl: string) => {
    window.open(originalUrl, '_blank');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-semibold ${textColor}`}>Photo Album</h2>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              activeTab === 'upload'
                ? `${activeButtonBg} text-white`
                : `${buttonTextColor} ${buttonHoverColor}`
            }`}
            onClick={() => setActiveTab('upload')}
          >
            Upload
          </button>
          <button
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              activeTab === 'view'
                ? `${activeButtonBg} text-white`
                : `${buttonTextColor} ${buttonHoverColor}`
            }`}
            onClick={() => setActiveTab('view')}
          >
            View Photos
          </button>
        </div>
      </div>

      {activeTab === 'upload' ? (
        <div className="text-black">
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
            <form onSubmit={handleSubmit} className="w-full max-w-md">
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="cursor-pointer flex flex-col items-center gap-2 mb-4 p-8 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Upload size={24} className="text-gray-400" />
                <span className="text-sm text-gray-600">
                  {image ? image.name : 'Click to upload a photo'}
                </span>
              </label>
              
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 mb-4"
              />
              
              <button
                type="submit"
                disabled={!image || uploading}
                className="w-full px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400"
              >
                {uploading ? 'Uploading...' : 'Upload Photo'}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="text-black">
          <div className="grid grid-cols-2 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="relative pt-[100%]">
                  <img
                    src={photo.imageUrl}
                    alt={photo.caption || 'Uploaded photo'}
                    className="absolute inset-0 w-full h-full object-contain bg-white cursor-pointer"
                    onClick={() => handleImageClick(photo.originalUrl)}
                  />
                </div>
                <div className="p-3">
                  {photo.caption && (
                    <p className="text-gray-900 mb-1">{photo.caption}</p>
                  )}
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{photo.userName}</span>
                    <span>
                      {photo.createdAt?.toDate?.() ? 
                        format(photo.createdAt.toDate(), 'MMM d, yyyy') : 
                        'Just now'
                      }
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="absolute top-2 right-2 p-1 bg-white/80 rounded-full text-gray-600 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoAlbum;
