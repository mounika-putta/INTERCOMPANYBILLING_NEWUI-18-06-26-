import React from "react";
import { baseURL } from "../../services/api";

const ViewPopup = ({ data, type, onClose }) => {
  if (!data) return null;

  const logoFileName = data.comapanyLogo?.split(/[/\\]/).pop();

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
    <div className="quotation-view-overlay">
      <div className="quotation-view-modal">
        <button className="quotation-view-close-btn" onClick={onClose}>&times;</button>
        <h3 className="quotation-view-title">View {type} Details</h3>

        <h4 className="quotation-view-section-title">Company Information</h4>
        {logoFileName && (
          <img
            src={`${baseURL}/UploadedFiles/${logoFileName}`}
            alt="Company Logo"
            className="company-logo-corner"
          />
        )}
        <div className="quotation-view-info">

          <div><span className="label">Company Name</span>: {data.companyName}</div>
          <div><span className="label">VAT Number</span>: {data.vatNumber}</div>
          <div><span className="label">Registration Number</span>: {data.registrationNumber}</div>
          <div><span className="label">Company Email</span>: {data.companyEmail}</div>
          <div><span className="label">Phone Number</span>: {data.companyPhoneNumber}</div>
          <div className="info-row">
            <span className="label">Company Address</span>
             <span className="colon">:</span>
            <span className="values" style={{ marginLeft: '-8px' }}>{data.companyAddress}</span>
          </div>      
          
        </div>
        <h4 className="quotation-view-section-title">Bank Information</h4>
        <div className="quotation-view-info">
          <div><span className="label">Bank Account Number</span>: {data.bankAccountNumber}</div>
          <div><span className="label">Branch Code</span>: {data.branchCode}</div>
          <div className="info-row">
            <span className="label">Branch Address</span>
             <span className="colon">:</span>
             <span className="values" style={{ marginLeft: '-8px' }}>{data.branchAddress}</span>
         </div>
          {/* <div><span className="label" hidden>IFSC Code</span>: {data.ifscCode }</div> */}
          
        </div>
        <h4 className="quotation-view-section-title">Quotation Information</h4>
        <div className="quotation-view-info">
          <div><span className="label">Quotation Id</span>: {data.referenceNumber}</div>
          
          <div><span className="label">Date</span>:&nbsp;
          
           {data?.quotationDate
                          ? (() => {
                            const d = new Date(data.quotationDate);
                            const day = String(d.getDate()).padStart(2, "0");
                            const month = String(d.getMonth() + 1).padStart(2, "0");
                            const year = d.getFullYear();
                            return `${day}/${month}/${year}`;
                          })()
                          : "/"}
           </div>

          <div><span className="label">Currency</span>: {data.currency}</div>
          <div><span className="label">Type</span>: {data.quotationType}</div>
          <div><span className="label">Total Amount</span>: {totalAmount.toFixed(2)}</div>
          <div><span className="label">Status</span>: {data.quotationStatus}</div>
          
          {data.quotationStatus === "Rejected" && (
            <div className="info-row">
              <span className="label">Reason</span>
              <span className="colon">:</span>
              <span className="values" style={{marginLeft :'-6px'}}>{data.reason}</span>
            </div>
            
          )}

        </div>
        {type === "Invoice" && (
              <>
                <h4 className="quotation-view-section-title">Invoice Information</h4>
                <div className="quotation-view-info">
                  <div><span className="label">Invoice Id</span>: {data.invoiceRefno || "-"}</div>
                  <div><span className="label">Invoice Date</span>:&nbsp;               
                   {data?.invoiceDate
                          ? (() => {
                            const d = new Date(data.invoiceDate);
                            const day = String(d.getDate()).padStart(2, "0");
                            const month = String(d.getMonth() + 1).padStart(2, "0");
                            const year = d.getFullYear();
                            return `${day}/${month}/${year}`;
                          })()
                          : "/"}
                   </div>
                  <div><span className="label">Status</span>: {data.invoiceStatus || "-"}</div>
                  
                  {data.invoiceStatus === "Cancelled" && (
                    <div className="info-row">
                                    <span className="label">Reason</span>
                                    <span className="colon">:</span>
                                    <span className="values">{data.reason}</span>
                    </div>
                  )}
                </div>
              </>
            )}



        {/* Details Table */}
        <h4 className="quotation-view-section-title">Quotation Details</h4>
        <table className="quotation-view-table">
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
            {(data.details || []).map((d, i) => (
              <tr key={i}>
                <td>{d.itemCode}</td>
                <td>{d.category}</td>
                <td>{d.itemName}</td>
                <td style={{textAlign: 'right'}}>{d.quotationQuantity}</td>
                <td style={{textAlign: 'right'}}>{d.unitRate}</td>
                <td style={{textAlign: 'right'}}>{(d.quotationQuantity * d.unitRate)}</td>
                <td style={{textAlign: 'right'}}>{d.discount || 0}</td>
                <td style={{textAlign: 'right'}}>{(d.quotationQuantity * d.unitRate)-(d.discount)}</td>
                <td style={{textAlign: 'right'}}>{d.tax}</td>                            
                <td style={{textAlign: 'right'}}>
                  {(
                    (d.quotationQuantity * d.unitRate - d.discount) +
                    ((d.quotationQuantity * d.unitRate - d.discount) * d.tax) / 100
                  ).toFixed(2)}
                </td>
                

              </tr>
            ))}
          </tbody>
        </table>

        <h4 className="quotation-view-section-title">Customer Information</h4>
        <div className="quotation-view-info">
          <div><span className="label">Customer Name</span>: {data.customerName}</div>
          <div><span className="label">Email</span>: {data.customerEmail}</div>
          {/* <div><span className="label">Address</span>: {data.customerAddress}</div> */}
          <div className="info-row">
            <span className="label">Address</span>
            <span className="colon">:</span>
            <span className="values" style={{ marginInlineStart: '-8px' }}>{data.customerAddress}</span>
          </div>
          <div><span className="label">Mobile Number</span>:&nbsp;{data.customerPhone}</div>
          <div className="info-row">
            <span className="label">Payment Terms</span>
            <span className="colon">:</span>
            <span className="values" style={{ marginInlineStart: '-8px' }}>{data.paymentTerms}</span>
          </div>
        </div>
         

      </div>
    </div>
  );
};

export default ViewPopup;