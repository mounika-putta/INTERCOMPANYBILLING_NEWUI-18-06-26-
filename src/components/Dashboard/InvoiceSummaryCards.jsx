import React from "react";
import {
  FaFileInvoice,
  FaMoneyBillWave,
  FaCheckCircle,
  FaBan,
  FaUndoAlt,
} from "react-icons/fa";

const INVOICE_STATUSES = [
  { label: "Total Invoice", key: "total", status: "Total", accent: "total", icon: FaFileInvoice },
  { label: "Unpaid", key: "created", status: "Created", accent: "approved", icon: FaMoneyBillWave },
  { label: "Paid", key: "approved", status: "Paid", accent: "created", icon: FaCheckCircle },
  { label: "Cancelled", key: "rejected", status: "Cancelled", accent: "rejected", icon: FaBan },
  { label: "Credit Note", key: "creditNote", status: "Credit note Created", accent: "creditnote", icon: FaUndoAlt },
];

const InvoiceSummaryCards = ({ counts, onCardClick }) => {
  return (
    <div className="summary-cards-row">
      {INVOICE_STATUSES.map(({ label, key, status, accent, icon: Icon }) => (
        <div
          key={label}
          className={`stat-card stat-${accent}`}
          onClick={() => onCardClick(status)}
        >
          <span className="stat-card-icon">
            <Icon />
          </span>
          <div className="stat-card-body">
            <span className="stat-card-label">{label}</span>
            <span className="stat-card-value">{counts?.invoices?.[key] || 0}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InvoiceSummaryCards;
