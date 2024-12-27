import React from "react";
import { AiFillInstagram } from "react-icons/ai";
import { FaTiktok } from "react-icons/fa";
const Footer = () => {
  return (
    <div className="footer-container">
      <p>2025 Winged Panda All rights reserverd</p>
      <p className="icons">
        <a
          href="https://www.instagram.com/winged_panda_crafts/"
          target="_blank"
        >
          <AiFillInstagram />
        </a>

        <a href="https://www.tiktok.com/@wingedpandacrafts" target="_blank">
          <FaTiktok />
        </a>
      </p>
    </div>
  );
};

export default Footer;
