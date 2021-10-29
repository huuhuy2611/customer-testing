import React from "react";
import { PowerByOddle } from "@/assets/img";

function Footer(): JSX.Element {
  return (
    <div className="custom-footer">
      <div className="div-center fs-14" style={{ flexWrap: "wrap" }}>
        <a
          className="power-oddle mr-10 mt-3"
          target="_blank"
          href="https://oddle.vip/Ueh"
          rel="noreferrer"
        >
          <PowerByOddle />
        </a>

        <div>
          <a
            target="_blank"
            href="https://oddle.me/oddle-pass-terms-of-use/"
            rel="noreferrer"
          >
            Terms & Conditions
          </a>
          <span className="wall">|</span>
          <a
            target="_blank"
            href="https://oddle.me/privacy-policy"
            rel="noreferrer"
          >
            Privacy Policy
          </a>
        </div>
      </div>
      <div className="learn-more fs-12">
        <span>
          Making a reservation is free for you and the restaurant.{" "}
          <a target="_blank" href="https://oddle.vip/jtY" rel="noreferrer">
            Learn more
          </a>
        </span>
      </div>

      <style jsx>{`
        .custom-footer {
          .wall {
            padding: 0 4px;
          }
          .learn-more {
            color: #515151;
            text-align: center;
            a {
              color: #515151;
            }
          }
          a {
            text-decoration: underline;
            color: #515151;
            cursor: pointer;
          }
          .power-oddle {
            height: 15px;
          }
        }
      `}</style>
    </div>
  );
}

export default Footer;
