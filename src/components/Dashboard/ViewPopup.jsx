import React from "react";
import { baseURL } from "../../services/api";
import "../ui/QuotationViewPopup.css";

const formatDate = (dateString) => {
  if (!dateString) return "/";
  const d = new Date(dateString);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const getStatusClass = (status) => {
  const normalized = String(status || "").toLowerCase();
  if (normalized.includes("approved")) return "approved";
  if (normalized.includes("paid")) return "paid";
  if (normalized.includes("unpaid")) return "unpaid";
  if (normalized.includes("cancelled")) return "cancelled";
  if (normalized.includes("rejected")) return "rejected";
  if (normalized.includes("created")) return "created";
  return "default";
};

const ViewPopup = ({ data, type, onClose }) => {
  if (!data) return null;

  const logoFileName = data.comapanyLogo?.split(/[/\\]/).pop();
  const statusText = type === "Invoice" ? data.invoiceStatus || data.quotationStatus : data.quotationStatus;
  const statusClass = getStatusClass(statusText);

  const totalAmount = (data.details || []).reduce((sum, d) => {
    const quantity = Number(d.quotationQuantity) || 0;
    const rate = Number(d.unitRate) || 0;
    const discount = Number(d.discount) || 0;
    const tax = Number(d.tax) || 0;

    const baseAmount = quantity * rate;
    const discountedAmount = baseAmount - discount;
    const netAmount = discountedAmount + (discountedAmount * tax) / 100;

    return sum + netAmount;
  }, 0);

  return (
    <div className="view-popup-overlay">
      <div className="view-popup-modal">
        <div className="view-popup-header">
          <div className="view-popup-title-group">
            <h3 className="view-popup-title">View {type} Details</h3>
            <span className={`view-popup-badge ${statusClass}`}>{statusText || "Unknown"}</span>
          </div>

          <div className="view-popup-header-actions">
            {logoFileName && (
              <img
                src={`${baseURL}/UploadedFiles/${logoFileName}`}
                alt="Company Logo"
                className="view-popup-logo"
              />
            )}
            <button className="view-popup-close-btn" onClick={onClose}>&times;</button>
          </div>
        </div>

        <div className="view-popup-body">
          <section className="view-popup-section">
            <h4 className="view-popup-section-title">Company Information</h4>
            <div className="view-popup-info">
              <div className="view-popup-info-row">
                <span className="view-popup-info-label">Company Name</span>
                <span className="view-popup-info-value">{data.companyName}</span>
              </div>
              <div className="view-popup-info-row">
                <span className="view-popup-info-label">VAT Number</span>
                <span className="view-popup-info-value">{data.vatNumber}</span>
              </div>
              <div className="view-popup-info-row">
                <span className="view-popup-info-label">Registration Number</span>
                <span className="view-popup-info-value">{data.registrationNumber}</span>
              </div>
              <div className="view-popup-info-row">
                <span className="view-popup-info-label">Company Email</span>
                <span className="view-popup-info-value">{data.companyEmail}</span>
              </div>
              <div className="view-popup-info-row">
                <span className="view-popup-info-label">Phone Number</span>
                <span className="view-popup-info-value">{data.companyPhoneNumber}</span>
              </div>
              <div className="view-popup-info-row">
                <span className="view-popup-info-label">Company Address</span>
                <span className="view-popup-info-value">{data.companyAddress}</span>
              </div>
            </div>
          </section>

          <section className="view-popup-section">
            <h4 className="view-popup-section-title">Bank Information</h4>
            <div className="view-popup-info">
              <div className="view-popup-info-row">
                <span className="view-popup-info-label">Bank Account Number</span>
                <span className="view-popup-info-value">{data.bankAccountNumber}</span>
              </div>
              <div className="view-popup-info-row">
                <span className="view-popup-info-label">Branch Code</span>
                <span className="view-popup-info-value">{data.branchCode}</span>
              </div>
              <div className="view-popup-info-row">
                <span className="view-popup-info-label">Branch Address</span>
                <span className="view-popup-info-value">{data.branchAddress}</span>
              </div>
            </div>
          </section>

          <section className="view-popup-section">
            <h4 className="view-popup-section-title">Quotation Information</h4>
            <div className="view-popup-info">
              <div className="view-popup-info-row">
                <span className="view-popup-info-label">Quotation Id</span>
                <span className="view-popup-info-value">{data.referenceNumber}</span>
              </div>
              <div className="view-popup-info-row">
                <span className="view-popup-info-label">Date</span>
                <span className="view-popup-info-value">{formatDate(data.quotationDate)}</span>
              </div>
              <div className="view-popup-info-row">
                <span className="view-popup-info-label">Currency</span>
                <span className="view-popup-info-value">{data.currency}</span>
              </div>
              <div className="view-popup-info-row">
                <span className="view-popup-info-label">Type</span>
                <span className="view-popup-info-value">{data.quotationType}</span>
              </div>
              <div className="view-popup-info-row">
                <span className="view-popup-info-label">Total Amount</span>
                <span className="view-popup-info-value">{totalAmount.toFixed(2)}</span>
              </div>
              <div className="view-popup-info-row">
                <span className="view-popup-info-label">Status</span>
                <span className="view-popup-info-value">{data.quotationStatus}</span>
              </div>
              {data.quotationStatus === "Rejected" && (
                <div className="view-popup-info-row">
                  <span className="view-popup-info-label">Reason</span>
                  <span className="view-popup-info-value">{data.reason}</span>
                </div>
              )}
            </div>
          </section>

          {type === "Invoice" && (
            <section className="view-popup-section">
              <h4 className="view-popup-section-title">Invoice Information</h4>
              <div className="view-popup-info">
                <div className="view-popup-info-row">
                  <span className="view-popup-info-label">Invoice Id</span>
                  <span className="view-popup-info-value">{data.invoiceRefno || "-"}</span>
                </div>
                <div className="view-popup-info-row">
                  <span className="view-popup-info-label">Invoice Date</span>
                  <span className="view-popup-info-value">{formatDate(data.invoiceDate)}</span>
                </div>
                <div className="view-popup-info-row">
                  <span className="view-popup-info-label">Status</span>
                  <span className="view-popup-info-value">{data.invoiceStatus || "-"}</span>
                </div>
                {data.invoiceStatus === "Cancelled" && (
                  <div className="view-popup-info-row">
                    <span className="view-popup-info-label">Reason</span>
                    <span className="view-popup-info-value">{data.reason}</span>
                  </div>
                )}
              </div>
            </section>
          )}

          <section className="view-popup-section">
            <h4 className="view-popup-section-title">Quotation Details</h4>
            <div className="view-popup-table-wrapper">
              <table className="view-popup-table">
                <thead>
                  <tr>
                    <th>ITEM CODE</th>
                    <th>CATEGORY</th>
                    <th>NAME</th>
                    <th>QUANTITY</th>
                    <th>UNIT RATE EXCL VAT</th>
                    <th>AMOUNT</th>
                    <th>DISCOUNT</th>
                    <th>DISCOUNTED TOTAL</th>
                    <th>VAT %</th>
                    <th>NET AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.details || []).map((d, i) => {
                    const quantity = Number(d.quotationQuantity) || 0;
                    const rate = Number(d.unitRate) || 0;
                    const discount = Number(d.discount) || 0;
                    const total = quantity * rate;
                    const discounted = total - discount;
                    const net = discounted + (discounted * (Number(d.tax) || 0)) / 100;
                    return (
                      <tr key={i}>
                        <td>{d.itemCode}</td>
                        <td>{d.category}</td>
                        <td>{d.itemName}</td>
                        <td className="text-right">{quantity}</td>
                        <td className="text-right">{rate}</td>
                        <td className="text-right">{total}</td>
                        <td className="text-right">{discount || 0}</td>
                        <td className="text-right">{discounted}</td>
                        <td className="text-right">{d.tax}</td>
                        <td className="text-right">{net.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="view-popup-section">
            <h4 className="view-popup-section-title">Customer Information</h4>
            <div className="view-popup-info">
              <div className="view-popup-info-row">
                <span className="view-popup-info-label">Customer Name</span>
                <span className="view-popup-info-value">{data.customerName}</span>
              </div>
              <div className="view-popup-info-row">
                <span className="view-popup-info-label">Email</span>
                <span className="view-popup-info-value">{data.customerEmail}</span>
              </div>
              <div className="view-popup-info-row">
                <span className="view-popup-info-label">Address</span>
                <span className="view-popup-info-value">{data.customerAddress}</span>
              </div>
              <div className="view-popup-info-row">
                <span className="view-popup-info-label">Mobile Number</span>
                <span className="view-popup-info-value">{data.customerPhone}</span>
              </div>
              <div className="view-popup-info-row">
                <span className="view-popup-info-label">Payment Terms</span>
                <span className="view-popup-info-value">{data.paymentTerms}</span>
              </div>
            </div>
          </section>
        </div>

        <div className="view-popup-footer">
          <button className="view-popup-btn secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ViewPopup;
