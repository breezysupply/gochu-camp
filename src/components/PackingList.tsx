import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, onSnapshot, serverTimestamp, updateDoc, doc, deleteDoc, getDocs, writeBatch, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Trash2, XCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

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
  const { theme } = useTheme();
  const [items, setItems] = useState<PackingItem[]>([]);
  const [newItem, setNewItem] = useState('');

  const textColor = theme === 'winxp' ? 'text-black' : 'text-white';
  const borderColor = theme === 'winxp' ? 'border-gray-300' : 'border-gray-700';
  const hoverColor = theme === 'winxp' ? 'hover:text-gray-700' : 'hover:text-gray-300';
  const inputBg = theme === 'winxp' ? 'bg-white' : 'bg-[#1e293b]';
  const addButtonBg = theme === 'winxp' ? 'bg-gray-900' : 'bg-purple-600';
  const addButtonHoverBg = theme === 'winxp' ? 'hover:bg-gray-800' : 'hover:bg-purple-700';

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
        <h2 className={`text-xl font-semibold ${textColor}`}>Packing List</h2>
        <div className="flex gap-2">
          <button
            onClick={handleGochuMeUp}
            className={`text-sm ${textColor} ${hoverColor}`}
          >
            + Add camping essentials
          </button>
          <button
            onClick={handleDestroyAll}
            className="text-sm text-red-600 hover:text-red-700"
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
            className={`flex-1 px-4 py-2 ${inputBg} border ${borderColor} rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 ${textColor}`}
            placeholder="Add new item..."
          />
          <button
            type="submit"
            className={`px-4 py-2 ${addButtonBg} text-white rounded-md ${addButtonHoverBg}`}
          >
            Add
          </button>
        </div>
      </form>

      <div className="w-full">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${borderColor}`}>
              <th className={`text-left p-2 text-sm font-medium ${textColor} w-1/2`}>Item</th>
              <th className={`p-2 text-sm font-medium ${textColor} w-[10%]`}>Breezy</th>
              <th className={`p-2 text-sm font-medium ${textColor} w-[10%]`}>Six</th>
              <th className={`p-2 text-sm font-medium ${textColor} w-[10%]`}>Yoseb</th>
              <th className={`p-2 text-sm font-medium ${textColor} w-[10%]`}>Yims</th>
              <th className={`p-2 text-sm font-medium ${textColor} w-[10%]`}>JackyP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {items.map(item => (
              <tr key={item.id}>
                <td className="p-2 flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  <span className={textColor}>{item.item}</span>
                </td>
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={item.breezy}
                    onChange={() => handleCheckboxChange(item.id, 'breezy')}
                    className="rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-gray-700"
                  />
                </td>
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={item.six}
                    onChange={() => handleCheckboxChange(item.id, 'six')}
                    className="rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-gray-700"
                  />
                </td>
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={item.yoseb}
                    onChange={() => handleCheckboxChange(item.id, 'yoseb')}
                    className="rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-gray-700"
                  />
                </td>
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={item.yims}
                    onChange={() => handleCheckboxChange(item.id, 'yims')}
                    className="rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-gray-700"
                  />
                </td>
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={item.jackyP}
                    onChange={() => handleCheckboxChange(item.id, 'jackyP')}
                    className="rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-gray-700"
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
