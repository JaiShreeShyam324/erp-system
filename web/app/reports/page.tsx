'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function ReportsPage() {
  const [outstanding, setOutstanding] = useState<any[]>([]);
  const [stock, setStock] = useState<any[]>([]);
  const [orderStock, setOrderStock] = useState<any[]>([]);
  const [partySearch, setPartySearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    Promise.all([
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/ledger/outstanding`, { headers })
        .then((res) => setOutstanding(res.data))
        .catch(() => setOutstanding([])),

      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/stock/report`, { headers })
        .then((res) => setStock(res.data))
        .catch(() => setStock([])),

      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/stock/order-report`, { headers })
        .then((res) => setOrderStock(res.data))
        .catch(() => setOrderStock([])),
    ]).finally(() => setLoading(false));
  }, []);

  const filteredOutstanding = useMemo(() => {
    return outstanding.filter((item) =>
      (item.partyName || '').toLowerCase().includes(partySearch.toLowerCase())
    );
  }, [outstanding, partySearch]);

  const filteredStock = useMemo(() => {
    return stock.filter((item) =>
      `${item.productName || ''} ${item.design || ''}`
        .toLowerCase()
        .includes(productSearch.toLowerCase())
    );
  }, [stock, productSearch]);

  const filteredOrderStock = useMemo(() => {
    return orderStock.filter((item) =>
      `${item.productName || ''} ${item.design || ''}`
        .toLowerCase()
        .includes(productSearch.toLowerCase())
    );
  }, [orderStock, productSearch]);

  const outstandingTotal = filteredOutstanding.reduce(
    (acc, item) => {
      acc.receivable += Number(item.receivable || 0);
      acc.payable += Number(item.payable || 0);
      acc.balance += Number(item.balance || 0);
      return acc;
    },
    { receivable: 0, payable: 0, balance: 0 }
  );

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <section className="bg-white rounded-2xl shadow p-6">
          <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
            ← Back to Dashboard
          </Link>

          <h1 className="text-3xl font-bold mt-2">Reports</h1>
          <p className="text-gray-500 text-sm mt-1">
            View outstanding, stock and order reports
          </p>
        </section>

        {loading ? (
          <section className="bg-white rounded-2xl shadow p-6">
            <p>Loading reports...</p>
          </section>
        ) : (
          <>
            <section className="bg-white rounded-2xl shadow p-6 overflow-auto">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-2xl font-bold">Outstanding Report</h2>
                  <p className="text-gray-500 text-sm">Party-wise payable / receivable</p>
                </div>

                <input
                  className="border rounded-lg px-4 py-2"
                  placeholder="Search party..."
                  value={partySearch}
                  onChange={(e) => setPartySearch(e.target.value)}
                />
              </div>

              {filteredOutstanding.length === 0 ? (
                <p className="text-gray-500">No records found</p>
              ) : (
                <table className="w-full border text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Party</th>
                      <th className="border p-2 text-right">Receivable</th>
                      <th className="border p-2 text-right">Payable</th>
                      <th className="border p-2 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOutstanding.map((item, index) => (
                      <tr key={index}>
                        <td className="border p-2">{item.partyName}</td>
                        <td className="border p-2 text-right">{item.receivable ?? 0}</td>
                        <td className="border p-2 text-right">{item.payable ?? 0}</td>
                        <td className="border p-2 text-right">{item.balance ?? 0}</td>
                      </tr>
                    ))}

                    <tr className="bg-gray-50 font-semibold">
                      <td className="border p-2">Total</td>
                      <td className="border p-2 text-right">
                        {outstandingTotal.receivable}
                      </td>
                      <td className="border p-2 text-right">
                        {outstandingTotal.payable}
                      </td>
                      <td className="border p-2 text-right">
                        {outstandingTotal.balance}
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </section>

            <section className="bg-white rounded-2xl shadow p-6 overflow-auto">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-2xl font-bold">Stock Report</h2>
                  <p className="text-gray-500 text-sm">Product-wise stock IN / OUT</p>
                </div>

                <input
                  className="border rounded-lg px-4 py-2"
                  placeholder="Search product/design..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
              </div>

              {filteredStock.length === 0 ? (
                <p className="text-gray-500">No records found</p>
              ) : (
                <table className="w-full border text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Product</th>
                      <th className="border p-2 text-left">Design</th>
                      <th className="border p-2 text-right">IN</th>
                      <th className="border p-2 text-right">OUT</th>
                      <th className="border p-2 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStock.map((item, index) => (
                      <tr key={index}>
                        <td className="border p-2">{item.productName}</td>
                        <td className="border p-2">{item.design || '-'}</td>
                        <td className="border p-2 text-right">{item.stockIn}</td>
                        <td className="border p-2 text-right">{item.stockOut}</td>
                        <td className="border p-2 text-right">{item.balance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>

            <section className="bg-white rounded-2xl shadow p-6 overflow-auto">
              <div className="mb-4">
                <h2 className="text-2xl font-bold">Order + Stock Report</h2>
                <p className="text-gray-500 text-sm">
                  Stock balance, pending orders and final availability
                </p>
              </div>

              {filteredOrderStock.length === 0 ? (
                <p className="text-gray-500">No records found</p>
              ) : (
                <table className="w-full border text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Product</th>
                      <th className="border p-2 text-left">Design</th>
                      <th className="border p-2 text-right">Stock Balance</th>
                      <th className="border p-2 text-right">Order Qty</th>
                      <th className="border p-2 text-right">Sold Qty</th>
                      <th className="border p-2 text-right">Pending Qty</th>
                      <th className="border p-2 text-right">Stock After Order</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrderStock.map((item, index) => (
                      <tr key={index}>
                        <td className="border p-2">{item.productName}</td>
                        <td className="border p-2">{item.design || '-'}</td>
                        <td className="border p-2 text-right">{item.stockBalance}</td>
                        <td className="border p-2 text-right">{item.orderQty}</td>
                        <td className="border p-2 text-right">{item.soldQty}</td>
                        <td className="border p-2 text-right">{item.pendingQty}</td>
                        <td className="border p-2 text-right">
                          {item.stockAfterOrder}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}