'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function OrderPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [list, setList] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProducts(res.data);
  };

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
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
    fetchProducts();
    fetchOrders();
  }, []);

  const saveOrder = async () => {
    const token = localStorage.getItem('token');

    if (!productId) return setMessage('Select product');
    if (!quantity) return setMessage('Enter quantity');

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/order`,
        { productId: Number(productId), quantity: Number(quantity), soldQty: 0 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage('Order saved');
      setProductId('');
      setQuantity('');
      fetchOrders();
    } catch {
      setMessage('Save failed');
    }
  };

  const updateSold = async (item: any) => {
    const token = localStorage.getItem('token');

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/order/${item.id}/sell`,
        { soldQty: Number(item.newSold || 0) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage('Updated');
      fetchOrders();
    } catch {
      setMessage('Update failed');
    }
  };

  const deleteOrder = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!confirm('Delete this order?')) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/order/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Deleted');
      fetchOrders();
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

        <h1 className="text-2xl font-bold mt-2 mb-6">Order Entry</h1>

        <select className="w-full border rounded-lg px-4 py-2 mb-4" value={productId} onChange={(e) => setProductId(e.target.value)}>
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.design || '-'})
            </option>
          ))}
        </select>

        <input className="w-full border rounded-lg px-4 py-2 mb-4" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />

        <button onClick={saveOrder} className="bg-black text-white px-4 py-2 rounded-lg">
          Save Order
        </button>

        {message && <p className="mt-4 text-sm text-blue-600">{message}</p>}

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Order List</h2>

          {loading ? (
            <p>Loading...</p>
          ) : list.length === 0 ? (
            <p className="text-gray-500">No records found</p>
          ) : (
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Product</th>
                  <th className="border p-2">Qty</th>
                  <th className="border p-2">Sold</th>
                  <th className="border p-2">Update Sold</th>
                  <th className="border p-2">Delete</th>
                </tr>
              </thead>
              <tbody>
                {list.map((item) => (
                  <tr key={item.id}>
                    <td className="border p-2">{item.product?.name}</td>
                    <td className="border p-2">{item.quantity}</td>
                    <td className="border p-2">{item.soldQty}</td>
                    <td className="border p-2">
                      <input type="number" className="border px-2 py-1 w-20" onChange={(e) => (item.newSold = e.target.value)} />
                      <button onClick={() => updateSold(item)} className="bg-blue-500 text-white px-2 py-1 ml-2 rounded">
                        Update
                      </button>
                    </td>
                    <td className="border p-2">
                      <button onClick={() => deleteOrder(item.id)} className="bg-red-500 text-white px-3 py-1 rounded">
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