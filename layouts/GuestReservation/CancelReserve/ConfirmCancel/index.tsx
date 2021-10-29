import React from "react";
import { IconWarningYellow } from "@/assets/img";
import CustomButtonNew from "@/components/Button/CustomButton";

interface IProps {
  handleCancel: () => void;
  handleGoBack: () => void;
}

function ConfirmCancel(props: IProps): JSX.Element {
  const { handleCancel, handleGoBack } = props;
  return (
    <div className='confirm-cancel'>
      <IconWarningYellow className='mb-10' />
      <h5 className='fs-26 fw-700 mb-20 font-arsenal'>Cancel Reservation?</h5>
      <p className='fs-16 pb-20 mb-20 border-bottom-d6d6d6'>
        This action cannot be undone. Are you sure you want to cancel your
        reservation?
      </p>
      <div className='mb-20'>
        <CustomButtonNew
          type='alert'
          text='Cancel This Reservation'
          onClick={handleCancel}
        />
      </div>
      <div>
        <CustomButtonNew text='Go Back' onClick={handleGoBack} />
      </div>
      <style jsx>{`
        .confirm-cancel {
          padding: 20px 16px;
          border-radius: 6px;
          border: 1px solid #d6d6d6;
          text-align: center;
          color: black;
          :global(.MuiButton-root) {
            height: 46px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default ConfirmCancel;
