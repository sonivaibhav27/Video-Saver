import React from "react";
import CodePush from "react-native-code-push";

export default (Root) => {
  class Code extends React.Component {
    componentDidMount = () => {
      CodePush.sync({
        updateDialog: {
          title: "New Update Arrived.🚀",
        },
        installMode: CodePush.InstallMode.IMMEDIATE,
        minimumBackgroundDuration: 10,
      });
    };

    render() {
      return <Root />;
    }
  }

  return CodePush({
    checkFrequency: CodePush.CheckFrequency.MANUAL,
  })(Code);
};
