import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBell, FaSignOutAlt } from "react-icons/fa";

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="topbar"
    >
      <div className="brand">
        <div className="brand-box"></div>

        <div>
          <h2>CrisisSync AI</h2>
          <p>Hospitality emergency ops</p>
        </div>
      </div>

      <nav className="nav-links">
        <NavLink to="/" className="nav-btn">Dashboard</NavLink>
        <NavLink to="/analytics" className="nav-btn">Analytics</NavLink>
      </nav>

      <div className="right-actions">
        <button className="icon-btn"><FaBell /></button>
        <button className="theme-btn">Light</button>

        <div className="user-box">
          <strong>abhishiek</strong>
          <span>Staff</span>
        </div>

        <button className="logout-btn">
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </motion.header>
  );
}