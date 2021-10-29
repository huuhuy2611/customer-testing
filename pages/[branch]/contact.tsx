import React, { useEffect, useState } from "react";
import { Container, Grid } from "@material-ui/core";
import { useRouter } from "next/router";
import LeftContact from "@/layouts/ContactPage/LeftContact";
import RightContact from "@/layouts/ContactPage/RightContact";
import DeviderMiddle from "@/layouts/DeviderMiddle";
import { UseBrandProp, useBrandStore } from "@/store/store";
import { breakpointUp } from "@/common/ultil/myTool";

function Contact(): JSX.Element {
  const router = useRouter();

  const brand = useBrandStore((state: UseBrandProp) => state.brand);

  const [showPolicy, setShowPolicy] = useState<boolean>(false);

  useEffect(() => {
    const temp = window.location.href.split("/");
    if (!brand?.id) router.push(`/${temp[temp.length - 2]}`);
  }, []);

  return (
    <div className="container">
      <Container maxWidth="xl" disableGutters>
        <Grid container>
          {breakpointUp(800) && (
            <Grid item xs={12} md={6}>
              <div className="left">
                <LeftContact showPolicy={showPolicy} />
              </div>
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            <RightContact
              showPolicy={showPolicy}
              setShowPolicy={setShowPolicy}
            />
          </Grid>
        </Grid>
      </Container>
      <DeviderMiddle />
      <style jsx>
        {`
          .container {
            padding: 40px 0;
          }
          .left {
            position: sticky;
            top: 40px;
            right: 50%;
          }
        `}
      </style>
    </div>
  );
}

export default Contact;
