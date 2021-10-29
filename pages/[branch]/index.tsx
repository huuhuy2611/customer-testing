import { Container, Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import moment from "moment";
import { breakpointUp } from "@/common/ultil/myTool";
import DeviderMiddle from "@/layouts/DeviderMiddle";
import RightHome from "@/layouts/HomePage/RightHome";
import LeftHome from "@/layouts/HomePage/LeftHome";
import { KEY_STORE_CONTACT_PAGE } from "@/common/constant/Widget";
import { IWidgetContactData } from "@/common/interface";
import {
  useBrandStore,
  UseBrandProp,
  useBookingStore,
  BookingStoreProp,
} from "@/store/store";
import Footer from "@/layouts/Footer";

function index(): JSX.Element {
  const router = useRouter();
  const setBrand = useBrandStore((state: UseBrandProp) => state.setBrand);
  // const setTime = useBookingStore((state: BookingStoreProp) => state.setTime);
  const setNumAdults = useBookingStore(
    (state: BookingStoreProp) => state.setNumAdults
  );
  const setNumChild = useBookingStore(
    (state: BookingStoreProp) => state.setNumChild
  );
  const setOutlet = useBookingStore(
    (state: BookingStoreProp) => state.setOutlet
  );
  const setDate = useBookingStore((state: BookingStoreProp) => state.setDate);

  // state

  const [isAvailableOutlet, setIsAvailableOutlet] = useState(false);
  const [defaultTime, setDefaultTime] = useState("");
  const [defaultDate, setDefaultDate] = useState("");

  useEffect(() => {
    sessionStorage.removeItem("token_widget");
    const contactStorage = localStorage.getItem(KEY_STORE_CONTACT_PAGE);

    if (typeof contactStorage !== "string") {
      return;
    }

    try {
      const params: IWidgetContactData = JSON.parse(
        contactStorage
      ) as IWidgetContactData;
      const {
        brand: brandStorage,
        time: timeStorage,
        date: dateStorage,
        numAdults: numAdultsStorage,
        numChild: numChildStorage,
        outlet: outletStorage,
        token: tokenWidgetStorage,
        isUsingIframe,
      } = params;

      if (!isUsingIframe) {
        return;
      }
      setBrand(brandStorage);
      if (timeStorage) setDefaultTime(timeStorage as string);
      setDate(dateStorage);
      if (moment(dateStorage, "MMMM-YY-DD") !== moment())
        setDefaultDate(dateStorage);
      setNumAdults(numAdultsStorage);
      setNumChild(numChildStorage);
      setOutlet(outletStorage);
      setIsAvailableOutlet(true);
      if (tokenWidgetStorage) {
        sessionStorage.setItem("token_widget", tokenWidgetStorage);
      }

      localStorage.removeItem(KEY_STORE_CONTACT_PAGE);
    } catch (error) {
      // TODO
    }
  }, []);

  useEffect(() => {
    if (router.query.token) {
      sessionStorage.setItem("token_widget", router.query.token as string);
    }
  }, [router.query.token]);

  return (
    <div className="container">
      <Container maxWidth="xl" disableGutters>
        <Grid container>
          {breakpointUp(800) && (
            <Grid item md={6}>
              <LeftHome />
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            <RightHome
              isAvailableOutlet={isAvailableOutlet}
              defaultTime={defaultTime}
              defaultDate={defaultDate}
            />
            {!breakpointUp(800) && (
              <div className="footer">
                <Footer />
              </div>
            )}
          </Grid>
        </Grid>
      </Container>
      <DeviderMiddle />
      <style jsx>
        {`
          .container {
            padding-top: 40px;
          }
          .footer {
            margin: 20px 0;
          }
        `}
      </style>
    </div>
  );
}

export default index;
