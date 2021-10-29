import React from "react";
import CustomButtonNew from "@/components/Button/CustomButton";
import { IOutletResponse } from "@/common/interface";
import { API_KEY_MAP } from "@/common/config";

interface IProps {
  dataOutlet: IOutletResponse;
}

function MapConfirmReserve(props: IProps): JSX.Element {
  const { dataOutlet } = props;

  return (
    <div className="custom-store-map">
      <div className="google-map">
        <iframe
          className="iframe-map"
          title="map"
          loading="lazy"
          src={`https://www.google.com/maps/embed/v1/place?key=${
            API_KEY_MAP as string
          }&q=${dataOutlet?.outletAddress}`}
        />
      </div>
      <div className="pt-10 pb-30 border-bottom-d6d6d6">
        <CustomButtonNew
          text="Get Directions"
          onClick={() => window.open(dataOutlet?.directionLink)}
        />
      </div>
      <style jsx>{`
        .custom-store-map {
          padding-top: 20px;
          position: relative;
          width: 100%;
          color: black;
          .google-map {
            height: 200px;
            position: relative;
            overflow: hidden;
            .iframe-map {
              height: 370px;
              width: 100%;
              border: 0;
              border-radius: 6px;
              pointer-events: none;
              position: absolute;
              top: -65px;
              left: 0;
            }
          }
        }
      `}</style>
    </div>
  );
}

export default MapConfirmReserve;
