import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaUserCircle,
  FaTachometerAlt,
  FaChartBar,
  FaFileInvoiceDollar,
  FaCheckCircle,
  FaFileInvoice,
  FaUsers,
  FaBuilding,
  FaBoxOpen,
  FaDatabase,
  FaUserShield,
  FaUserFriends,
  FaUsersCog,
  FaHistory,
} from 'react-icons/fa';
import './Sidebar.css';

// Each route carries the section group + icon used to render the
// grouped, icon-based navigation. The access-control filtering below
// still decides which of these actually appear for the logged-in role.
const allRoutes = [
  { path: '/quotationdashboard', label: 'Dashboard', group: 'General', icon: FaTachometerAlt },
  { path: '/ReportsDashboard', label: 'Reports Dashboard', group: 'General', icon: FaChartBar },

  { path: '/quotation', label: 'Quotation', group: 'Billing', icon: FaFileInvoiceDollar },
  { path: '/quotationapproval', label: 'Quotation Approval', group: 'Billing', icon: FaCheckCircle },
  { path: '/quotationInvoiceapproval', label: 'Invoice Approval', group: 'Billing', icon: FaFileInvoice },

  { path: '/customers', label: 'Customers', group: 'Master Data', icon: FaUsers },
  { path: '/ReceivingEntities', label: 'Companies', group: 'Master Data', icon: FaBuilding },
  { path: '/Products', label: 'Products', group: 'Master Data', icon: FaBoxOpen },
  { path: '/masterdata', label: 'Master', group: 'Master Data', icon: FaDatabase },

  { path: '/Roles', label: 'Roles', group: 'Administration', icon: FaUserShield },
  { path: '/userslist', label: 'Users List', group: 'Administration', icon: FaUserFriends },
  { path: '/screenmapping', label: 'User Management', group: 'Administration', icon: FaUsersCog },
  { path: '/Auditlog', label: 'Audit Log', group: 'Administration', icon: FaHistory },
];

// Render order for the section groups.
const GROUP_ORDER = ['General', 'Billing', 'Master Data', 'Administration'];

const Sidebar = () => {
  const sidebarRef = useRef();
  const [allowedRoutes, setAllowedRoutes] = useState([]);

  const userName = sessionStorage.getItem('Name') || sessionStorage.getItem('roleName') || 'User';
  const roleName = sessionStorage.getItem('roleName') || '';

  useEffect(() => {
    const screenList = JSON.parse(sessionStorage.getItem('screenList')) || [];
    const roleName = sessionStorage.getItem('roleName');

    const allowedPaths = screenList
      .filter(screen => screen.isActive === 'Yes')
      .map(screen => screen.screenName.trim().toLowerCase());

    const filtered = allRoutes.filter(route =>
      allowedPaths.includes(route.path.toLowerCase())
    );
    const isSuperAdmin = roleName?.toLowerCase().replace(/\s+/g, '') === 'superadmin';

    if (isSuperAdmin) {
      const userManagement = allRoutes.find(r => r.path === '/screenmapping');
      if (userManagement && !filtered.some(r => r.path === '/screenmapping')) {
        filtered.push(userManagement);
      }
    }

    setAllowedRoutes(filtered);
  }, []);

  // Bucket the allowed routes into their sections, preserving group order.
  const groupedRoutes = GROUP_ORDER
    .map(group => ({
      group,
      items: allowedRoutes.filter(route => route.group === group),
    }))
    .filter(section => section.items.length > 0);

  return (
    <aside className="sidebar" ref={sidebarRef}>
      <nav className="sidebar-nav">
        {groupedRoutes.map(({ group, items }) => (
          <div className="menu-group" key={group}>
            <p className="menu-group-title">{group}</p>
            <ul className="menu">
              {items.map(({ path, label, icon: Icon }) => (
                <li key={path}>
                  <NavLink
                    to={path}
                    className={({ isActive }) => (isActive ? 'active menu-link' : 'menu-link')}
                  >
                    <Icon className="menu-icon" />
                    <span className="menu-label">{label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* User profile pinned to the bottom (matches reference layout) */}
      <div className="sidebar-profile">
        <FaUserCircle size={36} className="sidebar-profile-avatar" />
        <div className="sidebar-profile-meta">
          <span className="sidebar-profile-name">{userName}</span>
          {roleName && <span className="sidebar-profile-role">{roleName}</span>}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
