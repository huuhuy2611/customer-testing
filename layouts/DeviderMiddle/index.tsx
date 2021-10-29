import { breakpointUp } from "@/common/ultil/myTool";
import React from "react";

function DeviderMiddle(): JSX.Element {
  return (
    <>
      {breakpointUp(800) && (
        <div className='border-middle'>
          <style jsx>
            {`
              .border-middle {
                background: linear-gradient(
                  90deg,
                  #c4c4c4 0%,
                  rgba(196, 196, 196, 0) 54.2%
                );
                opacity: 0.15;
                transform: matrix(-1, 0, 0, 1, 0, 0);
                position: fixed;
                width: 112px;
                height: 100vh;
                right: 50%;
                top: 0px;
              }
            `}
          </style>
        </div>
      )}
    </>
  );
}

export default DeviderMiddle;
