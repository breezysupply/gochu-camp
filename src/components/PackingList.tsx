import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, onSnapshot, serverTimestamp, updateDoc, doc, deleteDoc, getDocs, writeBatch, orderBy } from 'firebase/firestore';
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

  useEffect(() => {
    const q = query(
      collection(db, 'packingList'),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as PackingItem)));
    });
    return () => unsubscribe();
  }, []);

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

    const campingGear = [
      'Tent',
      'Sleeping Bag',
      'Camping Chair',
      'Headlamp',
      'Water Bottle',
      'First Aid Kit',
      'Matches/Lighter',
      'Multi-tool',
      'Insect Repellent',
      'Sunscreen'
    ];

    for (const item of campingGear) {
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

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleGochuMeUp}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Gochu Me Up
          </button>
          <button
            onClick={handleDestroyAll}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2"
          >
            <XCircle size={20} />
            Destroy All
          </button>
        </div>

        <form onSubmit={handleAddItem} className="mb-4 flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            className="flex-1 px-4 py-2 bg-gray-800 text-white rounded border border-gray-700"
            placeholder="Add new item..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
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
