import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axiosConfig';

const statusStyles = {
  unpaid: 'bg-red-50 text-red-700',
  paid: 'bg-green-50 text-green-700',
  insurance: 'bg-yellow-50 text-yellow-700'
};

const Invoices = () => {
  const { user } = useContext(AuthContext);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchInvoices = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/invoices');
      // backend returns { success: true, invoices }
      setInvoices(res.data.invoices || []);
    } catch (err) {
      console.error('fetchInvoices error:', err);
      setError(err?.response?.data?.message || 'Unable to load invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleMarkPaid = async (invoiceId) => {
    if (!window.confirm('Mark this invoice as PAID?')) return;
    setActionLoading(invoiceId);
    setError('');
    setMessage('');
    try {
      const res = await api.patch(`/invoices/${invoiceId}/status`, { status: 'paid' });
      // Update local list
      const updated = res.data.invoice || res.data;
      setInvoices((prev) => prev.map((i) => (i._id === invoiceId ? updated : i)));
      setMessage('Invoice marked as paid');
    } catch (err) {
      console.error('markPaid error:', err);
      setError(err?.response?.data?.message || 'Unable to update invoice');
    } finally {
      setActionLoading(null);
    }
  };

  const canModify = user && (user.role === 'admin' || user.role === 'receptionist');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-card bg-white p-6 shadow-card lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-800">Invoices</h1>
          <p className="text-sm text-neutral-500">Billing and payments â€” view and update invoice statuses.</p>
        </div>
      </div>

      {error ? (
        <div className="rounded-button border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}
      {message ? (
        <div className="rounded-button border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>
      ) : null}

      <div className="overflow-hidden rounded-card border border-neutral-100 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-100">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Invoice ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                {canModify && <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={canModify ? 6 : 5} className="px-6 py-8 text-center text-sm text-neutral-500">Loading invoices...</td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={canModify ? 6 : 5} className="px-6 py-8 text-center text-sm text-neutral-500">No invoices found.</td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-primary-light/40">
                    <td className="px-6 py-4 text-sm text-neutral-800">{inv._id}</td>
                    <td className="px-6 py-4 text-sm text-neutral-800">{inv.patientId?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 text-sm text-neutral-800">{inv.appointmentId?.doctorId?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 text-sm text-neutral-800">${inv.totalAmount?.toFixed(2) || '0.00'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[inv.paymentStatus] || statusStyles.unpaid}`}>
                        {inv.paymentStatus}
                      </span>
                    </td>
                    {canModify && (
                      <td className="px-6 py-4 text-right text-sm">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            disabled={inv.paymentStatus === 'paid' || actionLoading === inv._id}
                            onClick={() => handleMarkPaid(inv._id)}
                            className="rounded-button bg-primary px-3 py-1 text-sm font-semibold text-white disabled:opacity-50"
                          >
                            {actionLoading === inv._id ? 'Processing...' : inv.paymentStatus === 'paid' ? 'Paid' : 'Mark as Paid'}
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
