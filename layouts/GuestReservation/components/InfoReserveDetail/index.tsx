import React from "react";
import moment from "moment";
import {
  IconCalendar,
  IconClock,
  IconOccasion,
  IconPeople,
} from "@/assets/img";
import { IReservationResponse } from "@/common/interface";
import { convertTime } from "@/common/ultil/convertTime";

interface IProps {
  dataReserve: IReservationResponse;
}

function InfoReserveDetail(props: IProps): JSX.Element {
  const { dataReserve } = props;

  return (
    <div>
      <h5 className="fs-16 mb-20 mt-20">
        Reservation #{dataReserve?.code?.toUpperCase()}
      </h5>
      <div className="info-reserve-details pb-20 border-bottom-d6d6d6">
        <div className="info-reserve-details_left">
          <div className="info-reserve-details_left_content mb-12">
            <IconPeople transform="scale(0.778)" />
            <span>
              {dataReserve?.numberOfAdults} Adults
              {dataReserve?.numberOfChildren > 0
                ? `, ${dataReserve?.numberOfChildren} Children`
                : ""}
            </span>
          </div>
          <div className="info-reserve-details_left_content">
            <IconClock transform="scale(0.778)" />
            <span>{convertTime(dataReserve?.reservationTime)}</span>
          </div>
        </div>
        <div className="info-reserve-details_right">
          <div className="info-reserve-details_right_content mb-12">
            <IconCalendar transform="scale(0.737)" />
            <span>
              {moment(dataReserve?.reservationDate).format("ddd, D MMM")}
            </span>
          </div>
          {dataReserve?.occasions && (
            <div className="info-reserve-details_right_content">
              <div style={{ padding: "2px" }}>
                <IconOccasion />
              </div>
              <span>{dataReserve?.occasions}</span>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .info-reserve-details {
          display: flex;
          justify-content: space-between;
          .info-reserve-details_left_content,
          .info-reserve-details_right_content {
            display: flex;
            font-size: 14px;
            span {
              margin-left: 10px;
              text-align: left;
            }
          }
          .info-reserve-details_left {
            width: 50%;
          }
          .info-reserve-details_right {
            width: 50%;
          }
        }
      `}</style>
    </div>
  );
}

export default InfoReserveDetail;
