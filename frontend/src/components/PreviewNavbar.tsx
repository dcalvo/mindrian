import React from "react";
import { motion } from "framer-motion";
import { Home, LayoutDashboard, Blocks, Settings } from "lucide-react";

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
        <NavItem icon={Home} label="Home" onClick={onHomeClick} />
        <NavItem
          icon={LayoutDashboard}
          label="Workspaces"
          onClick={onWorkspacesClick}
        />
        <NavItem icon={Blocks} label="Extensions" onClick={onExtensionsClick} />
        <NavItem icon={Settings} label="Settings" />
      </div>
    </div>
  );
};
