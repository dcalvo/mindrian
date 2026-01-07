import React from "react";
import { motion, type Variants } from "framer-motion";
import { Code2, Brain, Users, Sparkles, ChevronRight } from "lucide-react";

import { LandingParticleBackground } from "../components/LandingParticleBackground";
import { LandingNavbar } from "../components/LandingNavbar";
import "../styles/preview.css";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  delay,
}) => {
  return (
    <motion.div
      className="landing-feature-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
    >
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </motion.div>
  );
};

export function LandingPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="landing-container">
      {/* Physics-based Particle Background */}
      <LandingParticleBackground />

      {/* Navbar */}
      <LandingNavbar />

      {/* Hero Section */}
      <section className="landing-hero">
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="hero-title" variants={itemVariants}>
            <span className="hero-brand">Welcome to Mindrian</span>
          </motion.h1>

          <motion.p className="hero-tagline" variants={itemVariants}>
            Think Better, Together
          </motion.p>

          <motion.p className="hero-subtitle" variants={itemVariants}>
            Your intelligent workspace for capturing thoughts, creating ideas,
            and collaborating with AI — all in real-time.
          </motion.p>

          <motion.div className="hero-cta" variants={itemVariants}>
            <motion.button
              className="cta-button primary"
              onClick={() => {
                const base = import.meta.env.DEV ? "http://localhost:4000" : "";
                const returnTo = import.meta.env.DEV
                  ? `?return_to=${encodeURIComponent(window.location.origin + "/")}`
                  : "";
                window.location.href = `${base}/users/log-in${returnTo}`;
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
              <ChevronRight size={18} />
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* What is an IDE Section */}
      <section className="landing-section">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">
            A workspace as <span className="highlight">powerful</span> as your
            ideas
          </h2>
          <p className="section-subtitle">
            Mindrian combines the structure of developer tools with the
            flexibility of a thinking space—organize ideas, collaborate with AI,
            and work together in real-time.
          </p>
        </motion.div>

        <div className="features-grid">
          <FeatureCard
            icon={<Code2 size={28} />}
            title="Structured Like Code"
            description="Organize ideas in workspaces and documents, just like files in a project. Navigate your thoughts with the same fluidity as browsing a codebase."
            delay={0.1}
          />
          <FeatureCard
            icon={<Brain size={28} />}
            title="Intelligent Assistance"
            description="AI agents that understand context, suggest connections, and help you think through complex problems — like autocomplete for your mind."
            delay={0.2}
          />
          <FeatureCard
            icon={<Users size={28} />}
            title="Real-time Collaboration"
            description="See who's thinking alongside you. Presence indicators, live cursors, and shared workspaces make collaboration seamless."
            delay={0.3}
          />
          <FeatureCard
            icon={<Sparkles size={28} />}
            title="Extensible by Design"
            description="Add specialized agents and extensions to enhance your workflow. Your thinking environment, customized for how you work."
            delay={0.4}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-main">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="footer-logo-icon">
                  <div className="footer-logo-square square-1" />
                  <div className="footer-logo-square square-2" />
                </div>
                <span className="footer-logo-text">mindrian</span>
              </div>
              <p className="footer-tagline">Think Better, Together</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <a href="#">Features</a>
                <a href="#">Pricing</a>
                <a href="#">Roadmap</a>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <a href="#">About</a>
                <a href="#">Blog</a>
                <a href="#">Careers</a>
              </div>
              <div className="footer-column">
                <h4>Legal</h4>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 Mindrian. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
