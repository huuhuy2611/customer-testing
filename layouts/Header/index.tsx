import React from "react";
import dynamic from "next/dynamic";
import {
  BookingStoreProp,
  useBookingStore,
  UseBrandProp,
  useBrandStore,
} from "@/store/store";
import {ImageDefault} from "@/assets/img";

interface IHeader {
  mobile?: boolean;
}
function Header({mobile = false}: IHeader): JSX.Element {
  const brand = useBrandStore((state: UseBrandProp) => state.brand);
  const outlet = useBookingStore((state: BookingStoreProp) => state.outlet);

  return (
    <>
      {!mobile ? (
        <div className="custom-header pb-20 border-bottom-d6d6d6">
          <img
            src={brand?.logo || outlet?.logo || ImageDefault.src}
            alt="logo"
            className="mr-10"
          />
          <h5>{brand.name}</h5>
          <style jsx>{`
            .custom-header {
              display: flex;
              align-items: center;
              color: black;
              img {
                width: 45px;
                height: 45px;
                border-radius: 50%;
                border: 1px solid #d6d6d6;
                object-fit : contain;
              }
              h5 {
                font-size: 18px;
                font-weight: 700;
              }
            }
          `}</style>
        </div>
      ) : (
        <div className="header">
          <div className="logo">
            <img
              src={brand?.logo || outlet?.logo || ImageDefault.src}
              alt="logo"
            />
          </div>
          <div className="right">
            <h4>{brand?.name}</h4>
            <p>{outlet?.address}</p>
          </div>
          <style jsx>
            {`
              .header {
                padding: 20px 16px;
                display: flex;
                margin-bottom: 20px;
                .logo {
                  width: 60px;
                  height: 60px;
                  margin-right: 20px;
                  img {
                    width: 60px;
                    height: 60px;
                    border: 1px solid #d6d6d6;
                    border-radius: 50%;
                    box-sizing: border-box;
                  }
                }
                .right {
                  h4 {
                    color: #000000;
                    font-size: 18px;
                    line-height: 26px;
                    margin-bottom: 5px;
                    font-weight: 600;
                  }
                  p {
                    font-size: 14px;
                    line-height: 20px;
                    color: #000000;
                  }
                }
              }
            `}
          </style>
        </div>
      )}
    </>
  );
}

export default dynamic(() => Promise.resolve(Header), {
  ssr: false,
});
