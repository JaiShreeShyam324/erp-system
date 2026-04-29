'use client';

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function ImportsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const handleUpload = async () => {
    if (!file) return setMessage('Please select a file');

    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/import/products`,
        formData,
        { headers }
      );

      setMessage(res.data.message || 'Upload successful');
      setFile(null);
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type: string) => {
    setLoading(true);
    setMessage('');

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/export/${type}`,
        { headers }
      );

      const filePath: string = res.data.filePath;
      const fileName =
        filePath.split('\\').pop() || filePath.split('/').pop();

      const downloadRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/export/download/${fileName}`,
        {
          headers,
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([downloadRes.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || 'file.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();

      setMessage(`Downloaded: ${fileName}`);
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Export failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6 space-y-6">

        {/* Back */}
        <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
          ← Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold">Imports / Exports</h1>

        {/* Upload */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Upload Products Excel</h2>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          <button
            onClick={handleUpload}
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            {loading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>

        {/* Export */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Export Data</h2>

          <div className="flex flex-wrap gap-2">
            <button onClick={() => handleExport('products')} className="btn">Products</button>
            <button onClick={() => handleExport('parties')} className="btn">Parties</button>
            <button onClick={() => handleExport('ledger')} className="btn">Ledger</button>
            <button onClick={() => handleExport('uid-entries')} className="btn">UID</button>
            <button onClick={() => handleExport('barcode-entries')} className="btn">Barcode</button>
            <button onClick={() => handleExport('order-stock')} className="btn">Order+Stock</button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="bg-gray-100 border rounded-lg p-3 text-sm">
            {message}
          </div>
        )}

      </div>

      <style jsx>{`
        .btn {
          background: black;
          color: white;
          padding: 8px 12px;
          border-radius: 8px;
        }
      `}</style>
    </main>
  );
}