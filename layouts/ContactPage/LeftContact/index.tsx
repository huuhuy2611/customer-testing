import React from "react";
import Footer from "@/layouts/Footer";
import Header from "@/layouts/Header";
import InfoReserve from "@/layouts/InfoReserve";

function LeftContact({ showPolicy }: { showPolicy: boolean }): JSX.Element {
  return (
    <div className="left-page">
      <Header />
      <InfoReserve isModify={!showPolicy} />
      <div className="footer">
        <Footer />
      </div>
      <style jsx>
        {`
          .left-page {
            padding: 0;
            width: 375px;
            display: block;
            margin: 0 auto;
            position: sticky;
            top: 40px;
            right: 50%;
            @media screen and (max-width: 800px) {
              position: initial;
              margin-bottom: 60px;
            }
            .footer {
              position: fixed;
              bottom: 40px;
              @media screen and (max-width: 800px) {
                display: none;
              }
            }
          }
        `}
      </style>
    </div>
  );
}

export default LeftContact;
