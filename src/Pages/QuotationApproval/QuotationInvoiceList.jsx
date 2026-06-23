import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './QuotationInvoiceList.css';
import { fetchInvoicelist, fetchSaveInvoicestatusPaidorcancel } from '../../redux/QuotationInvoiceApprovalSlice';
import { baseURL } from "../../services/api";
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import HelpModal from '../../components/Common/HelpModal';
import useSort from "../../components/Common/useSort";
import Pagination from "../../components/Common/Pagination";
import { fetchCompanieswithfilter } from '../../redux/CustomerSlice';
import CommonDatePicker from "../../components/Common/CommonDatePicker";
import dayjs from 'dayjs';
import { FaTimesCircle, FaCheckCircle, FaUndo, FaEye, FaDownload, FaFileAlt, FaFileInvoiceDollar, FaMoneyCheckAlt, FaReceipt, FaFileInvoice } from "react-icons/fa";
import CreditNoteTemplate from './CreditNoteTemplate';
import { downloadPdfFromPage } from '../../components/Common/downloadPdf';
import { fetchCreditnotedetailswithInvoicerefno } from '../../redux/QuotationTemplateSlice';
import { MdOutlineReceiptLong } from "react-icons/md";
import CreditNotePopup from '../../components/Dashboard/CreditNotePopup';
import { ViewPopup } from '../../components/Dashboard';

const QuotationInvoiceList = () => {
    //method and return data handler
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showHelp, setShowHelp] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
    const { invoiceList = [], loading, error } = useSelector(
        (state) => state.quotationInvoiceapproval || {}
    );
    // For cancel flow
    const [showCreditModal, setShowCreditModal] = useState(false);

    const [showCancelPopup, setShowCancelPopup] = useState(false);
    const [cancelReason, setCancelReason] = useState("");

    const [cancelLoading, setCancelLoading] = useState(false);
    const companyList = useSelector((state) => state.Customers.companies);

    const [creditViewLoadingId, setCreditViewLoadingId] = useState(null);
    const [creditDownloadLoadingId, setCreditDownloadLoadingId] = useState(null);
    const [invoiceDownloadLoadingId, setInvoiceDownloadLoadingId] = useState(null);


    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // filter functionality
    // const [filterId, setFilterId] = useState('');
    // const [filterDate, setFilterDate] = useState('');
    // const [filterCompany, setFilterCompany] = useState('');
    // const [filterCustomer, setFilterCustomer] = useState('');

    const [filters, setFilters] = useState({
        referenceNumber: "",
        invoiceDate: "",
        companyName: "",
        customerName: "",
    });


    const [tempFilters, setTempFilters] = useState({
        referenceNumber: "",
        invoiceDate: "",
        companyName: "",
        customerName: "",
    });

    const handleApplyFilters = () => {
        setFilters(tempFilters); // Apply only on button click
        setCurrentPage(1);       // Reset pagination (if needed)
    };

    // const filteredQuotations = invoiceList.filter((q) => {
    //     return (
    //         (filters.referenceNumber === "" ||
    //             q.referenceNumber?.toLowerCase().includes(filters.referenceNumber.toLowerCase())) &&
    //         (filters.invoiceDate === "" ||
    //             q.invoiceDate?.toLowerCase().includes(filters.invoiceDate.toLowerCase())) &&
    //         (filters.companyName === "" ||
    //             q.companyName?.toLowerCase().includes(filters.companyName.toLowerCase())) &&
    //         (filters.customerName === "" ||
    //             q.customerName?.toLowerCase().includes(filters.customerName.toLowerCase()))
    //     );
    // });

    const filteredQuotations = invoiceList.filter((q) => {

        // Reference Number Match
        const referenceMatch =
            !filters.referenceNumber ||
            q.referenceNumber?.toLowerCase().includes(filters.referenceNumber.toLowerCase());

        // Company Match
        const companyMatch =
            !filters.companyName ||
            q.companyName?.toLowerCase().includes(filters.companyName.toLowerCase());

        // Customer Match
        const customerMatch =
            !filters.customerName ||
            q.customerName?.toLowerCase().includes(filters.customerName.toLowerCase());

        // Date Match
        let dateMatch = true;
        if (filters.invoiceDate) {
            const qDate = dayjs(q.invoiceDate, ['YYYY-MM-DD', 'DD/MM/YYYY', 'YYYY-MM-DDTHH:mm:ss']);
            dateMatch = qDate.isValid() && qDate.format('YYYY-MM-DD') === filters.invoiceDate;
        }

        return referenceMatch && companyMatch && customerMatch && dateMatch;
    });

    const { sortedData, requestSort, sortConfig } = useSort(filteredQuotations);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // IMPORTANT: paginate SORTED data
    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);


    // useEffect(() => {
    //     setCurrentPage(1);
    // }, [filterId, filterDate, filterCompany, filterCustomer]);


    //data binding
    const [selectedQuotation, setSelectedQuotation] = useState(null);
    // method default calling
    useEffect(() => {
        dispatch(fetchInvoicelist());
        dispatch(fetchCompanieswithfilter());
    }, [dispatch]);
    //viewbutton//
    const handleViewClick = (quotation) => {
        setSelectedQuotation(quotation);
        setShowModal(true);
    };
    //popup open//
    const handleClosePopup = () => {
        setSelectedQuotation(null);
        setShowModal(false);
    };

    const [selectedCreditNote, setSelectedCreditNote] = useState(null);
    const [showCreditNotePopup, setShowCreditNotePopup] = useState(false);
    const creditNoteViewDetails = useSelector(
        (state) => state.quotationApprovalTemplate.creditNoteViewDetails
    );
    const handleCreditnoteClosePopup = () => {
        setShowCreditNotePopup(false);
        setSelectedCreditNote(null);
    };


    const handleCreditNoteViewClick = async (invoice) => {

        if (!invoice.invoiceReferenceNumber) return;

        try {

            setCreditViewLoadingId(invoice.invoiceId);

            const response = await dispatch(
                fetchCreditnotedetailswithInvoicerefno(
                    invoice.invoiceReferenceNumber
                )
            ).unwrap();

            console.log("Credit Note Response", response);

            setSelectedCreditNote(response.list);

            setShowCreditNotePopup(true);

        } catch (error) {

            console.log("Error", error);

            alertify.alert("Error", error);

        } finally {

            setCreditViewLoadingId(null);

        }
    };


    // Reject flow
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [rejectLoading, setRejectLoading] = useState(false);
    const [paidLoadingId, setPaidLoadingId] = useState(null); // holds invoiceId while Paid action is running
    const [cancelConfirmLoading, setCancelConfirmLoading] = useState(false); // for cancel confirm



    // Approve (Paid) handler


    const handleApprove = (invoiceId) => {
        alertify.confirm(
            "Confirmation",
            "Are you sure you want to update status of this invoice as Paid?",
            function () {
                setPaidLoadingId(invoiceId);
                dispatch(
                    fetchSaveInvoicestatusPaidorcancel({
                        InvoiceId: invoiceId,
                        type: "Paid",
                        reason: ""
                    })
                ).then((res) => {
                    setPaidLoadingId(null);
                    if (res.meta.requestStatus === "fulfilled") {
                        alertify.alert("Success", res.payload.message, function () {
                            dispatch(fetchInvoicelist()); // refresh
                        });
                    } else {
                        alertify.alert("Error", "Failed to update invoice as Paid.");
                    }
                });
            },
            function () {
                alertify.alert('Warning', "Payment update cancelled.");
            }
        );
    };

    const handleCancel = (invoiceId) => {
        alertify.confirm(
            "Confirm Cancellation",
            "Do you want to cancel this invoice approval?",
            function () {
                // If user clicks Yes → open reason popup
                setSelectedInvoiceId(invoiceId);
                setShowCancelPopup(true);
            },
            function () {
                // If No → do nothing
                alertify.error("Cancel action aborted");
            }
        );
    };

    const handleConfirmCancel = () => {
        if (!cancelReason.trim()) {
            alertify.alert("Error", "Please enter a reason before cancelling.");
            return;
        }

        setCancelConfirmLoading(true);
        dispatch(
            fetchSaveInvoicestatusPaidorcancel({
                InvoiceId: selectedInvoiceId,
                type: "Cancel",
                reason: cancelReason
            })
        ).then((res) => {
            setCancelConfirmLoading(false);
            if (res.meta.requestStatus === "fulfilled") {
                alertify.alert("Success", res.payload.message, function () {
                    dispatch(fetchInvoicelist()); // refresh invoice list
                });
            } else {
                alertify.alert("Error", "Failed to cancel invoice.");
            }
            // Reset popup state
            setShowCancelPopup(false);
            setCancelReason("");
            setSelectedInvoiceId(null);
        });
    };

    const handleDownloadInvoice = async (
        invoiceId,
        invoiceReferenceNumber
    ) => {
        try {
            setInvoiceDownloadLoadingId(invoiceId);

            const url =
                `${window.location.origin}` +
                `/InvoiceTemplate?invoiceId=${invoiceId}`;

            await downloadPdfFromPage({
                url,
                fileName: `Invoice_${invoiceReferenceNumber}.pdf`,
            });

        } catch (error) {

            console.log("Invoice Download Error", error);

            alertify.error("Failed to download invoice");

        } finally {

            // small delay so spinner is visible
            setTimeout(() => {
                setInvoiceDownloadLoadingId(null);
            }, 500);
        }
    };
    const handleDownloadCreditNote = async (
        creditnoteId,
        CreditReferenceNumber
    ) => {
        debugger
        const url =
            `${window.location.origin}` +
            `/CreditNoteViewtemplate?creditNoteId=${creditnoteId}`;

        await downloadPdfFromPage({
            url,
            fileName: `CreditNote_${CreditReferenceNumber}.pdf`,
        });
    };
    const handleCreditNoteDownloadClick = async (
        invoiceReferenceNumber,
        invoiceId
    ) => {

        if (!invoiceReferenceNumber) return;

        try {

            setCreditDownloadLoadingId(invoiceId);

            const response = await dispatch(
                fetchCreditnotedetailswithInvoicerefno(
                    invoiceReferenceNumber
                )
            ).unwrap();

            const data = response?.list || response;

            console.log("Download Data", data);

            await handleDownloadCreditNote(
                data?.creditnoteId,
                data?.referenceNumber
            );

        } catch (error) {

            console.log("Download Error", error);

            alertify.alert("Error", error);

        } finally {

            setCreditDownloadLoadingId(null);

        }
    };

    return (
        <div className="quotationinvoice-approval-container">

            <div className="list-header">
                <h2 className='quotationInvoiceapprovalheading'>Invoice Approval List</h2>
                <button style={{ marginBottom: "-25px" }} className="help-btn" onClick={() => setShowHelp(true)}>
                    <i className="fas fa-question-circle"></i> Help
                </button>
            </div>
            <div className="filter-section">
                <input
                    type="text"
                    value={tempFilters.referenceNumber}
                    onChange={(e) =>
                        setTempFilters({ ...tempFilters, referenceNumber: e.target.value })
                    }
                    placeholder="Quotation Id"
                />
                {/* <input
                    type="date"
                    value={tempFilters.invoiceDate}
                    onChange={(e) =>
                        setTempFilters({ ...tempFilters, invoiceDate: e.target.value })
                    }
                    placeholder="date"
                /> */}
                <CommonDatePicker
                    value={tempFilters.invoiceDate}
                    onChange={(newDate) => {
                        // Check if newDate is a dayjs object
                        if (newDate && newDate.isValid && newDate.isValid()) {
                            // Store in YYYY-MM-DD format for filtering
                            setTempFilters({
                                ...tempFilters,
                                invoiceDate: newDate.format('YYYY-MM-DD'),
                            });
                        } else {
                            // Clear the date if null
                            setTempFilters({
                                ...tempFilters,
                                invoiceDate: '',
                            });
                        }
                    }}
                    className="common-input" label="Select Date" placeholder="Select Date"
                />
                {/* <input
                    type="text"
                    value={tempFilters.companyName}
                    onChange={(e) =>
                        setTempFilters({ ...tempFilters, companyName: e.target.value })
                    }
                    placeholder="Company Name"
                /> */}
                <select
                    value={tempFilters.companyName}
                    onChange={(e) =>
                        setTempFilters({ ...tempFilters, companyName: e.target.value })
                    }
                    className="form-control"
                >
                    <option value="">Select Company </option>
                    {companyList.map((company) => (
                        <option key={company.companyName} value={company.companyName}>
                            {company.companyName}
                        </option>
                    ))}

                </select>
                <input
                    type="text"
                    value={tempFilters.customerName}
                    onChange={(e) =>
                        setTempFilters({ ...tempFilters, customerName: e.target.value })
                    }
                    placeholder="Customer Name"
                />

                <button
                    className="filter-btn"
                    type="button"
                    onClick={handleApplyFilters}
                >
                    Filter
                </button>
                <button className="clear-btn"
                    onClick={() => {
                        const clearedFilters = { referenceNumber: "", invoiceDate: "", companyName: "", customerName: "" };
                        setTempFilters(clearedFilters); setFilters(clearedFilters); setCurrentPage(1);
                    }}>Clear
                </button>
            </div>

            <div className="invoice-approval-list">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th onClick={() => requestSort("referenceNumber")}>
                                QUOTATION ID {" "}
                                {sortConfig.key === "referenceNumber" ? (sortConfig.direction === "asc" ? "↑" : "↓") : "↑"}
                            </th>
                            <th>INVOICE ID</th>
                            <th>QUOTATION DATE</th>
                            <th>COMPANY</th>
                            <th>CUSTOMER</th>
                            <th>STATUS</th>
                            <th>ACTION</th>
                            <th>VIEW / DOWNLOAD</th>

                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="10" style={{ textAlign: "center", padding: "40px 0" }}>
                                    <div className="loader"></div>
                                </td>
                            </tr>
                        ) : filteredQuotations.length === 0 ? (
                            <tr>
                                <td colSpan="10" style={{ textAlign: "center" }}>
                                    No result found.
                                </td>
                            </tr>
                        ) : (

                            currentItems.map((q) => (
                                <tr key={q.invoiceId}>
                                    <td>{q.referenceNumber}</td>
                                    <td>{q.invoiceReferenceNumber}</td>

                                    <td>
                                        {q.invoiceDate
                                            ? new Date(q.invoiceDate).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            })
                                            : "-"}


                                    </td>
                                    <td>{q.companyName || '-'}</td>
                                    <td>{q.customerName}</td>
                                    <td>
                                        <span
                                            className={`status-badge 
                                            ${q.invoiceStatus === "Created" ? "status-invoicecreated" : ""}
                                            ${q.invoiceStatus === "Paid" ? "status-paid" : ""}
                                            ${q.invoiceStatus === "Cancelled" ? "status-cancelled" : ""}
                                            ${q.invoiceStatus === "Credit note Created" ? "status-creditnote" : ""}`}>
                                            {q.invoiceStatus}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-container">

                                            {q.invoiceStatus === "Created" && (
                                                <>
                                                    <div
                                                        onClick={() => handleApprove(q.invoiceId)}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        {paidLoadingId === q.invoiceId ? (
                                                            <span className="icon-spinner"></span>
                                                        ) : (
                                                            <FaCheckCircle title="Marks as Paid"
                                                                className="action-icon invoicepaid-icon"
                                                            />
                                                        )}
                                                    </div>

                                                    <FaTimesCircle
                                                        className="action-icon invoicecancel-icon" title="Marks as cancelled"
                                                        onClick={() => handleCancel(q.invoiceId)}
                                                    />
                                                </>
                                            )}

                                            {q.invoiceStatus === "Paid" && (
                                                <>
                                                    <FaTimesCircle
                                                        className="action-icon invoicecancel-icon" title="Marks as cancelled"
                                                        onClick={() => handleCancel(q.invoiceId)}
                                                    />

                                                    <div
                                                        title="Generate Credit Note"
                                                        onClick={() => {
                                                            setSelectedInvoiceId(q.invoiceId);
                                                            setShowCreditModal(true);
                                                        }}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        {paidLoadingId === q.invoiceId ? (
                                                            <span className="icon-spinner"></span>
                                                        ) : (
                                                            <FaReceipt
                                                                className="action-icon credit-icon"
                                                            />
                                                        )}
                                                    </div>
                                                </>
                                            )}

                                            {q.invoiceStatus === "Cancelled" && (
                                                <div
                                                    onClick={() => handleApprove(q.invoiceId)}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    {paidLoadingId === q.invoiceId ? (
                                                        <span className="icon-spinner"></span>
                                                    ) : (
                                                        <FaCheckCircle
                                                            className="action-icon invoicepaid-icon"
                                                        />
                                                    )}
                                                </div>
                                            )}
                                            {!["Created", "Paid", "Cancelled"].includes(q.invoiceStatus) && (
                                                <div
                                                    className="no-action"
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        width: "100%",
                                                    }}
                                                >
                                                    -
                                                </div>
                                            )}
                                        </div>
                                    </td>



                                    <td>
                                        <div className="action-container">

                                            <FaEye
                                                style={{ cursor: "pointer" }}
                                                className="action-icon view-icon"
                                                onClick={() => handleViewClick(q)}
                                                title="View Invoice Details"
                                            />

                                            <div
                                                onClick={() =>
                                                    handleDownloadInvoice(
                                                        q.invoiceId,
                                                        q.invoiceReferenceNumber
                                                    )
                                                }
                                                style={{
                                                    cursor: invoiceDownloadLoadingId === q.invoiceId
                                                        ? "not-allowed"
                                                        : "pointer",
                                                    pointerEvents:
                                                        invoiceDownloadLoadingId === q.invoiceId
                                                            ? "none"
                                                            : "auto",
                                                }}
                                            >
                                                {invoiceDownloadLoadingId === q.invoiceId ? (
                                                    <div className="mini-spinner"></div>
                                                ) : (
                                                    <FaDownload
                                                        className="action-icon download-icon"
                                                        title="Invoice Download"
                                                    />
                                                )}
                                            </div>

                                            {q.invoiceStatus === "Credit note Created" && (
                                                <>
                                                    <div
                                                        onClick={() => handleCreditNoteViewClick(q)}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        {creditViewLoadingId === q.invoiceId ? (
                                                            <span className="icon-spinner"></span>
                                                        ) : (
                                                            <MdOutlineReceiptLong
                                                                className="action-icon creditview-icon"
                                                                title="View Credit Note Details"
                                                            />
                                                        )}
                                                    </div>

                                                    <div
                                                        onClick={() =>
                                                            handleCreditNoteDownloadClick(
                                                                q.invoiceReferenceNumber,
                                                                q.invoiceId
                                                            )
                                                        }
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        {creditDownloadLoadingId === q.invoiceId ? (
                                                            <span className="icon-spinner"></span>
                                                        ) : (
                                                            <FaDownload
                                                                className="action-icon creditdownload-icon"
                                                                title="Credit Note Download"
                                                            />
                                                        )}
                                                    </div>
                                                </>

                                            )}

                                            {/* {q.invoiceStatus === "Created" && (
                                                <>
                                                    <div
                                                        onClick={() => handleApprove(q.invoiceId)}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        {paidLoadingId === q.invoiceId ? (
                                                            <span className="icon-spinner"></span>
                                                        ) : (
                                                            <FaCheckCircle title="Marks as Paid"
                                                                className="action-icon paid-icon"
                                                            />
                                                        )}
                                                    </div>

                                                    <FaTimesCircle
                                                        className="action-icon cancel-icon" title="Marks as cancelled"
                                                        onClick={() => handleCancel(q.invoiceId)}
                                                    />
                                                </>
                                            )}

                                            {q.invoiceStatus === "Paid" && (
                                                <>
                                                    <FaTimesCircle
                                                        className="action-icon cancel-icon" title="Marks as cancelled"
                                                        onClick={() => handleCancel(q.invoiceId)}
                                                    />

                                                    <div
                                                        title="Generate Credit Note"
                                                        onClick={() => {
                                                            setSelectedInvoiceId(q.invoiceId);
                                                            setShowCreditModal(true);
                                                        }}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        {paidLoadingId === q.invoiceId ? (
                                                            <span className="icon-spinner"></span>
                                                        ) : (
                                                            <FaReceipt
                                                                className="action-icon credit-icon"
                                                            />
                                                        )}
                                                    </div>
                                                </>
                                            )}

                                            {q.invoiceStatus === "Cancelled" && (
                                                <div
                                                    onClick={() => handleApprove(q.invoiceId)}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    {paidLoadingId === q.invoiceId ? (
                                                        <span className="icon-spinner"></span>
                                                    ) : (
                                                        <FaCheckCircle
                                                            className="action-icon paid-icon"
                                                        />
                                                    )}
                                                </div>
                                            )} */}

                                        </div>
                                    </td>
                                </tr>
                            ))

                        )}
                    </tbody>
                </table>
            </div>

            {sortedData.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalItems={sortedData.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                />
            )}

            {showCancelPopup && (
                <div className="cancel-popup-overlay">
                    <div className="cancel-popup">
                        <h4>Cancel Invoice</h4>
                        <textarea
                            placeholder="Enter cancellation reason..."
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            rows={4}
                            style={{ width: "100%" }}
                        />
                        <div style={{ marginTop: "10px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                            <button className='cancel-btn' onClick={() => setShowCancelPopup(false)} disabled={cancelConfirmLoading}>
                                Close
                            </button>
                            <button
                                className="paid-btn"
                                onClick={handleConfirmCancel}
                                disabled={cancelConfirmLoading}
                            >
                                {cancelConfirmLoading && <span className="spinner"></span>}
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedQuotation && (
                <ViewPopup show={showModal} onClose={() => setShowModal(false)}
                    selectedInvoice={selectedQuotation} type="invoiceapproval"
                    onGenerateInvoice={null}
                    loadingRefNo={null} />
            )}

            {showCreditNotePopup && selectedCreditNote && (
                <CreditNotePopup
                    selectedCreditNote={selectedCreditNote}
                    onClose={() => {
                        setShowCreditNotePopup(false);
                        setSelectedCreditNote(null);
                    }}
                />
            )}
            {showCreditModal && (
                <div className="quotation-view-overlay">
                    <div className="quotation-view-modal"
                        style={{
                            maxWidth: '75vw',
                            width: '1200px'
                        }}>
                        <button
                            className="quotation-view-close-btn"
                            onClick={() => setShowCreditModal(false)}
                        >
                            &times;
                        </button>
                        <CreditNoteTemplate
                            invoiceId={selectedInvoiceId}
                            closeModal={() => setShowCreditModal(false)}
                            onSaved={() => {
                                dispatch(fetchInvoicelist()); // 🔥 refresh list
                            }}
                        />
                    </div>
                </div>
            )}
            <HelpModal show={showHelp} title="Invoice Approval - Help & Overview" screenName="InvoiceApporval" onClose={() => setShowHelp(false)} />



        </div>
    );
};

export default QuotationInvoiceList;
