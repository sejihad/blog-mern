import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white pt-4 pb-2 mt-5">
      <div className="container">
        <div className="text-center">
          <p className="mb-0">
            © {currentYear} CodeByJihad. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
