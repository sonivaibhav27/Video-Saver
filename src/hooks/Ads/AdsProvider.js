import React from "react";
import useAdConsent from "./AdsConsent";
import { Context } from "../../config";
import { CustomActivityIndicator, Toast } from "../../common";
export default ({ children }) => {
  let ads = useAdConsent();
  let timeout = React.useRef();
  React.useEffect(() => {
    timeout.current = setTimeout(() => {
      Toast("Please reopen the app, as it is taking more time to load", "LONG");
    }, 20000);
    return () => {
      clearTimeout(timeout.current);
    };
  }, []);

  if (ads != null) {
    clearTimeout(timeout.current);
    return (
      <Context.AdsConsentContext.Provider value={ads}>
        {children}
      </Context.AdsConsentContext.Provider>
    );
  } else {
    return <CustomActivityIndicator text="loading..." />;
  }
};
