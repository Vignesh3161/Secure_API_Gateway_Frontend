import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Key, Copy, CheckCircle, Search, MoreHorizontal } from 'lucide-react';
import axios from 'axios';
import { cn } from '../lib/utils';

export default function ApiKeys() {
  const [keys, setKeys] = useState([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const response = await axios.get('http://localhost:4000/admin/keys');
      setKeys(response.data);
    } catch (error) {
      console.error('Failed to fetch keys', error);
    }
  };

  const createKey = async () => {
    if (!newKeyName) return;
    try {
      await axios.post('http://localhost:4000/admin/keys', { name: newKeyName });
      setNewKeyName('');
      fetchKeys();
    } catch (error) {
      console.error('Failed to create key', error);
    }
  };

  const deleteKey = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/admin/keys/${id}`);
      fetchKeys();
    } catch (error) {
      console.error('Failed to delete key', error);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-10 max-w-[1200px] mx-auto bg-[#f5ece5] min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-[#1e293b] mb-2">API Keys</h1>
          <p className="text-slate-400 font-medium">Manage access credentials for your gateway</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search keys..." 
              className="bg-white rounded-full pl-12 pr-6 py-3 w-64 text-sm focus:outline-none shadow-sm border border-slate-100"
            />
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Key Name..."
              className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f15a24]"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
            />
            <button 
              onClick={createKey}
              className="bg-[#111111] hover:bg-[#222222] text-white px-6 py-2 rounded-xl flex items-center transition-colors font-bold text-sm"
            >
              <Plus className="h-4 w-4 mr-2 text-[#f15a24]" />
              Generate
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-soft border border-slate-50">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-400 text-[10px] uppercase tracking-widest font-black border-b border-slate-50">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">API Key</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Created At</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {keys.map((key) => (
              <tr key={key._id} className="text-slate-700 hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-6 font-bold text-sm">{key.name}</td>
                <td className="px-6 py-6">
                  <div className="flex items-center">
                    <code className="bg-slate-100 px-3 py-1.5 rounded-lg text-slate-600 text-xs font-mono font-semibold">
                      {key.key.substring(0, 12)}...
                    </code>
                    <button 
                      onClick={() => copyToClipboard(key.key, key._id)}
                      className="ml-3 text-slate-400 hover:text-[#f15a24] transition-colors"
                    >
                      {copiedId === key._id ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <span className="px-3 py-1 rounded-full text-[10px] bg-green-100 text-green-600 uppercase font-black tracking-wider">
                    Active
                  </span>
                </td>
                <td className="px-6 py-6 text-slate-400 text-xs font-semibold">
                  {new Date(key.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-6 py-6 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => deleteKey(key._id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    <button className="text-slate-300 hover:text-slate-600 p-2 rounded-xl transition-colors">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {keys.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-20 text-center text-slate-400 italic text-sm font-medium">
                  No API keys found. Generate one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
