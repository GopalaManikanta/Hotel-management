import { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  X,
  Building2,
  Calendar,
  User,
  BedDouble,
  CheckCircle,
  CreditCard,
  ShieldCheck,
  Sparkles,
  Receipt,
  Phone,
  Mail,
  Moon
} from 'lucide-react';
import { toast } from 'react-toastify';

const InvoiceModal = ({ isOpen, onClose, booking }) => {
  if (!isOpen || !booking) return null;

  const [isDownloading, setIsDownloading] = useState(false);

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const invoiceNo = booking.invoiceNumber || `INV-2026-${booking.id.replace('BK-', '')}`;
  const transactionId = booking.transactionId || `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
  const invoiceDate = booking.paymentDate || booking.actualCheckInTime || new Date().toLocaleDateString('en-IN');

  const baseTariff = Number(booking.baseAmount) || Math.round(Number(booking.amount) * 0.85) || 10000;
  const extraCharges = Number(booking.extraCharges) || 0;
  const subtotal = baseTariff + extraCharges;
  const cgst = Math.round(subtotal * 0.06); // 6% CGST
  const sgst = Math.round(subtotal * 0.06); // 6% SGST
  const totalTax = cgst + sgst;
  const grandTotal = subtotal + totalTax;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadInvoice = () => {
    setIsDownloading(true);
    toast.info(`Preparing official Tax Invoice ${invoiceNo} PDF...`);

    setTimeout(() => {
      // Create a blob file download simulation for Tax Invoice
      const invoiceTextContent = `
================================================================================
           CELESTIA GRAND LUXURY HOTEL & RESORT SUITE
           GSTIN: 36AAACC1234H1Z5 | HSN/SAC: 996311 (Hotel Services)
           Beachfront Drive, Jubilee Hills, Hyderabad 500033
================================================================================
OFFICIAL TAX INVOICE & PAYMENT RECEIPT
Invoice No: ${invoiceNo}
Transaction Ref ID: ${transactionId}
Invoice Date: ${invoiceDate}
Payment Status: ${booking.paymentStatus || 'Paid in Full'}
Payment Method: ${booking.paymentMethod || 'UPI / GPay'}

--------------------------------------------------------------------------------
GUEST DETAILS
--------------------------------------------------------------------------------
Guest Name:     ${booking.guestName}
Email Address:  ${booking.guestEmail || 'N/A'}
Phone Mobile:   ${booking.guestMobile || '+91 98765 43210'}
Verified ID:    ${booking.idProofType || 'Aadhaar Card'} - ${booking.idProofNumber || '8921-4412-9012'}

--------------------------------------------------------------------------------
RESERVATION SUMMARY
--------------------------------------------------------------------------------
Booking Reference: ${booking.id}
Assigned Room:     Room ${booking.roomNumber} (${booking.roomType})
Check-In Date:     ${booking.checkIn}
Check-Out Date:    ${booking.checkOut}
Stay Duration:     ${booking.nights || 2} Nights

--------------------------------------------------------------------------------
BILLING & TAX BREAKDOWN
--------------------------------------------------------------------------------
Base Room Tariff (${booking.nights || 2} Nights):  ${formatINR(baseTariff)}
Incidental / Extra Services:          ${formatINR(extraCharges)}
--------------------------------------------------------------------------------
Subtotal:                            ${formatINR(subtotal)}
CGST (6%):                           ${formatINR(cgst)}
SGST (6%):                           ${formatINR(sgst)}
--------------------------------------------------------------------------------
GRAND TOTAL SETTLED:                 ${formatINR(grandTotal)}
================================================================================
Thank you for staying at Celestia Grand Hotel & Resort Suite!
For reservations or inquiries, visit celestiagrand.com or call +91 40 8899 0011.
================================================================================
`;

      const blob = new Blob([invoiceTextContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice_${invoiceNo}_${booking.guestName.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsDownloading(false);
      toast.success(`Tax Invoice ${invoiceNo} downloaded successfully!`);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-900 space-y-0">
        
        {/* Modal Action Bar */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2 font-extrabold text-base text-slate-900">
            <FileText className="w-5 h-5 text-indigo-600" />
            Tax Invoice & Payment Receipt
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4 text-slate-600" /> Print
            </button>
            <button
              type="button"
              onClick={handleDownloadInvoice}
              disabled={isDownloading}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isDownloading ? 'Generating...' : 'Download Invoice'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white text-slate-400 hover:text-slate-800 border border-slate-200 shadow-xs cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Tax Invoice Content Sheet */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto bg-white">
          
          {/* Invoice Header Branding */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-200 pb-5 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Celestia Grand</h2>
                  <p className="text-[10px] text-indigo-600 font-bold tracking-widest uppercase">Luxury Hotel & Resort Suite</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2 font-medium">
                Jubilee Hills Beachfront Drive, Hyderabad 500033<br />
                GSTIN: <strong className="text-slate-800">36AAACC1234H1Z5</strong> | HSN/SAC: <strong className="text-slate-800">996311</strong>
              </p>
            </div>

            <div className="text-left sm:text-right text-xs space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-200 min-w-[200px]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">TAX INVOICE</span>
              <div className="font-mono font-black text-indigo-600 text-sm">{invoiceNo}</div>
              <div className="text-slate-500 font-semibold">Ref: {booking.id}</div>
              <div className="text-slate-500 font-semibold">Date: {invoiceDate}</div>
              <div className="pt-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                  <CheckCircle className="w-3 h-3 text-emerald-600" /> {booking.paymentStatus || 'Paid in Full'}
                </span>
              </div>
            </div>
          </div>

          {/* Billed To Guest Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-indigo-600" /> Billed To (Guest Specs)
              </span>
              <div className="font-extrabold text-slate-900 text-sm">{booking.guestName}</div>
              <div className="text-slate-600 font-semibold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-600" /> {booking.guestEmail || 'guest@example.com'}
              </div>
              <div className="text-slate-600 font-semibold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-indigo-600" /> {booking.guestMobile || '+91 98765 43210'}
              </div>
              <div className="pt-1 border-t border-slate-200 text-emerald-800 font-bold text-[11px] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                {booking.idProofType || 'Aadhaar Card'}: {booking.idProofNumber || '8921-4412-9012'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                <BedDouble className="w-3.5 h-3.5 text-indigo-600" /> Reservation Details
              </span>
              <div className="font-extrabold text-slate-900">
                Room {booking.roomNumber} ({booking.roomType})
              </div>
              <div className="text-slate-600 font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" /> {booking.checkIn} to {booking.checkOut}
              </div>
              <div className="text-indigo-600 font-bold flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5" /> 🌙 {booking.nights || 2} Nights Stay
              </div>
              <div className="pt-1 border-t border-slate-200 text-slate-700 font-bold text-[11px] flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-indigo-600" /> {booking.paymentMethod || 'UPI / GPay'} (ID: {transactionId})
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                  <th className="p-3">Description / Service</th>
                  <th className="p-3 text-center">Qty / Nights</th>
                  <th className="p-3 text-right">Rate (₹)</th>
                  <th className="p-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                <tr>
                  <td className="p-3 font-bold">
                    <div>{booking.roomType} Accommodation</div>
                    <div className="text-[10px] text-slate-500 font-normal">Room {booking.roomNumber} • Tariff Plan</div>
                  </td>
                  <td className="p-3 text-center font-semibold">{booking.nights || 2} Nights</td>
                  <td className="p-3 text-right font-semibold">{formatINR(Math.round(baseTariff / (booking.nights || 2)))}</td>
                  <td className="p-3 text-right font-bold text-slate-900">{formatINR(baseTariff)}</td>
                </tr>

                {extraCharges > 0 && (
                  <tr>
                    <td className="p-3 font-bold">
                      <div>Incidental / Extra Services</div>
                      <div className="text-[10px] text-slate-500 font-normal">Minibar, Laundry & Dining Add-ons</div>
                    </td>
                    <td className="p-3 text-center font-semibold">1 Service</td>
                    <td className="p-3 text-right font-semibold">{formatINR(extraCharges)}</td>
                    <td className="p-3 text-right font-bold text-slate-900">{formatINR(extraCharges)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Tax Breakdown & Grand Total */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
            <div className="text-xs text-slate-500 space-y-1 max-w-xs">
              <span className="font-bold text-slate-700 block">Terms & Payment Notes:</span>
              <p>
                This document serves as an official tax invoice under Section 31 of CGST Act. All hospitality taxes are inclusive.
              </p>
            </div>

            <div className="w-full sm:w-64 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-900">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>CGST @ 6%:</span>
                <span>{formatINR(cgst)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>SGST @ 6%:</span>
                <span>{formatINR(sgst)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 font-black text-sm text-indigo-700">
                <span>Grand Total:</span>
                <span>{formatINR(grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Stamp & Footer */}
          <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <div>Authorized Signature • Celestia Grand Front Desk Accounts</div>
            <div className="font-mono text-indigo-600 font-bold">Generated via AGY HMS Payments Engine</div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default InvoiceModal;
