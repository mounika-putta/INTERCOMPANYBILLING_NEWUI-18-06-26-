import React, { useState, useEffect } from "react";
import { AxiosInstance } from "../../services/api";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import "alertifyjs/build/css/themes/default.css";
import "./Roles.css";
import Button from "../../components/Common/Button";
import HelpModal from "../../components/Common/HelpModal";
import Pagination from "../../components/Common/Pagination";
import { FaEdit, FaTrash } from "react-icons/fa";

const Roles = () => {
  const [showCreateScreen, setShowCreateScreen] = useState(false);
  const [showEditScreen, setShowEditScreen] = useState(false);
  const [items, setItems] = useState([]);
  const [showHelp, setShowHelp] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Loaders
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  // New Item state
  const [newItem, setNewItem] = useState({
    RoleName: "",
    RoleDescription: "",
    IsActive: "",
    IsDeleted: "",
  });

  // Validation state
  const [errors, setErrors] = useState({
    RoleName: "",
    RoleDescription: "",
    IsActive: "",
    IsDeleted: "",
    duplicate: "",
  });

  // Edit Item state
  const [editItem, setEditRole] = useState({
    Id: "",
    RoleName: "",
    RoleDescription: "",
    IsActive: "",
    IsDeleted: "",
  });

  // Validation state for Edit form
  const [editErrors, setEditErrors] = useState({
    RoleName: "",
    RoleDescription: "",
    IsActive: "",
    IsDeleted: "",
    duplicate: "",
  });

  // Filters (applied)
  const [filters, setFilters] = useState({
    RoleName: "",
    RoleDescription: "",
    IsActive: "",
    IsDeleted: "",
  });

  // Temporary filter inputs (before Apply)
  const [tempFilters, setTempFilters] = useState({
    RoleName: "",
    RoleDescription: "",
    IsActive: "",
    IsDeleted: "",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);

  // Sorting (only RoleName)
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const requestSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  // Fetch roles from API
  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get("/api/Roles/getRolesList");
      if (response.data && response.data.list) {
        setItems(Array.isArray(response.data.list) ? response.data.list : []);
      } else {
        setItems([]);
        console.error("List not found in response");
      }
    } catch (error) {
      console.error("Error fetching Roles:", error);
      alertify.error("Failed to load Roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // normalization helper
  const norm = (v) => (v === null || v === undefined ? "" : String(v).trim().toLowerCase());

  // Filtered data (applied filters)
  const filteredData = React.useMemo(() => {
    return items.filter((d) => {
      const fName = norm(filters.RoleName);
      const fDesc = norm(filters.RoleDescription);
      const fActive = norm(filters.IsActive);
      const fDeleted = norm(filters.IsDeleted);

      const dName = norm(d.RoleName ?? d.roleName);
      const dDesc = norm(d.RoleDescription ?? d.roleDescription);
      const dActive = norm(d.IsActive ?? d.isActive);
      const dDeleted = norm(d.IsDeleted ?? d.isDeleted);

      const nameMatch = !fName || dName.includes(fName);
      const descMatch = !fDesc || dDesc.includes(fDesc);
      const activeMatch = !fActive || dActive === fActive || dActive.includes(fActive);
      const deletedMatch = !fDeleted || dDeleted === fDeleted || dDeleted.includes(fDeleted);

      return nameMatch && descMatch && activeMatch && deletedMatch;
    });
  }, [items, filters]);

  // Sorted data (only when sorting by RoleName)
  const sortedData = React.useMemo(() => {
    if (!Array.isArray(filteredData)) return [];

    if (sortConfig.key !== "RoleName") return filteredData.slice();

    const direction = sortConfig.direction === "desc" ? -1 : 1;

    return filteredData
      .slice()
      .sort((a, b) => {
        const aName = (a.RoleName ?? a.roleName ?? "").toString().trim().toLowerCase();
        const bName = (b.RoleName ?? b.roleName ?? "").toString().trim().toLowerCase();
        if (aName < bName) return -1 * direction;
        if (aName > bName) return 1 * direction;
        return 0;
      });
  }, [filteredData, sortConfig]);

  // Pagination calculations (single source of truth)
  const totalRecords = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / recordsPerPage));

  // keep currentPage valid when totalPages or recordsPerPage change
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedData.slice(indexOfFirstRecord, indexOfLastRecord);

  // Pagination change handler
  const handlePageChange = (page) => {
    const p = Number(page) || 1;
    if (p < 1) setCurrentPage(1);
    else if (p > totalPages) setCurrentPage(totalPages);
    else setCurrentPage(p);
  };

  // Apply/Clear filters
  const handleApplyFilters = () => {
    setFilters({
      RoleName: tempFilters.RoleName?.trim() ?? "",
      RoleDescription: tempFilters.RoleDescription?.trim() ?? "",
      IsActive: tempFilters.IsActive ?? "",
      IsDeleted: tempFilters.IsDeleted ?? "",
    });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    const cleared = { RoleName: "", RoleDescription: "", IsActive: "", IsDeleted: "" };
    setTempFilters(cleared);
    setFilters(cleared);
    setCurrentPage(1);
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    setCreateLoading(true); // start loader

    let newErrors = {};
    if (!newItem.RoleName.trim()) newErrors.RoleName = "Role Name is required";
    if (!newItem.RoleDescription.trim())
      newErrors.RoleDescription = "Role Description is required";

    const isDuplicate = items.some(
      (item) =>
        (item.roleName || "").toLowerCase() === newItem.RoleName.trim().toLowerCase()
    );

    if (isDuplicate) {
      alertify.alert("Error", "Role already exists!");
      setCreateLoading(false);
      return; // stop save process
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setCreateLoading(false); // stop loader if validation fails
      return;
    }

    try {
      const response = await AxiosInstance.post("/api/Roles/SaveRoles", newItem);
      if (response.data.success) {
        alertify.alert("Create", "Role created successfully!").show();
        setShowCreateModal(false);
        setCreateLoading(false);
        setNewItem({ RoleName: "", RoleDescription: "", IsActive: "" });
        setErrors({});
        fetchItems();
      } else {
        alertify.alert("error", response.data.message || "Failed to create role");
      }
    } catch (error) {
      console.error("Error saving role:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create role";
      alertify.error(message);
    } finally {
      setCreateLoading(false); // stop loader
    }
  };

  const handleEditItem = async (e) => {
    debugger;
    e.preventDefault();
    setUpdateLoading(true);

    // Client-side validation
    const newEditErrors = {};
    if (!editItem.RoleName || !editItem.RoleName.trim()) {
      newEditErrors.RoleName = "Role name is required";
    }
    if (!editItem.RoleDescription || !editItem.RoleDescription.trim()) {
      newEditErrors.RoleDescription = "Role description is required";
    }
    if (!editItem.IsActive || editItem.IsActive === "") {
      newEditErrors.IsActive = "Please select Active status";
    }
    if (!editItem.IsDeleted || editItem.IsDeleted === "") {
      newEditErrors.IsDeleted = "Please select Deleted status";
    }

    // Duplicate check: make sure another role (different id) doesn't have the same name
    // const duplicate = items.some(
    //   (role) =>
    //     Number(role.id) !== Number(editItem.Id) &&
    //     (role.roleName || "").trim().toLowerCase() ===
    //     (editItem.RoleName || "").trim().toLowerCase()
    // );

    // if (duplicate) {
    //   alertify.alert('Message', "Role name already exists");
    //   setUpdateLoading(false);
    //   return;
    // }


    if (Object.keys(newEditErrors).length > 0) {
      setEditErrors(newEditErrors);
      setUpdateLoading(false);
      // Scroll to top of form or focus first error input (optional)
      return;
    }

    // If validation passed, continue with API call
    try {
      debugger;

      const response = await AxiosInstance.post(
        `/api/Roles/UpdateRoles/${editItem.Id}`,
        editItem
      );

      console.log("Response:", response.data);

      // ----- CHECK SUCCESS FLAG RETURNED FROM BACKEND -----
      if (response.data?.success) {
        alertify.alert("Success", response.data.message || "Role updated successfully!").show();

        fetchItems();
        setShowEditModal(false);
        setEditErrors({});
      } else {
        // API returned success = false
        alertify.alert("Error", response.data.message || "Failed to update role").show();
      }

    } catch (error) {
      console.error("Axios error object:", error);

      // ----- MODEL VALIDATION ERRORS -----
      if (error.response?.data?.errors) {
        const apiErrors = {};
        const errObj = error.response.data.errors;

        if (errObj.RoleName) apiErrors.RoleName = errObj.RoleName.join(" ");
        if (errObj.RoleDescription)
          apiErrors.RoleDescription = errObj.RoleDescription.join(" ");

        setEditErrors(apiErrors);
        alertify.alert("Validation Error", "Please fix the errors.").show();
      }

      // ----- SIMPLE MESSAGE ERROR -----
      else if (error.response?.data?.message) {
        alertify.alert("Error", error.response.data.message).show();
      }

      // ----- NETWORK ERROR -----
      else if (error.request) {
        alertify.alert("Network Error", "Could not reach API").show();
      }

      // ----- ALL OTHER ERRORS -----
      else {
        alertify.alert("Error", error.message).show();
      }

    } finally {
      setUpdateLoading(false);
    }

  };
  // Delete role
  const handleDelete = async (id) => {
    alertify.confirm(
      "Delete Role",
      "Are you sure you want to delete this role?",
      async function () {
        try {
          const response = await AxiosInstance.post(`/api/Roles/DeleteRoles/${id}`);
          if (response.data?.success) {
            fetchItems();
            alertify.alert("Delete", response.data.message || "Role deleted successfully").show();
          } else {
            alertify.error(response.data?.message || "Failed to delete role");
          }
        } catch (error) {
          console.error("Error deleting role:", error);
          alertify.alert("Error", "Error while deleting role").show();
        }
      },
      function () {
        alertify.alert("Error", "Delete cancelled");
      }
    );
  };

  return (
    <div className="role-container">
      <div className="role-content">
        {/* LIST SCREEN */}
        {!showCreateScreen && !showEditScreen && (
          <div className="role-section">
            <div className="list-header">
              <h3 className="customer-title">Roles</h3>
              <button className="help-btn" onClick={() => setShowHelp(true)}>
                <i className="fas fa-question-circle"></i> Help
              </button>
            </div>

            {/* Filters */}
            <div className="filter-section">
              <input
                type="text"
                value={tempFilters.RoleName}
                onChange={(e) => setTempFilters({ ...tempFilters, RoleName: e.target.value })}
                placeholder="Role Name"
              />
              <input
                type="text"
                value={tempFilters.RoleDescription}
                onChange={(e) => setTempFilters({ ...tempFilters, RoleDescription: e.target.value })}
                placeholder="Role Description"
              />
              <select
                value={tempFilters.IsActive}
                onChange={(e) => setTempFilters({ ...tempFilters, IsActive: e.target.value })}
              >
                <option value="">Select Active</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>

              <button className="filter-btn" onClick={handleApplyFilters}>Filter</button>
              <button className="clear-btn" onClick={handleClearFilters}>Clear</button>
            </div>

            {/* Add New Button */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "10px 0",
              }}
            >
              {/* Records per page - Left */}
              <div className="records-per-page">
                Records per page:
                <select
                  value={recordsPerPage}
                  onChange={(e) => {
                    setRecordsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  style={{ marginLeft: "8px" }}
                >
                  {[2, 5, 10, 25].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              {/* Add New Role Button - Right */}

              <button
                className="btn_add"
                // style={{ backgroundColor: "#1E7D4E", color: "white", border: "none" }}
                onClick={() => setShowCreateModal(true)}
              >
                + Add New
              </button>
            </div>
            <br />

            {/* Roles Table */}
            <table className="data-table">
              <thead>
                <tr>
                  <th
                    style={{ cursor: "pointer" }}
                    onClick={() => requestSort("RoleName")}
                  >
                    ROLE NAME{" "}
                    {sortConfig.key === "RoleName"
                      ? sortConfig.direction === "asc"
                        ? "↑"
                        : "↓"
                      : "↑"}
                  </th>
                  <th>ROLE DESCRIPTION</th>
                  <th>IS ACTIVE</th>
                  <th>IS DELETED</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      <div className="loader"></div>
                    </td>
                  </tr>
                ) : currentRecords.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No roles found
                    </td>
                  </tr>
                ) : (
                  currentRecords.map((dept) => (
                    <tr key={dept.id}>
                      <td>{dept.roleName ?? dept.RoleName}</td>
                      <td>{dept.roleDescription ?? dept.RoleDescription}</td>
                      <td>{dept.isActive ?? dept.IsActive}</td>
                      <td>{dept.isDeleted ?? dept.IsDeleted}</td>
                      <td>
                        <FaEdit
                          style={{ cursor: 'pointer' }}
                          className="action-icon edit-icon"
                          title="Edit"
                          onClick={() => {
                            setEditRole({
                              Id: dept.id,
                              RoleName: dept.roleName ?? dept.RoleName,
                              RoleDescription: dept.roleDescription ?? dept.RoleDescription,
                              IsActive: dept.isActive ?? dept.IsActive,
                              IsDeleted: dept.isDeleted ?? dept.IsDeleted,
                            });
                            setEditErrors({});
                            setShowEditModal(true);
                          }}
                        />

                        &nbsp;
                        {String(dept.isDeleted ?? dept.IsDeleted).toLowerCase() !== "yes" && (
                          <FaTrash style={{ cursor: 'pointer' }}
                            className="action-icon cancel-icon"
                            title="Delete"
                            onClick={() => handleDelete(dept.id)}
                          />
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {!loading && totalRecords > 0 && (
              <Pagination
                currentPage={currentPage}
                totalItems={totalRecords}
                itemsPerPage={recordsPerPage}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        )}

        {/* CREATE ITEM SCREEN */}
        {showCreateModal && (
          <div className="modal-overlay">
            <div className="role-modal">
              <div className="modal-header">
                <h3>Create Role</h3>
                <button onClick={() => setShowCreateModal(false)}>✕</button>
              </div>

              <form onSubmit={handleCreateItem}>
                <div className="formlabel-group">
                  <label>Role Name *</label>
                  <input
                    type="text"
                    value={newItem.RoleName}
                    onChange={(e) =>
                      setNewItem({ ...newItem, RoleName: e.target.value })
                    }
                  />
                  {errors.RoleName && (
                    <p className="error-message">{errors.RoleName}</p>
                  )}
                </div>

                <div className="formlabel-group">
                  <label>Role Description *</label>
                  <input
                    type="text"
                    value={newItem.RoleDescription}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        RoleDescription: e.target.value,
                      })
                    }
                  />
                  {errors.RoleDescription && (
                    <p className="error-message">{errors.RoleDescription}</p>
                  )}
                </div>

                <div className="Role-actions">
                  <button type="submit" className="btn btn-success">
                    Save
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* EDIT ITEM SCREEN */}
        

        {showEditModal && (
          <div className="modal-overlay">
            <div className="role-modal">
              <div className="modal-header">
                <h3>Edit Role</h3>
                <button onClick={() => setShowEditModal(false)}>✕</button>
              </div>

              <form onSubmit={handleEditItem} className="create-item-form-row">
                {/* Role Name */}
                <div className="formlabel-group">
                  <label>Role Name <span className="required">*</span></label>
                  <input
                    type="text"
                    value={editItem.RoleName || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[a-zA-Z0-9\s]*$/.test(value)) {
                        setEditRole({ ...editItem, RoleName: value });
                      }
                      setEditErrors((prev) => ({ ...prev, RoleName: value.trim() === "" ? "Role Name is required" : "" }));
                    }}
                    onBlur={() => {
                      const value = editItem.RoleName || "";
                      setEditErrors((prev) => ({ ...prev, RoleName: value.trim() === "" ? "Role Name is required" : "" }));
                    }}
                    className={editErrors.RoleName ? "input-error" : ""}
                  />
                  {editErrors.RoleName && <p className="error-message">{editErrors.RoleName}</p>}
                </div>

                {/* Role Description */}
                <div className="formlabel-group">
                  <label>Role Description <span className="required">*</span></label>
                  <input
                    type="text"
                    value={editItem.RoleDescription || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setEditRole({ ...editItem, RoleDescription: value });
                      setEditErrors((prev) => ({ ...prev, RoleDescription: value.trim() === "" ? "Role Description is required" : "" }));
                    }}
                    onBlur={() => {
                      const value = editItem.RoleDescription || "";
                      setEditErrors((prev) => ({ ...prev, RoleDescription: value.trim() === "" ? "Role Description is required" : "" }));
                    }}
                    className={editErrors.RoleDescription ? "input-error" : ""}
                  />
                  {editErrors.RoleDescription && <p className="error-message">{editErrors.RoleDescription}</p>}
                </div>

                <div className="formlabel-group">
                  <label>Is Active <span className="required">*</span></label>
                  <select
                    value={editItem.IsActive ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditRole(prev => ({ ...prev, IsActive: val }));
                      setEditErrors(prev => ({ ...prev, IsActive: val === "" ? "Please select status" : "" }));
                    }}
                    onBlur={(e) => {
                      const val = e.target.value;
                      setEditErrors(prev => ({ ...prev, IsActive: val === "" ? "Please select status" : "" }));
                    }}
                    className={editErrors.IsActive ? "input-error" : ""}
                  >
                    <option value="">Select Is Active</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  {editErrors.IsActive && <p className="error-message">{editErrors.IsActive}</p>}
                </div>

                <div className="formlabel-group">
                  <label>Is Deleted <span className="required">*</span></label>
                  <select
                    value={editItem.IsDeleted ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditRole(prev => ({ ...prev, IsDeleted: val }));
                      setEditErrors(prev => ({ ...prev, IsDeleted: val === "" ? "Please select status" : "" }));
                    }}
                    onBlur={(e) => {
                      const val = e.target.value;
                      setEditErrors(prev => ({ ...prev, IsDeleted: val === "" ? "Please select status" : "" }));
                    }}
                    className={editErrors.IsDeleted ? "input-error" : ""}
                  >
                    <option value="">Select Is Deleted</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  {editErrors.IsDeleted && <p className="error-message">{editErrors.IsDeleted}</p>}
                </div>

                {editErrors.duplicate && <p className="error-message">{editErrors.duplicate}</p>}

                <div className="Role-actions">
                  <button type="submit" className="btn btn-success btn-lg" disabled={updateLoading}>
                    {updateLoading ? <>Update <span className="button-loader"></span></> : "Update"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger btn-lg"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditErrors({});
                      setEditRole({ Id: "", RoleName: "", RoleDescription: "", IsActive: "", IsDeleted: "" });
                    }}
                    disabled={updateLoading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <HelpModal show={showHelp} title="Roles - Help & Overview" screenName="Roles" onClose={() => setShowHelp(false)} />
      </div>
    </div>
  );
};

export default Roles;
