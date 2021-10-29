import React from "react";
import {IconPin, IconPhone, IconEmail, IconClock} from "@/assets/img";
import Header from "@/layouts/Header";
import {IOutletResponse} from "@/common/interface";

interface IProps {
  dataOutlet: IOutletResponse;
}

function InfoOutlet(props: IProps): JSX.Element {
  const {dataOutlet} = props;

  return (
    <div className="custom-store-map">
      <div className="pt-20">
        <Header />
      </div>
      {dataOutlet?.phone && (
        <div className="info-reserve">
          <IconPhone className="mr-8" />
          {/* <span>{dataOutlet.phone.slice(0, 3) !== "+65"
              ? `+65${dataOutlet.phone}`
              : dataOutlet.phone}</span> */}
          <span>{dataOutlet.phone}</span>
        </div>
      )}
      {dataOutlet?.email && (
        <div className="info-reserve">
          <IconEmail className="mr-8" />
          <span>{dataOutlet?.email}</span>
        </div>
      )}
      {dataOutlet?.outletAddress && (
        <div className="info-reserve">
          <IconPin className="mr-8" />
          <span>{dataOutlet?.outletAddress}</span>
        </div>
      )}
      {dataOutlet?.operationHours && (
        <div className="info-reserve">
          <IconClock className="mr-8" />
          <span>{dataOutlet?.operationHours}</span>
        </div>
      )}

      <style jsx>{`
        .custom-store-map {
          :global(.custom-header) {
            border-bottom: unset;
            justify-content: center;
          }
          .info-reserve {
            display: flex;
            margin-bottom: 16px;
            font-size: 14px;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}

export default InfoOutlet;
