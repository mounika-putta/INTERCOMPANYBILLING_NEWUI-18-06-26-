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
import { ViewPopup } from '../../components/Dashboard';


const Quotationapproval = () => {
    //method and return data handler
    const dispatch = useDispatch();
    const { activeurl } = useSelector((state) => state.registration);
    const [showHelp, setShowHelp] = useState(false);
    const companyList = useSelector((state) => state.Customers.companies);
    const [showModal, setShowModal] = useState(false);

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
        setSelectedQuotation({
            ...quotation,
            quotationDate: quotation.invoiceDate
        });

        setShowModal(true);
    };
    //popup open//
    const handleClosePopup = () => {
        setSelectedQuotation(null);
        setShowModal(false);
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
                elementSelector: ".cit-sheet",
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
                                    <div className="loader"></div>
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
                                    <td>
                                        <FaEye
                                            style={{ cursor: 'pointer' }}
                                            className="action-icon view-icon"
                                            onClick={() => handleViewClick(q)}
                                            title="View Quotation Details"
                                        />
                                    </td>

                                    <td
                                        style={{

                                            display: "flex",

                                            gap: "10px"
                                        }}
                                    >
                                        <button
                                            onClick={() => handleGenerateInvoice(q.referenceNumber)}
                                            style={{
                                                backgroundColor: "#1E7D4E",
                                                minWidth: "110px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                borderRadius :"4px",
                                                color:"#fff",
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


            <ViewPopup show={showModal} onClose={() => setShowModal(false)} selectedInvoice={selectedQuotation} type="quotationapproval"
                onGenerateInvoice={handleGenerateInvoice}
                loadingRefNo={loadingRefNo} />

            <HelpModal show={showHelp} title="Quotation Approval List - Help & Overview" screenName="QuotationApproval" onClose={() => setShowHelp(false)} />



        </div>
    );
};

export default Quotationapproval;
