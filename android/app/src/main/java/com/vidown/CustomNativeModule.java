package com.vidownranuja;

import android.app.Activity;
import android.content.ContentResolver;
import android.content.Intent;
import android.content.UriPermission;
import android.net.Uri;
import android.os.Build;
import android.provider.DocumentsContract;
import android.util.Log;

import androidx.annotation.RequiresApi;
import androidx.documentfile.provider.DocumentFile;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;


import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

public class CustomNativeModule extends ReactContextBaseJavaModule{
    public static ReactApplicationContext mContext;
    public ActivityEventListener activityEventListener;
    CustomNativeModule(ReactApplicationContext context){
        super(context);
        mContext = context;
    }

    @ReactMethod
    public void setAppLovinConsent(boolean consent){
    }

    @ReactMethod
    public void copyToInternal(String srcURI,String dest,Promise promise) {
        try {
            ContentResolver contentResolver = mContext.getContentResolver();
            InputStream inputStream = null;
            OutputStream outputStream = null;
            try {
                 inputStream = contentResolver.openInputStream(Uri.parse(srcURI));
                 outputStream = new FileOutputStream(dest);
                byte[] buf = new byte[10240];
                int len;
                while((len = inputStream.read(buf) ) > 0){
                    outputStream.write(buf,0,len);
                }

                promise.resolve("CIN");
            }
            catch (Exception e){
                promise.reject("Could not assess path, Please contact App Developer.");
            }finally {
                assert inputStream != null;
                inputStream.close();
                assert outputStream != null;
                outputStream.close();
            }
        }
        catch (Exception e){
            promise.reject("Could not assess path, Please contact App Developer.");
        }
    }



    @Override
    public String getName() {
        return "CustomNativeModule";
    }

}
