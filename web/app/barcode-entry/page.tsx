'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function BarcodeEntryPage() {
  const searchParams = useSearchParams();
  const initialBarcode = searchParams.get('barcode') || '';

  const [barcode, setBarcode] = useState(initialBarcode);
  const [checkingDate, setCheckingDate] = useState(new Date().toISOString().split('T')[0]);
  const [checkingRemark, setCheckingRemark] = useState('');
  const [checkerName, setCheckerName] = useState('Narayan');
  const [message, setMessage] = useState('');
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/barcode-entry`, {
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
    if (initialBarcode) handleSearch(initialBarcode);
  }, [initialBarcode]);

  const handleSearch = async (value: string) => {
    setBarcode(value);
    if (!value) return;

    const token = localStorage.getItem('token');

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/barcode-entry/search/${value}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data) {
        setCheckingDate(new Date(res.data.checkingDate).toISOString().split('T')[0]);
        setCheckingRemark(res.data.checkingRemark || '');
        setCheckerName(res.data.checkerName || '');
        setMessage('Existing barcode loaded');
      } else {
        setCheckingRemark('');
        setCheckerName('Narayan');
        setMessage('New barcode entry');
      }
    } catch {
      setCheckingRemark('');
      setCheckerName('Narayan');
      setMessage('New barcode entry');
    }
  };

  const saveEntry = async () => {
    const token = localStorage.getItem('token');

    if (!barcode.trim()) return setMessage('Barcode is required');
    if (!checkerName.trim()) return setMessage('Checker name is required');

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/barcode-entry/upsert`,
        { barcode, checkingDate, checkingRemark, checkerName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(`Saved barcode: ${res.data.barcode}`);
      fetchList();
    } catch {
      setMessage('Save failed');
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!confirm('Delete this barcode entry?')) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/barcode-entry/${id}`, {
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
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-6">
        <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
          ← Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold mt-2 mb-6">Barcode Entry</h1>

        <input className="w-full border rounded-lg px-4 py-2 mb-4" placeholder="Enter Barcode" value={barcode} onChange={(e) => handleSearch(e.target.value)} />

        <input className="w-full border rounded-lg px-4 py-2 mb-4" type="date" value={checkingDate} onChange={(e) => setCheckingDate(e.target.value)} />

        <input className="w-full border rounded-lg px-4 py-2 mb-4" placeholder="Checking Remark" value={checkingRemark} onChange={(e) => setCheckingRemark(e.target.value)} />

        <input className="w-full border rounded-lg px-4 py-2 mb-4" placeholder="Checker Name" value={checkerName} onChange={(e) => setCheckerName(e.target.value)} />

        <button onClick={saveEntry} className="bg-black text-white px-4 py-2 rounded-lg">
          Save
        </button>

        {message && <p className="mt-4 text-sm text-blue-600">{message}</p>}

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Barcode List</h2>

          {loading ? (
            <p>Loading...</p>
          ) : list.length === 0 ? (
            <p className="text-gray-500">No records found</p>
          ) : (
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Barcode</th>
                  <th className="border p-2 text-left">Checker</th>
                  <th className="border p-2 text-left">Remark</th>
                  <th className="border p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {list.map((item) => (
                  <tr key={item.id}>
                    <td className="border p-2">{item.barcode}</td>
                    <td className="border p-2">{item.checkerName}</td>
                    <td className="border p-2">{item.checkingRemark || '-'}</td>
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