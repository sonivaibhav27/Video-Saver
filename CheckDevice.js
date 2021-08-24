import React from "react";
import {Platform,Text,View} from "react-native"
import App from "./App"


export default ()=>{
    return (
        <View style={{flex:1}}>
         {
            Platform.OS == 'android' ?  <App/> :<View style={{flex:1,justifyContent: 'center',alignItems: 'center',}}><Text>
                We Don't support for {Platform.OS} Now, We will release soon :)
                </Text></View> 
         }
        </View>
     
    )
}