import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  LayoutDashboard,
  Blocks,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../hooks/auth/useAuth";
import "./common.css";

const NavItem = ({
  icon: Icon,
  label,
  onClick,
}: {
  icon: any;
  label: string;
  onClick?: () => void;
}) => {
  return (
    <motion.div
      className="nav-item"
      whileHover="hover"
      initial="rest"
      animate="rest"
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <div className="nav-icon-wrapper">
        <Icon size={20} />
      </div>
      <motion.span
        className="nav-label"
        variants={{
          rest: { opacity: 0, y: -10, x: "-50%", pointerEvents: "none" },
          hover: { opacity: 1, y: 0, x: "-50%", pointerEvents: "auto" },
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
};

interface NavbarProps {
  onHomeClick?: () => void;
  onWorkspacesClick?: () => void;
  onExtensionsClick?: () => void;
  variant?: "fixed" | "absolute"; // Position variant
}

export const Navbar: React.FC<NavbarProps> = ({
  onHomeClick,
  onWorkspacesClick,
  onExtensionsClick,
  variant = "absolute",
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Track scroll for fixed variant
  useEffect(() => {
    if (variant === "fixed") {
      const handleScroll = () => {
        setScrolled(window.scrollY > 20);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [variant]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get user initial from email
  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  const handleLogin = () => {
    const base = import.meta.env.DEV ? "http://localhost:4000" : "";
    const returnTo = import.meta.env.DEV
      ? `?return_to=${encodeURIComponent(window.location.origin + "/")}`
      : "";
    window.location.href = `${base}/users/log-in${returnTo}`;
  };

  const handleLogoClick = () => {
    if (isAuthenticated) {
      navigate({ to: "/" });
    }
  };

  // Default navigation handlers for authenticated users
  const defaultHomeClick = () => navigate({ to: "/" });
  const defaultWorkspacesClick = () => navigate({ to: "/" }); // TODO: implement workspace navigation
  const defaultExtensionsClick = () => navigate({ to: "/" }); // TODO: implement extensions navigation

  const wrapperClass =
    variant === "fixed"
      ? `landing-nav-wrapper ${scrolled ? "scrolled" : ""}`
      : "preview-nav-wrapper";
  const navClass = variant === "fixed" ? "landing-nav" : "preview-nav";

  return (
    <div className={wrapperClass}>
      <div className={navClass}>
        <div className="nav-left">
          <motion.div
            className="nav-logo"
            onClick={handleLogoClick}
            whileHover="hover"
            initial="initial"
            style={{ cursor: isAuthenticated ? "pointer" : "default" }}
          >
            <div className="nav-logo-icon">
              <motion.div
                className="logo-square square-1"
                variants={{
                  initial: { x: 0, y: 0 },
                  hover: { x: -4, y: 0 },
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
              <motion.div
                className="logo-square square-2"
                variants={{
                  initial: { x: 0, y: 0 },
                  hover: { x: 4, y: 0 },
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            </div>
            <span className="nav-logo-text">mindrian</span>
          </motion.div>
        </div>

        {/* Center nav items - only show if authenticated */}
        {isAuthenticated && (
          <div className="nav-center">
            <NavItem
              icon={Home}
              label="Home"
              onClick={onHomeClick || defaultHomeClick}
            />
            <NavItem
              icon={LayoutDashboard}
              label="Workspaces"
              onClick={onWorkspacesClick || defaultWorkspacesClick}
            />
            <NavItem
              icon={Blocks}
              label="Extensions"
              onClick={onExtensionsClick || defaultExtensionsClick}
            />
          </div>
        )}

        <div className="nav-right">
          {isAuthenticated && user ? (
            <div className="user-avatar-wrapper" ref={dropdownRef}>
              <motion.div
                className="user-avatar-button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <div className="user-avatar">
                  <span>{userInitial}</span>
                </div>
                <motion.div
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  style={{ color: "var(--preview-text-secondary)" }}
                >
                  <ChevronDown size={14} />
                </motion.div>
              </motion.div>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    className="user-dropdown"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                    }}
                  >
                    {user.email && (
                      <div className="user-dropdown-email">{user.email}</div>
                    )}
                    <motion.button
                      className="user-dropdown-item"
                      onClick={logout}
                      whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.04)" }}
                    >
                      <LogOut size={16} />
                      <span>Log out</span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.button
              className="login-btn"
              onClick={handleLogin}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Log In
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};
