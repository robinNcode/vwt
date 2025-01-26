import React from "react";
import Navbar from "./Navbar";

const Header: React.FC = () => {
  return (
    <header id="header" className="header d-flex align-items-center sticky-top">
      <div className="container-fluid container-xl position-relative d-flex align-items-center">
        <a href="index.html" className="logo d-flex align-items-center me-auto">
          <h1 className="sitename">OnePage</h1>
        </a>

        <Navbar />

        <a className="btn-getstarted" href="#about">Get Started</a>
      </div>
    </header>
  );
}

export default Header;