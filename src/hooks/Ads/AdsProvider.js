import React from "react";
import useAdConsent from "./AdsConsent";
import { Context } from "../../config";

export default ({ children }) => {
  const adsConsent = useAdConsent();
  return (
    <Context.AdsConsentContext.Provider value={adsConsent}>
      {children}
    </Context.AdsConsentContext.Provider>
  );
};
