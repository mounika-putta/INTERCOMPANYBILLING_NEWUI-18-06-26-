import React from "react";
import { FaEye } from "react-icons/fa";

const InvoiceTable = ({ data, loading, status, onSort, sortConfig, onView }) => (
  <div className="quotation-dashboard-table-container">
    <div style={{marginLeft:"10px"}} className="table-header">
      <h4>Invoice Details</h4>
    

      <div className="status-wrapper">
        <h4 className="status-label">Status :</h4>

        <span
          className={`status-badge
      ${status === "Total" ? "status-total" : ""}
      ${status === "Paid" ? "status-created" : ""}
       ${status === "Created" ? "status-approved" :""}
      ${status === "Credit note Created" ? "status-creditnotes" : ""}
      ${status === "Cancelled" ? "status-rejected" : ""}
    `}
        >
           {status === "Created" ? "Unpaid" : status}
        </span>
      </div>
    
    </div>

    <table className="quotation-dashboard-table">
      <thead>
        <tr>
          <th onClick={() => onSort("refno")} style={{ cursor: "pointer" }}>
            QUOTATION ID{" "}

            {sortConfig.key === "refno" ?
              (sortConfig.direction === "asc" ? "↑" : "↓")
              : "↑"}
          </th>

          <th>INVOICE ID</th>
          <th>INVOICE DATE</th>
          <th>COMPANY</th>
          <th>CUSTOMER</th>
          {/* <th>STATUS</th> */}
          <th>VIEW</th>
        </tr>
      </thead>

      


      <tbody>
        {loading ? (
          <tr>
            <td colSpan={7} style={{ textAlign: "center" }}>
              <div className="spinner"></div>
            </td>
          </tr>
        ) : !status ? (
          <tr>
            <td colSpan={7} style={{ textAlign: "center", color: "green" }}>
              Please select a status
            </td>
          </tr>
        ) : data.length === 0 ? (
          <tr>
            <td colSpan={7} style={{ textAlign: "center" }}>
              No results found
            </td>
          </tr>
        ) : (
          data.map((item) => (
            <tr key={item.refno}>
              <td>{item.refno}</td>
              <td>{item.invoiceRefno || "-"}</td>
              <td>
                
                {item.invoiceDate
                  ? new Date(item.invoiceDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                  : "-"}
                </td>

              <td>{item.companyName || "-"}</td>
              <td>{item.customerName || "-"}</td>
              {/* <td>{item.invoiceStatus || "-"}</td> */}
              <td>
                 <FaEye
                                  style={{ cursor: 'pointer' }}
                                  className="action-icon view-icon"
                                  onClick={() => onView(item)}
                                  title="View Invoice Details"
                                />
              </td>
            </tr>
          ))
        )}
      </tbody>

    </table>
  </div>
);

export default InvoiceTable;
