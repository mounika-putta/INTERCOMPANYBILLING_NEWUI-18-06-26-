import React, { useState, useRef, useEffect } from 'react';
import './TopNavbar.css';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaChevronDown } from 'react-icons/fa';

const TopNavbar = () => {
  const navigate = useNavigate();
  const Name = sessionStorage.getItem('Name') || 'User';
  const roleName = sessionStorage.getItem('roleName');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/', { replace: true });
    window.location.reload();
  };

  const handleEditProfile = () => {
    navigate('/editprofile');
    setDropdownOpen(false);
  };

  const handleChangePassword = () => {
    navigate('/changepassword');
    setDropdownOpen(false);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="top-navbar">
      {/* Left: Logo + product name */}
      <div className="navbar-brand">
        <img src="/files/assets/images/ITSALOGO.png" alt="Logo" className="logo-img" />
        <span className="navbar-product">Inter-Company Billing</span>
      </div>

      {/* Right: Username + dropdown */}
      <div className="navbar-icons">
        <div
          className="user-dropdown"
          ref={dropdownRef}
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          <FaUserCircle size={26} className="user-avatar" />
          <span className="user-meta">
            <span className="user-name">{Name}</span>
            {roleName && <span className="user-role">{roleName}</span>}
          </span>
          <FaChevronDown size={12} className="user-caret" />

          {dropdownOpen && (
            <div className="dropdown-menu">
              {roleName !== 'SuperAdmin' && roleName !== 'Super Admin' && (
                <div className="dropdown-item" onClick={handleEditProfile}>
                  Edit Profile
                </div>
              )}
              <div className="dropdown-item" onClick={handleChangePassword}>
                Change Password
              </div>
              <div className="dropdown-item dropdown-item--danger" onClick={handleLogout}>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
