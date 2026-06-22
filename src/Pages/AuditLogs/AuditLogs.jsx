import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, fetchAuditLogsWithFilter, clearAuditLogs, fetchAuditdetailswithId } from "../../redux/AuditSlice";
import "./AuditLogs.css";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import { baseURL } from "../../services/api";
import HelpModal from "../../components/Common/HelpModal";
import Pagination from "../../components/Common/Pagination";
import useSort from "../../components/Common/useSort";
import CommonDatePicker from "../../components/Common/CommonDatePicker";
import dayjs from 'dayjs';
import { FaEye } from "react-icons/fa";

const AuditLogs = () => {
  const dispatch = useDispatch();
  const [showHelp, setShowHelp] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const { Details = [], auditLogs = [], Users = [], loading, error } = useSelector(
    (state) => state.audit
  );

  // Fetch users on mount
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Pagination & filter states
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [filters, setFilters] = useState({
    userId: "",
    ScreenName: "",
    fromDate: "",
    toDate: "",
  });
  useEffect(() => {
    dispatch(clearAuditLogs());
    setHasSearched(false);
    setCurrentPage(1);
  }, [
    filters.userId,
    filters.ScreenName,
    filters.fromDate,
    filters.toDate,
    dispatch,
  ]);

  useEffect(() => {
    return () => {
      dispatch(clearAuditLogs());
    };
  }, [dispatch]);


  const [selectedItem, setSelectedItem] = useState(null);

  const handleFilterSubmit = () => {
    debugger;
    if (!filters.userId) {
      alertify.alert('warning', "Please select options to filter.");
      return;
    }
    setHasSearched(true);
    dispatch(
      fetchAuditLogsWithFilter({
        user: filters.userId,
        ScreenName: filters.ScreenName,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
      })
    );
    setCurrentPage(1);
  };

  // 🟣 Pagination logic (client-side)

  const { sortedData, requestSort, sortConfig } = useSort(auditLogs);
  const itemsPerPage = 5;
  const totalRecords = sortedData.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedData.slice(indexOfFirstRecord, indexOfLastRecord);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

const handleFilterChange = (eOrDate, fieldName) => {
  if (fieldName) {
    // Called from DatePicker, eOrDate is dayjs object
    setFilters((prev) => ({
      ...prev,
      [fieldName]: eOrDate && eOrDate.isValid?.() ? eOrDate.format('YYYY-MM-DD') : '',
    }));
  } else if (eOrDate?.target) {
    // Called from select/input, eOrDate is event
    const { name, value } = eOrDate.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  } else {
    // Defensive fallback — do nothing or log
    console.warn('Unhandled onChange argument', eOrDate);
  }
};



  const handleRecordsChange = (e) => {
    setRecordsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };


  const handleCloseModal = () => setSelectedItem(null);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleViewClick = async (item) => {
    debugger
    try {
      const response = await dispatch(
        fetchAuditdetailswithId({
          ScreenName: item.table, // must match API helper
          Id: item.id,
        })
      ).unwrap();

      console.log("Full Selected Item:", response);
      let parsedData = {};

      if (response.Objectdata) {
        // Case 1: Roles or similar
        parsedData = response.Objectdata;
      }
      else if (Array.isArray(response.data) && response.data.length > 0) {
        // Case 2: Customers or Quotation
        parsedData = response.data[0];
      }
      else if (response.data && typeof response.data === "object") {
        parsedData = response.data;
      }

      // 🟢 Set the final flattened data
      setSelectedItem({
        screenname: response.screenname,
        ...parsedData,
      });

     console.log('parsedData',parsedData);
    } catch (err) {
      console.log('err', err);
      alertify.alert("Error", "Failed to fetch audit details.");
    }
  };

  const totalAmount = selectedItem
    ? (selectedItem.details || []).reduce((sum, d) => {
      const quantity = Number(d.quotationQuantity) || 0;
      const rate = Number(d.unitRate) || 0;
      const discount = Number(d.discount) || 0;
      const tax = Number(d.tax) || 0;

      const baseAmount = quantity * rate;
      const discountedAmount = baseAmount - discount;
      const netAmount = discountedAmount + (discountedAmount * tax) / 100;

      return sum + netAmount;
    }, 0)
    : 0;




  return (
    <div className="Auditlog-container">

      <div className="list-header">
        <h2 className="Auditlogheading">Audit Logs</h2>
        <button className="help-btn" onClick={() => setShowHelp(true)}>
          <i className="fas fa-question-circle"></i> Help
        </button>
      </div>
      {/* 🔍 Filter Section */}
      <div className="filter-section">
        <select
          name="userId"
          value={filters.userId}
          onChange={handleFilterChange}
        >
          <option value="">Select User</option>
          {Users.map((user) => (
            <option key={user.email} value={user.email}>
              {user.email}
            </option>
          ))}
        </select>
        <select
          name="ScreenName"
          value={filters.ScreenName}
          onChange={handleFilterChange}
        >
          <option value="">Select Screen</option>
          <option value="Roles">Roles</option>
          <option value="Customers">Customers</option>
          <option value="Companies">Companies</option>
          <option value="Products">Products</option>
          {/* <option value="Service Rendered">Service Rendered</option> */}
          <option value="Quotation">Quotation</option>
          <option value="Invoice">Invoice</option>


        </select>


        {/* <input
          type="date"
          name="fromDate"
          value={filters.fromDate}
          onChange={handleFilterChange}
        /> */}
        <CommonDatePicker
          value={filters.fromDate}
          onChange={(newDate) => handleFilterChange(newDate, 'fromDate',)}
          className="common-input"  label="Start Date" placeholder="From Date"
        />

        <CommonDatePicker
          value={filters.toDate}
          onChange={(newDate) => handleFilterChange(newDate, 'toDate')}
          className="common-input"  label="End Date" placeholder="To Date"
        />


        {/* <input
          type="date"
          name="toDate"
          value={filters.toDate}
          onChange={handleFilterChange}
        /> */}

        <button className="filter-btn" onClick={handleFilterSubmit}>
          Filter
        </button>
        <button
          className="clear-btn"
          onClick={() => {
            setFilters({
              userId: "",
              ScreenName: "",
              fromDate: "",
              toDate: "",
            });
            setCurrentPage(1);
          }}
        >
          Clear
        </button>


      </div>

      {/* 🧾 Records per page */}
      <div className="pagination-controls">
        <label>Records per page &nbsp;</label>
        <select value={recordsPerPage} onChange={handleRecordsChange}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>

      {/* 🧾 Audit Logs Table */}
      <table className="data-table">
        <thead>
          <tr>

            <th onClick={() => requestSort("table")}>
              SCREEN {" "}
              {sortConfig.key === "table" ? (sortConfig.direction === "asc" ? "↑" : "↓") : "↑"}
            </th>
            <th>ACTION</th>
            <th>ACTION DATE</th>
            <th>DETAILS</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={7} style={{ textAlign: "center" }}>
              <div className="loader"></div></td></tr>
          ) : currentRecords.length > 0 ? (
            currentRecords.map((item, index) => (
              <tr key={index}>
                <td>{item.table}</td>
                <td>{item.action}</td>
                <td>{new Date(item.actionDate).toLocaleString("en-GB", { hour12: false })}</td>
                <td>
                  {/* <button
                    className="btn btn-sm btn-outline-primary"
                    title="View"
                    onClick={() => {
                      handleViewClick(item);
                    }}
                  >
                    <i className="fas fa-eye" style={{ color: "blue", cursor: "pointer" }}></i>
                  </button> */}
                  <FaEye
                    style={{ cursor: "pointer"}}
                    className="action-icon view-icon"
                    onClick={() => handleViewClick(item)}
                    title="View Details"
                  />
                </td>

              </tr>
            ))
          ) : filters.userId || filters.fromDate || filters.toDate ? (
            <tr>
              <td colSpan="4" className="no-records" style={{ textAlign: "center", fontStyle: "normal" }}>
                No records found.
              </td>
            </tr>
          ) : (
            <tr>
              <td colSpan="4" className="no-records" style={{ textAlign: "center", fontStyle: "normal", color: "green" }}>
                Search with filter.
              </td>
            </tr>
          )}
        </tbody>


      </table>


      {!loading && auditLogs.length > 0 && (


        <Pagination
          currentPage={currentPage}
          totalItems={auditLogs.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      )}



      {/* Modal for Audit Details */}
      {selectedItem && (
        <div className="auditlog-modal-overlay">
          <div className="auditlog-modal">
            <button className="close-btn" onClick={handleCloseModal}>
              &times;
            </button>

            <h2 style={{ color: "#3D8C4F" }}>View Details</h2>


            {/* Quotation Details */}
            {(selectedItem.screenname === "Quotation" || selectedItem.screenname === "Invoice") && (
              <>
                <h4 className="auditlog-view-section-titles">Company Information</h4>
                <div className="auditlog-view-info">
                  {selectedItem.comapanyLogo && (() => {
                    const logoFileName = selectedItem.comapanyLogo.split(/[/\\]/).pop();
                    return (
                      <img
                        src={`${baseURL}/UploadedFiles/${logoFileName}`}
                        alt="Company Logo"
                        className="company-logo-corner"
                      />
                    );
                  })()}



                  {selectedItem.companyName &&
                    <div className="auditlog-info-row">
                      <span className="label">Company Name</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.companyName}</span>
                    </div>
                  }
                  {selectedItem.companyEmail &&
                    <div className="auditlog-info-row">
                      <span className="label">Company Email</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.companyEmail}</span>
                    </div>

                  }
                  {selectedItem.companyPhoneNumber &&
                    <div className="auditlog-info-row">
                      <span className="label">Phone Number</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.companyPhoneNumber}</span>
                    </div>}
                  {selectedItem.companyAddress && (
                    <div className="auditlog-info-row">
                      <span className="label">Company Address</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.companyAddress}</span>
                    </div>

                  )}
                  {selectedItem.vatNumber &&

                    <div className="auditlog-info-row">
                      <span className="label">VAT Number</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.vatNumber}</span>
                    </div>
                  }
                  {selectedItem.registrationNumber &&

                    <div className="auditlog-info-row">
                      <span className="label">Registration Number</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.registrationNumber}</span>
                    </div>
                  }
                </div>

                <h4 className="auditlog-view-section-title">Bank Information</h4>

                {selectedItem.bankAccountNumber && (
                  <div className="auditlog-info-row">
                    <span className="label">Bank Account Number</span>
                    <span className="colon">:</span>
                    <span className="value">{selectedItem.bankAccountNumber}</span>
                  </div>
                )}

                {selectedItem.branchCode && (
                  <div className="auditlog-info-row">
                    <span className="label">Branch Code</span>
                    <span className="colon">:</span>
                    <span className="value">{selectedItem.branchCode}</span>
                  </div>
                )}

                {/* <div className="auditlog-info-row">
                  <span className="label">IFSC Code</span>
                  <span className="colon">:</span>
                  <span className="value">{selectedItem.ifscCode || "-"}</span>
                </div> */}

                {selectedItem.branchAddress && (
                  <div className="auditlog-info-row">
                    <span className="label">Address</span>
                    <span className="colon">:</span>
                    <span className="value">{selectedItem.branchAddress}</span>
                  </div>
                )}


                {selectedItem.screenname === "Quotation" && (
                  <>
                    <h4 className="auditlog-view-section-title">Quotation Information</h4>
                    <div className="auditlog-view-info">
                      {selectedItem.refno && (
                        <div className="auditlog-info-row">
                          <span className="label">Quotation Id</span>
                          <span className="colon">:</span>
                          <span className="value">{selectedItem.refno}</span>
                        </div>
                      )}

                      {selectedItem.quotationDate && (
                        <div className="auditlog-info-row">
                          <span className="label">Date</span>
                          <span className="colon">:</span>
                          <span className="value">
                            {(() => {
                              const d = new Date(selectedItem.quotationDate);
                              return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
                            })()}
                          </span>
                        </div>
                      )}

                      {selectedItem.quotationStatus && (
                        <div className="auditlog-info-row">
                          <span className="label">Status</span>
                          <span className="colon">:</span>
                          <span className="value">{selectedItem.quotationStatus}</span>
                        </div>
                      )}

                      {selectedItem.currency && (
                        <div className="auditlog-info-row">
                          <span className="label">Currency</span>
                          <span className="colon">:</span>
                          <span className="value">{selectedItem.currency}</span>
                        </div>
                      )}

                      {selectedItem.quotationType && (
                        <div className="auditlog-info-row">
                          <span className="label">Type</span>
                          <span className="colon">:</span>
                          <span className="value">{selectedItem.quotationType}</span>
                        </div>
                      )}

                      <div className="auditlog-info-row">
                        <span className="label">Total Amount</span>
                        <span className="colon">:</span>
                        <span className="value">{totalAmount || 0}</span>
                      </div>

                      {selectedItem.quotationStatus === "Rejected" && (
                        <div className="auditlog-info-row">
                          <span className="label">Reason</span>
                          <span className="colon">:</span>
                          <span className="value">{selectedItem.reason}</span>
                        </div>
                      )}
                    </div>

                  </>
                )}

                {selectedItem.screenname === "Invoice" && (
                  <>
                    <h4 className="auditlog-view-section-title">Invoice Information</h4>

                    {selectedItem.referenceNumber && (
                      <div className="auditlog-info-row">
                        <span className="label">Quotation Id</span>
                        <span className="colon">:</span>
                        <span className="value">{selectedItem.referenceNumber}</span>
                      </div>

                    )}

                    {selectedItem.quotationDate &&
                      <div className="auditlog-info-row">
                        <span className="label">Quoation Date</span>
                        <span className="colon">:</span>
                        <span className="value">
                          {(() => {
                            const d = new Date(selectedItem.quotationDate);
                            return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
                          })()}
                        </span>
                      </div>}
                    {selectedItem.quotationStatus && (

                      <div className="auditlog-info-row">
                        <span className="label">Quotation Status</span>
                        <span className="colon">:</span>
                        <span className="value">{selectedItem.quotationStatus}</span>
                      </div>
                    )}
                    {selectedItem.invoiceReferenceNumber && (

                      <div className="auditlog-info-row">
                        <span className="label">Invoice Id</span>
                        <span className="colon">:</span>
                        <span className="value">{selectedItem.invoiceReferenceNumber}</span>
                      </div>
                    )}

                    {selectedItem.invoiceDate &&


                      <div className="auditlog-info-row">
                        <span className="label">Invoice Date</span>
                        <span className="colon">:</span>
                        <span className="value">
                          {(() => {
                            const d = new Date(selectedItem.invoiceDate);
                            return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
                          })()}
                        </span>
                      </div>}
                    {selectedItem.invoiceStatus && (

                      <div className="auditlog-info-row">
                        <span className="label">Invoice Status</span>
                        <span className="colon">:</span>
                        <span className="value">{selectedItem.invoiceStatus}</span>
                      </div>
                    )}
                    {selectedItem.currency && (

                      <div className="auditlog-info-row">
                        <span className="label">Currency</span>
                        <span className="colon">:</span>
                        <span className="value">{selectedItem.currency}</span>
                      </div>
                    )}
                    {selectedItem.quotationType && (


                      <div className="auditlog-info-row">
                        <span className="label">Type</span>
                        <span className="colon">:</span>
                        <span className="value">{selectedItem.quotationType}</span>
                      </div>
                    )}

                    {selectedItem.totalAmount && (

                      <div className="auditlog-info-row">
                        <span className="label">Total</span>
                        <span className="colon">:</span>
                        <span className="value">{selectedItem.totalAmount}</span>
                      </div>
                    )}
                    {selectedItem.invoiceStatus === "Cancelled" && (
                      <div className="auditlog-info-row">
                        <span className="label">Reason</span>
                        <span className="colon">:</span>
                        <span className="value">{selectedItem.reason}</span>
                      </div>
                    )}

                  </>
                )}

                <h4 className="auditlog-view-section-title">Quotation Details</h4>
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
                    {(selectedItem.details || []).map((d, idx) => (
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

                <h4 className="auditlog-view-section-title">Customer Information</h4>
                <div className="auditlog-view-info">
                  {selectedItem.customerName && (
                    <div className="auditlog-info-row">
                      <span className="label">Customer Name</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.customerName}</span>
                    </div>
                  )}

                  {selectedItem.customerEmail && (
                    <div className="auditlog-info-row">
                      <span className="label">Email</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.customerEmail}</span>
                    </div>
                  )}

                  {selectedItem.customerPhone && (
                    <div className="auditlog-info-row">
                      <span className="label">Mobile Number</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.customerPhone}</span>
                    </div>
                  )}

                  {selectedItem.customerAddress && (
                    <div className="auditlog-info-row">
                      <span className="label">Address</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.customerAddress}</span>
                    </div>
                  )}
                  {selectedItem.paymentTerms && (
                    <div className="auditlog-info-row">
                      <span className="label">Payment Terms</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.paymentTerms}</span>
                    </div>
                  )}
                </div>

              </>
            )}

            {selectedItem && selectedItem.screenname === "Roles" && (

              <div className="auditlog-view-info">

                {selectedItem.roleName &&
                  <div className="auditlog-info-row">
                    <span className="label">Role Name</span>
                    <span className="colon">:</span>
                    <span className="value">{selectedItem.roleName}</span>
                  </div>
                }
                {selectedItem.roleDescription &&
                  <div className="auditlog-info-row">
                    <span className="label">Description</span>
                    <span className="colon">:</span>
                    <span className="value">{selectedItem.roleDescription}</span>
                  </div>
                }
                {selectedItem.isActive &&
                  <div className="auditlog-info-row">
                    <span className="label">Is Active</span>
                    <span className="colon">:</span>
                    <span className="value">{selectedItem.isActive}</span>
                  </div>
                }
                {selectedItem.isDeleted &&
                  <div className="auditlog-info-row">
                    <span className="label">Is Deleted</span>
                    <span className="colon">:</span>
                    <span className="value">{selectedItem.isDeleted}</span>
                  </div>
                }
                
                {selectedItem.createdBy &&
                  <div className="auditlog-info-row">
                    <span className="label">Created By</span>
                    <span className="colon">:</span>
                    <span className="value">{selectedItem.createdBy}</span>
                  </div>

                }
                {selectedItem.createdDate &&

                  <div className="auditlog-info-row">
                    <span className="label">Created Date</span>
                    <span className="colon">:</span>
                    <span className="value">
                      {(() => {
                        const d = new Date(selectedItem.createdDate);
                        return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
                      })()}
                    </span>
                  </div>}
                {selectedItem.modifiedBy &&
                  <div className="auditlog-info-row">
                    <span className="label">Modified By</span>
                    <span className="colon">:</span>
                    <span className="value">{selectedItem.modifiedBy}</span>
                  </div>
                }
                {selectedItem.modifiedDate &&
                  <div className="auditlog-info-row">
                    <span className="label">Modified Date</span>
                    <span className="colon">:</span>
                    <span className="value">
                      {(() => {
                        const d = new Date(selectedItem.modifiedDate);
                        return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
                      })()}
                    </span>
                  </div>

                }

              </div>

            )}

            {selectedItem && selectedItem.screenname === "Companies" && (
              <>
                <h4 className="auditlog-view-section-title">Company Information</h4>
                <div className="auditlog-view-info">
                  {selectedItem.companyLogo && (() => {
                    const logoFileName = selectedItem.companyLogo.split(/[/\\]/).pop();
                    return (
                      <img
                        src={`${baseURL}/UploadedFiles/${logoFileName}`}
                        alt="Company Logo"
                        className="company-logo-corner"
                      />
                    );
                  })()}

                  {selectedItem.companyName && (
                    <div className="auditlog-info-row">
                      <span className="label">Name</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.companyName}</span>
                    </div>
                  )}

                  {selectedItem.companyAddress && (
                    <div className="auditlog-info-row">
                      <span className="label">Address</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.companyAddress}</span>
                    </div>
                  )}

                  {selectedItem.companyEmail && (
                    <div className="auditlog-info-row">
                      <span className="label">Email</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.companyEmail}</span>
                    </div>
                  )}

                  {selectedItem.companyPhoneNumber && (
                    <div className="auditlog-info-row">
                      <span className="label">Phone Number</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.companyPhoneNumber}</span>
                    </div>
                  )}

                  {selectedItem.companyWebsite && (
                    <div className="auditlog-info-row">
                      <span className="label">Website</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.companyWebsite}</span>
                    </div>
                  )}

                  {selectedItem.registrationNumber && (
                    <div className="auditlog-info-row">
                      <span className="label">Registration Number</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.registrationNumber}</span>
                    </div>
                  )}

                  {selectedItem.vatNumber && (
                    <div className="auditlog-info-row">
                      <span className="label">VAT Number</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.vatNumber}</span>
                    </div>
                  )}
                </div>

                <h4 className="auditlog-view-section-title">Bank Information</h4>
                <div className="auditlog-view-info">
                  {selectedItem.accountHolderName && (
                    <div className="auditlog-info-row">
                      <span className="label">Account Holder Name</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.accountHolderName}</span>
                    </div>
                  )}

                  {selectedItem.bankAccountNumber && (
                    <div className="auditlog-info-row">
                      <span className="label">Account Number</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.bankAccountNumber}</span>
                    </div>
                  )}

                  {selectedItem.branchCode && (
                    <div className="auditlog-info-row">
                      <span className="label">Branch Code</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.branchCode}</span>
                    </div>
                  )}

                  {/* {selectedItem.ifscCode && (
                    <div className="auditlog-info-row">
                      <span className="label">IFSC Code</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.ifscCode}</span>
                    </div>
                  )} */}

                  {selectedItem.brannchAddress && (
                    <div className="auditlog-info-row">
                      <span className="label">Address</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.brannchAddress}</span>
                    </div>
                  )}
                </div>
                  
                {selectedItem.createdBy &&
                  <div className="auditlog-info-row">
                    <span className="label">Created By</span>
                    <span className="colon">:</span>
                    <span className="value">{selectedItem.createdBy}</span>
                  </div>

                }
                {selectedItem.createdDate &&

                  <div className="auditlog-info-row">
                    <span className="label">Created Date</span>
                    <span className="colon">:</span>
                    <span className="value">
                      {(() => {
                        const d = new Date(selectedItem.createdDate);
                        return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
                      })()}
                    </span>
                  </div>}
                {selectedItem.modifiedBy &&
                  <div className="auditlog-info-row">
                    <span className="label">Modified By</span>
                    <span className="colon">:</span>
                    <span className="value">{selectedItem.modifiedBy}</span>
                  </div>
                }
                {selectedItem.modifiedDate &&
                  <div className="auditlog-info-row">
                    <span className="label">Modified Date</span>
                    <span className="colon">:</span>
                    <span className="value">
                      {(() => {
                        const d = new Date(selectedItem.modifiedDate);
                        return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
                      })()}
                    </span>
                  </div>

                }


              </>
            )}


            {selectedItem && selectedItem.screenname === "Customers" && (
              <>
                <div className="auditlog-view-info">
                  {selectedItem.title && (
                    <div className="auditlog-info-row">
                      <span className="label">Title</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.title}</span>
                    </div>
                  )}

                  {selectedItem.Name && (
                    <div className="auditlog-info-row">
                      <span className="label">Name</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.Name}</span>
                    </div>
                  )}

                  {selectedItem.surName && (
                    <div className="auditlog-info-row">
                      <span className="label">Surname</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.surName}</span>
                    </div>
                  )}

                  {selectedItem.mobile && (
                    <div className="auditlog-info-row">
                      <span className="label">Mobile</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.mobile}</span>
                    </div>
                  )}

                  {selectedItem.gender && (
                    <div className="auditlog-info-row">
                      <span className="label">Gender</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.gender}</span>
                    </div>
                  )}

                  {selectedItem.companyName && (
                    <div className="auditlog-info-row">
                      <span className="label">Company Name</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.companyName}</span>
                    </div>
                  )}

                  {selectedItem.email && (
                    <div className="auditlog-info-row">
                      <span className="label">Email</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.email}</span>
                    </div>
                  )}

                  {selectedItem.customerAccountNo && (
                    <div className="auditlog-info-row">
                      <span className="label">Customer Account No.</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.customerAccountNo}</span>
                    </div>
                  )}

                  {selectedItem.address && (
                    <div className="auditlog-info-row">
                      <span className="label">Address</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.address}</span>
                    </div>
                  )}
                  
                {selectedItem.createdBy &&
                  <div className="auditlog-info-row">
                    <span className="label">Created By</span>
                    <span className="colon">:</span>
                    <span className="value">{selectedItem.createdBy}</span>
                  </div>

                }
                {selectedItem.createdDate &&

                  <div className="auditlog-info-row">
                    <span className="label">Created Date</span>
                    <span className="colon">:</span>
                    <span className="value">
                      {(() => {
                        const d = new Date(selectedItem.createdDate);
                        return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
                      })()}
                    </span>
                  </div>}
                {selectedItem.modifiedBy &&
                  <div className="auditlog-info-row">
                    <span className="label">Modified By</span>
                    <span className="colon">:</span>
                    <span className="value">{selectedItem.modifiedBy}</span>
                  </div>
                }
                {selectedItem.modifiedDate &&
                  <div className="auditlog-info-row">
                    <span className="label">Modified Date</span>
                    <span className="colon">:</span>
                    <span className="value">
                      {(() => {
                        const d = new Date(selectedItem.modifiedDate);
                        return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
                      })()}
                    </span>
                  </div>

                }

                </div>
              </>
            )}

            {selectedItem && selectedItem.screenname === "Products" && (
              <>
                <div className="auditlog-view-info">
                  {selectedItem.itemCode && (
                    <div className="auditlog-info-row">
                      <span className="label">Item Code</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.itemCode}</span>
                    </div>
                  )}

                  {selectedItem.category && (
                    <div className="auditlog-info-row">
                      <span className="label">Category</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.category}</span>
                    </div>
                  )}

                  {selectedItem.itemName && (
                    <div className="auditlog-info-row">
                      <span className="label">Item Name</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.itemName}</span>
                    </div>
                  )}

                  {selectedItem.description && (
                    <div className="auditlog-info-row">
                      <span className="label">Description</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.description}</span>
                    </div>
                  )}

                  {selectedItem.price && (
                    <div className="auditlog-info-row">
                      <span className="label">Price excl VAT</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.price}</span>
                    </div>
                  )}

                  {selectedItem.unitOfMeasure && (
                    <div className="auditlog-info-row">
                      <span className="label">Unit of Measure</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.unitOfMeasure}</span>
                    </div>
                  )}

                  {selectedItem.taxRate && (
                    <div className="auditlog-info-row">
                      <span className="label">VAT %</span>
                      <span className="colon">:</span>
                      <span className="value">{selectedItem.taxRate}</span>
                    </div>
                  )}
                  
                {selectedItem.createdBy &&
                  <div className="auditlog-info-row">
                    <span className="label">Created By</span>
                    <span className="colon">:</span>
                    <span className="value">{selectedItem.createdBy}</span>
                  </div>

                }
                {selectedItem.createdDate &&

                  <div className="auditlog-info-row">
                    <span className="label">Created Date</span>
                    <span className="colon">:</span>
                    <span className="value">
                      {(() => {
                        const d = new Date(selectedItem.createdDate);
                        return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
                      })()}
                    </span>
                  </div>}
                {selectedItem.modifiedBy &&
                  <div className="auditlog-info-row">
                    <span className="label">Modified By</span>
                    <span className="colon">:</span>
                    <span className="value">{selectedItem.modifiedBy}</span>
                  </div>
                }
                {selectedItem.modifiedDate &&
                  <div className="auditlog-info-row">
                    <span className="label">Modified Date</span>
                    <span className="colon">:</span>
                    <span className="value">
                      {(() => {
                        const d = new Date(selectedItem.modifiedDate);
                        return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
                      })()}
                    </span>
                  </div>

                }
                  
                </div>
              </>
            )}

            {selectedItem && selectedItem.screenname === "Service Rendered" && (

              <div className="auditlog-view-info">

                {selectedItem.name && <div><span className="label">Name</span>: {selectedItem.name}</div>}
                {selectedItem.description && <div><span className="label">Description</span>: {selectedItem.description}</div>}
                {selectedItem.companyName && <div><span className="label">Company Name</span>: {selectedItem.companyName}</div>}
                {selectedItem.unitOfMeasure && <div><span className="label">Unit of Measure</span>: {selectedItem.unitOfMeasure}</div>}
                {selectedItem.rate && (
                  <div>
                    <span className="label">Rate</span>: {selectedItem.rate}
                  </div>
                )}
                {selectedItem.isActive && <div><span className="label">Is Active</span>: {selectedItem.isActive}</div>}
                {selectedItem.isDeleted && <div><span className="label">Is Deleted</span>: {selectedItem.isDeleted}</div>}
                {selectedItem.createdBy && <div><span className="label">Created By</span>: {selectedItem.createdBy}</div>}
                {selectedItem.createdDate && <div><span className="label">Created Date</span>:
                  {selectedItem?.createdDate
                    ? (() => {
                      const d = new Date(selectedItem.createdDate);
                      const day = String(d.getDate()).padStart(2, "0");
                      const month = String(d.getMonth() + 1).padStart(2, "0");
                      const year = d.getFullYear();
                      return `${day}/${month}/${year}`;
                    })()
                    : "/"}
                </div>}
                {selectedItem.modifiedBy && <div><span className="label">Modified By</span>: {selectedItem.modifiedBy}</div>}
                {selectedItem.modifiedDate && <div><span className="label">Modified Date</span>:
                  {selectedItem?.modifiedDate
                    ? (() => {
                      const d = new Date(selectedItem.modifiedDate);
                      const day = String(d.getDate()).padStart(2, "0");
                      const month = String(d.getMonth() + 1).padStart(2, "0");
                      const year = d.getFullYear();
                      return `${day}/${month}/${year}`;
                    })()
                    : "/"}
                </div>}
              </div>

            )}
            <div>
              <div className="auditlog-view-info">

                {selectedItem.action &&

                  <div className="auditlog-info-row">
                    <span className="label">Action</span>
                    <span className="colon">:</span>
                    <span className="value">{selectedItem.action}</span>
                  </div>
                }
                {selectedItem.actionBy &&

                  <div className="auditlog-info-row">
                    <span className="label">Action By</span>
                    <span className="colon">:</span>
                    <span className="value">{selectedItem.actionBy}</span>
                  </div>
                }
                {/* {selectedItem.screenname && <div><span className="label">Screen</span>: {selectedItem.screenname}</div>} */}
                {selectedItem.actionDate &&
                  <div className="auditlog-info-row">
                    <span className="label">Action Date</span>
                    <span className="colon">:</span>
                    <span className="value">
                      {(() => {
                        const d = new Date(selectedItem.actionDate);
                        return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
                      })()}
                    </span>
                  </div>
                }
              </div>

            </div>


          </div>
        </div>
      )}
      <HelpModal show={showHelp} title="Audit Logs - Help & Overview" screenName="AuditLog" onClose={() => setShowHelp(false)} />




    </div>
  );
};

export default AuditLogs;
