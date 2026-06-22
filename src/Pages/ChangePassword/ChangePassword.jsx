import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import alertify from "alertifyjs";
import "./ChangePassword.css";
import { changePassword, resetChangePasswordState } from "../../redux/ChangePasswordSlice";

const ChangePassword = () => {
    const dispatch = useDispatch();
    const { loading, success, error } = useSelector(
        (state) => state.changePassword
    );

    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userId, setUserId] = useState("");

    useEffect(() => {
        const storedUserName = sessionStorage.getItem("userName");
        const storedUserId = sessionStorage.getItem("userId");
        // const storedpassword = sessionStorage.getItem("password");

        if (storedUserName) setUsername(storedUserName);
        if (storedUserId) setUserId(storedUserId);
        // if (storedpassword) setOldPassword(storedpassword);
    }, []);

    // ✅ Handle success / error
    useEffect(() => {
        debugger
        if (success) {
            alertify.alert('Success', "Password changed successfully!", function () {
                setNewPassword("");
                setOldPassword("");
                setConfirmPassword("");
                setShowPassword(false)
                dispatch(resetChangePasswordState());
            });
        }

        if (error) {
            alertify.alert('error',error);
            dispatch(resetChangePasswordState());
        }
    }, [success, error, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!oldPassword) {
            alertify.alert('Warning',"Please enter your old password");
            return;
        }

        if (!newPassword) {
            alertify.alert('Warning',"Please enter new password");
            return;
        }

        if (!confirmPassword) {
            alertify.alert('Warning',"Please confirm new password");
            return;
        }

        if (newPassword !== confirmPassword) {
            alertify.alert('Warning',"New password and Confirm password do not match");
            return;
        }

        dispatch(
            changePassword({
                userId: userId,
                newPassword: newPassword,
                oldPassword: oldPassword,
            })
        );
    };

    return (
        <div className="change-password-container">
            <h2>Change Password</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-row">

                    <input type="hidden" value={userId} readOnly />
                </div>

                <div className="form-row">
                    <label>
                        User Name 
                    </label>
                    <input type="text" value={username} readOnly style={{ backgroundColor: "#e9ecef" }} />
                </div>

                <div className="form-row">
                    <label>
                        Passcode <span className="required">*</span>
                    </label>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Passcode"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="form-row">
                    <label>
                        New Password <span className="required">*</span>
                    </label>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-row">
                    <label>
                        Confirm Password <span className="required">*</span>
                    </label>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>


                <div className="toggle-password">
                    
                    <input
                        type="checkbox"
                        id="showPassword"
                        checked={showPassword}
                        onChange={() => setShowPassword(prev => !prev)}
                    />

                    <label htmlFor="showPassword">Show Password</label>
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={loading}>
                        {loading && <span className="spinner"></span>}
                        Change Password
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;
