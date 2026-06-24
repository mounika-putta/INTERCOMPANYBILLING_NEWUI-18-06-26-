import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "alertifyjs/build/css/alertify.css";
import { fetchInvoicedetailswithRefno } from "../../redux/QuotationTemplateSlice";
import "./ClassicInvoiceTemplate.css";
import { baseURL } from "../../services/api";

const LOCAL_LOGO = "/images/company-logo.png";

const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "-";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${d.getFullYear()}`;
};

const InvoiceTemplate = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const queryParams = new URLSearchParams(location.search);
  const invoiceId = queryParams.get("invoiceId");

  const { invoiceDetails, invoiceloading, error, message } =
    useSelector((state) => state.quotationApprovalTemplate) || {};

  const invoice = invoiceDetails?.list?.[0] || null;

  useEffect(() => {
    if (invoiceId) dispatch(fetchInvoicedetailswithRefno(invoiceId));
  }, [dispatch, invoiceId]);

  console.log("Invoice Details:", invoiceDetails);

  const formatCurrency = (n) => {
    if (n == null || n === "") return "-";
    return Number(n).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const logoFileName = invoice?.comapanyLogo
    ? invoice.comapanyLogo.split(/[/\\]/).pop()?.trim()
    : "";
  const logoUrl = logoFileName
    ? `${baseURL}/UploadedFiles/${logoFileName}`
    : LOCAL_LOGO;

  if (invoiceloading) {
    return (
      <div className="cit-loading">
        <div className="cit-spinner" />
      </div>
    );
  }

  if (error) {
    return <div className="cit-error">Failed to load invoice. Please try again.</div>;
  }

  if (!invoice) {
    return <div className="cit-error">Invoice not found.</div>;
  }

  return (
    <div className="cit-page">
      <div className="cit-sheet">
        {message && <div className="cit-banner success">{message}</div>}

        {/* Header: logo + company block */}
        <div className="cit-head">
          <div className="cit-logo-box">
            {logoFileName && (
              <img
                src={logoUrl}
                alt="Company Logo"
                className="cit-logo"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
              />
            )}
          </div>
          <div className="cit-title-wrap">
            <h1 className="cit-title">Invoice</h1>

          </div>
          <div className="cit-company">
            <div className="cit-company-name">{invoice?.companyName || "-"}</div>
            <div className="cit-row-line">
              <span>Company Reg No:</span> {invoice?.registrationNumber || "-"}
            </div>
            <div className="cit-row-line">
              <span>VAT Reg No:</span> {invoice?.vatNumber || "-"}
            </div>
            <div className="cit-row-line">
              <span>Website:</span>
              {invoice?.companyWebsite || "-"}
            </div>

            <div className="cit-row-line">
              <span>Tel:</span> {invoice?.companyPhoneNumber || "-"}
            </div>
            <div className="cit-row-line">
              <span>Email:</span> {invoice?.companyEmail || "-"}
            </div>
            <div className="cit-row-line">
              <span>Address:</span> {invoice?.companyAddress || "-"}
            </div>
          </div>
        </div>

        {/* Meta row: customer | title | doc meta */}
        <div className="cit-meta">
          <div className="cit-party">
            <div className="cit-block-label">Bill To</div>
            <div className="cit-strong">{invoice?.receivingEntity || "-"}</div>
            <div>{invoice?.customerName || "-"}</div>
            <div className="cit-dim">{invoice?.customerEmail || "-"}</div>
          </div>

          <div className="cit-title-wrap">
            {/* <h1 className="cit-title">Invoice</h1>
            <div className="cit-title-sub">{invoice?.invoiceStatus || ""}</div> */}
          </div>

          <div className="cit-docmeta">
            <div className="cit-mrow">
              <span>Date</span>
              <span>{formatDate(invoice?.invoiceDate)}</span>
            </div>
            <div className="cit-mrow">
              <span>Invoice No</span>
              <span>{invoice?.invoiceReferenceNumber || "-"}</span>
            </div>
            <div className="cit-mrow">
              <span>Quotation Ref</span>
              <span>{invoice?.referenceNumber || "-"}</span>
            </div>
            <div className="cit-mrow">
              <span>Currency</span>
              <span>{invoice?.currency || "-"}</span>
            </div>
          </div>
        </div>

        {/* Secondary attributes */}
        <div className="cit-attrs">
          <div className="cit-attr">
            <span>VAT Number</span>
            {invoice?.vatNumber || "-"}
          </div>
          <div className="cit-attr">
            <span>Type</span>
            {invoice?.quotationType || "-"}
          </div>
          <div className="cit-attr">
            <span>payment Terms</span>
            {invoice?.paymentTerms || "-"}
          </div>
        </div>

        {/* Line items */}
        <table className="cit-table">
          <thead>
            <tr>
              <th style={{ width: "110px" }}>Item Code</th>
              <th>Description</th>
              <th style={{ width: "80px" }}>Qty</th>
              <th style={{ width: "100px" }}>Unit Rate Excl VAT</th>
              <th style={{ width: "70px" }}>Disc</th>
              <th style={{ width: "60px" }}>VAT %</th>
              <th style={{ width: "120px" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice?.details?.length > 0 ? (
              invoice.details.map((d, idx) => {
                const base = (Number(d.quotationQuantity) || 0) * (Number(d.unitRate) || 0);
                const discounted = base - (Number(d.discount) || 0);
                const net = discounted + (discounted * (Number(d.tax) || 0)) / 100;
                return (
                  <tr key={idx}>
                    <td className="cit-ctr">{d.itemCode}</td>
                    <td className="cit-desc">
                      {d.itemName}
                      {d.category ? (
                        <span className="cit-dim"> — {d.category}</span>
                      ) : null}
                    </td>
                    <td className="cit-ctr">{d.quotationQuantity}</td>
                    <td className="cit-num">{formatCurrency(d.unitRate)}</td>
                    <td className="cit-num">{formatCurrency(d.discount)}</td>
                    <td className="cit-ctr">{d.tax}</td>
                    <td className="cit-num">{formatCurrency(net)}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className="cit-empty" colSpan="7">
                  No invoice details found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Footer: bank + totals */}
        <div className="cit-foot">
          <div className="cit-bank">
            <div className="cit-block-label">Bank Details</div>
            <div className="cit-brow">
              <span>Account Name</span>
              <span>{invoice?.accountHolderName || "-"}</span>
            </div>
            <div className="cit-brow">
              <span>Branch Code</span>
              <span>{invoice?.branchCode || "-"}</span>
            </div>
            <div className="cit-brow">
              <span>Account Number</span>
              <span>{invoice?.bankAccountNumber || "-"}</span>
            </div>
            <div className="cit-brow">
              <span>Reference</span>
              <span>{invoice?.invoiceReferenceNumber || "-"}</span>
            </div>
          </div>

          <div className="cit-totals">
            <div className="cit-trow">
              <span>Subtotal</span>
              <span>{formatCurrency(invoice?.subTotal)}</span>
            </div>
            <div className="cit-trow">
              <span>VAT</span>
              <span>{formatCurrency(invoice?.taxAmount)}</span>
            </div>
            <div className="cit-trow cit-grand">
              <span>Total Incl. VAT</span>
              <span>{formatCurrency(invoice?.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Payment terms */}
        <div className="cit-note">
          Payment Terms: {invoice?.paymentTerms || "—"}
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate;
