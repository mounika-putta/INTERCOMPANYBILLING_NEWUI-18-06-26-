import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Quotationapproval.css';
import { fetchQuotationlist, savegenerateinvoicewitherefno } from '../../redux/QuotationApprovalSlice';
import { fetchActiveUrl } from '../../redux/RegistrationSlice';
import { baseURL } from "../../services/api";
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import Pagination from "../../components/Common/Pagination";
import HelpModal from "../../components/Common/HelpModal";
import useSort from "../../components/Common/useSort";
import CommonDatePicker from "../../components/Common/CommonDatePicker";
import dayjs from 'dayjs';
import { FaDownload, FaEye } from "react-icons/fa";
import { downloadPdfFromPage } from '../../components/Common/downloadPdf';


const Quotationapproval = () => {
    //method and return data handler
    const dispatch = useDispatch();
    const { activeurl } = useSelector((state) => state.registration);
    const [showHelp, setShowHelp] = useState(false);
    const companyList = useSelector((state) => state.Customers.companies);
    

    const {
        quotationList = [],
        loading,
        error } = useSelector(
            (state) => state.quotationapproval || {}
        );
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
    const filteredQuotations1 = quotationList.filter((q) => {
        // const idMatch = (q.referenceNumber || '').toLowerCase().includes((filterId || '').toLowerCase());
        // const dateMatch = filterDate ? new Date(q.invoiceDate).toISOString().slice(0, 10) === filterDate : true;
        // const companyMatch = (q.companyName || '').toLowerCase().includes((filterCompany || '').toLowerCase());
        // const customerMatch = (q.billingEntity || '').toLowerCase().includes((filterCustomer || '').toLowerCase());

        // return idMatch && dateMatch && companyMatch && customerMatch;
        return (
            (filters.referenceNumber === "" ||
                q.referenceNumber?.toLowerCase().includes(
                    filters.referenceNumber.toLowerCase()
                )) &&
            (filters.invoiceDate === "" ||
                q.invoiceDate?.toLowerCase().includes(filters.invoiceDate.toLowerCase())) &&
            (filters.companyName === "" ||
                q.companyName?.toLowerCase().includes(
                    filters.companyName.toLowerCase()
                )) &&
            (filters.customerName === "" ||
                q.customerName?.toLowerCase().includes(
                    filters.customerName.toLowerCase()
                ))
        );
    });

    const filteredQuotations = quotationList.filter((q) => {
        debugger
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
    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    // useEffect(() => {
    //     setCurrentPage(1);
    // }, [filterId, filterDate, filterCompany, filterCustomer]);


    //data binding
    const [selectedQuotation, setSelectedQuotation] = useState(null);
    // method default calling

    useEffect(() => {
        dispatch(fetchQuotationlist());
        dispatch((fetchActiveUrl()));
    }, [dispatch]);

    const templateUrl = `${activeurl?.[0] || ''}Invoicetemplate`;

    console.log('templateUrl:', templateUrl);

    //viewbutton//
    const handleViewClick = (quotation) => {
        setSelectedQuotation(quotation);
    };
    //popup open//
    const handleClosePopup = () => {
        setSelectedQuotation(null);
    };

    //generate Invoice

    const [loadingRefNo, setLoadingRefNo] = useState(null);


    // selector with default
    const { loadingByRefNo = {}, statusofInvoicegeneration } = useSelector(
        (state) => state.quotationapproval || {}
    );
    const [invoiceMessage, setInvoiceMessage] = useState('');

    const handleGenerateInvoice = (refNo) => {
        debugger;
        setLoadingRefNo(refNo);


        dispatch(savegenerateinvoicewitherefno({ refNo, templateUrl }))
            .unwrap()
            .then((res) => {
                setLoadingRefNo(false);
                setSelectedQuotation(null);
                console.log("Invoice generated successfully:", res.mess);
                setInvoiceMessage(res.message); // store message
                alertify.alert("Success", res.message);
                dispatch(fetchQuotationlist()); // refresh list
            })
            .catch((err) => {
                setSelectedQuotation(null);
                console.error("Error generating invoice:", err);
                alertify.alert("Error", "Failed to generate invoice");
            });
    };
    
    const [downloadingId, setDownloadingId] = useState(null);

    const handleDownloadQuotation = async (
  quotationId,
  referenceNumber
) => {

  try {

    setDownloadingId(quotationId);

    // Allow UI render
    await new Promise((resolve) => setTimeout(resolve, 300));

    const url =
      `${window.location.origin}` +
      `/QuotationTemplateModern?quotationId=${quotationId}&type=download`;

    await downloadPdfFromPage({
      url,
      fileName: `Quotation_${referenceNumber}.pdf`,
    });

    // Keep loader visible slightly longer
    await new Promise((resolve) => setTimeout(resolve, 1500));

  } catch (error) {

    console.error(error);

    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to download quotation.";

    if (
      message ===
      "Quotation is older than 14 days and has expired."
    ) {
      alertify.error(
        "Quotation expired. PDF download is not allowed."
      );
    } else {
      alertify.error(message);
    }

  } finally {

    setDownloadingId(null);

  }
};

    return (
        <div className="quotation-approval-container">
            {/* <h2 className='quotationapprovalheading'>Quotation Approval List</h2> */}
            <div className="list-header">
                <h2 className="Auditlogheading">Quotation Approval List</h2>
                <button className="help-btn" onClick={() => setShowHelp(true)}>
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
                        if (newDate && newDate.isValid && newDate.isValid()) {
                            setTempFilters({
                                ...tempFilters,
                                invoiceDate: newDate.format('YYYY-MM-DD'),
                            });
                        } else {
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
                                QUOTATION ID {""}
                                {sortConfig.key === "referenceNumber" ? (sortConfig.direction === "asc" ? "↑" : "↓") : "↑"}
                            </th>
                            <th>QUOTATION DATE</th>
                            <th>COMPANY</th>
                            <th>CUSTOMER</th>
                            <th>STATUS</th>
                            <th>VIEW</th>
                            <th>ACTION</th>

                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="8" style={{ textAlign: "center", padding: "40px 0" }}>
                                    <div className="spinner"></div>
                                </td>
                            </tr>
                        ) : filteredQuotations.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: "center" }}>
                                    No result found.
                                </td>
                            </tr>
                        ) : (
                            currentItems.map((q) => (
                                <tr key={q.quotationId}>
                                    <td>{q.referenceNumber}</td>
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
                                        <span className={`status ${q.quotationStatus.toLowerCase()}`}>
                                            {q.quotationStatus}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        <FaEye
                                        style={{  cursor: 'pointer' }}
                                            className="action-icon view-icon"
                                            onClick={() => handleViewClick(q)}
                                            title="View Invoice Details"
                                        />
                                    </td>

                                    <td
                                        style={{
                                            textAlign: "center",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "10px"
                                        }}
                                    >
                                        <button
                                            onClick={() => handleGenerateInvoice(q.referenceNumber)}
                                            style={{
                                                backgroundColor: "orange",
                                                minWidth: "110px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: "6px"
                                            }}
                                            disabled={loadingRefNo === q.referenceNumber}
                                        >
                                            {loadingRefNo === q.referenceNumber && (
                                                <span className="spinner"></span>
                                            )}

                                            Generate Invoice
                                        </button>

                                        {downloadingId === q.quotationId ? (
                                            <div
                                                className="spinner"
                                                style={{
                                                    width: "18px",
                                                    height: "18px"
                                                }}
                                            ></div>
                                        ) : (
                                            <FaDownload
                                                style={{
                                                    color: "#2563eb",
                                                    cursor: "pointer"
                                                }}
                                                className="action-icon download-icon"
                                                onClick={() =>
                                                    handleDownloadQuotation(
                                                        q.quotationId,
                                                        q.referenceNumber
                                                    )
                                                }
                                                title="QuotationDownload"
                                            />
                                        )}
                                    </td>


                                </tr>
                            ))

                        )}
                    </tbody>
                </table>
            </div>


            {!loading && quotationList.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalItems={quotationList.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                />
            )}


            {selectedQuotation && (
                <div className="quotation-view-overlay">
                    <div className="quotation-view-modal">
                        <button
                            className="quotation-view-close-btn"
                            onClick={handleClosePopup}
                        >
                            &times;
                        </button>

                        <h3 className="quotation-view-title">View Quotation Details</h3>

                        {/* ---------- Company Information ---------- */}
                        <h4 className="quotation-view-section-title">Company Information</h4>
                        <div className="quotation-view-info">
                            <div className="company-logo">
                                {selectedQuotation.comapanyLogo && (() => {
                                    const logoFileName = selectedQuotation.comapanyLogo.split(/[/\\]/).pop();
                                    console.log('logoFileName', logoFileName);
                                    return (
                                        <img
                                            src={`${baseURL}/UploadedFiles/${logoFileName}`}
                                            alt="Company Logo"
                                            className="company-logo-corner"
                                        />
                                    );
                                })()}
                            {/* <div>{selectedQuotation?.comapanyLogo ? selectedQuotation.comapanyLogo.split(/[/\\]/).pop() : null}</div> */}
                       
                            </div>
                            <div><span className="label">Company Name</span>: {selectedQuotation.companyName}</div>
                            <div><span className="label">Company Email</span>: {selectedQuotation.companyEmail}</div>
                            <div><span className="label">Phone Number</span>: {selectedQuotation.companyPhoneNumber}</div>
                            {/* <div><span className="label">Company Address</span>: {selectedQuotation.companyAddress}</div> */}
                            <div className="info-row">
                                <span className="label">Company Address</span>
                                <span className="colon">:</span>
                                <span className="values" style={{ marginLeft: '-8px' }}>{selectedQuotation.companyAddress}</span>
                            </div>
                            <div><span className="label">VAT Number</span>: {selectedQuotation.vatNumber}</div>
                            <div><span className="label">Registration Number</span>: {selectedQuotation.registrationNumber}</div>
                        </div>

                        {/* ---------- Bank Info ---------- */}
                        <h4 className="quotation-view-section-title">Bank Information</h4>
                        <div className="quotation-view-info">
                            <div><span className="label">Bank Account Number</span>: {selectedQuotation.bankAccountNumber}</div>
                            <div><span className="label">Branch Code</span>: {selectedQuotation.branchCode}</div>
                            {/* <div><span className="label">IFSC Code</span>: {selectedQuotation.ifscCode}</div> */}
                            {/* <div><span className="label">Address</span>: {selectedQuotation.brannchAddress}</div> */}
                            <div className="info-row">
                                <span className="label">Branch Address</span>
                                <span className="colon">:</span>
                                <span className="values" style={{ marginLeft: '-8px' }}>{selectedQuotation.brannchAddress}</span>
                            </div>
                        </div>

                        {/* ---------- Quotation Information ---------- */}
                        <h4 className="quotation-view-section-title">Quotation Information</h4>
                        <div className="quotation-view-info">
                            <div><span className="label">Quotation Id</span>: {selectedQuotation.referenceNumber}</div>
                            <div><span className="label">Date</span>: {selectedQuotation?.invoiceDate
                                ? (() => {
                                    const d = new Date(selectedQuotation.invoiceDate);
                                    const day = String(d.getDate()).padStart(2, "0");
                                    const month = String(d.getMonth() + 1).padStart(2, "0");
                                    const year = d.getFullYear();
                                    return `${day}/${month}/${year}`;
                                })()
                                : "/"}
                            </div>
                            <div><span className="label">Status</span>: {selectedQuotation.quotationStatus}</div>
                            <div><span className="label">Currency</span>: {selectedQuotation.currency}</div>
                            <div><span className="label">Total Amount</span>: {selectedQuotation.totalAmount?.toFixed(2)}</div>

                            {selectedQuotation.quotationStatus === "Rejected" && (
                                <div className="info-row">
                                    <span className="label">Reason</span>
                                    <span className="colon">:</span>
                                    <span className="values">{selectedQuotation.reason}</span>
                                </div>

                            )}
                        </div>

                        {/* ---------- Quotation Details ---------- */}
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
                                {(selectedQuotation.details || []).map((d, idx) => (
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
                                ))}
                            </tbody>
                        </table>

                        {/* ---------- Customer Info ---------- */}
                        <h4 className="quotation-view-section-title">Customer Information</h4>
                        <div className="quotation-view-info">
                            <div><span className="label">Company Name</span>: {selectedQuotation.receivingEntity}</div>
                            <div><span className="label">Name</span>: {selectedQuotation.customerName}</div>
                            <div><span className="label">Email</span>: {selectedQuotation.customerEmail}</div>
                            {/* <div><span className="label">Address</span>: {selectedQuotation.customerAddress}</div> */}
                            <div className="info-row">
                                <span className="label">Address</span>
                                <span className="colon">:</span>
                                <span className="values" style={{ marginLeft: '-8px' }}>{selectedQuotation.customerAddress}</span>
                            </div>
                            <div><span className="label">Mobile Number</span>: {selectedQuotation.customerPhone}</div>
                            <div className="info-row">
                                <span className="label">Payment Terms</span>
                                <span className="colon">:</span>
                                <span className="values" style={{ marginInlineStart: '-8px' }}>{selectedQuotation.paymentTerms}</span>
                            </div>
                        </div>
                        <br />

                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                            <button
                                onClick={() => handleGenerateInvoice(selectedQuotation.referenceNumber)}
                                style={{
                                    backgroundColor: "orange",
                                    minWidth: "110px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "6px"
                                }}
                                disabled={loadingRefNo === selectedQuotation.referenceNumber}
                            >
                                {(loadingRefNo === selectedQuotation.referenceNumber) && (
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                )}

                                Generate Invoice
                            </button>
                        </div>



                    </div>
                </div>
            )}
            <HelpModal show={showHelp} title="Quotation Approval List - Help & Overview" screenName="QuotationApproval" onClose={() => setShowHelp(false)} />



        </div>
    );
};

export default Quotationapproval;
