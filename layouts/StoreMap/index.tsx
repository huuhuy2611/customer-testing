import React from "react";
import { BookingStoreProp, useBookingStore } from "@/store/store";
import { IconPin, IconPhone, IconEmail, IconClock } from "@/assets/img";
import { API_KEY_MAP } from "@/common/config";

function StoreMap(): JSX.Element {
  const outlet = useBookingStore((state: BookingStoreProp) => state.outlet);

  return (
    <div className="custom-store-map">
      {outlet?.outlet && (
        <>
          <h5 className="fs-16">{outlet?.outlet}</h5>
          <div />
          <div className="google-map">
            <iframe
              className="iframe-map"
              title="map"
              loading="lazy"
              src={`https://www.google.com/maps/embed/v1/place?key=${
                API_KEY_MAP as string
              }&q=${outlet?.address}`}
            />
          </div>
          <div className="store-address info-reserve">
            <IconPin className="mr-8" />
            <span>{outlet?.address}</span>
          </div>
          <div>
            {outlet?.phone && (
              <div className="info-reserve">
                <IconPhone className="mr-8" />
                <span>
                  {/* {outlet?.phone.slice(0, 3) !== "+65"
                    ? `+65${outlet.phone}`
                    : outlet.phone} */}
                  {outlet?.phone}
                </span>
              </div>
            )}
            {outlet?.email && (
              <div className="info-reserve">
                <IconEmail className="mr-8" />
                <span>{outlet?.email}</span>
              </div>
            )}
            {outlet?.operationHours && (
              <div className="info-reserve">
                <IconClock className="mr-8" />
                <span>{outlet?.operationHours}</span>
              </div>
            )}
          </div>
        </>
      )}

      <style jsx>{`
        .custom-store-map {
          padding-top: 20px;
          position: relative;
          width: 100%;
          color: black;
          .google-map {
            height: 200px;
            position: relative;
            margin: 20px 0;
            overflow: hidden;
            .iframe-map {
              height: 370px;
              width: 100%;
              border: 0;
              border-radius: 6px;
              pointer-events: none;
              position: absolute;
              top: -65px;
            }
          }
          .store-address {
            padding-bottom: 20px;
            border-bottom: 1px solid #d6d6d6;
            font-size: 14px;
          }
          .info-reserve {
            display: flex;
            margin-bottom: 16px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}

export default StoreMap;
