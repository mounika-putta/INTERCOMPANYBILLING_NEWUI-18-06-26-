import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles, fetchCompanies, fetchUserByEmail } from "../../redux/EditProfileSlice";
import { fetchupdateUser, getuserslist } from "../../redux/UsersListSlice";
import alertify from "alertifyjs";
import "./EditProfile.css";

const EditProfile = () => {
  const dispatch = useDispatch();
  const { roles, companies, user } = useSelector(
    (state) => state.editProfile
  );

  const sessionEmail = sessionStorage.getItem("useremail");

  const [errors, setErrors] = useState({});
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    name: "",
    surName: "",
    gender: "",
    email: "",
    mobile: "",
    userName: "",
    address: "",
    roleId: "",
    companyId: "",
    IsActive: "",
    IsDeleted: "",
  });

  
  const [initialFormData, setInitialFormData] = useState(null);

  /*  FETCH DATA  */
  useEffect(() => {
    dispatch(fetchRoles());
    dispatch(fetchCompanies());
    if (sessionEmail) {
      dispatch(fetchUserByEmail(sessionEmail));
    }
  }, [dispatch, sessionEmail]);

  /* SET FORM DATA */
  useEffect(() => {
    if (user) {
      const data = {
        id: user.id || "",
        title: user.title || "",
        name: user.name || "",
        surName: user.surName || "",
        gender: user.gender || "",
        email: user.email || "",
        mobile: user.mobile || "",
        address: user.address || "",
        userName: user.userName || "",
        roleId: user.roleId || "",
        companyId: user.companyName || "",
        IsActive: user.isActive || "",
        IsDeleted: user.isDeleted || "",
      };

      setFormData(data);         
      setInitialFormData(data);   
    }
  }, [user]);

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* CANCEL BUTTON  */
  const handleEditClose = () => {
    if (initialFormData) {
      setFormData(initialFormData); 
    }
    setErrors({});
  };

 
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    const mobileRegex = /^[0-9]{10}$/;

    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.surName) newErrors.surName = "Surname is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.userName) newErrors.userName = "Username is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.roleId) newErrors.roleId = "Role is required";
    if (!formData.companyId) newErrors.companyId = "Company is required";
    if (!formData.IsActive) newErrors.IsActive = "IsActive is required";
    if (!formData.IsDeleted) newErrors.IsDeleted = "IsDeleted is required";

    if (!formData.mobile || !mobileRegex.test(formData.mobile)) {
      newErrors.mobile = "Mobile must be 10 digits";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payload = {
      Id: formData.id,
      Title: formData.title,
      Name: formData.name,
      SurName: formData.surName,
      Gender: formData.gender,
      Address: formData.address,
      Mobile: formData.mobile,
      UserName: formData.userName,
      Email: formData.email,
      RoleId: Number(formData.roleId),
      CompanyName: Number(formData.companyId),
      IsActive: formData.IsActive,
      IsDeleted: formData.IsDeleted,
    };

    try {
      setLoadingUpdate(true);

      const response = await dispatch(fetchupdateUser(payload)).unwrap();

      alertify.alert(
        "Success",
        response?.message || "Updated successfully"
      );

      dispatch(getuserslist());
      setErrors({});
    } catch (err) {
      alertify.alert("Error", err?.message || "No changes found");
    } finally {
      setLoadingUpdate(false);
    }
  };


  return (
    <div className="edit-profile-container">
      <h2 className="text-center text-green-700">Edit Profile</h2>

      <form onSubmit={handleEditSubmit}>
         <input type="hidden" name="id" value={formData.id} />

        {/* Title */}
        <div className="editform-row">
          <label>Title <span className="required">*</span></label>
          <select name="title" value={formData.title} onChange={handleChange} required >
            <option value="">Select Title</option>
            <option value="Miss">Miss</option>
            <option value="Mr">Mr</option>
            <option value="Mrs">Mrs</option>
          </select>
        </div>

        {/* Name */}
        <div className="editform-row">
         
           <label>Name <span className="required">*</span></label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required  />
        </div>

        {/* Surname */}
        <div className="editform-row">
          <label>Surname <span className="required">*</span></label>
          <input type="text" name="surName" value={formData.surName} onChange={handleChange} required />
        </div>

        {/* Gender */}
        <div className="editform-row">
          <label>Gender <span className="required">*</span></label>
          <select name="gender" value={formData.gender} onChange={handleChange} required >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Email */}
      <div className="editform-row"><label>Email</label>
      <input type="email"value={formData.email || ""} readOnly style={{ backgroundColor: "rgb(233, 236, 239)" }}
     />
    </div>


        {/* Mobile */}
        <div className="editform-row">
          <label>Mobile <span className="required">*</span></label>
          <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Enter 10-digit mobile number" maxLength={10} pattern="\d{10}"required/>
        </div>

        {/* Username */}
        <div className="editform-row">
          <label>Username<span className="required">*</span></label>
          <input type="text" name="userName" value={formData.userName} onChange={handleChange} required />
        </div>

        {/* Address */}
        <div className="editform-row">
          <label>Address<span className="required">*</span></label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />
        </div>

        {/* Role */}
        <div className="editform-row">
          <label>Role <span className="required">*</span></label>
          <select name="roleId" value={formData.roleId} onChange={handleChange}required >
            <option value="">Select Role</option>
            {roles.map(r => (
              <option key={r.id} value={r.id}>{r.roleName}</option>
            ))}
          </select>
        </div>

        {/* Company */}
        <div className="editform-row">
          <label>Company <span className="required">*</span></label>
          <select name="companyId" value={formData.companyId} onChange={handleChange} required >
            <option value="">Select Company</option>
            {companies.map(c => (
              <option key={c.id} value={c.id}>{c.companyName}</option>
            ))}
          </select>
        </div>

        <div className="editform-row">
          <label>Is Active <span className="required">*</span></label>
          <select name="IsActive" value={formData.IsActive} onChange={handleChange} required >
            <option value="">Select Is Active</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

         <div className="editform-row">
          <label>Is Deleted <span className="required">*</span></label>
          <select name="IsDeleted" value={formData.IsDeleted} onChange={handleChange} required >
            <option value="">Select Is Deleted</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>


        {/* Submit */}
        {/* <div className="form-actions">
          <button type="submit">Edit</button>
        </div> */}

         <div className="form-editactions">
             <button type="submit" className="useredit-update-btn" disabled={loadingUpdate}>
                  {loadingUpdate ? <span className="button-loader"></span> : ""} Update
                </button>
                <button type="button" className="useredit-cancel-btn"
                  onClick={handleEditClose}
                >Cancel</button>
              </div>

      </form>
    </div>
  );
};

export default EditProfile;
