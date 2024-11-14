import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, onSnapshot, serverTimestamp, updateDoc, doc, deleteDoc, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { Trash2, XCircle } from 'lucide-react';

interface PackingItem {
  id: string;
  item: string;
  breezy: boolean;
  six: boolean;
  yoseb: boolean;
  yims: boolean;
  jackyP: boolean;
}

const PackingList: React.FC = () => {
  const [items, setItems] = useState<PackingItem[]>([]);
  const [newItem, setNewItem] = useState('');

  const defaultItems = [
    "Tent",
    "Sleeping Bag",
    "Camping Chair",
    "Headlamp",
    "Water Bottle"
  ];

  const handleDelete = async (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const docRef = doc(db, 'packingList', itemId);
      await deleteDoc(docRef);
    }
  };

  const handleDestroyAll = async () => {
    if (window.confirm('Are you sure you want to delete ALL items? This cannot be undone.')) {
      const batch = writeBatch(db);
      const snapshot = await getDocs(collection(db, 'packingList'));
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    }
  };

  const handleGochuMeUp = async () => {
    const q = query(collection(db, 'packingList'));
    const snapshot = await getDocs(q);
    
    if (snapshot.docs.length > 0) {
      if (!window.confirm('List already has items. Add default items anyway?')) {
        return;
      }
    }

    for (const item of defaultItems) {
      await addDoc(collection(db, 'packingList'), {
        item,
        breezy: false,
        six: false,
        yoseb: false,
        yims: false,
        jackyP: false,
        createdAt: serverTimestamp(),
      });
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    await addDoc(collection(db, 'packingList'), {
      item: newItem,
      breezy: false,
      six: false,
      yoseb: false,
      yims: false,
      jackyP: false,
      createdAt: serverTimestamp(),
    });

    setNewItem('');
  };

  const handleCheckboxChange = async (itemId: string, field: keyof PackingItem) => {
    const docRef = doc(db, 'packingList', itemId);
    const item = items.find(i => i.id === itemId);
    if (item) {
      await updateDoc(docRef, {
        [field]: !item[field]
      });
    }
  };

  useEffect(() => {
    try {
      console.log('Setting up packing list listener');
      const q = query(collection(db, 'packingList'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        console.log('Received packing list update:', snapshot.docs.length, 'items');
        const newItems = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as PackingItem[];
        console.log('Processed items:', newItems);
        setItems(newItems);
      }, (error) => {
        console.error('Error in packing list listener:', error);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up packing list listener:', error);
    }
  }, []);

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-4 mb-6">
          <button
            onClick={handleGochuMeUp}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Gochu Me Up
          </button>
          <button
            onClick={handleDestroyAll}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Destroy All
          </button>
        </div>
        
        <form onSubmit={handleAddItem} className="mb-6 flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add new item..."
            className="flex-1 p-2 rounded bg-gray-800 text-white border border-gray-700"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-2">Item</th>
                <th className="p-2">Breezy</th>
                <th className="p-2">Six</th>
                <th className="p-2">Yoseb</th>
                <th className="p-2">Yims</th>
                <th className="p-2">JackyP</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b border-gray-700">
                  <td className="p-2 flex items-center gap-2">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                    {item.item}
                  </td>
                  <td className="p-2 text-center">
                    <input 
                      type="checkbox" 
                      checked={item.breezy} 
                      onChange={() => handleCheckboxChange(item.id, 'breezy')}
                      className="accent-purple-600 h-5 w-5"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <input 
                      type="checkbox" 
                      checked={item.six} 
                      onChange={() => handleCheckboxChange(item.id, 'six')}
                      className="accent-purple-600 h-5 w-5"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <input 
                      type="checkbox" 
                      checked={item.yoseb} 
                      onChange={() => handleCheckboxChange(item.id, 'yoseb')}
                      className="accent-purple-600 h-5 w-5"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <input 
                      type="checkbox" 
                      checked={item.yims} 
                      onChange={() => handleCheckboxChange(item.id, 'yims')}
                      className="accent-purple-600 h-5 w-5"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <input 
                      type="checkbox" 
                      checked={item.jackyP} 
                      onChange={() => handleCheckboxChange(item.id, 'jackyP')}
                      className="accent-purple-600 h-5 w-5"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PackingList;
