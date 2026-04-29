'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function PartyPage() {
  const [name, setName] = useState('');
  const [type, setType] = useState('CUSTOMER');
  const [list, setList] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/party`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setList(res.data);
    } catch {
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const saveParty = async () => {
    const token = localStorage.getItem('token');

    if (!name.trim()) return setMessage('Party name required');

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/party`,
        { name, type },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setName('');
      setType('CUSTOMER');
      setMessage('Party saved');
      fetchList();
    } catch {
      setMessage('Save failed');
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6">
        <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
          ← Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold mt-2 mb-6">Party Master</h1>

        <div className="space-y-3">
          <input
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Party Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select
            className="w-full border rounded-lg px-4 py-2"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="CUSTOMER">Customer</option>
            <option value="SUPPLIER">Supplier</option>
          </select>

          <button onClick={saveParty} className="bg-black text-white px-4 py-2 rounded-lg">
            Save Party
          </button>
        </div>

        {message && <p className="mt-4 text-sm text-blue-600">{message}</p>}

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Party List</h2>

          {loading ? (
            <p>Loading...</p>
          ) : list.length === 0 ? (
            <p className="text-gray-500">No records found</p>
          ) : (
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">Type</th>
                </tr>
              </thead>
              <tbody>
                {list.map((item) => (
                  <tr key={item.id}>
                    <td className="border p-2">{item.name}</td>
                    <td className="border p-2">{item.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}