import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMasterList, createmaster, updatemaster, deletemaster } from "../../redux/MasterSlice";
import "./MasterData.css";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import HelpModal from "../../components/Common/HelpModal";
import useSort from "../../components/Common/useSort";
import { FaEdit, FaTrash } from "react-icons/fa";
import Pagination from "../../components/Common/Pagination";

const MasterData = () => {
  const dispatch = useDispatch();
  const { tableData = [], loading, error, successMessage } = useSelector((state) => state.master || {});

  const [selectedType, setSelectedType] = useState("");
  const [formData, setFormData] = useState({});
  const [editingItem, setEditingItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit'
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [showHelp, setShowHelp] = useState(false);

  // errors are now stored as e.g. { "Currency_description": "msg", "Tax_taxPercentage": "msg" }
  const [errors, setErrors] = useState({});

  const { sortedData, requestSort, sortConfig } = useSort(tableData);

  const totalPages = Math.max(1, Math.ceil((sortedData?.length || 0) / recordsPerPage));
  const paginatedData = (sortedData || []).slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );


  // Helpers for namespaced errors
  const errorKey = (field, type = selectedType) => `${type}_${field}`;
  const getError = (field, type = selectedType) => errors[errorKey(field, type)] || "";
  const setFieldError = (field, message = "") => {
    setErrors((prev) => ({ ...prev, [errorKey(field)]: message }));
  };

  // When switching type, reset data & errors
  useEffect(() => {
    if (selectedType) dispatch(getMasterList(selectedType));
  }, [selectedType, dispatch]);

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setSelectedType(value);
    setFormData({});
    setEditingItem(null);
    setCurrentPage(1);
    // Reset any previous validations (scoped keys)
    setErrors({});
    setShowHelp(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // clear field error when user types
    setFieldError(name, value && value.toString().trim() ? "" : getError(name) ? "This field is required" : "");
  };

  const openCreateModal = () => {
    setModalMode("create");
    setEditingItem(null);
    setFormData({});
    setErrors({});
    setShowModal(true);
  };

  // Date formatting
  const formatDateInput = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - userTimezoneOffset)
      .toISOString()
      .split("T")[0];

    return localISOTime;
  };

  const formatDateDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };

  // Validation
  const validateForm = () => {
    let newErrors = {};

    if (selectedType === "Currency") {
      if (!formData.currencyName?.trim()) {
        newErrors[errorKey("currencyName")] = "Currency  is required.";
      }

      if (!formData.description?.trim()) {
        newErrors[errorKey("description")] = "Description is required.";
      }

      // if (!formData.isActive) {
      //   newErrors[errorKey("isActive")] = "Is Active is required.";
      // }

      // if (!formData.isDeleted) {
      //   newErrors[errorKey("isDeleted")] = "Is Deleted is required.";
      // }
    }

    if (selectedType === "VAT") {
      if (!formData.taxPercentage && formData.taxPercentage !== 0) {
        newErrors[errorKey("taxPercentage")] = "Vat Percentage is required.";
      }

      if (!formData.description?.trim()) {
        newErrors[errorKey("description")] = "Description is required.";
      }

      if (!formData.isActive) {
        newErrors[errorKey("isActive")] = "Is Active is required.";
      }

      if (!formData.isDeleted) {
        newErrors[errorKey("isDeleted")] = "Is Deleted is required.";
      }
    }

    if (selectedType === "Category") {
      if (!formData.categoryName?.trim()) {
        newErrors[errorKey("categoryName")] = "Category Name is required.";
      }
      if (!formData.isActive) {
        newErrors[errorKey("isActive")] = "Is Active is required.";
      }
      if (!formData.isDeleted) {
        newErrors[errorKey("isDeleted")] = "Is Deleted is required.";
      }
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };


  // Duplicate check
  const validateDuplicates = () => {
    let duplicateError = false;

    if (selectedType === "Currency") {
      const exists = (tableData || []).some(
        (item) =>
          item.currencyName?.toLowerCase() === formData.currencyName?.toLowerCase() &&
          (!editingItem || item.id !== editingItem.id)
      );
      if (exists) {
        alertify.alert("Duplicate Error", "Currency Name already exists!");
        duplicateError = true;
      }
    }

    if (selectedType === "VAT") {
      const exists = (tableData || []).some(
        (item) =>
          parseFloat(item.taxPercentage) === parseFloat(formData.taxPercentage) &&
          (!editingItem || item.id !== editingItem.id)
      );
      if (exists) {
        alertify.alert("Duplicate Error", "Vat Percentage already exists!");
        duplicateError = true;
      }
    }

    if (selectedType === "Category") {
      const exists = (tableData || []).some(
        (item) =>
          item.categoryName?.toLowerCase() === formData.categoryName?.toLowerCase() &&
          (!editingItem || item.id !== editingItem.id)
      );
      if (exists) {
        alertify.alert("Duplicate Error", "Category Name already exists!");
        duplicateError = true;
      }
    }

    return !duplicateError;
  };

  // CREATE
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!validateDuplicates()) return;

    let payload = { EntityType: selectedType };

    if (selectedType === "Currency") {
      payload = {
        CurrencyName: formData.currencyName,
        Description: formData.description,
        IsActive: formData.isActive || "Yes",
        IsDeleted: formData.isDeleted || "No",
        EntityType: "Currency",
      };
    } else if (selectedType === "VAT") {
      payload = {
        TaxPercentage: parseFloat(formData.taxPercentage),
        StartDate: formData.startDate || formData.satrtDate || null,
        EndDate: formData.endDate || null,
        Description: formData.description,
        IsActive: formData.isActive || "Yes",
        IsDeleted: formData.isDeleted || "No",
        EntityType: "VAT",
      };
    } else if (selectedType === "Category") {
      payload = {
        CategoryName: formData.categoryName,
        Description: formData.description || "",
        IsActive: formData.isActive || "Yes",
        IsDeleted: formData.isDeleted || "No",
        EntityType: "Category",
      };
    }

    setCreateLoading(true);

    dispatch(createmaster(payload))
      .unwrap()
      .then((res) => {
        alertify.alert("Success", `${selectedType} saved successfully!`);
        dispatch(getMasterList(selectedType));
        setFormData({});
        setErrors({});
      })
      .catch((err) => {
        console.error("Error saving record:", err);
        alertify.alert("Error", `Failed to save ${selectedType} record.`);
      })
      .finally(() => {
        setCreateLoading(false);
      });
  };

  // EDIT
  const handleEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);

    let mappedData = {};
    if (selectedType === "Currency") {
      mappedData = {
        currencyName: item.currencyName || "",
        description: item.description || "",
        isActive: item.isActive,
        isDeleted: item.isDeleted,
      };
    } else if (selectedType === "VAT") {
      mappedData = {
        taxPercentage: item.taxPercentage || "",
        satrtDate: formatDateInput(item.satrtDate || item.startDate),
        endDate: formatDateInput(item.endDate),
        description: item.description || "",
        isActive: item.isActive,
        isDeleted: item.isDeleted,
      };
    } else if (selectedType === "Category") {
      mappedData = {
        categoryName: item.name || "",
        description: item.description || "",
        isActive: item.isActive,
        isDeleted: item.isDeleted,
      };
    }

    setFormData(mappedData);

    // Clear only fields for this type
    if (selectedType === "Currency") {
      setErrors((prev) => ({
        ...prev,
        [errorKey("currencyName")]: "",
        [errorKey("description")]: "",
      }));
    } else if (selectedType === "VAT") {
      setErrors((prev) => ({
        ...prev,
        [errorKey("taxPercentage")]: "",
        [errorKey("satrtDate")]: "",
        [errorKey("description")]: "",
      }));
    }
  };

  // UPDATE
  const handleUpdate = (e) => {
    e.preventDefault();
    if (!selectedType || !editingItem) return;
    if (!validateForm()) return;
    if (!validateDuplicates()) return;

    let payload = { EntityType: selectedType, Id: editingItem.id };

    if (selectedType === "Currency") {
      payload.CurrencyName = formData.currencyName;
      payload.Description = formData.description;
      payload.IsActive = formData.isActive;
      payload.IsDeleted = formData.isDeleted;
    } else if (selectedType === "VAT") {
      payload.TaxPercentage = parseFloat(formData.taxPercentage);
      payload.StartDate = formData.startDate || formData.satrtDate || null;
      payload.EndDate = formData.endDate || null;
      payload.Description = formData.description;
      payload.IsActive = formData.isActive;
      payload.IsDeleted = formData.isDeleted;
    } else if (selectedType === "Category") {
      payload.CategoryName = formData.categoryName;
      payload.Description = formData.description;
      payload.IsActive = formData.isActive;
      payload.IsDeleted = formData.isDeleted;
    }

    setUpdateLoading(true);
    dispatch(updatemaster(payload))
      .unwrap()
      .then((res) => {
        debugger
        if (res?.message?.toLowerCase().includes("no changes")) {
          alertify.alert("warning", res?.message);
        } else {
          alertify.alert("Update", res?.message);
        }

        dispatch(getMasterList(selectedType));
        setFormData({});
        setEditingItem(null);
        setShowModal(false);
        setErrors({});
      })
      .catch((err) => {
        alertify.alert("Error", err);
        console.error(err);
      })
      .finally(() => setUpdateLoading(false));
  };

  // DELETE (Soft delete)
  const handleDelete = (item) => {
    debugger;
    alertify.confirm(
      "Delete Confirmation",
      `Are you sure you want to delete this ${selectedType}?`,
      () => {
        const payload = {
          EntityType: selectedType,
          Id: item.id,
          // IsDeleted: "Yes",
          // IsActive: "No",
          // Description: item.description,
        };

        // if (selectedType === "Currency") {
        //   payload.CurrencyName = item.currencyName;
        // } else if (selectedType === "VAT") {
        //   payload.TaxPercentage = item.taxPercentage;
        //   payload.SatrtDate = item.satrtDate;
        //   payload.EndDate = item.endDate;
        // }

        dispatch(deletemaster(payload))
          .unwrap()
          .then((res) => {
            if (res?.message?.toLowerCase().includes("no changes")) {
              alertify.alert("warning", res?.message);
            } else {
              alertify.alert("Update", res?.message);
            }
            alertify.alert("Deleted", " Deleted successfully");
            dispatch(getMasterList(selectedType));
          })
          .catch((err) => {
            alertify.alert("error", err);
          });
      },
      () => {
        alertify.alert("Cancelled", "Delete cancelled");
      }
    );
  };

  const getColSpan = () => {
    if (selectedType === "Currency") return 5;
    if (selectedType === "VAT") return 5;
    if (selectedType === "Category") return 4;
    return 1;
  };

  return (
    <div className="master-container">
      <div className="list-header">
        <h2 className="master-title">Master Screen</h2>

        <button
          className="help-btn"
          onClick={() => {
            if (!selectedType) {
              alertify.alert("Help", "Please select a screen type (Currency or VAT) first.");
              return;
            }
            setShowHelp(true);
          }}
        >
          <i className="fas fa-question-circle"></i> Help
        </button>
      </div>

      <div className="masterfilters-row">
        <div className="master-filter">
          <label className="filter-label">Select Type</label>
          <select value={selectedType} onChange={handleTypeChange} className="filter-select">
            <option value="">Make Selection</option>
            <option value="Currency">Currency</option>
            <option value="VAT">VAT</option>
            <option value="Category">Category</option>
          </select>
        </div>
      </div>

      {showHelp && selectedType && (
        <HelpModal
          show={showHelp}
          title={`${selectedType === "VAT" ? "VAT" : selectedType} - Help & Overview`}

          screenName={selectedType}
          onClose={() => setShowHelp(false)}
        />
      )}

      {/* CREATE FORM removed - use Add New modal to create records */}

      {/* TABLE */}
      {selectedType && (
        <div className="master-table-container">
          <div className="table-toolbar">
            <div className="records-per-page">
              <label>Records per page:</label>
              <select
                value={recordsPerPage}
                onChange={(e) => {
                  setRecordsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                {[2, 5, 10, 25].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginLeft: "auto" }}>
              {selectedType && selectedType !== "VAT" && (
                <button type="button" className="add-new-btn" onClick={openCreateModal}>
                  + Add New
                </button>
              )}
            </div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                {selectedType === "Currency" && (
                  <>
                    <th onClick={() => requestSort("currencyName")}>
                      CURRENCY {sortConfig.key === "currencyName" ? (sortConfig.direction === "asc" ? "↑" : "↓") : "↑"}
                    </th>
                    {/* <th>CURRENCY NAME</th> */}
                    <th>DESCRIPTION</th>
                    {/* <th>CREATED DATE</th>
                    <th>MODIFIED DATE</th> */}
                    <th>IS ACTIVE</th>
                    <th>IS DELETED</th>
                    <th>ACTION</th>
                  </>
                )}
                {selectedType === "Category" && (
                  <>
                    <th onClick={() => requestSort("name")}>CATEGORY NAME {sortConfig.key === "name" ? (sortConfig.direction === "asc" ? "↑" : "↓") : "↑"}</th>
                    <th>IS ACTIVE</th>
                    <th>IS DELETED</th>
                    <th>ACTION</th>
                  </>
                )}
                {selectedType === "VAT" && (
                  <>
                    <th onClick={() => requestSort("taxPercentage")}>
                      VAT % {sortConfig.key === "taxPercentage" ? (sortConfig.direction === "asc" ? "↑" : "↓") : "↑"}
                    </th>
                    {/* <th>TAX %</th> */}
                    <th>DESCRIPTION</th>
                    {/* <th>START DATE</th>
                    <th>END DATE</th> */}
                    <th>IS ACTIVE</th>
                    <th>IS DELETED</th>
                    <th>ACTION</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={getColSpan()} style={{ textAlign: "center" }}>
                    <span className="spinner"></span>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={getColSpan()} style={{ textAlign: "center" }}>
                    No records found
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr key={index}>
                    {selectedType === "Currency" && (
                      <>
                        <td>{item.currencyName}</td>
                        <td>{item.description}</td>
                        {/* <td>{formatDateDisplay(item.createdDate)}</td>
                        <td>{formatDateDisplay(item.modifiedDate)}</td> */}
                        <td>{item.isActive}</td>
                        <td>{item.isDeleted}</td>
                        {/* <td>
                          <button className="icon-btn me-2" onClick={() => handleEdit(item)}>
                            <i className="fas fa-edit" style={{ color: "blue", cursor: "pointer" }}></i>
                          </button>
                         
                          <button className="icon-btn2" onClick={() => handleDelete(item)}>
                            <i className="fas fa-trash" style={{ color: "red", cursor: "pointer" }}></i>
                          </button>
                        </td> */}

                        <td className="actions-cell">
                          <div className="action-master">
                            <FaEdit
                              style={{ cursor: 'pointer' }}
                              className="action-icon edit-icon"
                              title="Edit"
                              onClick={() => handleEdit(item)}
                            />
                            <button
                              className={`icon-btn delete ${item.isDeleted === "Yes" ? "invisible" : ""}`}
                              onClick={() => handleDelete(item)}
                              disabled={item.isDeleted === "Yes"}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>

                      </>
                    )}
                    {selectedType === "VAT" && (
                      <>
                        <td style={{ width: "8%", textAlign: "right" }}>{item.taxPercentage}</td>
                        <td>{item.description}</td>
                        {/* <td>{formatDateDisplay(item.satrtDate)}</td>
                        <td>{formatDateDisplay(item.endDate)}</td> */}
                        <td>{item.isActive}</td>
                        <td>{item.isDeleted}</td>

                        <td className="actions-cell">
                          <div className="action-master">
                            <button className="icon-btn me-2" onClick={() => handleEdit(item)}>
                              <i className="fas fa-edit"></i>
                            </button>
                            {item.isDeleted === "No" && (
                              <button className="icon-btn" onClick={() => handleDelete(item)}>
                                <i className="fas fa-trash" style={{ color: "red", cursor: "pointer" }}></i>
                              </button>
                            )}
                          </div>
                        </td>

                      </>
                    )}
                    {selectedType === "Category" && (
                      <>
                        <td>{item.name}</td>
                        <td>{item.isActive}</td>
                        <td>{item.isDeleted}</td>
                        <td className="actions-cell">
                          <div className="action-master">
                            <FaEdit
                              style={{ cursor: 'pointer' }}
                              className="action-icon edit-icon"
                              title="Edit"
                              onClick={() => handleEdit(item)}
                            />
                            <button
                              className={`icon-btn delete ${item.isDeleted === "Yes" ? "invisible" : ""}`}
                              onClick={() => handleDelete(item)}
                              disabled={item.isDeleted === "Yes"}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* <div className="pagination">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)} className={currentPage === i + 1 ? "active" : ""}>
                {i + 1}
              </button>
            ))}
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
              Next
            </button>
          </div> */}

          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={currentPage === i + 1 ? "active" : ""}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="mastermodal-overlay">
          <div className="mastermodal-content">
            <div
              className="modal-close-btn"
              onClick={() => {
                setShowModal(false);
                setEditingItem(null);
                setFormData({});
                setErrors({});
              }}
            >
              &times;
            </div>
            <h3>{modalMode === "create" ? `Add ${selectedType}` : `Edit ${selectedType === "VAT" ? "VAT" : selectedType}`}</h3>

            <form onSubmit={modalMode === "create" ? handleSubmit : handleUpdate}>
              {selectedType === "Currency" && (
                <>
                  <div className="typeform-row">
                    <div className="typeform-group">
                      <label>
                        Currency Name <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="currencyName"
                        value={formData.currencyName || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          const regex = /^[A-Za-z\s]*$/;
                          if (regex.test(value)) {
                            setFormData({ ...formData, currencyName: value });
                            setErrors((prev) => ({
                              ...prev,
                              [errorKey("currencyName")]: value.trim() ? "" : "Currency is required",
                            }));
                          }
                        }}
                        className={getError("currencyName") ? "error-input" : ""}
                      />
                      {getError("currencyName") && <p className="error-message">{getError("currencyName")}</p>}
                    </div>

                    <div className="typeform-group">
                      <label>
                        Description <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="description"
                        value={formData.description || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, description: value });
                          setErrors((prev) => ({
                            ...prev,
                            [errorKey("description")]: value.trim() ? "" : "Description is required",
                          }));
                        }}
                        className={getError("description") ? "error-input" : ""}
                      />
                      {getError("description") && <p className="error-message">{getError("description")}</p>}
                    </div>
                  </div>

                  {/* <div className="radio-group-row">
                    <div className="radio-group">
                      <label>Is Active</label>
                      <div>
                        <label>
                          <input
                            type="radio"
                            name="isActive"
                            value="Yes"
                            checked={formData.isActive === "Yes"}
                            onChange={handleInputChange}
                          />{" "}
                          Yes
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="isActive"
                            value="No"
                            checked={formData.isActive === "No"}
                            onChange={handleInputChange}
                          />{" "}
                          No
                        </label>
                      </div>
                    </div>

                    <div className="radio-group">
                      <label>Is Deleted</label>
                      <div>
                        <label>
                          <input
                            type="radio"
                            name="isDeleted"
                            value="Yes"
                            checked={formData.isDeleted === "Yes"}
                            onChange={handleInputChange}
                          />{" "}
                          Yes
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="isDeleted"
                            value="No"
                            checked={formData.isDeleted === "No"}
                            onChange={handleInputChange}
                          />{" "}
                          No
                        </label>
                      </div>
                    </div>
                  </div> */}
                  <div className="typeform-row">
                    <div className="typeform-group">
                      <label>Is Active <span className="required">*</span></label>
                      <select
                        name="isActive"
                        value={formData.isActive || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, isActive: value });
                          setFieldError("isActive", value ? "" : "Is Active is required");
                        }}
                        className={getError("isActive") ? "input-error" : ""}
                      >
                        <option value="">Select Is Active</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                      {getError("isActive") && (
                        <p className="error-message">{getError("isActive")}</p>
                      )}
                      {getError.isActive && <p className="error-message">{getError.isActive}</p>}
                    </div>

                    {/* Is Deleted */}
                    <div className="typeform-group">
                      <label>Is Deleted <span className="required">*</span></label>
                      <select
                        name="isDeleted"
                        value={formData.isDeleted || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, isDeleted: value });
                          setFieldError("isDeleted", value ? "" : "Is Deleted is required");
                        }}
                        className={getError("isDeleted") ? "input-error" : ""}
                      >
                        <option value="">Select Is Deleted</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                      {getError("isDeleted") && (
                        <p className="error-message">{getError("isDeleted")}</p>
                      )}

                      {getError.isDeleted && <p className="error-message">{getError.isDeleted}</p>}
                    </div>
                  </div>
                </>
              )}

              {selectedType === "VAT" && (
                <>
                  <div className="typeform-row">
                    <div className="typeform-group">
                      <label>
                        VAT Percentage(%) <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="taxPercentage"
                        value={formData.taxPercentage || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          const regex = /^(?:\d{1,2}(?:\.\d{0,2})?)?$/;
                          if (value === "" || regex.test(value)) {
                            setFormData({ ...formData, taxPercentage: value });
                            setErrors((prev) => ({
                              ...prev,
                              [errorKey("taxPercentage")]: value.trim() ? "" : "Vat Percentage is required",
                            }));
                          }
                        }}
                        className={getError("taxPercentage") ? "error-input" : ""}
                        placeholder="Enter tax percentage"
                      />
                      {getError("taxPercentage") && <p className="error-message">{getError("taxPercentage")}</p>}
                    </div>

                    <div className="typeform-group">
                      <label>Description<span className="required">*</span></label>
                      <input
                        type="text"
                        name="description"
                        value={formData.description || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, description: value });
                          setErrors((prev) => ({
                            ...prev,
                            [errorKey("description")]: value.trim() ? "" : "Description is required",
                          }));
                        }}
                        className={getError("description") ? "error-input" : ""}
                      />
                      {getError("description") && <p className="error-message">{getError("description")}</p>}
                    </div>
                  </div>

                  {/* <div className="typeform-row">

                    <div className="typeform-group">
                      <label>Start Date<span className="required">*</span></label>
                      <input
                        type="date"
                        name="satrtDate"
                        value={formData.satrtDate || ""}
                        onChange={(e) => {
                          handleInputChange(e);
                          setErrors((prev) => ({ ...prev, [errorKey("satrtDate")]: "" }));
                        }}
                      />
                    </div>
                    <div className="typeform-group">
                      <label>End Date<span className="required">*</span></label>
                      <input type="date" name="endDate" value={formData.endDate || ""} onChange={handleInputChange} />
                    </div>


                  </div> */}

                  {/* <div className="radio-group-row">
                    <div className="radio-group">
                      <label>Is Active</label>
                      <div>
                        <label>
                          <input
                            type="radio"
                            name="isActive"
                            value="Yes"
                            checked={formData.isActive === "Yes"}
                            onChange={handleInputChange}
                          />{" "}
                          Yes
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="isActive"
                            value="No"
                            checked={formData.isActive === "No"}
                            onChange={handleInputChange}
                          />{" "}
                          No
                        </label>
                      </div>
                    </div>

                    <div className="radio-group">
                      <label>Is Deleted</label>
                      <div>
                        <label>
                          <input
                            type="radio"
                            name="isDeleted"
                            value="Yes"
                            checked={formData.isDeleted === "Yes"}
                            onChange={handleInputChange}
                          />{" "}
                          Yes
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="isDeleted"
                            value="No"
                            checked={formData.isDeleted === "No"}
                            onChange={handleInputChange}
                          />{" "}
                          No
                        </label>
                      </div>
                    </div>
                  </div> */}

                  <div className="typeform-row">
                    <div className="typeform-group">
                      <label>Is Active <span className="required">*</span></label>
                      <select
                        name="isActive"
                        value={formData.isActive || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, isActive: value });
                          setFieldError("isActive", value ? "" : "Is Active is required");
                        }}
                        className={getError("isActive") ? "input-error" : ""}
                      >
                        <option value="">Select Is Active</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                      {getError("isActive") && (
                        <p className="error-message">{getError("isActive")}</p>
                      )}

                      {getError.isActive && <p className="error-message">{getError.isActive}</p>}
                    </div>

                    {/* Is Deleted */}
                    <div className="typeform-group">
                      <label>Is Deleted <span className="required">*</span></label>
                      <select
                        name="isDeleted"
                        value={formData.isDeleted || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, isDeleted: value });
                          setFieldError("isDeleted", value ? "" : "Is Deleted is required");
                        }}
                        className={getError("isDeleted") ? "input-error" : ""}
                      >
                        <option value="">Select Is Deleted</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                      {getError("isDeleted") && (
                        <p className="error-message">{getError("isDeleted")}</p>
                      )}

                      {getError.isDeleted && <p className="error-message">{getError.isDeleted}</p>}
                    </div>
                  </div>
                </>
              )}

              {selectedType === "Category" && (
                <>
                  <div className="typeform-row">
                    <div className="typeform-group">
                      <label>
                        Category Name <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="categoryName"
                        value={formData.categoryName || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, categoryName: value });
                          setErrors((prev) => ({
                            ...prev,
                            [errorKey("categoryName")]: value.trim() ? "" : "Category Name is required",
                          }));
                        }}
                        className={getError("categoryName") ? "error-input" : ""}
                      />
                      {getError("categoryName") && <p className="error-message">{getError("categoryName")}</p>}
                    </div>
                  </div>

                  <div className="typeform-row">
                    <div className="typeform-group">
                      <label>Is Active <span className="required">*</span></label>
                      <select
                        name="isActive"
                        value={formData.isActive || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, isActive: value });
                          setFieldError("isActive", value ? "" : "Is Active is required");
                        }}
                        className={getError("isActive") ? "input-error" : ""}
                      >
                        <option value="">Select Is Active</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                      {getError("isActive") && (
                        <p className="error-message">{getError("isActive")}</p>
                      )}
                    </div>

                    <div className="typeform-group">
                      <label>Is Deleted <span className="required">*</span></label>
                      <select
                        name="isDeleted"
                        value={formData.isDeleted || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, isDeleted: value });
                          setFieldError("isDeleted", value ? "" : "Is Deleted is required");
                        }}
                        className={getError("isDeleted") ? "input-error" : ""}
                      >
                        <option value="">Select Is Deleted</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                      {getError("isDeleted") && (
                        <p className="error-message">{getError("isDeleted")}</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="master-buttons">
                <button
                  type="submit"
                  className="btn btn-success btn-lg"
                  disabled={modalMode === "create" ? createLoading : updateLoading}
                >
                  {(modalMode === "create" ? createLoading : updateLoading) && <span className="spinner"></span>}
                  {modalMode === "create" ? " Save" : " Update"}
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-lg"
                  onClick={() => {
                    setShowModal(false);
                    setEditingItem(null);
                    setFormData({});
                    setErrors({});
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterData;
