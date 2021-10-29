import React from "react";
import { IWigetProvider } from "@/common/interface/index";

const widgetConfigValue: IWigetProvider = {};

// initialise without default values
const WidgetContext = React.createContext({
  widgetConfig: widgetConfigValue,
  setWidgetConfig: (widgetConfig: IWigetProvider) => {},
});

export default WidgetContext;
