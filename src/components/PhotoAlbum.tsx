import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../firebase';
import { format } from 'date-fns';

interface Photo {
  id: string;
  imageUrl: string;
  caption: string;
  createdAt: any;
  userName: string;
}

type Tab = 'upload' | 'view';

const PhotoAlbum: React.FC = () => {
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
      const storageRef = ref(storage, `photos/${Date.now()}_${image.name}`);
      
      await uploadBytes(storageRef, image);
      const downloadURL = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'photos'), {
        imageUrl: downloadURL,
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

  return (
    <div className="h-full flex flex-col">
      <div className="windows-toolbar mb-4 bg-[#ECE9D8] border border-[#919B9C] p-2">
        <button 
          className={`px-4 py-1 border border-[#919B9C] mr-2 ${
            activeTab === 'upload' ? 'bg-white' : 'bg-[#ECE9D8] active:bg-[#DADADA]'
          }`}
          onClick={() => setActiveTab('upload')}
        >
          Upload
        </button>
        <button 
          className={`px-4 py-1 border border-[#919B9C] ${
            activeTab === 'view' ? 'bg-white' : 'bg-[#ECE9D8] active:bg-[#DADADA]'
          }`}
          onClick={() => setActiveTab('view')}
        >
          View Photos
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 bg-white border border-[#919B9C]">
        {activeTab === 'upload' ? (
          <form onSubmit={handleSubmit} className="mb-6 space-y-4 bg-[#ECE9D8] p-4 border border-[#919B9C]">
            <div>
              <label className="block mb-2 text-[#000080]">Add Photo</label>
              <input
                id="photoInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 bg-white border border-[#919B9C]"
              />
            </div>
            <div>
              <label className="block mb-2 text-[#000080]">Caption</label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full p-2 bg-white border border-[#919B9C]"
                rows={3}
              />
            </div>
            <button
              type="submit"
              disabled={uploading}
              className="w-full px-4 py-2 bg-[#ECE9D8] border border-[#919B9C] active:bg-[#DADADA] disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload Photo'}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            {loading ? (
              <div className="text-center p-4">Loading photos...</div>
            ) : photos.length === 0 ? (
              <div className="text-center p-4">No photos uploaded yet.</div>
            ) : (
              photos.map((photo) => (
                <div key={photo.id} className="bg-[#ECE9D8] border border-[#919B9C] p-4">
                  <img
                    src={photo.imageUrl}
                    alt={photo.caption}
                    className="w-full max-h-[500px] object-contain border border-[#919B9C]"
                  />
                  <div className="mt-2 p-4 bg-white border border-[#919B9C]">
                    <p className="text-lg mb-2">{photo.caption}</p>
                    <div className="text-sm text-gray-600">
                      <p>Posted by: {photo.userName}</p>
                      {photo.createdAt && (
                        <p>Posted on: {new Date(photo.createdAt.toDate()).toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoAlbum;
