import React from "react";

function Divider(): JSX.Element {
  return (
    <div className='divider'>
      <style jsx>
        {`
          .divider {
            height: 1px;
            width: 100%;
            background-color: #d6d6d6;
            margin: 30px 0;
          }
        `}
      </style>
    </div>
  );
}

export default Divider;
