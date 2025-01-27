import React from "react";
import Header from "./Header.tsx";
import Footer from "./Footer.tsx";
import HeroSection from "../pages/landing/HeroSection.tsx";

const PublicLayout: React.FC = () => {
  return (
    <>
      <Header />
      <main id="main">
        <HeroSection />
        {/*<AboutSection />*/}
        {/*<ServicesSection />*/}
        {/*<PortfolioSection />*/}
        {/*<TeamSection />*/}
        {/*<ContactSection />*/}
      </main>
      <Footer />
    </>
  );
}

export default PublicLayout;