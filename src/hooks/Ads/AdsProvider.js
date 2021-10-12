import React from "react";
import useAdConsent from "./AdsConsent";
import { Context } from "../../config";
import { CustomActivityIndicator } from "../../common";

export default ({ children }) => {
  const adsConsent = useAdConsent();
  if (adsConsent != null) {
    return (
      <Context.AdsConsentContext.Provider value={adsConsent}>
        {children}
      </Context.AdsConsentContext.Provider>
    );
  } else {
    return <CustomActivityIndicator text="loading..." />;
  }
};
