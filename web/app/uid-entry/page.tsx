'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function UidEntryPage() {
  const searchParams = useSearchParams();
  const initialUid = searchParams.get('uid') || '';

  const [uid, setUid] = useState(initialUid);
  const [machineNumber, setMachineNumber] = useState('');
  const [message, setMessage] = useState('');
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/uid-entry`, {
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

  useEffect(() => {
    if (initialUid) handleSearch(initialUid);
  }, [initialUid]);

  const handleSearch = async (value: string) => {
    setUid(value);
    if (!value) return;

    const token = localStorage.getItem('token');

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/uid-entry/search/${value}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data) {
        setMachineNumber(res.data.machineNumber || '');
        setMessage('Existing UID loaded');
      } else {
        setMachineNumber('');
        setMessage('New UID entry');
      }
    } catch {
      setMachineNumber('');
      setMessage('New UID entry');
    }
  };

  const saveEntry = async () => {
    const token = localStorage.getItem('token');

    if (!uid.trim()) return setMessage('UID is required');
    if (!machineNumber.trim()) return setMessage('Machine number is required');

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/uid-entry/upsert`,
        { uid, machineNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(`Saved: ${res.data.uid}`);
      fetchList();
    } catch {
      setMessage('Save failed');
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!confirm('Delete this entry?')) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/uid-entry/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Deleted');
      fetchList();
    } catch {
      setMessage('Delete failed');
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6">
        <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
          ← Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold mt-2 mb-6">UID Entry</h1>

        <input className="w-full border rounded-lg px-4 py-2 mb-4" placeholder="Enter UID" value={uid} onChange={(e) => handleSearch(e.target.value)} />

        <input className="w-full border rounded-lg px-4 py-2 mb-4" placeholder="Machine Number" value={machineNumber} onChange={(e) => setMachineNumber(e.target.value)} />

        <button onClick={saveEntry} className="bg-black text-white px-4 py-2 rounded-lg">
          Save
        </button>

        {message && <p className="mt-4 text-sm text-blue-600">{message}</p>}

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">UID List</h2>

          {loading ? (
            <p>Loading...</p>
          ) : list.length === 0 ? (
            <p className="text-gray-500">No records found</p>
          ) : (
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">UID</th>
                  <th className="border p-2 text-left">Machine</th>
                  <th className="border p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {list.map((item) => (
                  <tr key={item.id}>
                    <td className="border p-2">{item.uid}</td>
                    <td className="border p-2">{item.machineNumber}</td>
                    <td className="border p-2">
                      <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                        Delete
                      </button>
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