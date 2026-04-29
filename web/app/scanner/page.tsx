'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';
import Link from 'next/link';

export default function ScannerPage() {
  const [scanResult, setScanResult] = useState('');
  const [message, setMessage] = useState('');
  const [record, setRecord] = useState<any>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const html5QrCode = new Html5Qrcode('reader');
    const token = localStorage.getItem('token');

    html5QrCode
      .start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          setScanResult(decodedText);
          setMessage('Searching...');

          try {
            const res = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/barcode-entry/search/${decodedText}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (res.data) {
              setRecord(res.data);
              setMessage('Record found');
            } else {
              setRecord(null);
              setMessage('No record found');
            }
          } catch {
            setRecord(null);
            setMessage('Search failed');
          }

          await html5QrCode.stop();
        },
        () => {}
      )
      .catch(() => {
        setMessage('Camera start failed');
      });

    return () => {
      html5QrCode.stop().catch(() => {});
    };
  }, []);

  const restartScanner = () => {
    window.location.reload();
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Barcode Scanner</h1>

        <div id="reader" className="w-full mb-6" />

        {scanResult && (
          <p className="mb-2">
            <strong>Scanned:</strong> {scanResult}
          </p>
        )}

        {message && (
          <p className="mb-4 text-sm text-blue-600">{message}</p>
        )}

        {record && (
          <div className="border rounded-lg p-4 bg-gray-50 space-y-2 mb-4">
            <p><strong>Barcode:</strong> {record.barcode}</p>
            <p><strong>Checking Date:</strong> {new Date(record.checkingDate).toLocaleDateString()}</p>
            <p><strong>Remark:</strong> {record.checkingRemark || '-'}</p>
            <p><strong>Checker:</strong> {record.checkerName}</p>
          </div>
        )}

        {!record && scanResult && (
          <div className="border rounded-lg p-4 bg-yellow-50 space-y-2 mb-4">
            <p>No barcode record found.</p>
            <Link
              href={`/barcode-entry?barcode=${encodeURIComponent(scanResult)}`}
              className="inline-block bg-black text-white px-4 py-2 rounded-lg"
            >
              Open Barcode Entry
            </Link>
          </div>
        )}

        <button
          onClick={restartScanner}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          Scan Again
        </button>
      </div>
    </main>
  );
}