package com.vidownranuja;

import com.applovin.sdk.AppLovinPrivacySettings;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


import java.util.Arrays;
import java.util.Map;
import java.util.HashMap;

public class CustomNativeModule extends ReactContextBaseJavaModule{
    public static ReactApplicationContext mContext;
    CustomNativeModule(ReactApplicationContext context){
        super(context);
        mContext = context;
    }

    @ReactMethod
    public void setAppLovinConsent(boolean consent){
        AppLovinPrivacySettings.setHasUserConsent(consent,mContext);
    }


    @Override
    public String getName() {
        return "CustomNativeModule";
    }

}
