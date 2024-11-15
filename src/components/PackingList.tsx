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
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Packing List</h2>
        <div className="flex gap-2">
          <button
            onClick={handleGochuMeUp}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            + Add camping essentials
          </button>
          <button
            onClick={handleDestroyAll}
            className="text-sm text-red-600 hover:text-red-900"
          >
            Delete All
          </button>
        </div>
      </div>

      <form onSubmit={handleAddItem} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="Add new item..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Add
          </button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left p-2 text-sm font-medium text-gray-500">Item</th>
              <th className="p-2 text-sm font-medium text-gray-500">Breezy</th>
              <th className="p-2 text-sm font-medium text-gray-500">Six</th>
              <th className="p-2 text-sm font-medium text-gray-500">Yoseb</th>
              <th className="p-2 text-sm font-medium text-gray-500">Yims</th>
              <th className="p-2 text-sm font-medium text-gray-500">JackyP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map(item => (
              <tr key={item.id}>
                <td className="p-2 flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  <span className="text-gray-900">{item.item}</span>
                </td>
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={item.breezy}
                    onChange={() => handleCheckboxChange(item.id, 'breezy')}
                    className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  />
                </td>
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={item.six}
                    onChange={() => handleCheckboxChange(item.id, 'six')}
                    className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  />
                </td>
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={item.yoseb}
                    onChange={() => handleCheckboxChange(item.id, 'yoseb')}
                    className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  />
                </td>
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={item.yims}
                    onChange={() => handleCheckboxChange(item.id, 'yims')}
                    className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  />
                </td>
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={item.jackyP}
                    onChange={() => handleCheckboxChange(item.id, 'jackyP')}
                    className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PackingList;
