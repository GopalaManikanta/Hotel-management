import { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import InvoiceModal from '../components/InvoiceModal';
import { useHotel } from '../context/HotelContext';
import { toast } from 'react-toastify';
import {
  CreditCard,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  FileText,
  Printer,
  RefreshCcw,
  Sparkles,
  DollarSign,
  TrendingUp,
  RotateCcw,
  Calendar,
  BedDouble,
  User,
  List,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Receipt,
  QrCode,
  Wallet
} from 'lucide-react';

const ITEMS_PER_PAGE = 6;

const Payments = () => {
  const { bookings, updatePaymentStatus } = useHotel();

  // Filter, Search, View Mode, Pagination States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State for Invoice Generation & Preview
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState(null);

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  // Derive Payments Dataset from Bookings Ledger with Transaction IDs & Invoice Numbers
  const paymentsList = useMemo(() => {
    return bookings.map((b, idx) => {
      const isPaid = b.status === 'Checked-In' || b.status === 'Checked-Out' || b.status === 'Confirmed';
      const paymentStatus = b.paymentStatus || (isPaid ? 'Paid in Full' : b.status === 'Cancelled' ? 'Refunded' : 'Pending Settlement');
      const transactionId = b.transactionId || `TXN-${88000 + idx * 147}`;
      const invoiceNumber = b.invoiceNumber || `INV-2026-${b.id.replace('BK-', '')}`;
      const paymentMethod = b.paymentMethod || (idx % 2 === 0 ? 'UPI / GPay' : 'Credit Card (Visa)');
      const paymentDate = b.actualCheckInTime || b.checkIn || '24 Sep 2026';

      return {
        ...b,
        transactionId,
        invoiceNumber,
        paymentStatus,
        paymentMethod,
        paymentDate
      };
    });
  }, [bookings]);

  // Derived KPI Metrics
  const totalRevenue = useMemo(() => {
    return paymentsList
      .filter((p) => p.paymentStatus === 'Paid in Full')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  }, [paymentsList]);

  const paidCount = useMemo(() => {
    return paymentsList.filter((p) => p.paymentStatus === 'Paid in Full').length;
  }, [paymentsList]);

  const pendingCount = useMemo(() => {
    return paymentsList.filter((p) => p.paymentStatus === 'Pending Settlement').length;
  }, [paymentsList]);

  const pendingAmount = useMemo(() => {
    return paymentsList
      .filter((p) => p.paymentStatus === 'Pending Settlement')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  }, [paymentsList]);

  const refundedCount = useMemo(() => {
    return paymentsList.filter((p) => p.paymentStatus === 'Refunded').length;
  }, [paymentsList]);

  // Method Breakdown Counts
  const upiCount = paymentsList.filter((p) => p.paymentMethod.toLowerCase().includes('upi')).length;
  const cardCount = paymentsList.filter((p) => p.paymentMethod.toLowerCase().includes('card')).length;
  const cashCount = paymentsList.filter((p) => p.paymentMethod.toLowerCase().includes('cash')).length;

  // Filtered Payments Calculation
  const filteredPayments = useMemo(() => {
    return paymentsList.filter((p) => {
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        p.transactionId.toLowerCase().includes(query) ||
        p.invoiceNumber.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query) ||
        p.guestName.toLowerCase().includes(query) ||
        p.guestEmail?.toLowerCase().includes(query) ||
        p.guestMobile?.includes(query) ||
        p.roomNumber.toLowerCase().includes(query);

      const matchesStatus = statusFilter === 'All' || p.paymentStatus === statusFilter;
      const matchesMethod = methodFilter === 'All' || p.paymentMethod.toLowerCase().includes(methodFilter.toLowerCase());

      let matchesDate = true;
      if (dateFilter === 'Today') {
        const todayStr = new Date().toISOString().split('T')[0];
        matchesDate = p.checkIn === todayStr || p.checkOut === todayStr;
      }

      return matchesSearch && matchesStatus && matchesMethod && matchesDate;
    });
  }, [paymentsList, searchTerm, statusFilter, methodFilter, dateFilter]);

  // Pagination Calculation
  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE) || 1;
  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPayments.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPayments, currentPage]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setMethodFilter('All');
    setDateFilter('All');
    setCurrentPage(1);
  };

  const handleStatusChange = (bookingId, newStatus) => {
    updatePaymentStatus(bookingId, newStatus);
  };

  const handleQuickDownloadDummyInvoice = (payment) => {
    toast.info(`Preparing simulated Invoice PDF download for ${payment.invoiceNumber}...`);

    setTimeout(() => {
      const text = `
=====================================================
CELESTIA GRAND LUXURY HOTEL - DUMMY TAX INVOICE
=====================================================
Invoice No: ${payment.invoiceNumber}
Transaction Ref: ${payment.transactionId}
Booking Ref: ${payment.id}
Guest Name: ${payment.guestName} (${payment.guestEmail || 'N/A'})
Mobile: ${payment.guestMobile || '+91 98765 43210'}
Room: Room ${payment.roomNumber} (${payment.roomType})
Stay Dates: ${payment.checkIn} to ${payment.checkOut} (${payment.nights || 2} Nights)
Payment Gateway: ${payment.paymentMethod}
Payment Status: ${payment.paymentStatus}
Total Amount Paid: ${formatINR(payment.amount)}
=====================================================
Thank you for staying at Celestia Grand Hotel & Resort!
`;
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice_${payment.invoiceNumber}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Downloaded ${payment.invoiceNumber} invoice file!`);
    }, 1000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid in Full':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
            <CheckCircle className="w-3 h-3 text-emerald-600" /> Paid in Full
          </span>
        );
      case 'Pending Settlement':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 shadow-xs">
            <Clock className="w-3 h-3 text-amber-600" /> Pending Settlement
          </span>
        );
      case 'Partial Payment':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs">
            <CreditCard className="w-3 h-3 text-indigo-600" /> Partial Payment
          </span>
        );
      case 'Refunded':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 shadow-xs">
            <RotateCcw className="w-3 h-3 text-rose-600" /> Refunded
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <Layout>
      <div className="space-y-6 bg-white min-h-full">
        
        {/* Top Header & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 bg-white">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Real-Time Payments & Tax Invoicing Module
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Payments, Invoices & Financial Ledger
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Payment summary metrics, GST Tax Invoice generation, transaction filters, and simulated PDF downloads.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Switcher */}
            <div className="flex items-center p-1 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                  viewMode === 'table' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                  viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Operational Payment KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Revenue Collected</span>
              <div className="text-2xl font-black text-indigo-600 mt-0.5">{formatINR(totalRevenue)}</div>
              <span className="text-[10px] text-emerald-600 font-bold">{paidCount} Paid Settlements</span>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Pending Settlements</span>
              <div className="text-2xl font-black text-amber-600 mt-0.5">{formatINR(pendingAmount)}</div>
              <span className="text-[10px] text-amber-600 font-bold">{pendingCount} Awaiting Collection</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Payment Gateways</span>
              <div className="text-xs font-bold text-slate-800 mt-1 flex flex-wrap gap-1">
                <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">UPI: {upiCount}</span>
                <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">Card: {cardCount}</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <QrCode className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Adjustments & Refunds</span>
              <div className="text-2xl font-black text-rose-600 mt-0.5">{refundedCount} Cases</div>
              <span className="text-[10px] text-slate-400 font-semibold">100% Audited</span>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
              <RotateCcw className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Search, Filter & Date Bar */}
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search TXN ID, Invoice #, Guest Name, Room #..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition shadow-xs"
              />
            </div>

            {/* Payment Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600 transition shadow-xs"
              >
                <option value="All">All Payment Statuses</option>
                <option value="Paid in Full">Paid in Full</option>
                <option value="Pending Settlement">Pending Settlement</option>
                <option value="Partial Payment">Partial Payment</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            {/* Payment Method Filter */}
            <div>
              <select
                value={methodFilter}
                onChange={(e) => {
                  setMethodFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600 transition shadow-xs"
              >
                <option value="All">All Payment Gateways</option>
                <option value="UPI">UPI / GPay / PhonePe</option>
                <option value="Card">Credit Card / Debit Card</option>
                <option value="Cash">Cash at Front Desk</option>
                <option value="Corporate">Bank Transfer / Corporate</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <select
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600 transition shadow-xs"
              >
                <option value="All">All Date Ranges</option>
                <option value="Today">Today's Transactions</option>
              </select>
            </div>

          </div>

          {/* Counter Bar & Reset */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
            <span className="text-slate-500 font-semibold">
              Showing <strong className="text-slate-900">{filteredPayments.length}</strong> transaction records
            </span>

            {(searchTerm || statusFilter !== 'All' || methodFilter !== 'All' || dateFilter !== 'All') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-bold transition cursor-pointer"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Content View: Table or Grid */}
        {filteredPayments.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-slate-300 p-8 shadow-xs">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-indigo-600 mb-3 shadow-xs">
              <CreditCard className="w-10 h-10" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">No Transaction Records Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Adjust your search query, status dropdown, or payment gateway filter.
            </p>
          </div>
        ) : viewMode === 'table' ? (
          /* TABLE VIEW */
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold bg-white">
                    <th className="p-4">Transaction Ref & Invoice</th>
                    <th className="p-4">Guest Specs</th>
                    <th className="p-4">Room & Stay</th>
                    <th className="p-4">Payment Method</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Amount (₹)</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 bg-white">
                  {paginatedPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition">
                      {/* Transaction Ref */}
                      <td className="p-4">
                        <div className="font-mono font-black text-indigo-600 text-xs">{p.transactionId}</div>
                        <div className="text-[10px] font-bold text-slate-500">{p.invoiceNumber}</div>
                        <div className="text-[10px] text-slate-400">{p.paymentDate}</div>
                      </td>

                      {/* Guest Specs */}
                      <td className="p-4">
                        <div className="font-extrabold text-slate-900 text-sm">{p.guestName}</div>
                        <div className="text-[10px] text-slate-500">{p.guestEmail} • 📱 {p.guestMobile || '+91 98765 43210'}</div>
                      </td>

                      {/* Room & Stay */}
                      <td className="p-4 font-semibold text-slate-700">
                        <div className="font-bold text-slate-900 flex items-center gap-1">
                          <BedDouble className="w-3.5 h-3.5 text-indigo-600" /> Room {p.roomNumber}
                        </div>
                        <div className="text-[11px] text-slate-500">{p.nights || 2} Nights ({p.checkIn})</div>
                      </td>

                      {/* Payment Method */}
                      <td className="p-4 font-bold text-slate-800">
                        <div className="flex items-center gap-1.5">
                          <Wallet className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{p.paymentMethod}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <div className="space-y-1">
                          {getStatusBadge(p.paymentStatus)}
                          <div>
                            <select
                              value={p.paymentStatus}
                              onChange={(e) => handleStatusChange(p.id, e.target.value)}
                              className="text-[10px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-slate-700 hover:border-indigo-500 cursor-pointer transition shadow-xs mt-1"
                            >
                              <option value="Paid in Full">Mark Paid in Full</option>
                              <option value="Pending Settlement">Mark Pending</option>
                              <option value="Partial Payment">Mark Partial</option>
                              <option value="Refunded">Mark Refunded</option>
                            </select>
                          </div>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="p-4 font-black text-indigo-600 text-sm">
                        {formatINR(p.amount)}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right space-x-2">
                        {/* Generate Tax Invoice Action */}
                        <button
                          type="button"
                          onClick={() => setSelectedInvoiceBooking(p)}
                          className="px-2.5 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[11px] shadow-xs transition inline-flex items-center gap-1 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" /> Invoice
                        </button>

                        {/* Dummy Download Action */}
                        <button
                          type="button"
                          onClick={() => handleQuickDownloadDummyInvoice(p)}
                          className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer shadow-xs inline-flex items-center gap-1 font-bold text-[11px]"
                          title="Download Invoice File (Dummy)"
                        >
                          <Download className="w-3.5 h-3.5 text-indigo-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedPayments.map((p) => (
              <div key={p.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <span className="font-mono font-black text-indigo-600 text-xs">{p.transactionId}</span>
                    {getStatusBadge(p.paymentStatus)}
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="font-extrabold text-slate-900 text-base">{p.guestName}</div>
                    <div className="text-slate-500">{p.guestEmail} • 📱 {p.guestMobile || '+91 98765 43210'}</div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 my-2 space-y-1.5">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>Room {p.roomNumber} ({p.roomType})</span>
                        <span className="text-indigo-600 font-black">{formatINR(p.amount)}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>Invoice: {p.invoiceNumber}</span>
                        <span>{p.paymentMethod}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedInvoiceBooking(p)}
                    className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex-1 flex items-center justify-center gap-1 shadow-md transition cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" /> Generate Tax Invoice
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDownloadDummyInvoice(p)}
                    className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shadow-xs cursor-pointer"
                    title="Download Invoice"
                  >
                    <Download className="w-4 h-4 text-indigo-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 pt-4 bg-white">
            <span className="text-xs text-slate-500 font-semibold">
              Page <strong className="text-slate-900">{currentPage}</strong> of <strong className="text-slate-900">{totalPages}</strong>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 disabled:opacity-40 cursor-pointer shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pNum = idx + 1;
                return (
                  <button
                    key={pNum}
                    type="button"
                    onClick={() => setCurrentPage(pNum)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer ${
                      currentPage === pNum
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {pNum}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 disabled:opacity-40 cursor-pointer shadow-xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Tax Invoice Generation & Download Modal */}
      <InvoiceModal
        isOpen={!!selectedInvoiceBooking}
        onClose={() => setSelectedInvoiceBooking(null)}
        booking={selectedInvoiceBooking}
      />
    </Layout>
  );
};

export default Payments;
