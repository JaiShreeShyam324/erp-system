'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [parties, setParties] = useState<any[]>([]);
  const [uidEntries, setUidEntries] = useState<any[]>([]);
  const [barcodeEntries, setBarcodeEntries] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/');
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, { headers })
      .then((res) => setProfile(res.data))
      .catch(() => {
        localStorage.removeItem('token');
        router.push('/');
      });

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/product`, { headers })
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]));

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/party`, { headers })
      .then((res) => setParties(res.data))
      .catch(() => setParties([]));

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/uid-entry`, { headers })
      .then((res) => setUidEntries(res.data))
      .catch(() => setUidEntries([]));

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/barcode-entry`, { headers })
      .then((res) => setBarcodeEntries(res.data))
      .catch(() => setBarcodeEntries([]));
  }, [router]);

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const cards = [
    { title: 'Products', value: products.length },
    { title: 'Parties', value: parties.length },
    { title: 'UID Entries', value: uidEntries.length },
    { title: 'Barcode Entries', value: barcodeEntries.length },
  ];

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow p-6 flex justify-between">
          <div>
            <h1 className="text-3xl font-bold">ERP Dashboard</h1>
            <p className="text-gray-600 mt-1">
              {profile?.user?.email || 'Loading...'}
            </p>
          </div>

          <button onClick={logout} className="bg-black text-white px-4 py-2 rounded-lg">
            Logout
          </button>
        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-4 gap-4">
          {cards.map((card) => (
            <div key={card.title} className="bg-white rounded-2xl shadow p-5">
              <p className="text-gray-500 text-sm">{card.title}</p>
              <h2 className="text-3xl font-bold">{card.value}</h2>
            </div>
          ))}
        </div>

        {/* MAIN MENU */}
        <div className="grid md:grid-cols-3 gap-4">

          <Link href="/product" className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold">Product Master</h2>
            <p className="text-gray-500 text-sm mt-2">
              Create and manage product details
            </p>
          </Link>

          <Link href="/uid-entry" className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold">UID Entry</h2>
            <p className="text-gray-500 text-sm mt-2">
              Manage machine numbers using UID
            </p>
          </Link>

          <Link href="/barcode-entry" className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold">Barcode Entry</h2>
            <p className="text-gray-500 text-sm mt-2">
              Update barcode checking details
            </p>
          </Link>

          <Link href="/reports" className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold">Reports</h2>
            <p className="text-gray-500 text-sm mt-2">
              View reports
            </p>
          </Link>

          <Link href="/imports" className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold">Imports</h2>
            <p className="text-gray-500 text-sm mt-2">
              Upload / Export Excel
            </p>
          </Link>

          <Link href="/scanner" className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold">Scanner</h2>
            <p className="text-gray-500 text-sm mt-2">
              Scan barcodes
            </p>
          </Link>

          <Link href="/party" className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold">Party Master</h2>
            <p className="text-gray-500 text-sm mt-2">
              Create and manage customers and suppliers
            </p>
          </Link>

          <Link href="/order" className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold">Order Entry</h2>
            <p className="text-gray-500 text-sm mt-2">
              Create and manage orders
            </p>
          </Link>

          <Link href="/stock" className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold">Stock Entry</h2>
            <p className="text-gray-500 text-sm mt-2">
              Add stock IN and OUT entries
            </p>
          </Link>

          

        </div>

      </div>
    </main>
  );
}