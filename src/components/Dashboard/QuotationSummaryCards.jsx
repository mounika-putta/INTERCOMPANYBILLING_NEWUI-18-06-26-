import React from "react";
import {
  FaFileInvoiceDollar,
  FaPlusCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";

const QUOTATION_STATUSES = [
  { label: "Total Quotation", key: "total", status: "Total", accent: "total", icon: FaFileInvoiceDollar },
  { label: "Created", key: "created", status: "Created", accent: "created", icon: FaPlusCircle },
  { label: "Approved", key: "approved", status: "Approved", accent: "approved", icon: FaCheckCircle },
  { label: "Rejected", key: "rejected", status: "Rejected", accent: "rejected", icon: FaTimesCircle },
  { label: "Expired", key: "expired", status: "Expired", accent: "expired", icon: FaClock },
];

const QuotationSummaryCards = ({ counts, onCardClick }) => {
  return (
    <div className="summary-cards-row">
      {QUOTATION_STATUSES.map(({ label, key, status, accent, icon: Icon }) => (
        <div
          key={status}
          className={`stat-card stat-${accent}`}
          onClick={() => onCardClick(status)}
        >
          <span className="stat-card-icon">
            <Icon />
          </span>
          <div className="stat-card-body">
            <span className="stat-card-label">{label}</span>
            <span className="stat-card-value">
              {counts?.quotations?.[key] || 0}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuotationSummaryCards;
