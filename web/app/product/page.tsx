'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function ProductPage() {
  const [name, setName] = useState('');
  const [design, setDesign] = useState('');
  const [list, setList] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/product`,
        { headers }
      );
      setList(res.data);
    } catch {
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const saveProduct = async () => {
    if (!name.trim()) return setMessage('Product name required');

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/product`,
        { name, design },
        { headers }
      );

      setMessage('Product saved');
      setName('');
      setDesign('');
      fetchProducts();
    } catch {
      setMessage('Save failed');
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6">

        {/* Back */}
        <Link
          href="/dashboard"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold mt-2 mb-6">Product Master</h1>

        {/* Form */}
        <div className="space-y-3">
          <input
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Design"
            value={design}
            onChange={(e) => setDesign(e.target.value)}
          />

          <button
            onClick={saveProduct}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            Save Product
          </button>
        </div>

        {message && (
          <p className="mt-4 text-sm text-blue-600">{message}</p>
        )}

        {/* List */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Product List</h2>

          {loading ? (
            <p>Loading...</p>
          ) : list.length === 0 ? (
            <p className="text-gray-500">No records found</p>
          ) : (
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">Design</th>
                </tr>
              </thead>
              <tbody>
                {list.map((item) => (
                  <tr key={item.id}>
                    <td className="border p-2">{item.name}</td>
                    <td className="border p-2">
                      {item.design || '-'}
                    </td>
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