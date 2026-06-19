import React from "react";
import { FaEye } from "react-icons/fa";
import '../../theme/global.css'

const QuotationTable = ({ data, loading, status,onSort, sortConfig ,onView }) => (
  <div className="quotation-dashboard-table-container">
    <div style={{marginLeft:"10px"}} className="table-header">
      <h4>Quotation Details</h4>
      <div className="status-wrapper">
        <h4 className="status-label">Status :</h4>

        <span
          className={`status-badge
      ${status === "Total" ? "status-total" : ""}
      ${status === "Created" ? "status-created" : ""}
       ${status === "Approved" ? "status-approved" : ""}
      ${status === "Expired" ? "status-expired" : ""}
      ${status === "Rejected" ? "status-rejected" : ""}
    `}
        >
          {status}
        </span>
      </div>
    </div>
    <table className="quotation-dashboard-table">
      <thead>
        <tr>
          <th onClick={() => onSort("refno")}>
            QUOTATION ID {""}
            {sortConfig.key === "refno" ?
              (sortConfig.direction === "asc" ? "↑" : "↓")
              : "↑"}
          </th>
          <th>DATE</th>
          <th>COMPANY</th>
          <th>CUSTOMER</th>
          <th>VIEW</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={5} style={{ textAlign: "center" }}>
              <div className="loader"></div>
            </td>
          </tr>
        ) : !status ? (
          <tr>
            <td colSpan={5} style={{ textAlign: "center", color: "green" }}>
              Please select a status
            </td>
          </tr>
        ) : data.length === 0 ? (
          <tr>
            <td colSpan={5} style={{ textAlign: "center" }}>
              No results found
            </td>
          </tr>
        ) : (
          data.map((item) => (
            <tr key={item.refno}>
              <td>{item.refno}</td>
              {/* <td>{item.quotationDate ? new Date(item.quotationDate).toLocaleDateString() : "-"}</td> */}
              <td>
                {item.quotationDate
                  ? new Date(item.quotationDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                  : "-"}
              </td>

              <td>{item.companyName || "-"}</td>
              <td>{item.customerName || "-"}</td>
              <td>
                
                <FaEye
                  style={{ cursor: 'pointer' }}
                  className="action-icon view-icon"
                  onClick={() => onView(item)}
                  title="View Quotation Details"
                />
              </td>
              
            </tr>
          ))
        )}
      </tbody>

    </table>
  </div>
);

export default QuotationTable;
