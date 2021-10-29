import React from "react";
import { IconExpire } from "@/assets/img";
import CustomButtonNew from "@/components/Button/CustomButton";
import { IReservationResponse } from "@/common/interface";
import InfoOutlet from "../../components/InfoOutlet";
import InfoReserveDetail from "../../components/InfoReserveDetail";

interface IProps {
  data: IReservationResponse;
}

function ReservationCancelled(props: IProps): JSX.Element {
  const { data } = props;

  return (
    <div className='reservation-cancelled'>
      <IconExpire className='mb-10' />
      <h5 className='fs-26 fw-700 font-arsenal pb-20 mb-20 border-bottom-d6d6d6'>
        Reservation Expired
      </h5>
      {}
      <div className='pb-20 border-bottom-d6d6d6'>
        <InfoReserveDetail dataReserve={data} />
      </div>
      <div className='pb-20 mb-20 border-bottom-d6d6d6'>
        <CustomButtonNew type='primary' text='Make Another Reservation' />
      </div>
      <InfoOutlet dataOutlet={data?.outlet} />
      <style jsx>{`
        .reservation-cancelled {
          padding: 20px 16px;
          border: 1px solid #d6d6d6;
          border-radius: 6px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export default ReservationCancelled;
