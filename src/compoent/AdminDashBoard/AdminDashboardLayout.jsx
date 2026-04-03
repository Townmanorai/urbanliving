// import React from "react";
// import { Outlet } from "react-router-dom";
// import Sidebar from "./Sidebar/Sidebar";
// import "./AdminDashboardLayout.css";

// const AdminDashboardLayout = () => {
//   return (
//     <div className="admin-dashboard-layout">
//       <Sidebar />
//       <div className="admin-dashboard-content">
//         <Outlet />
//       </div>
//     </div>
//   );
// };

// export default AdminDashboardLayout;

import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import Sidebar from "./Sidebar/Sidebar";
import "./AdminDashboardLayout.css";

const AdminDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  return (
    <div className="admin-dashboard-layout">

      {/* Mobile Topbar */}
      <div className="mobile-topbar">
        <FaBars onClick={() => setSidebarOpen(true)} />
        <span>Dashboard</span>
      </div>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="admin-dashboard-content">
        <Outlet />
      </div>

      {/* Overlay */}
      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
};

export default AdminDashboardLayout;
