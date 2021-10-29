import React from "react";

interface IProp {
  step: 1 | 2;
}
function StepLabel({ step }: IProp): JSX.Element {
  return (
    <div className="form-header">
      <div className="label">
        <h2>{step === 1 ? "Make a Reservation" : "Reservation Details"}</h2>
        <p>STEP {step} OF 2</p>
      </div>
      <style jsx>
        {`
          .form-header {
            height: 56px;
            margin-bottom: 30px;
            border-bottom: 1px solid #d6d6d6;
            display: flex;
            align-items: center;
            .label {
              position: relative;
              margin-bottom: 20px;
              width: 100%;
              h2 {
                color: #000000;
                font-size: 24px;
                line-height: 30px;
              }
              p {
                color: rgba(0, 0, 0, 0.6);
                font-size: 12px;
                line-height: 14px;
                position: absolute;
                bottom: 5px;
                right: 20px;
                @media (max-width: 375px) {
                  position: unset;
                }
              }
            }
          }
        `}
      </style>
    </div>
  );
}

export default StepLabel;
