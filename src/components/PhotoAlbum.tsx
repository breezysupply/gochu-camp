import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../firebase';

interface Photo {
  id: string;
  imageUrl: string;
  caption: string;
  createdAt: any;
  userName: string;
}

const PhotoAlbum: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'photos'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newPhotos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Photo[];
      setPhotos(newPhotos);
    });

    return () => unsubscribe();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !auth.currentUser) return;

    try {
      setUploading(true);
      const storageRef = ref(storage, `photos/${Date.now()}_${image.name}`);
      
      // Upload the image
      const uploadTask = uploadBytes(storageRef, image);
      await uploadTask;
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);

      // Add to Firestore
      await addDoc(collection(db, 'photos'), {
        imageUrl: downloadURL,
        caption,
        createdAt: serverTimestamp(),
        userName: auth.currentUser.displayName || 'Anonymous',
        userId: auth.currentUser.uid
      });

      // Reset form
      setCaption('');
      setImage(null);
      if (document.getElementById('photoInput')) {
        (document.getElementById('photoInput') as HTMLInputElement).value = '';
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
          <div>
            <label className="block mb-2">Add Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            />
          </div>
          <div>
            <label className="block mb-2">Caption</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
              rows={3}
            />
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </button>
        </form>

        <div className="space-y-6">
          {photos.map((photo) => (
            <div key={photo.id} className="bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={photo.imageUrl}
                alt={photo.caption}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{photo.caption}</h3>
                <p className="text-sm text-gray-500">{photo.userName}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhotoAlbum;
