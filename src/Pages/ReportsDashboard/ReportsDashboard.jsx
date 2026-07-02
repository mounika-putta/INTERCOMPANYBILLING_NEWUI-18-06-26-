import React, { useState, useEffect } from "react";
import axios from "axios";
import { ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, } from "recharts";
import "./ReportsDashboard.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardReport, fetchReportDetails, clearReportDetails, clearDashboardData } from '../../redux/DashboardSlice';
import { fetchCreditnotedetailswithInvoicerefno } from '../../redux/QuotationTemplateSlice';
import { InvoiceTable, QuotationTable, ViewPopup } from "../../components/Dashboard";
import useSort from "../../components/Common/useSort";
import Pagination from "../../components/Common/Pagination";
import HelpModal from "../../components/Common/HelpModal";
import CreditNotePopup from "../../components/Dashboard/CreditNotePopup";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";


const ReportsDashboard = () => {
  const dispatch = useDispatch();
  const [fromDate, setFromDate] = useState("");
  const [period, setPeriod] = useState("");
  const [selectedType, setSelectedType] = useState("quotation");
  const [comparisonType, setComparisonType] = useState("quotation");
  const [pieType, setPieType] = useState("quotation");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailType, setDetailType] = useState("");
  const [detailStatus, setDetailStatus] = useState("");
  const [activePanel, setActivePanel] = useState("graph");
  const companyList = useSelector((state) => state.Customers.companies);
  const [showHelp, setShowHelp] = useState(false);
  const { reportDetailsData, reportDetailsLoading } = useSelector((state) => state.dashboardsData);
  const { reportsdashboardData, reportsloading } = useSelector((state) => state.dashboardsData);
  const [selectedCreditNote, setSelectedCreditNote] = useState(null);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [showCreditNotePopup, setShowCreditNotePopup] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    return () => {
      dispatch(clearReportDetails());
      dispatch(clearDashboardData());

      setSelectedQuotation(null);
      setSelectedCreditNote(null);
      setShowCreditNotePopup(false);
      setActivePanel("graph");
    };
  }, [dispatch]);

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

      alertify.alert("Error occurred while fetching credit note details");
    }
  };

  const dashboardData = reportsdashboardData;

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

  const COLORS = [
    "#5C9DED",
    "#4CAF50",
    "#D4A017",
    "#E57373",
    "#9575CD",
    "#90A4AE",
  ];

  const handleApply = async () => {

    if (!period) {
      alertify.alert('Warning', "Please select a period");
      return;
    }

    // Convert the selected period (7 / 30 / 60 days) into a start date
    const days = Number(period);
    const start = new Date();
    start.setDate(start.getDate() - days + 1);
    const computedFromDate = start.toISOString().split("T")[0];
    setFromDate(computedFromDate);

    const result = await dispatch(
      fetchDashboardReport(computedFromDate)
    );
    setActivePanel("graph");
    console.log("API Response:", result.payload);
  };


  const handleChartClick = async (type, status) => {

     const normalizedType = type.toLowerCase();

    setDetailType(normalizedType);
    setDetailStatus(status);

    await dispatch(fetchReportDetails({
      type,
      status,
      fromDate
    }));

    setActivePanel("details");
  };


  const handleViewClick = async (quotation) => {
    const isCreditNote =
      quotation.invoiceStatus?.toLowerCase() === "credit note created" ||
      quotation.quotationStatus?.toLowerCase() === "credit note created";

    if (isCreditNote) {
      await handleCreditNoteViewClick(quotation);
    } else {
      setSelectedQuotation({
        ...quotation,
        invoiceReferenceNumber:
          quotation.invoiceReferenceNumber || quotation.invoiceRefno
      });
      setShowModal(true);
    }
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);

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

    dispatch(fetchReportDetails({
      type: detailType,
      status: detailStatus,
      fromDate
    }));
  };
  const normalizeInvoiceStatus = (status) => {
    if (!status) return "";
    return status.toLowerCase() === "created" ? "Unpaid" : status;
  };
  const quotationStatus =
    dashboardData?.quotationStatus?.map((x) => ({
      name: x.status,
      value: x.count,
    })) || [];
  const invoiceBarData =
    dashboardData?.invoiceStatus?.map((x) => ({
      status: normalizeInvoiceStatus(x.status),
      count: x.count,
    })) || [];

  const quotationBarData =
    dashboardData?.quotationStatus?.map((x) => ({
      status: x.status,
      count: x.count,
    })) || [];

  const invoiceStatus =
    dashboardData?.invoiceStatus?.map((x,) => ({
      name: normalizeInvoiceStatus(x.status),
      value: x.count,
    })) || [];

  const quotationTrend =
    dashboardData?.quotationTrend?.map((x) => ({
      period: new Date(x.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      count: x.count,
    })) || [];

  const invoiceTrend =
    dashboardData?.invoiceTrend?.map((x) => ({
      period: new Date(x.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      count: x.count,
    })) || [];

  // Merge quotation & invoice trends by date so both lines align on one X axis
  const combinedTrend = (() => {
    const map = new Map();
    const addPoint = (date, key, count) => {
      const label = new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const existing = map.get(label) || {
        period: label,
        quotationCount: 0,
        invoiceCount: 0,
        sortKey: new Date(date).getTime(),
      };
      existing[key] = count;
      map.set(label, existing);
    };

    (dashboardData?.quotationTrend || []).forEach((x) =>
      addPoint(x.date, "quotationCount", x.count)
    );
    (dashboardData?.invoiceTrend || []).forEach((x) =>
      addPoint(x.date, "invoiceCount", x.count)
    );

    return Array.from(map.values()).sort((a, b) => a.sortKey - b.sortKey);
  })();

  // Derived KPI values from the real status breakdowns
  const approvedQuotations =
    quotationStatus.find((s) => /approv|accept/i.test(s.name))?.value || 0;
  const paidInvoices =
    invoiceStatus.find((s) => /paid/i.test(s.name))?.value || 0;

  const hasQuotationStatus = quotationStatus.length > 0;
  const hasInvoiceStatus = invoiceStatus.length > 0;
  const hasQuotationTrend = quotationTrend.length > 0;
  const hasInvoiceTrend = invoiceTrend.length > 0;

  const hasBarData =
    selectedType === "quotation"
      ? quotationBarData.length > 0
      : invoiceBarData.length > 0;

  const hasLineData = combinedTrend.length > 0;


  const filteredData =
    reportDetailsData?.filter((item) => {
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
  }, [filters, reportDetailsData]);


  return (
    <div className="reportdashboard-wrapper">
      <div className="container-fluid">


        {/* HEADER */}
        <div className="reportdashboard-header-card">

          <div className="reportdashboard-header-text">
            <h2>Reports Analytics Dashboard</h2>
            <p>
              Track quotation and invoice performance
              {period ? ` over the last ${period} days` : " over the selected period"}.
            </p>
          </div>

          <div className="reportdashboard-filter-section">
            <select
              name="period"
              id="period"
              className="report-period-select"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="">Select Period</option>
              <option value="7">7 Days</option>
              <option value="15">15 Days</option>
              <option value="30">30 Days</option>
              <option value="45">45 Days</option>
              <option value="60">60 Days</option>
            </select>

            <button
              onClick={handleApply}
              className="reportdashboard-search-btn"
              disabled={reportsloading}
            >
              {reportsloading ? "Loading..." : "Search"}
            </button>

            <button className="help-btn" onClick={() => setShowHelp(true)}>
              <i className="fas fa-question-circle"></i> Help
            </button>
          </div>

        </div>

        {/* OVERVIEW STAT CARDS */}
        {dashboardData && (
          <>
            <h3 className="report-section-heading">Overview</h3>
            <div className="report-stat-cards">
              <div className="report-stat-card sc-quotation">
                <span className="sc-label">Total Quotations</span>
                <span className="sc-value">
                  {dashboardData?.summary?.totalQuotations || 0}
                </span>
              </div>
              <div className="report-stat-card sc-accepted">
                <span className="sc-label">Approved Quotations</span>
                <span className="sc-value">{approvedQuotations}</span>
              </div>
              <div className="report-stat-card sc-invoice">
                <span className="sc-label">Total Invoices</span>
                <span className="sc-value">
                  {dashboardData?.summary?.totalInvoices || 0}
                </span>
              </div>
              <div className="report-stat-card sc-paid">
                <span className="sc-label">Paid Invoices</span>
                <span className="sc-value">{paidInvoices}</span>
              </div>
            </div>
          </>
        )}
        {dashboardData && activePanel === "graph" && (
          <div className="reportdashboard-charts-grid">

            {/* STATUS BAR CHART */}
            {hasBarData && (
              <div className="reportdashboard-chart-card shadow-sm">
                <div className="reportdashboard-chart-header d-flex justify-content-between">
                  <span>Status Trend</span>

                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="quotation">Quotation</option>
                    <option value="invoice">Invoice</option>
                  </select>
                </div>

                <div className="reportdashboard-chart-body">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={
                        selectedType === "quotation"
                          ? quotationBarData
                          : invoiceBarData
                      }

                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="status" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count"
                        onClick={(data) =>
                          handleChartClick(
                            selectedType,
                            data.status
                          )
                        }>
                        {(
                          selectedType === "quotation"
                            ? quotationBarData
                            : invoiceBarData
                        ).map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* INVOICE PIE */} {/* QUOTATION PIE */}

            {(hasInvoiceStatus || hasQuotationStatus) && (
              <div className="reportdashboard-chart-card">
                <div className="reportdashboard-chart-header d-flex justify-content-between">
                  <span>Status Distribution</span>

                  <select
                    value={pieType}
                    onChange={(e) => setPieType(e.target.value)}
                  >
                    <option value="quotation">Quotation</option>
                    <option value="invoice">Invoice</option>

                  </select>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={
                        pieType === "invoice"
                          ? invoiceStatus
                          : quotationStatus
                      }
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      label
                      onClick={(data) =>
                        handleChartClick(
                          pieType,
                          data.name
                        )
                      }
                    >
                      {(pieType === "invoice"
                        ? invoiceStatus
                        : quotationStatus
                      ).map((entry, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>

                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            {/* TREND LINE CHART */}
            {hasLineData && (
              <div className="reportdashboard-chart-card reportdashboard-full-width">
                <div className="reportdashboard-chart-header d-flex justify-content-between">
                  <span>Trend Analysis - Quotation vs Invoice</span>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={combinedTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />

                    <Line
                      type="bump"
                      dataKey="quotationCount"
                      stroke="#5C9DED"
                      strokeWidth={4}
                      dot={false}
                      activeDot={{ r: 7 }}
                      name="Quotation Count"
                    />

                    <Line
                      type="bump"
                      dataKey="invoiceCount"
                      stroke="#00C896"
                      strokeWidth={4}
                      dot={false}
                      activeDot={{ r: 7 }}
                      name="Invoice Count"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* NO DATA MESSAGE */}
            {!hasBarData &&
              !hasInvoiceStatus &&
              !hasQuotationStatus &&
              !hasLineData && (
                <div
                  className="alert alert-warning text-center"
                  style={{
                    gridColumn: "1 / -1",
                    marginTop: "20px",
                    marginLeft: '30px',
                    color: 'red'
                  }}
                >
                  No data available for the selected date range.
                </div>
              )}

          </div>
        )}
        {!dashboardData && (
          <div className="alert alert-info text-center" style={{ marginLeft: '30px', color: '#2a2d9b' }}>
            Please select a period and click Search to view analytics.
          </div>
        )}
      </div>

      {activePanel === "details" && (
        <div className="report-popup-overlay">
          <div className="report-popup">

            <div className="filter-section d-flex">
              <input
                type="text"
                value={tempFilters.referenceNumber}
                onChange={(e) =>
                  setTempFilters({ ...tempFilters, referenceNumber: e.target.value })
                }
                placeholder="Quotation ID"
              />

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

            <div className="report-popup-header">
              {/* <h4>
                {detailType} - {detailStatus}
              </h4> */}

              <button
                style={{ marginLeft: "1150px", marginBottom: "10px", color: "white", background: "Red" }}
                className="popup-close-btn"
                onClick={() => setActivePanel("graph")}
              >
                ✕
              </button>
            </div>

            <div
              className="report-popup-body"
              style={{
                maxHeight: "75vh",
                overflowY: "auto"
              }}
            >
              {detailType?.toLowerCase() === "quotation" ? (


                <QuotationTable
                  data={paginatedData}
                  loading={reportDetailsLoading}
                  status={detailStatus}
                  sortConfig={{ key: "", direction: "" }}
                  onSort={() => { }}
                  onView={handleViewClick}
                />


              ) : (
                <InvoiceTable
                  data={paginatedData}
                  loading={reportDetailsLoading}
                  status={detailStatus}
                  sortConfig={{ key: "", direction: "" }}
                  onSort={() => { }}
                  onView={handleViewClick}
                />
              )}
              {filteredData.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredData.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                />

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

              {/* <br />
              <div className="list-header">
                <br />
                <button style={{ marginLeft: "1075px", marginBottom: "10px" }} className="help-btn" onClick={() => setShowHelp(true)}>
                  <i className="fas fa-question-circle"></i> Help
                </button>
              </div> */}

              {selectedQuotation && (
                <ViewPopup
                  show={showModal}
                  onClose={() => setShowModal(false)}
                  selectedInvoice={selectedQuotation}
                  type={detailType}
                  onGenerateInvoice={null}
                  loadingRefNo={null} />
                
                
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

            </div>

          </div>
        </div>
      )}
      <HelpModal show={showHelp} title="Reports Dashboard - Help & Overview" screenName="ReportsDashboard" onClose={() => setShowHelp(false)} />
    </div>


  );
};

export default ReportsDashboard;