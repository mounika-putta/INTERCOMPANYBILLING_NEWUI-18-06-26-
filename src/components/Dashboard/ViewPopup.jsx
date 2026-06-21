import React from "react";
import { baseURL } from "../../services/api";

const ViewPopup = ({ show, onClose, selectedInvoice }) => {
  if (!show || !selectedInvoice) return null;

  return (
    <div className="quotation-view-overlay">
      <div className="quotation-view-modal">
        <button
          className="quotation-view-close-btn"
          onClick={onClose}
        >
          &times;
        </button>

        <h3 className="quotation-view-title">View Quotation Details</h3>

        {/* {selectedInvoice.comapanyLogo && (() => {
          const logoFileName = selectedInvoice.comapanyLogo.split(/[/\\]/).pop();
          console.log('logoFileName', logoFileName);
          return (
            <img
              src={`${baseURL}/UploadedFiles/${logoFileName}`}
              alt="Company Logo"
              className="company-logo-corner"
            />
          );
        })()} */}
        {/* Company Information */}
        <h4 className="quotation-view-section-title">Company Information</h4>
        {selectedInvoice.comapanyLogo && (() => {
              const logoFileName = selectedInvoice.comapanyLogo.split(/[/\\]/).pop();
              console.log('logoFileName', logoFileName);
              return (
                <img
                  src={`${baseURL}/UploadedFiles/${logoFileName}`}
                  alt="Company Logo"
                  className="company-logo-corner"
                />
              );
            })()}
           
        <div className="quotation-view-info">     
          <div><span className="label">Company Name</span> : <span>{selectedInvoice.companyName}</span></div>
          <div><span className="label">Company Vat Number</span> :<span>{selectedInvoice.vatNumber}</span></div>
          <div><span className="label">Company Reg Number</span>: <span>{selectedInvoice.registrationNumber}</span></div>
          <div><span className="label">Company Address</span> :<span>{selectedInvoice.companyAddress}</span></div>
          {/* <div><span className="label">Company Website</span>: <span>{selectedInvoice.companyWebsite}</span></div> */}
          <div><span className="label">Company Email</span>: <span>{selectedInvoice.companyEmail}</span></div>
          <div><span className="label">Company Phone Number</span> :<span>{selectedInvoice.companyPhoneNumber}</span></div>
        </div>

        {/* Banking Details */}
        <h4 className="quotation-view-section-title">Banking Details</h4>
        <div className="quotation-view-info">
          <div><span className="label">Account Number</span> : <span>{selectedInvoice.bankAccountNumber}</span></div>
          <div><span className="label">Branch Code</span> :<span>{selectedInvoice.branchCode}</span></div>
          <div><span className="label">Branch Address</span>: <span>{selectedInvoice.brannchAddress}</span></div>
          {/* <div><span className="label">IFSC Code</span> :<span>{selectedInvoice.ifscCode}</span></div> */}
        </div>

        {/* Quotation Information */}
        <h4 className="quotation-view-section-title">Quotation Information</h4>
        <div className="quotation-view-info">
          <div><span className="label">Quotation ID</span> : <span>{selectedInvoice.referenceNumber}</span></div>
          <div><span className="label">Date</span> :<span>
            {selectedInvoice?.invoiceDate
              ? (() => {
                const d = new Date(selectedInvoice.invoiceDate);
                const day = String(d.getDate()).padStart(2, "0");
                const month = String(d.getMonth() + 1).padStart(2, "0");
                const year = d.getFullYear();
                return `${day}/${month}/${year}`;
              })()
              : "/"}

          </span></div>
          
          <div><span className="label">Status</span>: <span>{selectedInvoice.quotationStatus}</span></div>
          <div><span className="label">Currency</span>: <span>{selectedInvoice.currency}</span></div>
          
          <div><span className="label">Total Amount</span> :<span>{selectedInvoice.totalAmount?.toFixed(2)}</span></div>

          {selectedInvoice.Status === "Rejected" && (
            <div className="info-row">
              <span className="label">Reason</span>
              <span className="colon">:</span>
              <span className="values" style={{ marginInlineStart: '-1px' }}>{selectedInvoice.reason}</span>
            </div>

          )}
        </div>

        {/* Quotation Details Table */}
        <h4 className="quotation-view-section-title">Quotation Details</h4>
        <table className="data-table">
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
            {(selectedInvoice.details || []).map((d, i) => (
              <tr key={i}>
                <td>{d.itemCode}</td>
                <td>{d.category}</td>
                <td>{d.Name}</td>
                <td style={{ textAlign: 'right' }}>{d.quotationQuantity}</td>
                <td style={{ textAlign: 'right' }}>{d.unitRate}</td>
                <td style={{ textAlign: 'right' }}>{(d.quotationQuantity * d.unitRate)}</td>
                <td style={{ textAlign: 'right' }}>{d.discount || 0}</td>
                <td style={{ textAlign: 'right' }}>{(d.quotationQuantity * d.unitRate) - (d.discount)}</td>
                <td style={{ textAlign: 'right' }}>{d.tax}</td>
                <td style={{ textAlign: 'right' }}>
                  {(
                    (d.quotationQuantity * d.unitRate - d.discount) +
                    ((d.quotationQuantity * d.unitRate - d.discount) * d.tax) / 100
                  ).toFixed(2)}
                </td>


              </tr>
            ))}
          </tbody>
        </table>

        {/* Customer Information */}
        <h4 className="quotation-view-section-title">Customer Information</h4>
        <div className="quotation-view-info">
          <div><span className="label">Company Name</span> : <span>{selectedInvoice.receivingEntity}</span></div>
          <div><span className="label">Name</span> : <span>{selectedInvoice.customerName}</span></div>
          <div><span className="label">Phone</span> :<span>{selectedInvoice.customerPhone}</span></div>
          <div><span className="label">Email</span>: <span>{selectedInvoice.customerEmail}</span></div>
          <div><span className="label">Address</span> :<span>{selectedInvoice.customerAddress}</span></div>
          <div><span className="label">Payment Terms</span> :<span>{selectedInvoice.paymentTerms}</span></div>

        </div>
      </div>
    </div>
  );
};

export default ViewPopup;
