import React from "react";
import Footer from "@/layouts/Footer";
import Header from "@/layouts/Header";
import StoreMap from "@/layouts/StoreMap";

function LeftHome(): JSX.Element {
  return (
    <div className="left-page">
      <Header />
      <StoreMap />
      <div className="footer">
        <Footer />
      </div>
      <style jsx>
        {`
          .left-page {
            width: 375px;
            display: block;
            margin: 0 auto;
            position: sticky;
            top: 40px;
            right: 50%;
            @media (max-width: 375px) {
              width: 100%;
            }
            .footer {
              position: fixed;
              bottom: 40px;
            }
          }
        `}
      </style>
    </div>
  );
}

export default LeftHome;
