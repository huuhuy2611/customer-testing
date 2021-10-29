/* eslint-disable @typescript-eslint/no-unused-vars */
import ButtonCheckbox from "@/components/Button/ButtonCheckbox";
import { UseBrandProp, useBrandStore } from "@/store/store";
import { Grid } from "@material-ui/core";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import TextArea from "./TextArea";

interface IOccasion {
  id: string;
  name: string;
  active: boolean;
}

interface IProps {
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

function Occasions({ setValue }: IProps): JSX.Element {
  const brand = useBrandStore((state: UseBrandProp) => state.brand);

  const [showOtherOccasion, setShowOtherOccasion] = useState<boolean>(false);

  const [listOccasion, setListOccasion] = useState<Array<IOccasion>>(
    brand?.occasions?.map((e) => ({ ...e, active: false }))
  );

  const [otherOccasion, setOtherOccasion] = useState<string>("");

  const mergeOccasion = () => {
    const temp = listOccasion
      .filter((e: IOccasion) => e.active)
      .map((e: IOccasion) => e.name);
    const occasions =
      showOtherOccasion && otherOccasion?.trim()
        ? temp.concat(`Other Occasion: ${otherOccasion.trim()}`).join(", ")
        : temp.join(", ");
    setValue(occasions);
  };

  const handleOccasion = (index: number) => {
    const tempData: Array<IOccasion> = _.cloneDeep(listOccasion);
    tempData[index].active = !tempData[index].active;
    setListOccasion(tempData);
  };

  useEffect(() => {
    mergeOccasion();
  }, [otherOccasion, listOccasion]);

  return (
    <div>
      <div className='header d-flex justify-content-between'>
        <div className='label fs-18'>Occasions</div>
        <p>SELECT IF APPLICABLE</p>
      </div>
      <div className='list-occasion'>
        <Grid container spacing={1}>
          {listOccasion.map((occasion, index: number) => (
            <Grid item xs={6} key={occasion?.id}>
              <ButtonCheckbox
                onClick={() => handleOccasion(index)}
                title={occasion?.name}
              />
            </Grid>
          ))}
          <Grid
            item
            xs={listOccasion?.length % 2 === 0 ? 12 : 6}
            className={
              listOccasion?.length % 2 === 1 ? "btnRight" : "btnCenter"
            }
          >
            <ButtonCheckbox
              onClick={() => setShowOtherOccasion(!showOtherOccasion)}
              title='Other'
            />
          </Grid>
        </Grid>
      </div>
      {showOtherOccasion && (
        <div className='other-occasion mt-20'>
          <TextArea setValue={setOtherOccasion} type='occasion' />
        </div>
      )}
      <style jsx>
        {`
          .header {
            p {
              font-size: 12px;
              line-height: 25px;
              text-align: center;
              color: rgba(0, 0, 0, 0.6);
            }
          }
          .list-occasion {
            margin-top: 20px;
            :global(.MuiGrid-spacing-xs-1 > .MuiGrid-item) {
              padding: 5px;
            }
            :global(.btnCenter) {
              :global(.MuiButton-label) {
                justify-content: inherit;
              }
            }
          }
        `}
      </style>
    </div>
  );
}

export default Occasions;
