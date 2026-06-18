import React from "react";
import { baseURL } from "../../services/api";

const CreditNotePopup = ({ selectedCreditNote, onClose }) => {

    return (

        <div className="quotation-view-overlay">

            <div className="quotation-view-modal">

                <button
                    className="quotation-view-close-btn"
                    onClick={onClose}
                >
                    &times;
                </button>

                <h3 className="quotation-view-title">
                    View Credit Note Details
                </h3>

                {/* ---------- Company Information ---------- */}

                <h4 className="quotation-view-section-title">
                    Company Information
                </h4>

                <div className="quotation-view-info">

                    <div>

                        {selectedCreditNote.comapanyLogo && (() => {

                            const logoFileName =
                                selectedCreditNote.comapanyLogo
                                    .split(/[/\\]/)
                                    .pop();

                            return (
                                <img
                                    src={`${baseURL}/UploadedFiles/${logoFileName}`}
                                    alt="Company Logo"
                                    className="company-logo-corner"
                                />
                            );

                        })()}

                    </div>

                    <div>
                        <span className="label">Company Name</span>:
                        {selectedCreditNote.companyName}
                    </div>

                    <div>
                        <span className="label">Company Email</span>:
                        {selectedCreditNote.companyEmail}
                    </div>

                    <div>
                        <span className="label">Phone Number</span>:
                        {selectedCreditNote.companyPhoneNumber}
                    </div>

                    <div className="info-row">
                        <span className="label">Company Address</span>
                        <span className="colon">:</span>

                        <span
                            className="values"
                            style={{ marginLeft: "-8px" }}
                        >
                            {selectedCreditNote.companyAddress}
                        </span>
                    </div>

                    <div>
                        <span className="label">VAT Number</span>:
                        {selectedCreditNote.vatNumber}
                    </div>

                    <div>
                        <span className="label">Registration Number</span>:
                        {selectedCreditNote.registrationNumber}
                    </div>

                </div>

                {/* ---------- Bank Information ---------- */}

                <h4 className="quotation-view-section-title">
                    Bank Information
                </h4>

                <div className="quotation-view-info">

                    <div>
                        <span className="label">Bank Account Number</span>:
                        {selectedCreditNote.bankAccountNumber}
                    </div>

                    <div>
                        <span className="label">Branch Code</span>:
                        {selectedCreditNote.branchCode}
                    </div>

                    <div className="info-row">
                        <span className="label">Branch Address</span>
                        <span className="colon">:</span>

                        <span
                            className="values"
                            style={{ marginLeft: "-8px" }}
                        >
                            {selectedCreditNote.brannchAddress}
                        </span>
                    </div>

                </div>

                {/* ---------- Quotation Information ---------- */}

                <h4 className="quotation-view-section-title">
                    Quotation Information
                </h4>

                <div className="quotation-view-info">

                    <div>
                        <span className="label">Quotation Id</span>:
                        {selectedCreditNote.quotationRefno}
                    </div>

                    <div>
                        <span className="label">Quotation Date</span>:

                        {selectedCreditNote?.quotationDate
                            ? (() => {

                                const d = new Date(
                                    selectedCreditNote.quotationDate
                                );

                                const day = String(
                                    d.getDate()
                                ).padStart(2, "0");

                                const month = String(
                                    d.getMonth() + 1
                                ).padStart(2, "0");

                                const year = d.getFullYear();

                                return `${day}/${month}/${year}`;

                            })()
                            : "/"}
                    </div>

                    <div>
                        <span className="label">Quotation Status</span>:
                        {selectedCreditNote.quotationStatus}
                    </div>

                    <div>
                        <span className="label">Currency</span>:
                        {selectedCreditNote.currency}
                    </div>

                    <div>
                        <span className="label">Type</span>:
                        {selectedCreditNote.quotationType}
                    </div>

                    <div>
                        <span className="label">Total Amount</span>:
                        {selectedCreditNote.totalAmount?.toFixed(2)}
                    </div>

                </div>

                {/* ---------- Invoice Information ---------- */}

                <h4 className="quotation-view-section-title">
                    Invoice Information
                </h4>

                <div className="quotation-view-info">

                    <div>
                        <span className="label">Invoice Id</span>:
                        {selectedCreditNote.invoiceReferenceNumber}
                    </div>

                    <div>
                        <span className="label">Invoice Date</span>:

                        {selectedCreditNote?.invoiceDate
                            ? (() => {

                                const d = new Date(
                                    selectedCreditNote.invoiceDate
                                );

                                const day = String(
                                    d.getDate()
                                ).padStart(2, "0");

                                const month = String(
                                    d.getMonth() + 1
                                ).padStart(2, "0");

                                const year = d.getFullYear();

                                return `${day}/${month}/${year}`;

                            })()
                            : "/"}
                    </div>

                    <div>
                        <span className="label">Invoice Status</span>:
                        {selectedCreditNote.invoiceStatus}
                    </div>

                    {selectedCreditNote.invoiceStatus === "Cancelled" && (

                        <div className="info-row">

                            <span className="label">Reason</span>

                            <span className="colon">:</span>

                            <span className="values">
                                {selectedCreditNote.reason}
                            </span>

                        </div>

                    )}

                </div>

                {/* ---------- Credit Note Information ---------- */}

                <h4 className="quotation-view-section-title">
                    Credit Note Information
                </h4>

                <div className="quotation-view-info">

                    <div>
                        <span className="label">
                            Credit Note Refno.
                        </span>:
                        {selectedCreditNote.referenceNumber}
                    </div>

                    <div>
                        <span className="label">
                            Credit Note Date
                        </span>:

                        {selectedCreditNote?.creditNoteDate
                            ? (() => {

                                const d = new Date(
                                    selectedCreditNote.creditNoteDate
                                );

                                const day = String(
                                    d.getDate()
                                ).padStart(2, "0");

                                const month = String(
                                    d.getMonth() + 1
                                ).padStart(2, "0");

                                const year = d.getFullYear();

                                return `${day}/${month}/${year}`;

                            })()
                            : "/"}
                    </div>

                    <div>
                        <span className="label">Due Date</span>:

                        {selectedCreditNote?.dueDate
                            ? (() => {

                                const d = new Date(
                                    selectedCreditNote.dueDate
                                );

                                const day = String(
                                    d.getDate()
                                ).padStart(2, "0");

                                const month = String(
                                    d.getMonth() + 1
                                ).padStart(2, "0");

                                const year = d.getFullYear();

                                return `${day}/${month}/${year}`;

                            })()
                            : "/"}
                    </div>

                </div>

                {/* ---------- Quotation Details ---------- */}

                <h4 className="quotation-view-section-title">
                    Quotation Details
                </h4>

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
                            <th>DISCOUNTED AMOUNT</th>
                            <th>VAT %</th>
                            <th>NET AMOUNT</th>
                        </tr>

                    </thead>

                    <tbody>

                        {(selectedCreditNote.details || []).map((d, idx) => (

                            <tr key={idx}>

                                <td className="desc">{d.itemCode}</td>

                                <td className="desc">{d.category}</td>

                                <td className="desc">{d.itemName}</td>

                                <td style={{ textAlign: "right" }}>
                                    {d.itemQuantity}
                                </td>

                                <td style={{ textAlign: "right" }}>
                                    {d.unitRate}
                                </td>

                                <td style={{ textAlign: "right" }}>
                                    {(d.itemQuantity * d.unitRate)}
                                </td>

                                <td style={{ textAlign: "right" }}>
                                    {d.discount}
                                </td>

                                <td style={{ textAlign: "right" }}>
                                    {(d.itemQuantity * d.unitRate) - d.discount}
                                </td>

                                <td style={{ textAlign: "right" }}>
                                    {d.vat}
                                </td>

                                <td style={{ textAlign: "right" }}>

                                    {(
                                        (d.itemQuantity * d.unitRate - d.discount) +
                                        (
                                            (
                                                d.itemQuantity * d.unitRate -
                                                d.discount
                                            ) * d.vat
                                        ) / 100
                                    ).toFixed(2)}

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

                {/* ---------- Customer Information ---------- */}

                <h4 className="quotation-view-section-title">
                    Customer Information
                </h4>

                <div className="quotation-view-info">
                    <div>
                        <span className="label">Credit Note Addressed To.</span>:
                        {selectedCreditNote.receivingEntity}
                    </div>
                    <div>
                        <span className="label">Name</span>:
                        {selectedCreditNote.customerName}
                    </div>

                    <div>
                        <span className="label">Email</span>:
                        {selectedCreditNote.customerEmail}
                    </div>

                    <div>
                        <span className="label">Mobile Number</span>:
                        {selectedCreditNote.customerPhone}
                    </div>

                    <div className="info-row">

                        <span className="label">Address</span>

                        <span className="colon">:</span>

                        <span
                            className="values"
                            style={{ marginLeft: "-8px" }}
                        >
                            {selectedCreditNote.customerAddress}
                        </span>

                    </div>

                    <div className="info-row">

                        <span className="label">Payment Terms</span>

                        <span className="colon">:</span>

                        <span
                            className="values"
                            style={{ marginInlineStart: "-8px" }}
                        >
                            {selectedCreditNote.paymentTerms}
                        </span>

                    </div>

                </div>

                <br />

            </div>

        </div>
    );
};

export default CreditNotePopup;