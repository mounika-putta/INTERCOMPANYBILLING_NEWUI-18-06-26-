import React from "react";
import { FaTrash, FaMinus } from "react-icons/fa";
import { FiSearch, FiCheck, FiX, FiPlusSquare } from "react-icons/fi";

const UpdateQuotationForm = ({
  selectedQuotation,
  setSelectedQuotation,
  showInvoiceUpdateForm,
  setShowInvoiceUpdateForm,
  currencies,
  handleEditDetailsChange,
  handleEditAddRow,
  handleEditRemoveRow,
  setShowCustomerPopup,
  handleSearch,
  fetchCustomers,
  setPopupCustomerMode,
  openEditPopup,
  setSelectedRowIndex,
  setPopupMode,
  setShowInventoryPopup,
  handleUpdate,
  isSaving,
  createErrors,
  setCreateErrors,
  setShowDiscountPopup,
  setTotalBefore,
  setupdatediscounttype,
  setupdatediscountvalue,
  generatedQuotationId,
  todayDate,
  popuploading,
  setDiscountType,
  setDiscountedTotal,
  setDiscountValue,
  DiscountMode,
  setDiscountMode,
  tax
}) => {

  return (
    <>
      {(
        <div className="quotation-form-overlay">
          <div className="quotation-form-modal">

            <span
              className="closequotation-btn"
              onClick={() => setShowInvoiceUpdateForm(false)}
            >
              &times;
            </span>

            <h2 style={{ color: "green", textAlign: "center" }}>Update Quotation</h2>

            <h4 className="quotationsub-title" style={{ color: "green" }}>Company Information</h4>

            {/* Example fields */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
              <div style={{ flex: "1 1 22%" }}>
                <label>Company Name <FiSearch
                  style={{ cursor: "pointer", marginRight: "5px", backgroundColor: "#e9ecef" }}
                  onClick={() => {
                    handleSearch();

                  }}
                /></label>
                <input
                  type="text"
                  style={{ width: "100%", backgroundColor: "#e9ecef" }}
                  value={selectedQuotation.companyName || ""}
                  readOnly
                  onChange={(e) =>
                    setSelectedQuotation({
                      ...selectedQuotation,
                      companyName: e.target.value,
                    })
                  }
                />
              </div>
              <div style={{ flex: "1 1 22%" }}>
                <label>Company Vat Number</label>
                <input
                  type="text"
                  style={{ width: "100%", backgroundColor: "#e9ecef" }}
                  value={selectedQuotation.vatNumber || ""}
                  readOnly
                  onChange={(e) =>
                    setSelectedQuotation({
                      ...selectedQuotation,
                      VatNumber: e.target.value,
                    })
                  }
                />
              </div>
              <div style={{ flex: "1 1 22%" }}>
                <label>Company Reg Number</label>
                <input
                  type="text"
                  style={{ width: "100%", backgroundColor: "#e9ecef" }}
                  value={selectedQuotation.registrationNumber || ""}
                  readOnly
                  onChange={(e) =>
                    setSelectedQuotation({
                      ...selectedQuotation,
                      registrationNumber: e.target.value,
                    })
                  }
                />
              </div>

              <div style={{ flex: "1 1 22%" }}>
                <label>Company Address</label>
                <textarea
                  type="text"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "1px solid #28a745",
                    fontSize: "1rem",
                    fontFamily: "'Open Sans', sans-serif",
                    boxSizing: "border-box",
                    resize: "none",
                    maxHeight :"40px",
                    lineHeight: "1.4",
                    backgroundColor: "#e9ecef"
                  }}
                  value={selectedQuotation.companyAddress || ""}
                  readOnly
                  onChange={(e) =>
                    setSelectedQuotation({
                      ...selectedQuotation,
                      companyAddress: e.target.value,
                    })
                  }
                />
              </div>
              <div style={{ flex: "1 1 22%" }}>
                <label>Company Website</label>
                <input
                  type="text"
                  style={{ width: "100%", backgroundColor: "#e9ecef" }}
                  value={selectedQuotation.companyWebsite || ""}
                  readOnly
                  onChange={(e) =>
                    setSelectedQuotation({
                      ...selectedQuotation,
                      companyWebsite: e.target.value,
                    })
                  }
                />
              </div>
              <div style={{ flex: "1 1 22%" }}>
                <label>Company Email</label>
                <input
                  type="text"
                  style={{ width: "100%", backgroundColor: "#e9ecef" }}
                  value={selectedQuotation.companyEmail || ""}
                  readOnly
                  onChange={(e) =>
                    setSelectedQuotation({
                      ...selectedQuotation,
                      companyEmail: e.target.value,
                    })
                  }
                />
              </div>
              <div style={{ flex: "1 1 22%" }}>
                <label>Company Phone Number</label>
                <input
                  type="text"
                  style={{ width: "100%", backgroundColor: "#e9ecef" }}
                  value={selectedQuotation.companyPhoneNumber || ""}
                  readOnly
                  onChange={(e) =>
                    setSelectedQuotation({
                      ...selectedQuotation,
                      companyPhoneNumber: e.target.value,
                    })
                  }
                />
              </div>
              <div style={{ flex: "1 1 22%" }}>

              </div>
            </div>
            <h4 className="quotationsub-title" style={{ color: "green" }}>Banking Details</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
              <div style={{ flex: "1 1 22%" }}>
                <label>Account Number</label>
                <input
                  type="text"
                  style={{ width: "100%", backgroundColor: "#e9ecef" }}
                  value={selectedQuotation.bankAccountNumber || ""}
                  readOnly
                  onChange={(e) =>
                    setSelectedQuotation({
                      ...selectedQuotation,
                      bankAccountNumber: e.target.value,
                    })
                  }
                />
              </div>
              <div style={{ flex: "1 1 22%" }}>
                <label>Branch Code</label>
                <input
                  type="text"
                  style={{ width: "100%", backgroundColor: "#e9ecef" }}
                  value={selectedQuotation.branchCode || ""}
                  readOnly
                  onChange={(e) =>
                    setSelectedQuotation({
                      ...selectedQuotation,
                      branchCode: e.target.value,
                    })
                  }
                />
              </div>
              <div style={{ flex: "1 1 22%" }}>
                <label>Branch Address</label>
                <textarea
                  type="text"
                 style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "1px solid #28a745",
                    fontSize: "1rem",
                    fontFamily: "'Open Sans', sans-serif",
                    boxSizing: "border-box",
                    resize: "none",
                    maxHeight :"40px",
                    lineHeight: "1.4",
                    backgroundColor: "#e9ecef"
                  }}
                  value={selectedQuotation.brannchAddress || ""}
                  readOnly
                  onChange={(e) =>
                    setSelectedQuotation({
                      ...selectedQuotation,
                      brannchAddress: e.target.value,
                    })
                  }
                />
              </div>

              <div style={{ flex: "1 1 22%" }}>
                {/* <label>IFSC Code</label>
                <input
                  type="text"
                  style={{ width: "100%", backgroundColor: "#e9ecef" }}
                  value={selectedQuotation.ifscCode || ""}
                  readOnly
                  onChange={(e) =>
                    setSelectedQuotation({
                      ...selectedQuotation,
                      ifscCode: e.target.value,
                    })
                  }
                /> */}
              </div>


            </div>
            <h4 className="quotationsub-title" style={{ color: "green" }}>Quotation information</h4>
            <div style={{ display: "flex", marginBottom: "10px" }}>
              <label style={{ width: "120px", fontWeight: "500" }}>Quotation Id   &nbsp;&nbsp;&nbsp;&nbsp;  : </label>
              <span style={{ fontWeight: "bold", fontSize: "13px" }}>{selectedQuotation.id}</span>
            </div>

            {/* Invoice Date */}
            <div style={{ display: "flex", marginBottom: "10px" }}>
              <label style={{ width: "120px", fontWeight: "100" }}>Quotation Date :</label>
              <span style={{ fontWeight: "bold", fontSize: "13px" }}>{selectedQuotation.date ? selectedQuotation.date.split('T')[0] : "-"}</span>
            </div>
            <br />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
              {/* quotation ID */}

              <div style={{ flex: "1 1 22%" }}>
                <label>Receiving Entity&nbsp;&nbsp;
                  <FiSearch
                    style={{ cursor: "pointer", marginRight: "5px" }}
                    onClick={() => {
                      fetchCustomers(); // API call
                      setPopupCustomerMode("edit"); // edit form mode
                      setShowCustomerPopup(true);
                    }}
                  />
                </label>
                <input
                  type="text"
                  style={{ width: "100%", backgroundColor: "#e9ecef" }}
                  value={selectedQuotation?.receiving || ""}
                  readOnly
                  onChange={(e) =>
                    setSelectedQuotation((prev) => ({
                      ...prev,
                      receivingEntity: e.target.value,
                    }))
                  }
                />

              </div>
              <div style={{ flex: "1 1 22%" }}>
                <label>Currency</label>

                <select
                  name="currency"
                  value={selectedQuotation.currency || ""}
                  onChange={(e) =>
                    setSelectedQuotation({
                      ...selectedQuotation,
                      currency: e.target.value,
                    })
                  }
                >
                  <option value="">Select Currency</option>
                  {currencies.map((currency) => (
                    <option
                      key={currency.currencyId}
                      value={currency.currencyName}  // or currency.currencyCode / currencyId based on your need
                    >
                      {currency.currencyName}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ flex: "1 1 22%" }}>
                <label>Quotation Type</label>
                {/* <input
                                type="text"
                                style={{ width: "100%" }}
                                value={selectedQuotation.quotationType || ""}
                                onChange={(e) =>
                                  setSelectedQuotation({
                                    ...selectedQuotation,
                                    quotationType: e.target.value,
                                  })
                                }
                              /> */}
                <select
                  name="quotationType"
                  value={selectedQuotation?.quotationType || ""}
                  onChange={(e) =>
                    setSelectedQuotation({
                      ...selectedQuotation,
                      quotationType: e.target.value,
                    })
                  }
                >
                  <option value="">Select Type</option>
                  <option value="OnceOff">OnceOff</option>
                  <option value="Recurring">Recurring</option>
                </select>
              </div>
              <div style={{ flex: "1 1 22%" }}>
              </div>
            </div>

            {/* Quotation Details Example */}
            <h4 style={{ color: "green" }}>Quotation Details</h4>
            <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>NAME</th>
                  {/* <th>DESCRIPTION</th> */}
                  <th>QUANTITY</th>
                  <th>UNIT RATE EXCL VAT</th>
                  <th>AMOUNT</th>
                  <th>DISCOUNT</th>
                  <th>DISCOUNTED TOTAL</th>
                  <th>VAT</th>
                  <th>NET AMOUNT</th>
                  <th>
                    <FiPlusSquare className="add-row-btn" onClick={handleEditAddRow} />

                  </th>
                </tr>
              </thead>
              <tbody>
                {(selectedQuotation.details || []).map((row, index) => (
                  <tr key={index}>
                    <td hidden>{row.id}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>

                        <FiSearch
                          style={{ cursor: "pointer" }}
                          onClick={() => {               
                            openEditPopup(index)
                            setSelectedRowIndex(index);
                            setPopupMode("edit");
                          }}
                        />

                        <textarea
                          type="text"
                          value={row.itemName || ""}
                          onChange={(e) => handleEditDetailsChange(index, "itemName", e.target.value)}
                          readOnly
                          // style={{
                          //   borderColor: createErrors?.[`itemName${index}`] ? "red" : "#ccc",
                          //   minWidth: "110px", minHeight: "0px",
                          //   backgroundColor: "#e9ecef",
                          // }}

                          style={{
                              borderColor: createErrors?.[`itemName${index}`] ? "red" : "#28a745", textAlign: "Left", 
                              width: "100%",           
                              minWidth: "110px", minHeight: "0px",
                              backgroundColor: "#e9ecef",
                            }}
                        />

                        {createErrors?.[`itemName${index}`] && (
                          <span className="error-text">{createErrors[`itemName${index}`]}</span>
                        )}
                      </div>
                    </td>
                    {/* <td>
                      <input
                        type="text"
                        value={row.description || ""}
                        onChange={(e) => handleEditDetailsChange(index, "description", e.target.value)}
                        readOnly
                        style={{
                          borderColor: createErrors?.[`description_${index}`] ? "red" : "#ccc",
                           minWidth: "110px",
                          backgroundColor: "#e9ecef",
                        }}
                      />
                      {createErrors?.[`description_${index}`] && (
                        <span className="error-text">{createErrors[`description_${index}`]}</span>
                      )}
                    </td> */}

                    <td>
                      <input
                        type="number"
                        value={row.quantity || ""}
                        min="0"
                        
                        onChange={(e) => handleEditDetailsChange(index, "quantity", e.target.value)}
                        
                        style={{
                            borderColor: createErrors?.[`quantity_${index}`] ? "red" : "#28a745",
                            textAlign: "right",
                            width: "100%",
                            minWidth: "110px",
                            // backgroundColor: row.category === "Service Rendered" ? "#e9ecef" : "white", 
                            backgroundColor: "white",
                          }}
                      />
                      {createErrors?.[`quantity_${index}`] && (
                        <span className="error-text">{createErrors[`quantity_${index}`]}</span>
                      )}
                    </td>

                    <td>
                      <input
                        type="number"
                            min={0}

                        value={row.unitRate || ""}
                        onChange={(e) => handleEditDetailsChange(index, "unitRate", e.target.value)}
                        // readOnly
                        style={{
                          borderColor: createErrors?.[`unitRate_${index}`] ? "red" : "#ccc", textAlign: "right",
                          // backgroundColor: "#e9ecef", minWidth: "110px",
                        }}
                      />
                      {createErrors?.[`unitRate_${index}`] && (
                        <span className="error-text">{createErrors[`unitRate_${index}`]}</span>
                      )}
                    </td>

                    <td>
                      <input
                        type="number"
                        value={(row.unitRate * row.quantity)}
                        readOnly
                        onChange={(e) => handleEditDetailsChange(index, "amount", e.target.value)}
                        style={{
                          borderColor: createErrors?.[`amount_${index}`] ? "red" : "#ccc", textAlign: "right",
                          backgroundColor: "#e9ecef", minWidth: "110px",
                        }}
                      />

                    </td>
                    <td>
                      <input
                        type="number"
                        value={row.discount}
                        onChange={(e) => handleEditDetailsChange(index, "discount", e.target.value)}
                        style={{
                          width: "100%",
                          minWidth: "110px",
                          textAlign: "right",
                          backgroundColor: "#e9ecef",
                        }}
                        readOnly />
                    </td>

                    <td>
                      <input
                        type="number"
                        style={{ textAlign: "right", backgroundColor: "#e9ecef", minWidth: "110px", }}
                        debugger
                        // value={
                        //   row.discount > 0
                        //     ? (
                        //       ((row.unitRate * row.quantity) - row.discount)
                        //     ).toFixed(2)
                        //     : 0
                        // }
                        value={
                          (() => {
                            const qty = Number(row.quantity) || 0;
                            const price = Number(row.unitRate) || 0;

                            const amount = qty * price;
                            const discount = Number(row.discount) || 0;

                            return (amount - discount).toFixed(2);
                          })()
                        }
                        onChange={(e) => handleEditDetailsChange(index, "discountedamount", e.target.value)}
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="hidden"
                        style={{ textAlign: "center", backgroundColor: "#e9ecef", minWidth: "110px",width: "100%" }}
                        value={row.tax}
                        onChange={(e) => handleEditDetailsChange(index, "tax", e.target.value)}
                        readOnly
                      />
                      
                      {Number(row.tax) !== 0 ? (
                        <FiCheck style={{ color: "green", marginLeft: "46px", fontSize: "20px", textAlign: "center" }} />
                      ) : (
                        <FiX style={{ color: "red", marginLeft: "46px", fontSize: "20px", textAlign: "center" }} />
                      )}
                    </td>

                    <td>
                      
                      <input
                        type="number"
                        style={{ textAlign: "right", backgroundColor: "#e9ecef", minWidth: "110px" }}
                        // value={
                        //   row.quantity > 0
                        //     ? (
                        //       (row.amount - row.discount) +
                        //       (row.amount - row.discount) * row.tax / 100
                        //     ).toFixed(2)
                        //     : 0
                        // }
                        value={row.netamount}
                        onChange={(e) => handleEditDetailsChange(index, "netamount", e.target.value)}
                        readOnly
                      />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                        <button className="remove-row-btn" onClick={() => handleEditRemoveRow(index)}>
                          <FaTrash />
                        </button>
                        <button
                          className="discount-row-btn"
                          disabled={row.quantity <= 0}
                          style={{
                            opacity: row.quantity <= 0 ? 0.5 : 1,
                            cursor: row.quantity <= 0 ? "not-allowed" : "pointer"
                          }}
                          onClick={() => {
                            setShowDiscountPopup(true);
                            setTotalBefore(row.unitRate * row.quantity); // pass row total
                            setSelectedRowIndex(index);
                            setDiscountMode("edit");
                            setDiscountType(row.discountType);
                            setDiscountedTotal(row.discount);
                            setDiscountValue(row.discountValue);
                          }}
                        >
                          <FaMinus />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            <h4 className="quotationsub-title" style={{ color: "green" }}>Totals</h4>
            <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
              <div
                className="totals-section"
                style={{
                  width: "250px",       // reduced width
                  display: "flex",      // make sure children stack vertically
                  flexDirection: "column",
                  gap: "10px"           // space between rows
                }}
              >
                <div>
                  <label>Sub Total</label>
                  <input
                    type="text"
                    style={{ width: "100%", textAlign: "right", backgroundColor: "#e9ecef", }}
                    value={selectedQuotation.subTotal || "0.00"}
                    onChange={(e) =>
                      setSelectedQuotation({
                        ...selectedQuotation,
                        subTotal: e.target.value,
                      })
                    } readOnly

                  />
                </div>
                <div>
                  <label>VAT %</label>
                  <input
                    type="text" style={{ width: "100%", textAlign: "right", backgroundColor: "#e9ecef" }} value={tax ?? ""} readOnly />
                </div>

                <div>
                  <label>VAT Amount</label>
                  <input
                    type="text"
                    style={{ width: "100%", textAlign: "right", backgroundColor: "#e9ecef", }}
                    value={selectedQuotation.taxAmount || "0.00"}

                    onChange={(e) =>
                      setSelectedQuotation({
                        ...selectedQuotation,
                        taxAmount: e.target.value,
                      })
                    } readOnly
                  />
                </div>

                <div>
                  <label>Total Net Amount</label>
                  <input
                    type="text"
                    style={{ width: "100%", textAlign: "right", backgroundColor: "#e9ecef", }}
                    value={selectedQuotation.totalAmount || "0.00"}

                    onChange={(e) =>
                      setSelectedQuotation({
                        ...selectedQuotation,
                        amount: e.target.value,
                      })
                    } readOnly
                  />
                </div>
              </div>
            </div>
            <h4 className="quotationsub-title" style={{ color: "green" }}>Customer Information</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
              <div style={{ flex: "1 1 22%" }}>
                <label>Customer Name</label>
                <input
                  type="text"
                  style={{ width: "100%", backgroundColor: "#e9ecef" }}
                  value={selectedQuotation.customerName || ""}
                  onChange={(e) =>
                    setSelectedQuotation({
                      ...selectedQuotation,
                      CustomerName: e.target.value,
                    })
                  }
                />
              </div>
              <div style={{ flex: "1 1 22%" }}>
                <label>Customer Email </label>
                <input
                  type="text"
                  style={{ width: "100%", backgroundColor: "#e9ecef" }}
                  value={selectedQuotation.customerEmail || ""}
                  onChange={(e) =>
                    setSelectedQuotation({
                      ...selectedQuotation,
                      CustomerEmail: e.target.value,
                    })
                  }
                />
              </div>
              <div style={{ flex: "1 1 22%" }}>
                <label>Customer Phone Number</label>
                <input
                  type="text"
                  style={{ width: "100%", backgroundColor: "#e9ecef" }}
                  value={selectedQuotation.customerPhone || ""}
                  onChange={(e) =>
                    setSelectedQuotation({
                      ...selectedQuotation,
                      CustomerPhone: e.target.value,
                    })
                  }
                />
              </div>

              <div style={{ flex: "1 1 22%" }}>
                <label>Customer Address</label>
                <textarea
                  type="text"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "1px solid #28a745",
                    fontSize: "1rem",
                    fontFamily: "'Open Sans', sans-serif",
                    boxSizing: "border-box",
                    resize: "none",
                    maxHeight :"40px",
                    lineHeight: "1.4",
                    backgroundColor: "#e9ecef"
                  }}
                  value={selectedQuotation.customerAddress || ""}
                  onChange={(e) =>
                    setSelectedQuotation({
                      ...selectedQuotation,
                      CustomerAddress: e.target.value,
                    })
                  }
                />
              </div>


            </div>
            <h4 className="quotationsub-title" style={{ color: "green" }}>Payment Terms</h4>
            <div style={{ width: "100%" }}>
              <label>Payment Terms</label>
              <textarea style={{ width: "100%", minHeight: "70px" }}
                value={selectedQuotation.paymentTerms || ""}
                onChange={(e) =>
                  setSelectedQuotation({
                    ...selectedQuotation,
                    paymentTerms: e.target.value,
                  })
                }
              />
            </div>

            <br />
            {/* Save button */}
            <div className="quotation-actions">
              <button
                className="submit-btn"
                disabled={isSaving}
                onClick={() => handleUpdate(selectedQuotation)}
              >
                {isSaving && (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )} Update
              </button>
              <button
                type="button"
                className="btn btn-danger btn-lg"
                onClick={() => setShowInvoiceUpdateForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateQuotationForm;