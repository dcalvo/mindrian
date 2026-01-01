import React from "react";
import { motion } from "framer-motion";
import { Home, LayoutDashboard, Blocks } from "lucide-react";

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

export const PreviewNavbar: React.FC<{
  onHomeClick?: () => void;
  onWorkspacesClick?: () => void;
  onExtensionsClick?: () => void;
}> = ({ onHomeClick, onWorkspacesClick, onExtensionsClick }) => {
  return (
    <div className="preview-nav-wrapper">
      <div className="preview-nav">
        <div className="nav-left">
          <motion.div
            className="nav-logo"
            onClick={onHomeClick}
            whileHover="hover"
            initial="initial"
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
                  initial: { x: 7, y: -7 },
                  hover: { x: 11, y: -7 },
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            </div>
            <span className="nav-logo-text">mindrian</span>
          </motion.div>
        </div>

        <div className="nav-center">
          <NavItem icon={Home} label="Home" onClick={onHomeClick} />
          <NavItem
            icon={LayoutDashboard}
            label="Workspaces"
            onClick={onWorkspacesClick}
          />
          <NavItem
            icon={Blocks}
            label="Extensions"
            onClick={onExtensionsClick}
          />
        </div>

        <div className="nav-right">
          <div className="user-avatar-wrapper">
            <div className="user-avatar">
              <span>D</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
