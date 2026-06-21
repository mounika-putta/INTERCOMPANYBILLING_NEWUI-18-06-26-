import React, { useEffect, useState } from "react";
import "./QuotationDashboard.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchcount, fetchQuotationOrInvoiceDetails } from "../../redux/DashboardSlice";
import { DashboardHeader, InvoiceTable, QuotationTable, SearchBar, SummaryCards, ViewPopup } from "../../components/Dashboard";
import Pagination from "../../components/Common/Pagination";
import HelpModal from "../../components/Common/HelpModal";
import useSort from "../../components/Common/useSort";
import { fetchCompanieswithfilter } from '../../redux/CustomerSlice';
import CreditNotePopup from "../../components/Dashboard/CreditNotePopup";
import { fetchCreditnotedetailswithInvoicerefno } from '../../redux/QuotationTemplateSlice';


const QuotationDashboard = () => {
  const [type, setType] = useState("Quotation");
  const [status, setStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const companyList = useSelector((state) => state.Customers.companies);

  const dispatch = useDispatch();
  const { counts, quotationOrInvoiceData, loading } = useSelector((state) => state.dashboardsData);
  const [selectedCreditNote, setSelectedCreditNote] = useState(null);

  const [showCreditNotePopup, setShowCreditNotePopup] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const handleCreditNoteViewClick = async (invoice) => {

    // Try both possible field names for invoice reference
    const refNo = invoice.invoiceReferenceNumber || invoice.invoiceRefno;

    if (!refNo) return;

    try {

      const response = await dispatch(
        fetchCreditnotedetailswithInvoicerefno(refNo)
      ).unwrap();

      console.log("Credit Note Response", response);

      setSelectedCreditNote(response.list);

      setShowCreditNotePopup(true);

    } catch (error) {

      console.log("Error", error);

      alert(error);
    }
  };
  const handleViewClick = async (quotation) => {

    // Credit Note - Check both quotationStatus and invoiceStatus
    const isCreditNote =
      quotation.invoiceStatus === "Credit note Created" ||
      quotation.quotationStatus === "Credit note Created";

    if (isCreditNote) {

      await handleCreditNoteViewClick(quotation);

    } else {

      // Normal Popup
      setSelectedQuotation(quotation);
    }
  };
  useEffect(() => {
    dispatch(fetchcount());
    dispatch(fetchCompanieswithfilter());
  }, [dispatch]);

  useEffect(() => {
    setStatus("");
    setSelectedQuotation(null);
    setSearchTerm("");
    setCurrentPage(1);
    // Don't fetch data on page load - wait for user to select a status
  }, [type, dispatch]);


  useEffect(() => {
    if (quotationOrInvoiceData) {
      console.log("quotationOrInvoiceData:", quotationOrInvoiceData);
    }
  }, [quotationOrInvoiceData]);

  const handleCardClick = (clickedStatus) => {
    console.log("Clicked Status:", clickedStatus);
    setStatus(clickedStatus);
    dispatch(fetchQuotationOrInvoiceDetails({ type, status: clickedStatus }));
  };

  const [filters, setFilters] = useState({
    referenceNumber: "",
    invoiceDate: "",
    companyName: "",
    customerName: "",
  });


  const [tempFilters, setTempFilters] = useState({
    referenceNumber: "",
    quotationDate: "",
    companyName: "",
    customerName: "",
  });
  const handleApplyFilters = () => {
    setFilters(tempFilters); // Apply only on button click

  };

  const handleClearFilters = () => {
    const clearedFilters = {
      referenceNumber: "",
      quotationDate: "",
      companyName: "",
      customerName: "",
    };
    setTempFilters(clearedFilters);
    setFilters(clearedFilters);
    dispatch(fetchQuotationOrInvoiceDetails({ type, status }));
  };

  const filteredData =
    quotationOrInvoiceData?.filter((item) => {
      const search = searchTerm.toLowerCase();

      // Normalize date for consistent filtering
      const itemDate = item.quotationDate
        ? new Date(item.quotationDate).toISOString().split("T")[0]
        : item.date
          ? new Date(item.date).toISOString().split("T")[0]
          : "";

      const matchesSearch =
        item.companyName?.toLowerCase().includes(search) ||
        item.refno?.toLowerCase().includes(search) ||
        item.customerName?.toLowerCase().includes(search) ||
        item.invoiceRefno?.toLowerCase().includes(search) ||
        item.status?.toLowerCase().includes(search) ||
        itemDate.includes(search);

      const matchesFilters =
        (!filters.referenceNumber ||
          item.refno?.toLowerCase().includes(filters.referenceNumber.toLowerCase())) &&
        (!filters.quotationDate || itemDate === filters.quotationDate) &&
        (!filters.companyName ||
          item.companyName?.toLowerCase().includes(filters.companyName.toLowerCase())) &&
        (!filters.customerName ||
          item.customerName?.toLowerCase().includes(filters.customerName.toLowerCase()));

      return matchesSearch && matchesFilters;
    }) || [];

  const { sortedData, sortConfig, requestSort } = useSort([...filteredData]);




  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);


  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );



  const handlePageChange = (page) => setCurrentPage(page);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, status]);


  return (
    <div className="quotation-dashboard">
      <DashboardHeader type={type} setType={setType} />

      <SummaryCards type={type} counts={counts} onCardClick={handleCardClick} />
      {/* <div className="searchbar-row d-flex">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Company Name" />
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Customer Name" />
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Status" />
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Reference No" />
      </div> */}
      <div className="filter-section d-flex">
        <input
          type="text"
          value={tempFilters.referenceNumber}
          onChange={(e) =>
            setTempFilters({ ...tempFilters, referenceNumber: e.target.value })
          }
          placeholder="Quotation ID"
        />
        {/* <input
          type="date"
          value={tempFilters.quotationDate}
          onChange={(e) =>
            setTempFilters({ ...tempFilters, quotationDate: e.target.value })
          }
          placeholder="Date"
        /> */}
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

        <button className="filter-btn" onClick={handleApplyFilters}>
          Filter
        </button>
        <button className="clear-btn" onClick={handleClearFilters}>
          Clear
        </button>
      </div>


      <div className="table-card">
        {/* <h3 className="table-card-title">{type} List</h3>

        <div className="search-inline">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="button" className="search-go">Search</button>
        </div> */}

        {type === "Quotation" ? (
          <QuotationTable data={paginatedData} loading={loading} status={status} sortConfig={sortConfig} onSort={requestSort} onView={handleViewClick} />
        ) : (
          <InvoiceTable data={paginatedData} loading={loading} status={status} sortConfig={sortConfig} onSort={requestSort} onView={handleViewClick} />
        )}
        {filteredData.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      <br />
      <div className="list-header">
        <br />
        <button style={{ marginLeft: "1075px", marginBottom: "10px" }} className="help-btn" onClick={() => setShowHelp(true)}>
          <i className="fas fa-question-circle"></i> Help
        </button>
      </div>
      {/* 
      {selectedQuotation && (
        <ViewPopup data={selectedQuotation} type={type} onClose={() => setSelectedQuotation(null)} />
      )} */}
      {/* Normal Popup */}
      {selectedQuotation && (
        // <ViewPopup
        //   data={selectedQuotation}
        //   type={type}
        //   onClose={() => setSelectedQuotation(null)}
        // />

         <ViewPopup show={showModal} onClose={() => setShowModal(false)} selectedInvoice={selectedQuotation} />
        
      )}

      {/* Credit Note Popup */}
      {showCreditNotePopup && selectedCreditNote && (
        <CreditNotePopup
          selectedCreditNote={selectedCreditNote}
          onClose={() => {
            setShowCreditNotePopup(false);
            setSelectedCreditNote(null);
          }}
        />
      )}
      <HelpModal show={showHelp} title="Dashboard - Help & Overview" screenName="Dashboard" onClose={() => setShowHelp(false)} />
    </div>
  );
};

export default QuotationDashboard;
