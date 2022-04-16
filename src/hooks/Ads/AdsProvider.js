import React from "react";
import useAdConsent from "./AdsConsent";
import { Context } from "../../config";
import { CustomActivityIndicator, Toast } from "../../common";
export default ({ children }) => {
  if (true) {
    // clearTimeout(timeout.current);
    return (
      <Context.AdsConsentContext.Provider>
        {children}
      </Context.AdsConsentContext.Provider>
    );
  } else {
    return <CustomActivityIndicator text="loading..." />;
  }
};
