import React from "react";
import { FaTrash, FaMinus } from "react-icons/fa";
import { FiSearch, FiCheck, FiX, FiPlusSquare } from "react-icons/fi";



const CreateQuotationForm = ({

  clearForm, logoFile,
  baseURL, CompanyName, setCompanyName, VatNumber, CompanyId, setCompanyId,
  setVatNumber,
  RegistrationNumber,
  setRegistrationNumber,
  CompanyAddress,
  setCompanyAddress,
  CompanyWebsite,
  setCompanyWebsite,
  CompanyEmail,
  setCompanyEmail,
  CompanyPhoneNumber,
  setCompanyPhoneNumber,
  BankAccountNumber,
  setBankAccountNumber,
  BranchCode,
  setBranchCode,
  BrannchAddress,
  setBrannchAddress,
  IFSCCode,
  setIFSCCode,
  generatedQuotationId,
  todayDate,
  receivingEntity,
  setReceivingEntity,
  currencies,
  currency,
  setCurrency,
  quotationType,
  setQuotationType,
  quotationDetails,
  addRow,
  removeRow,
  handleDetailsChange,
  createErrors,
  setCreateErrors,
  CustomerName,
  setCustomerName,
  CustomerPhone,
  setCustomerPhone,
  CustomerEmail,
  setCustomerEmail,
  CustomerAddress,
  setCustomerAddress,
  PaymentTerms,
  setPaymentTerms,
  allowAlphaNumeric,
  isAlphaNumeric,
  computedSubtotal,
  computedTaxAmount,
  computedTotalAmount,
  setSubTotal,
  setTaxAmount,
  setTotalAmount,
  handleSearch,
  fetchCustomers,
  handleSave,
  isSaving,
  openCreatePopup,
  setSelectedRowIndex,
  setShowDiscountPopup,
  setTotalBefore,
  setShowInvoiceForm,
  closeInvoiceForm,
  DiscountMode,
  setDiscountMode,
  setDiscountType,
  setDiscountedTotal,
  setDiscountValue,
  tax


}) => {

  return (
    <>
      {/* FULL JSX EXACTLY AS YOU PROVIDED */}
      {(
        <div className="quotation-form-overlay">
          <div className="quotation-form-modal">
            
            
             <span
              className="closequotation-btn"
              onClick={() => closeInvoiceForm(false)}
            >
              &times;
            </span>

            <div style={{ position: "relative" }}>
              <h2 style={{ color: "green" }}>Generate Quotation</h2>

              {logoFile && (
                <img
                  src={`${baseURL}/UploadedFiles/${logoFile}`}
                  alt="Company Logo"
                  className="company-logo-corner"
                />
              )}
            </div>

            <h4 className="quotationsub-title" style={{ color: "green" }}>Company Information</h4>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "4px" }}>
              {/* setCompanyLogo(apiResponse.companyLogo || ""); */}

              <div style={{ flex: "1 1 22%" }}>
                <label>Company Name<span className="required">*</span>  &nbsp;&nbsp;
                  <FiSearch
                    style={{ cursor: "pointer", marginRight: "5px" }}
                    onClick={() => {
                      // setShowCompanyPopup(true);
                      handleSearch();
                    }}
                  />
                </label>
                <input
                  type="text"
                  style={{ width: "100%", backgroundColor: "#e9ecef" }} value={CompanyName}
                  onChange={(e) => {
                    const value = e.target.value;

                    setCompanyName(value)

                    if (value.trim() === "") {
                      setCreateErrors({ ...createErrors, CompanyName: "Vat Number is required" });
                    } else {
                      setCreateErrors({ ...createErrors, CompanyName: "" });
                    }
                  }}
                  className={createErrors.CompanyName ? "input-error" : ""}
                  readOnly
                />
                {createErrors.CompanyName && <p className="error-message">{createErrors.CompanyName}</p>}
              </div>

              <div style={{ flex: "1 1 22%" }}>
                <label>Company Vat Number<span className="required">*</span></label>
                <input
                  type="text"
                  style={{ width: "100%", backgroundColor: "#e9ecef" }}
                  value={VatNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    setVatNumber(value)
                    if (value.trim() === "") {
                      setCreateErrors({ ...createErrors, VatNumber: "Vat Number is required" });
                    } else {
                      setCreateErrors({ ...createErrors, VatNumber: "" });
                    }
                  }}
                  className={createErrors.VatNumber ? "input-error" : ""}
                  readOnly
                />
                {createErrors.VatNumber && <p className="error-message">{createErrors.VatNumber}</p>}
              </div>

              <div style={{ flex: "1 1 22%" }}>
                <label>Company Reg Number<span className="required">*</span></label>
                <input
                  type="text"
                  style={{ width: "100%", backgroundColor: "#e9ecef" }}
                  value={RegistrationNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    setRegistrationNumber(value)

                    if (value.trim() === "") {
                      setCreateErrors({ ...createErrors, RegistrationNumber: "Registration Number is required" });
                    } else {
                      setCreateErrors({ ...createErrors, RegistrationNumber: "" });
                    }
                  }}
                  className={createErrors.RegistrationNumber ? "input-error" : ""}
                  readOnly
                />
                {createErrors.RegistrationNumber && <p className="error-message">{createErrors.RegistrationNumber}</p>}

              </div>

              <div style={{ flex: "1 1 22%" }}>
                <label>Company Address<span className="required">*</span></label>
                <textarea
                  type="text"
                  style={{
                    width: "100%",
                    padding: "6px 9px",
                    borderRadius: "8px",
                    border: "1px solid #28a745",
                    fontSize: "13px",
                    fontFamily: "'Open Sans', sans-serif",
                    boxSizing: "border-box",
                    resize: "none",
                    maxHeight: "40px",
                    lineHeight: "1.4",
                    backgroundColor: "#e9ecef"
                  }}

                  value={CompanyAddress}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCompanyAddress(value)
                    if (value.trim() === "") {
                      setCreateErrors({ ...createErrors, CompanyAddress: "Company Address is required" });
                    } else {
                      setCreateErrors({ ...createErrors, CompanyAddress: "" });
                    }
                  }}
                  className={createErrors.CompanyAddress ? "input-error" : ""}
                  readOnly
                />
                {createErrors.CompanyAddress && <p className="error-message">{createErrors.CompanyAddress}</p>}

              </div>

              <div style={{ flex: "1 1 22%" }}>
                <label>Company Website<span className="required"></span></label>
                <input
                  type="text"
                  style={{ width: "100%", backgroundColor: "#e9ecef" }}
                  value={CompanyWebsite}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCompanyWebsite(value)
                    if (value.trim() === "") {
                      setCreateErrors({ ...createErrors, CompanyWebsite: "Company Website is required" });
                    } else {
                      setCreateErrors({ ...createErrors, CompanyWebsite: "" });
                    }
                  }}
                  className={createErrors.CompanyWebsite ? "input-error" : ""}
                  readOnly
                />
                {createErrors.CompanyWebsite && <p className="error-message">{createErrors.CompanyWebsite}</p>}

              </div>

              <div style={{ flex: "1 1 22%" }}>
                <label>Company Email<span className="required">*</span></label>
                <input
                  type="text"
                  style={{ width: "100%", backgroundColor: "#e9ecef" }}
                  value={CompanyEmail}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCompanyEmail(value)
                    if (value.trim() === "") {
                      setCreateErrors({ ...createErrors, CompanyEmail: "CompanyPhoneNumber is required" });
                    } else {
                      setCreateErrors({ ...createErrors, CompanyEmail: "" });
                    }
                  }}
                  className={createErrors.CompanyEmail ? "input-error" : ""}
                  readOnly
                />
                {createErrors.CompanyEmail && <p className="error-message">{createErrors.CompanyEmail}</p>}

              </div>

              <div style={{ flex: "1 1 22%" }}>
                <label>Company Phone Number<span className="required">*</span></label>
                <input
                  type="text"
                  style={{ width: "100%", backgroundColor: "#e9ecef" }}
                  value={CompanyPhoneNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCompanyPhoneNumber(value)
                    if (value.trim() === "") {
                      setCreateErrors({ ...createErrors, CompanyPhoneNumber: "CompanyPhoneNumber is required" });
                    } else {
                      setCreateErrors({ ...createErrors, CompanyPhoneNumber: "" });
                    }
                  }}
                  className={createErrors.CompanyPhoneNumber ? "input-error" : ""}
                  readOnly

                />

                {createErrors.CompanyPhoneNumber && <p className="error-message">{createErrors.CompanyPhoneNumber}</p>}


              </div>
              <div style={{ flex: "1 1 22%" }}>

              </div>

            </div>


            <h4 className="quotationsub-title" style={{ color: "green" }}>Banking Details</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "4px" }}>


              <div style={{ flex: "1 1 22%" }}>
                <label>Account Number<span className="required">*</span></label>
                <input
                  type="text"
                  style={{ width: "100%", backgroundColor: "#e9ecef" }}
                  value={BankAccountNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    setBankAccountNumber(value)

                    if (value.trim() === "") {
                      setCreateErrors({ ...createErrors, BankAccountNumber: "AccountNumber is required" });
                    } else {
                      setCreateErrors({ ...createErrors, BankAccountNumber: "" });
                    }
                  }}
                  className={createErrors.BankAccountNumber ? "input-error" : ""}
                  readOnly
                />
                {createErrors.BankAccountNumber && <p className="error-message">{createErrors.BankAccountNumber}</p>}

              </div>

              <div style={{ flex: "1 1 22%" }}>
                <label>Branch Code<span className="required">*</span></label>
                <input
                  type="text"
                  style={{ width: "100%", backgroundColor: "#e9ecef" }}
                  value={BranchCode}
                  onChange={(e) => {
                    const value = e.target.value;
                    setBranchCode(value)
                    if (value.trim() === "") {
                      setCreateErrors({ ...createErrors, BranchCode: "Branch Code is required" });
                    } else {
                      setCreateErrors({ ...createErrors, BranchCode: "" });
                    }
                  }}
                  className={createErrors.BranchCode ? "input-error" : ""}
                  readOnly
                />
                {createErrors.BranchCode && <p className="error-message">{createErrors.BranchCode}</p>}

              </div>

              <div style={{ flex: "1 1 22%" }}>
                <label>Branch Address<span className="required">*</span></label>
                <textarea
                  type="text"
                  style={{
                    width: "100%",
                    padding: "6px 9px",
                    borderRadius: "8px",
                    border: "1px solid #28a745",
                    fontSize: "13px",
                    fontFamily: "'Open Sans', sans-serif",
                    boxSizing: "border-box",
                    resize: "none",
                    maxHeight: "40px",
                    lineHeight: "1.4",
                    backgroundColor: "#e9ecef"
                  }}
                  value={BrannchAddress}
                  onChange={(e) => {
                    const value = e.target.value;
                    setBrannchAddress(value)
                    if (value.trim() === "") {
                      setCreateErrors({ ...createErrors, BrannchAddress: "Branch Address is required" });
                    } else {
                      setCreateErrors({ ...createErrors, BrannchAddress: "" });
                    }
                  }}
                  className={createErrors.BrannchAddress ? "input-error" : ""}
                  readOnly
                />
                {createErrors.BrannchAddress && <p className="error-message">{createErrors.BrannchAddress}</p>}

              </div>

              <div style={{ flex: "1 1 22%" }}>
                {/* <label>IFSC Code<span className="required"></span></label>
                <input
                  type="text"
                  style={{ width: "100%",backgroundColor:"#e9ecef" }}
                  value={IFSCCode}
                  onChange={(e) => {
                    const value = e.target.value;
                    setIFSCCode(value)

                    if (value.trim() === "") {
                      setCreateErrors({ ...createErrors, IFSCCode: "IFSCCode is required" });
                    } else {
                      setCreateErrors({ ...createErrors, IFSCCode: "" });
                    }
                  }}
                  className={createErrors.IFSCCode ? "input-error" : ""}
                  readOnly
                />
                {createErrors.IFSCCode && <p className="error-message">{createErrors.IFSCCode}</p>} */}

              </div>

            </div>

            <h4 className="quotationsub-title" style={{ color: "green" }}>Quotation Information</h4>
            <div style={{ maxWidth: "100%", padding: "0px" }}>
              {/* quotation ID */}
              <div style={{ display: "flex", marginBottom: "4px" }}>
                <label style={{ width: "120px", fontWeight: "500" }}>Quotation Id   &nbsp;&nbsp;&nbsp;&nbsp;  : </label>
                <span style={{ fontWeight: "bold", fontSize: "13px" }}>{generatedQuotationId}</span>
              </div>

              {/* Invoice Date */}
              <div style={{ display: "flex", marginBottom: "8px" }}>
                <label style={{ width: "120px", fontWeight: "100" }}>Quotation Date :</label>
                <span style={{ fontWeight: "bold", fontSize: "13px" }}>{todayDate}</span>
              </div>
              {/* Billing, Receiving, and Currency */}
              <div style={{ display: "flex", gap: "12px", marginBottom: "4px", width: "100%" }}>

                <div style={{ flex: 1 }}>
                  <label>Receiving Entity<span className="required">*</span>
                    &nbsp;&nbsp;
                    <FiSearch
                      style={{ cursor: "pointer", marginRight: "5px" }}
                      onClick={() => {
                        fetchCustomers();



                      }}
                    />

                  </label>
                  <input type="text" style={{ width: "100%", backgroundColor: "#e9ecef" }}
                    value={receivingEntity}
                    onChange={(e) => {
                      const value = e.target.value;
                      setReceivingEntity(value)
                      if (value.trim() === "") {
                        setCreateErrors({ ...createErrors, receivingEntity: "receivingEntity is required" });
                      } else {
                        setCreateErrors({ ...createErrors, receivingEntity: "" });
                      }
                    }}
                    className={createErrors.receivingEntity ? "input-error" : ""}
                    readOnly
                  />
                  {createErrors.receivingEntity && <p className="error-message">{createErrors.receivingEntity}</p>}

                </div>



                <div style={{ flex: 1 }}>
                  <label>Currency<span className="required">*</span></label>

                  <select style={{ width: "100%" }}
                    value={currency}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCurrency(value)
                      if (value.trim() === "") {
                        setCreateErrors({ ...createErrors, currency: "Currency is required" });
                      } else {
                        setCreateErrors({ ...createErrors, currency: "" });
                      }
                    }}
                    className={createErrors.currency ? "input-error" : ""}
                  >
                    <option value="">Select Currency</option>
                    {currencies.map((currency) => (
                      <option key={currency.currencyId} value={currency.currencyName}>
                        {currency.currencyName}
                      </option>
                    ))}
                  </select>
                  {createErrors.currency && <p className="error-message">{createErrors.currency}</p>}

                </div>
                <div style={{ flex: 1 }}>
                  <label>Quotation Type<span className="required">*</span></label>
                  <select style={{ width: "100%" }}
                    value={quotationType}
                    onChange={(e) => {
                      const value = e.target.value;
                      setQuotationType(value)
                      if (value.trim() === "") {
                        setCreateErrors({ ...createErrors, quotationType: "Quotation Type No is required" });
                      } else {
                        setCreateErrors({ ...createErrors, quotationType: "" });
                      }
                    }}
                    className={createErrors.quotationType ? "input-error" : ""}
                  >
                    <option value="">Select Type</option>
                    <option value="Recurring">Recurring</option>
                    <option value="OnceOff">OnceOff</option>

                  </select>
                  {createErrors.quotationType && <p className="error-message">{createErrors.quotationType}</p>}

                </div>

              </div>
            </div>

            <h4 className="quotationsub-title" style={{ color: "green" }}>Quotation Details</h4>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th hidden>ID</th>
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
                      <FiPlusSquare onClick={addRow} className="add-row-btn" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {quotationDetails.map((row, index) => (
                    <tr key={index}>
                      <td hidden>{row.id}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>

                          <FiSearch
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setSelectedRowIndex(index);
                              openCreatePopup(index)
                            }}
                          />
                          <textarea
                            type="text"
                            value={row.itemName}
                            onChange={(e) => handleDetailsChange(index, "itemName", e.target.value)}
                            readOnly
                            style={{
                              borderColor: createErrors[`itemName${index}`] ? "red" : "#28a745", textAlign: "Left", width: "100%",             // makes all fields same width
                              minWidth: "110px", minHeight: "0px",
                              backgroundColor: "#e9ecef",
                            }}
                          />
                          {createErrors[`itemName${index}`] && (
                            <span className="error-text">{createErrors[`itemName${index}`]}</span>
                          )}
                        </div>
                      </td>
                      {/* <td>

                      <input
                        type="text"
                        value={row.description}
                        onChange={(e) => handleDetailsChange(index, "description", e.target.value)}
                        readOnly
                        style={{
                          borderColor: createErrors[`description_${index}`] ? "red" : "#28a745", textAlign: "Left", width: "100%",             // makes all fields same width
                          minWidth: "110px",
                          backgroundColor: "#e9ecef",
                        }}
                      />
                      {createErrors[`description_${index}`] && (
                        <span className="error-text">{createErrors[`description_${index}`]}</span>
                      )}
                    </td> */}

                      <td>
                        <input
                          type="number"
                          value={row.quantity}
                          min="0"
                          // readOnly={row.category === "Service Rendered"}     
                          onChange={(e) => handleDetailsChange(index, "quantity", e.target.value)}
                          style={{
                            borderColor: createErrors[`quantity_${index}`] ? "red" : "#28a745",
                            textAlign: "right",
                            width: "100%",
                            minWidth: "110px",
                            // backgroundColor: row.category === "Service Rendered" ? "#e9ecef" : "white", 
                            backgroundColor: "white",
                          }}
                        />
                        {createErrors[`quantity_${index}`] && (
                          <span className="error-text">{createErrors[`quantity_${index}`]}</span>
                        )}
                      </td>

                      <td>
                        <input
                          type="number"
                          min={0}
                          value={row.price}

                          onChange={(e) => handleDetailsChange(index, "price", e.target.value)}

                          style={{
                            borderColor: createErrors[`price_${index}`] ? "red" : "#28a745", textAlign: "right", width: "100%",             // makes all fields same width
                            minWidth: "110px",
                            // backgroundColor:"#e9ecef", 

                          }}
                        />
                        {createErrors[`price_${index}`] && (
                          <span className="error-text">{createErrors[`price_${index}`]}</span>
                        )}
                      </td>
                      <td>
                        <input
                          type="number"
                          value={(row.price * row.quantity)}
                          readOnly
                          style={{
                            textAlign: "right", width: "100%",
                            minWidth: "110px",
                            backgroundColor: "#e9ecef",
                            // borderColor: createErrors?.[`tax${index}`] ? "red" : "#ccc", 
                          }}
                          onChange={(e) => handleDetailsChange(index, "amount", e.target.value)}
                        />
                      </td>

                      <td>
                        <input
                          type="number"
                          onChange={(e) => handleDetailsChange(index, "discount", e.target.value)}
                          value={row.discount}
                          style={{
                            width: "100%",
                            textAlign: "right",
                            minWidth: "110px",
                            backgroundColor: "#e9ecef",
                            // borderColor: createErrors?.[`tax${index}`] ? "red" : "#ccc",
                          }}
                          readOnly

                        />

                      </td>
                      <td>
                        <input
                          type="number"
                          // value={
                          //   row.discount > 0
                          //     ? (
                          //       (row.amount - row.discount)
                          //     ).toFixed(2)
                          //     : 0
                          // }
                          value={
                            (() => {
                              const qty = Number(row.quantity) || 0;
                              const price = Number(row.price) || 0;

                              const amount = qty * price;
                              const discount = Number(row.discount) || 0;

                              return (amount - discount).toFixed(2);
                            })()
                          }
                          readOnly
                          style={{
                            textAlign: "right", width: "100%",
                            minWidth: "110px",
                            backgroundColor: "#e9ecef",
                            // borderColor: createErrors?.[`tax${index}`] ? "red" : "#ccc", 
                          }}
                          onChange={(e) => handleDetailsChange(index, "discountedamount", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="hidden"
                          value={row.tax}
                          onChange={(e) => handleDetailsChange(index, "tax", e.target.value)}
                          readOnly
                          style={{
                            borderColor: "#28a745", textAlign: "right", width: "100%",
                            minWidth: "110px",
                            minHeight: "0px",
                            backgroundColor: "#e9ecef",

                          }}
                        />

                        {/* Icon based on tax value */}
                        {Number(row.tax) !== 0 ? (
                          <FiCheck style={{ color: "green", marginLeft: "6px", fontSize: "20px", textAlign: "center" }} />
                        ) : (
                          <FiX style={{ color: "red", marginLeft: "6px", fontSize: "20px", textAlign: "center" }} />
                        )}



                      </td>

                      <td>
                        <input
                          type="number"
                          value={
                            row.quantity > 0
                              ? (
                                (row.amount - row.discount) +
                                (row.amount - row.discount) * row.tax / 100
                              ).toFixed(2)
                              : 0
                          }
                          readOnly
                          style={{
                            textAlign: "right", width: "100%",
                            minWidth: "110px",
                            backgroundColor: "#e9ecef",
                            // borderColor: createErrors?.[`tax${index}`] ? "red" : "#ccc"
                          }}
                          onChange={(e) => handleDetailsChange(index, "netamount", e.target.value)}
                        />
                      </td>

                      <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                          {/* Delete Button */}
                          <button
                            className="remove-row-btn"
                            onClick={() => removeRow(index)}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>

                          {/* Discount Button */}

                          <button
                            className="discount-row-btn"
                            disabled={row.quantity <= 0}
                            style={{
                              opacity: row.quantity <= 0 ? 0.5 : 1,
                              cursor: row.quantity <= 0 ? "not-allowed" : "pointer"
                            }}
                            onClick={() => {
                              setShowDiscountPopup(true);
                              setTotalBefore(row.price * row.quantity);
                              setSelectedRowIndex(index);
                              setDiscountMode("create");
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
                  width: "250px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px"
                }}
              >
                <div>
                  <label>Sub Total</label>
                  <input
                    type="text"
                    style={{ width: "100%", textAlign: "right", backgroundColor: "#e9ecef" }}
                    value={computedSubtotal.toFixed(2)}
                    onChange={(e) => setSubTotal(e.target.value)}
                    readOnly
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
                    style={{ width: "100%", textAlign: "right", backgroundColor: "#e9ecef" }}
                    value={computedTaxAmount.toFixed(2)}
                    onChange={(e) => setTaxAmount(e.target.value)}
                    readOnly
                  />
                </div>

                <div>
                  <label>Total Net Amount</label>
                  <input
                    type="text"
                    style={{ width: "100%", textAlign: "right", backgroundColor: "#e9ecef" }}
                    value={computedTotalAmount.toFixed(2)}
                    onChange={(e) => setTotalAmount(e.target.value)}

                    readOnly
                  />
                </div>
              </div>
            </div>



            <h4 className="quotationsub-title" style={{ color: "green" }}>Customer Information</h4>


            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "4px" }}>


              <div style={{ flex: "1 1 22%" }}>
                <label>Customer Name<span className="required">*</span></label>

                <input
                  type="text"
                  style={{ width: "100%", backgroundColor: "#e9ecef" }}
                  value={CustomerName}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCustomerName(value)
                    if (value.trim() === "") {
                      setCreateErrors({ ...createErrors, CustomerName: "Customer Name is required" });
                    } else {
                      setCreateErrors({ ...createErrors, CustomerName: "" });
                    }
                  }}
                  className={createErrors.CustomerName ? "input-error" : ""}


                />
                {createErrors.CustomerName && <p className="error-message">{createErrors.CustomerName}</p>}
              </div>

              <div style={{ flex: "1 1 22%" }}>
                <label>Customer Phone <span className="required">*</span></label>
                <input
                  type="text"
                  style={{ width: "100%", backgroundColor: "#e9ecef" }}
                  value={CustomerPhone}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCustomerPhone(value)
                    if (value.trim() === "") {
                      setCreateErrors({ ...createErrors, CustomerPhone: "Customer Phone is required" });
                    } else {
                      setCreateErrors({ ...createErrors, CustomerPhone: "" });
                    }
                  }}
                  className={createErrors.CustomerPhone ? "input-error" : ""}

                  readOnly
                />
                {createErrors.CustomerPhone && <p className="error-message">{createErrors.CustomerPhone}</p>}

              </div>

              <div style={{ flex: "1 1 22%" }}>
                <label>Customer Email<span className="required">*</span></label>
                <input
                  type="text"
                  style={{ width: "100%", backgroundColor: "#e9ecef" }}
                  value={CustomerEmail}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCustomerEmail(value)
                    if (value.trim() === "") {
                      setCreateErrors({ ...createErrors, CustomerEmail: "Customer Email is required" });
                    } else {
                      setCreateErrors({ ...createErrors, CustomerEmail: "" });
                    }
                  }}
                  className={createErrors.CustomerEmail ? "input-error" : ""}

                  readOnly
                />
                {createErrors.CustomerEmail && <p className="error-message">{createErrors.CustomerEmail}</p>}
              </div>


              <div style={{ flex: "1 1 22%" }}>
                <label>Customer Address<span className="required">*</span></label>
                <textarea
                  type="text"
                  style={{
                    width: "100%",
                    padding: "6px 9px",
                    borderRadius: "8px",
                    border: "1px solid #28a745",
                    fontSize: "13px",
                    fontFamily: "'Open Sans', sans-serif",
                    boxSizing: "border-box",
                    resize: "none",
                    maxHeight: "40px",
                    lineHeight: "1.4",
                    backgroundColor: "#e9ecef"
                  }}
                  value={CustomerAddress}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCustomerAddress(value)
                    if (value.trim() === "") {
                      setCreateErrors({ ...createErrors, CustomerAddress: "Customer Address is required" });
                    } else {
                      setCreateErrors({ ...createErrors, CustomerAddress: "" });
                    }
                  }}
                  className={createErrors.CustomerAddress ? "input-error" : ""}

                  readOnly
                />
                {createErrors.CustomerAddress && <p className="error-message">{createErrors.CustomerAddress}</p>}
              </div>

            </div>

            <h4 className="quotationsub-title" style={{ color: "green" }}>Payment Terms</h4>
            <div style={{ width: "100%" }}>
              <label>
                Payment Terms <span className="required">*</span>
              </label>
              <textarea
                style={{ width: "100%", minHeight: "54px" }}
                value={PaymentTerms}
                onChange={(e) => {
                  const rawValue = e.target.value;
                  const validValue = allowAlphaNumeric(rawValue); // ✅ restrict to letters, numbers, and spaces

                  setPaymentTerms(validValue);

                  // Validation
                  if (validValue.trim() === "") {
                    setCreateErrors({
                      ...createErrors,
                      PaymentTerms: "Payment Terms is required",
                    });
                  } else if (!isAlphaNumeric(validValue)) {
                    setCreateErrors({
                      ...createErrors,
                      PaymentTerms: "Only letters and numbers are allowed",
                    });
                  } else {
                    setCreateErrors({
                      ...createErrors,
                      PaymentTerms: "",
                    });
                  }
                }}
                className={createErrors.PaymentTerms ? "input-error" : ""}
              />
              {createErrors.PaymentTerms && (
                <p className="error-message">{createErrors.PaymentTerms}</p>
              )}
            </div>

            <div className="quotation-actions" style={{ marginTop: "14px" }}>

              <button className="submit-btn" onClick={handleSave} disabled={isSaving}>
                {isSaving && (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )} Save
              </button>

              <button
                type="button"
                className="btn btn-danger btn-lg"
                // onClick={() => setShowInvoiceForm(false)}
                // onClick={() => {
                //   setShowInvoiceForm(false);
                //   setFormData(initialFormData);
                //   setErrors({});
                // }}                
                onClick={() => closeInvoiceForm()}
              >
                Cancel
              </button>
            </div>


            {/* I have kept 100% of your JSX exactly as it is */}
          </div>
        </div>
      )}
    </>
  );
};

export default CreateQuotationForm;
