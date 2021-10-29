import React, {useEffect, useContext} from "react";
import {useRouter} from "next/router";
import WigetContext from "@/common/context/WigetContext";
import {IWigetProvider} from "@/common/interface/index";
import {
  WidgetAction,
  WidgetScreen,
  WigetScreenURL,
  KEY_STORE_CONTACT_PAGE,
} from "@/common/constant/Widget";

interface DataEvent {
  action: string;
  data: unknown;
}

function Widget(): JSX.Element {
  const {setWidgetConfig} = useContext(WigetContext);
  const router = useRouter();
  const {pathname} = router;

  useEffect(() => {
    /**
     * Once the DOM is loaded we will send a message to the iframe with the action init
     * to tell the iframe that the react app has been loaded onto the DOM
     */
    if (WigetScreenURL.INIT === pathname) {
      const params = {
        action: WidgetAction.INIT,
        screen: WidgetScreen.INIT,
      };

      window.parent.postMessage(JSON.stringify(params), "*");
    }
  }, [pathname]);

  useEffect(() => {
    function onHandleDataSendFromWidget(event: MessageEvent): void {
      event.preventDefault();

      if (!event.data || typeof event.data !== "string") {
        return;
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const dataEvent: DataEvent = JSON.parse(event.data);

        switch (dataEvent?.action) {
          case WidgetAction.INITIAL_DATA_WIDGET: {
            setWidgetConfig(dataEvent?.data as IWigetProvider);
            break;
          }

          case WidgetAction.SAVE_CONTACT_DATA: {
            localStorage.setItem(
              KEY_STORE_CONTACT_PAGE,
              JSON.stringify(dataEvent?.data)
            );
            // fire event to open contact popup
            const params = {
              action: WidgetAction.BUILD_CONTACT_POPUP,
              screen: WidgetScreen.HOME,
              data: dataEvent?.data,
            };

            window.parent.postMessage(JSON.stringify(params), "*");
            break;
          }

          default:
            break;
        }
      } catch (error) {
        // TODO
      }
    }

    /**
     * The iframe checks the action in the handleMessage function used in widget.ts
     * and sends back a message with the config data
     */
    window.addEventListener("message", onHandleDataSendFromWidget);

    return () => {
      window.removeEventListener("message", onHandleDataSendFromWidget);
    };
  }, []);

  return <></>;
}

export default Widget;
