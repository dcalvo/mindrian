import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface LandingNavbarProps {
  onLoginClick?: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  onLoginClick,
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogin = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      // Default: redirect to Phoenix auth page
      const base = import.meta.env.DEV ? "http://localhost:4000" : "";
      const returnTo = import.meta.env.DEV
        ? `?return_to=${encodeURIComponent(window.location.origin + "/")}`
        : "";
      window.location.href = `${base}/users/log-in${returnTo}`;
    }
  };

  return (
    <div className={`landing-nav-wrapper ${scrolled ? "scrolled" : ""}`}>
      <nav className="landing-nav">
        <div className="nav-left">
          <motion.div className="nav-logo" whileHover="hover" initial="initial">
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

        <div className="nav-right">
          <motion.button
            className="login-btn"
            onClick={handleLogin}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Log In
          </motion.button>
        </div>
      </nav>
    </div>
  );
};
