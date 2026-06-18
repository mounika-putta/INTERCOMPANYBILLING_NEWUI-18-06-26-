// QuotationTemplateModern.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import {
  fetchQuotationdetailswithRefno,
  fetchSaveQuotationApprovalorRejection,
} from "../../redux/QuotationTemplateSlice";
import "./QuotationTemplateModern.css";
import { baseURL } from "../../services/api";


const LOCAL_LOGO = "/images/company-logo.png";
// → Replace with "/images/company-logo.png" in production

const QuotationTemplateModern = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const queryParams = new URLSearchParams(location.search);
  const quotationId = queryParams.get("quotationId");
  const type = queryParams.get("type");

  const {
    quotationDetails,
    loading,
    error,
    actionLoading,
    message,
  } = useSelector((state) => state.quotationApprovalTemplate) || {};

  const quotation = quotationDetails?.list?.[0] || null;

  useEffect(() => {
    if (quotationId) dispatch(fetchQuotationdetailswithRefno(quotationId));
  }, [dispatch, quotationId]);

  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const formatCurrency = (n) => {
    if (n == null) return "-";
    return Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // const totalAmount =
  //   quotation?.details?.reduce((total, d) => {
  //     const qty = Number(d.quotationQuantity) || 0;
  //     const rate = Number(d.unitRate) || 0;
  //     const tax = Number(d.tax) || 0;
  //     const base = qty * rate;
  //     const taxAmount = base * (tax / 100);
  //     return total + base + taxAmount;
  //   }, 0) || 0;

  const finalLogo = quotation?.comapanyLogo
    ? `${baseURL}/UploadedFiles/${quotation.comapanyLogo.split("\\").pop()}`
    : LOCAL_LOGO;

  const logoFileName = quotation?.comapanyLogo
    ? quotation.comapanyLogo.split(/[/\\]/).pop()
    : "";

  const logoUrl = logoFileName
    ? `${baseURL}/UploadedFiles/${encodeURIComponent(logoFileName)}`
    : LOCAL_LOGO;

  console.log("logoFileName:", logoFileName);
  console.log("logoUrl:", logoUrl);

  const handleApprove = () => {
    alertify.confirm(
      "Confirmation",
      "Are you sure you want to approve this quotation?",
      function () {
        setApproveLoading(true);
        dispatch(
          fetchSaveQuotationApprovalorRejection({
            quotationId: quotation.quotation,
            type: "Approve",
            reason: "",
          })
        ).then((res) => {
          setApproveLoading(false);
          if (res.meta.requestStatus === "fulfilled") {
            alertify.alert("Success", res.payload.message, function () {
              window.location.reload();
            });
          } else {
            alertify.alert("Error", "Approval failed.");
          }
        });
      },
      function () {
        alertify.alert("Cancelled", "Approval cancelled.");
      }
    );
  };

  const handleReject = () => {
    alertify.confirm(
      "Confirmation",
      "Are you sure you want to reject this quotation?",
      function () {
        setShowRejectModal(true);
      },
      function () {
        alertify.error("Rejection cancelled.");
      }
    );
  };

  const handleRejectConfirm = () => {
    if (!rejectReason.trim()) {
      alertify.alert("Warning", "Please enter a rejection reason.");
      return;
    }
    setRejectLoading(true);
    dispatch(
      fetchSaveQuotationApprovalorRejection({
        quotationId: quotation.quotation,
        type: "Reject",
        reason: rejectReason,
      })
    ).then((res) => {
      setRejectLoading(false);

      if (res.meta.requestStatus === "fulfilled") {
        alertify.alert("Success", res.payload.message, function () {
          setShowRejectModal(false);
          window.location.reload();
        });
      } else {
        alertify.alert("Error", "Rejection failed.");
      }
    });
  };

  // Rendering
  if (loading) {
    return (
      <div className="qt-loading">
        <div className="qt-spinner" />
      </div>
    );
  }

  return (
    <div className="qt-wrapper">
      <div className="qt-card">
        {/* Banner messages */}
        {message && <div className="qt-banner success">{message}</div>}
        {error && <div className="qt-banner error">{error}</div>}

        {/* Header */}
        <header className="qt-header">
          <div className="qt-header-left">

            {/* <img src={finalLogo} alt="Company Logo" className="qt-logo" crossOrigin="anonymous" /> */}


            <div className="company-logo">
              {quotation?.comapanyLogo && (() => {
                const logoFileName = quotation?.comapanyLogo.split(/[/\\]/).pop();
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
              {/* <div>{quotation?.comapanyLogo ? quotation?.comapanyLogo.split(/[/\\]/).pop() : null}</div> */}

            </div>
            {/* <div>{quotation?.comapanyLogo ? quotation.comapanyLogo.split(/[/\\]/).pop() : null}</div> */}
          </div>
          <div className="qt-header-center">
            <h1 className="qt-title">Quotation</h1>
            {/* <div className="qt-subtitle">Quotation Approval</div> */}
          </div>
          <div className="qt-header-right">
            <div className="qt-company-name">{quotation?.companyName}</div>
            <div className="qt-company-small">{quotation?.companyAddress}</div>
            <div className="qt-company-small">{quotation?.companyPhoneNumber}</div>
            <div className="qt-company-small">{quotation?.companyEmail}</div>
          </div>
        </header>

        {/* Body */}
        <section className="qt-body">
          <div className="qt-row">
            <div className="qt-block">
              <h4 className="qt-block-title">Company Information</h4>
              <div className="qt-kv"><span>Registration No</span><span>{quotation?.registrationNumber || "-"}</span></div>
              <div className="qt-kv"><span>VAT Number</span><span>{quotation?.vatNumber || "-"}</span></div>
              <div className="qt-kv"><span>Phone</span><span>{quotation?.companyPhoneNumber || "-"}</span></div>
              <div className="qt-kv"><span>Website</span><span>{quotation?.companyWebsite || "-"}</span></div>
              <div className="qt-kv"><span>Address</span><span>{quotation?.companyAddress || "-"}</span></div>

              <br />
              <h4 className="qt-block-title">Customer Information</h4>
              <div className="qt-kv"><span>Reference No</span><span>{quotation?.customerRefno || "-"}</span></div>
              <div className="qt-kv"><span>Company Name</span><span>{quotation?.receivingEntity || "-"}</span></div>
              <div className="qt-kv"><span>Name</span><span>{quotation?.customerName || "-"}</span></div>
              <div className="qt-kv"><span>Email</span><span>{quotation?.customerEmail || "-"}</span></div>

            </div>

            <div className="qt-block">
              <h4 className="qt-block-title">Quotation Info</h4>
              <div className="qt-kv"><span>Reference No</span><span>{quotation?.referenceNumber || "-"}</span></div>
              <div className="qt-kv">
                <span>Date</span>
                <span>
                  {quotation?.invoiceDate
                    ? (() => {
                      const d = new Date(quotation.invoiceDate);
                      const day = String(d.getDate()).padStart(2, "0");
                      const month = String(d.getMonth() + 1).padStart(2, "0");
                      const year = d.getFullYear();
                      return `${day}/${month}/${year}`;
                    })()
                    : "/"}
                </span>
              </div>
              <div className="qt-kv"><span>Status</span><span>{quotation?.quotationStatus || "-"}</span></div>
              <div className="qt-kv"><span>Currency</span><span>{quotation?.currency || "-"}</span></div>
              <div className="qt-kv"><span>Type</span><span>{quotation?.quotationType || "-"}</span></div>
              <div className="qt-kv"><span>Total</span><span>{quotation?.totalAmount || 0}</span></div>
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
                    {quotation?.details?.length > 0 ? (
                      quotation.details.map((d, idx) => {

                        return (
                          <tr key={idx}>
                            <td className="desc">{d.itemCode}</td>
                            <td className="desc">{d.category}</td>
                            <td className="desc">{d.itemName}</td>
                            <td style={{ textAlign: 'right' }}>{d.quotationQuantity}</td>
                            <td style={{ textAlign: 'right' }}>{d.unitRate}</td>
                            <td style={{ textAlign: 'right' }}>{(d.quotationQuantity * d.unitRate)}</td>
                            <td style={{ textAlign: 'right' }}>{d.discount}</td>
                            <td style={{ textAlign: 'right' }}>{(d.quotationQuantity * d.unitRate) - (d.discount)}</td>
                            <td style={{ textAlign: 'right' }}>{d.tax}</td>
                            <td style={{ textAlign: 'right' }}>
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
              <div className="qt-kv"><span>Account Name</span><span>{quotation?.accountHolderName || "-"}</span></div>
              <div className="qt-kv"><span>Branch Code</span><span>{quotation?.branchCode || "-"}</span></div>
              <div className="qt-kv"><span>Account Number</span><span>{quotation?.bankAccountNumber || "-"}</span></div>

              {/* <div className="qt-kv"><span>Phone</span><span>{quotation?.customerPhone || "-"}</span></div>
              <div className="qt-kv"><span>Payment terms</span><span>{quotation?.paymentTerms || "-"}</span></div> */}
            </div>

            <div className="qt-block totals">
              <div className="qt-totals-card">
                <div className="qt-totals-row">
                  <div>Subtotal</div>
                  <div>
                    {quotation?.subTotal || 0}
                    {/* {formatCurrency(
                    quotation?.details?.reduce((s, it) => {
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
                    {quotation?.taxAmount || 0}
                    {/* {formatCurrency(
                    quotation?.details?.reduce((s, it) => {
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
                  <div>{quotation?.totalAmount || 0}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="qt-row">
            <div className="qt-block full">
              <h4 className="qt-block-title">Payment Terms</h4>
              <div className="qt-terms">
                {quotation?.paymentTerms ||
                  "Null"}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="qt-actions">
            {type === "customer" &&
              (quotation?.quotationStatus === "Created" ||
                quotation?.quotationStatus === "Updated") && (
                <>
                  <button
                    className="btn btn-approve"
                    onClick={handleApprove}
                    disabled={approveLoading || rejectLoading}
                  >
                    {approveLoading && <div className="spinner"></div>}
                    Approve
                  </button>
                  <button
                    className="btn btn-reject"
                    onClick={handleReject}
                    disabled={approveLoading || rejectLoading}
                  >

                    Reject
                  </button>
                </>
              )}
          </div>
        </section>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="qt-modal-overlay">
          <div className="qt-modal">
            <h3>Rejection Reason</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason"
            />
            <div className="modal-buttons">
              <button onClick={handleRejectConfirm} disabled={approveLoading || rejectLoading}
                className="btn btn-approve">
                {rejectLoading && <div className="spinner"></div>}
                Submit
              </button>
              <button onClick={() => setShowRejectModal(false)} className="btn btn-reject">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default QuotationTemplateModern;
