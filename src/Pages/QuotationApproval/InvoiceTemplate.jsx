import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import { fetchInvoicedetailswithRefno } from '../../redux/QuotationTemplateSlice';
import './QuotationTemplateModern.css';
import { baseURL } from "../../services/api";



const QuotationTemplate = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const LOCAL_LOGO = "/mnt/data/bc2c1b92-1579-4906-8ac1-ef8ace38394b.png";
  const queryParams = new URLSearchParams(location.search);
  const invoiceId = queryParams.get('invoiceId');
  const quotationState = useSelector((state) => state.quotationapprovalTemplate) || {};

  const {
    invoiceDetails,
    invoiceloading,
    error,
    actionLoading,
    message
  } = useSelector((state) => state.quotationApprovalTemplate) || {};

  const invoice = invoiceDetails?.list?.[0] || null;


  useEffect(() => {
    if (invoiceDetails) {
      console.log(" invoice:", invoiceDetails);
      console.log(" invoice list:", invoiceDetails.list);
    } else {
      console.log("⚠️ invoiceDetails is null or undefined");
    }
  }, [invoiceDetails]);

  useEffect(() => {
    if (invoiceId) {
      dispatch(fetchInvoicedetailswithRefno(invoiceId));
    }
  }, [dispatch, invoiceId]);

  const formatCurrency = (n) => {
    if (n == null) return "-";
    return Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };


  const finalLogo = invoice?.comapanyLogo
    ? `${baseURL}/UploadedFiles/${invoice.comapanyLogo.split("\\").pop()}`
    : LOCAL_LOGO;

  const logoFileName = invoice?.comapanyLogo
    ? invoice.comapanyLogo
      .replace(/\\/g, "/")
      .split("/")
      .pop()
      ?.trim()
    : "";
  const logoUrl = logoFileName
    ? `${baseURL}/UploadedFiles/${logoFileName}`
    : LOCAL_LOGO;


  if (invoiceloading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        Failed to load quotation. Please try again.
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="error-message">
        Invoice not found.
      </div>
    );
  }


  // Get only the file name from full path
  // const logoFileName = invoice.comapanyLogo
  //     ? invoice.comapanyLogo.split("\\").pop()  // Windows path (backslash)
  //     : null;

  const totalAmount = (invoice?.details || []).reduce((sum, d) => {
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
    <div className="qt-wrapper">
      <div className="qt-card">
        {/* Banner messages */}
        {message && <div className="qt-banner success">{message}</div>}
        {error && <div className="qt-banner error">{error}</div>}

        {/* Header */}
        <header className="qt-header">
          <div className="qt-header-left">

            {invoice?.comapanyLogo && (() => {
              const logoFileName = invoice?.comapanyLogo.split(/[/\\]/).pop();
              console.log('logoFileName', logoFileName);
              return (
                <img
                  src={`${baseURL}/UploadedFiles/${logoFileName}`}
                  alt="Company Logo"
                  className="qt-Logo"
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                  onLoad={() => console.log("logo loaded")}
                  onError={(e) => console.log("logo failed", e)}
                />
              );
            })()}
          </div>
          <div className="qt-header-center">
            <h1 className="qt-title">Invoice</h1>
            {/* <div className="qt-subtitle">Quotation Approval</div> */}
          </div>
          <div className="qt-header-right">
            <div className="qt-company-name">{invoice?.companyName}</div>
            <div className="qt-company-small">{invoice?.companyAddress}</div>
            <div className="qt-company-small">{invoice?.companyPhoneNumber}</div>
            <div className="qt-company-small">{invoice?.companyEmail}</div>
          </div>
        </header>

        {/* Body */}
        <section className="qt-body">
          <div className="qt-row">
            <div className="qt-block">
              <h4 className="qt-block-title">Company Information</h4>
              <div className="qt-kv"><span>Registration No</span><span>{invoice?.registrationNumber || "-"}</span></div>
              <div className="qt-kv"><span>VAT Number</span><span>{invoice?.vatNumber || "-"}</span></div>
              <div className="qt-kv"><span>Phone</span><span>{invoice?.companyPhoneNumber || "-"}</span></div>
              <div className="qt-kv"><span>Website</span><span>{invoice?.companyWebsite || "-"}</span></div>
              <div className="qt-kv"><span>Address</span><span>{invoice?.companyAddress || "-"}</span></div>
              <br />
              <h4 className="qt-block-title">Customer Information</h4>
              <div className="qt-kv"><span>Reference No</span><span>{invoice?.customerRefno || "-"}</span></div>
              <div className="qt-kv"><span>Company Name</span><span>{invoice?.receivingEntity || "-"}</span></div>
              <div className="qt-kv"><span>Name</span><span>{invoice?.customerName || "-"}</span></div>
              <div className="qt-kv"><span>Email</span><span>{invoice?.customerEmail || "-"}</span></div>
            </div>


            <div className="qt-block">
              <h4 className="qt-block-title">Quotation Information</h4>
              <div className="qt-kv"><span>Quotation Ref No</span><span>{invoice?.referenceNumber || "-"}</span></div>
              <div className="qt-kv"><span>Invoice Ref No</span><span>{invoice?.invoiceReferenceNumber || "-"}</span></div>
              <div className="qt-kv"><span>Date</span><span>
                {invoice?.invoiceDate
                  ? (() => {
                    const d = new Date(invoice.invoiceDate);
                    const day = String(d.getDate()).padStart(2, "0");
                    const month = String(d.getMonth() + 1).padStart(2, "0");
                    const year = d.getFullYear();
                    return `${day}/${month}/${year}`;
                  })()
                  : "/"}
              </span></div>
              <div className="qt-kv"><span>Quotation Status</span><span>{invoice?.quotationStatus || "-"}</span></div>
              <div className="qt-kv"><span>Invoice Status</span><span>{invoice?.invoiceStatus || "-"}</span></div>
              <div className="qt-kv"><span>Currency</span><span>{invoice?.currency || "-"}</span></div>
              <div className="qt-kv"><span>Type</span><span>{invoice?.quotationType || "-"}</span></div>
              <div className="qt-kv"><span>Total</span><span>{invoice?.totalAmount || 0}</span></div>
            </div>

          </div>

          <div className="qt-row qt-items-row">
            <div className="qt-block full">
              <h4 className="qt-block-title">Quotation Details</h4>

              <div className="qt-table-wrap">
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
                    {invoice?.details?.length > 0 ? (
                      invoice.details.map((d, idx) => {
                        return (
                          <tr key={idx}>
                            <td >{d.itemCode}</td>
                            <td >{d.category}</td>
                            <td >{d.itemName}</td>
                            <td className="black-text" >{d.quotationQuantity}</td>
                            <td className="black-text" >{d.unitRate}</td>
                            <td className="black-text" >{(d.quotationQuantity * d.unitRate)}</td>
                            <td className="black-text" >{d.discount}</td>
                            <td className="black-text" >{(d.quotationQuantity * d.unitRate) - (d.discount)}</td>
                            <td className="black-text" >{d.tax}</td>
                            <td className="black-text" >
                              {(
                                (d.quotationQuantity * d.unitRate - d.discount) +
                                ((d.quotationQuantity * d.unitRate - d.discount) * d.tax) / 100
                              ).toFixed(2)}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className="no-data">No quotation details found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="qt-row bottom-row">
            <div className="qt-block">
              <h4 className="qt-block-title">Bank Account Information</h4>
              <div className="qt-kv"><span>Account Holder Name</span><span>{invoice?.accountHolderName || "-"}</span></div>
              <div className="qt-kv"><span>Branch Code</span><span>{invoice?.branchCode || "-"}</span></div>
              <div className="qt-kv"><span>Account Number</span><span>{invoice?.bankAccountNumber || "-"}</span></div>

              {/* <div className="qt-kv"><span>Phone</span><span>{quotation?.customerPhone || "-"}</span></div>
              <div className="qt-kv"><span>Payment terms</span><span>{quotation?.paymentTerms || "-"}</span></div> */}
            </div>

            <div className="qt-block totals">
              <div className="qt-totals-card">
                <div className="qt-totals-row">
                  <div>Subtotal</div>
                  <div>
                    {invoice?.subTotal || 0}
                    {/* {formatCurrency(
                    invoice?.details?.reduce((s, it) => {
                      const q = Number(it.quotationQuantity) || 0;
                      const r = Number(it.unitRate) || 0;
                      return s + q * r;
                    }, 0)
                  )} */}
                  </div>
                </div>
                <div className="qt-totals-row">
                  <div>VAT</div>
                  <div>
                    {invoice?.taxAmount || 0}
                    {/* {formatCurrency(
                    invoice?.details?.reduce((s, it) => {
                      const q = Number(it.quotationQuantity) || 0;
                      const r = Number(it.unitRate) || 0;
                      const t = Number(it.tax) || 0;
                      return s + (q * r) * (t / 100);
                    }, 0)
                  )} */}
                  </div>
                </div>
                <div className="qt-totals-row grand">
                  <div>Total Amount Incl. VAT</div>
                  <div>{invoice?.totalAmount || 0}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="qt-row">
            <div className="qt-block full">
              <h4 className="qt-block-title">Payment Terms</h4>
              <div className="qt-terms">
                {invoice?.paymentTerms ||
                  "Null"}
              </div>
            </div>
          </div>


        </section>
      </div>

    </div>
  );

};

export default QuotationTemplate;




