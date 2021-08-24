import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
  Dimensions,
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Easing } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";

const { height, width } = Dimensions.get("window");
const CopyLinkData = {
  facebook: {
    image: require("./HelpImages/facebook.jpeg"),
    name: "facebook",
  },
  twitter: {
    image: require("./HelpImages/twitter.jpeg"),
    name: "twitter",
  },
  pinterest: {
    image: require("./HelpImages/pin.jpeg"),
    name: "pinterest",
  },
  instagram: {
    image: require("./HelpImages/insta.jpeg"),
    name: "instagram",
  },
  paste: {
    image: require("./HelpImages/paste.jpeg"),
  },
};

const SocialMediaButton = ({ label, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress(label)}
      style={[styles.button]}
    >
      <Text style={styles.label}>{label} </Text>
    </TouchableOpacity>
  );
};

export const LinkCopyHelper = ({ label, image, index }) => {
  return (
    <View
      style={{
        padding: 10,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            backgroundColor: "#1a428a",
            borderRadius: 15,
            padding: 6,
            height: 25,
            width: 25,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 14,
              fontWeight: "bold",
            }}
          >
            {index}
          </Text>
        </View>
        <Text style={styles.lText}>{label}</Text>
      </View>
      <Image source={image} style={styles.image} resizeMode="contain" />
    </View>
  );
};

const LinkCopySection = ({ data, closeModal }) => {
  const animated = React.useRef(new Animated.Value(0)).current;
  console.log(data.image);
  React.useEffect(() => {
    Animated.timing(animated, {
      toValue: 1,
      easing: Easing.linear,
      useNativeDriver: true,
      duration: 300,
    }).start();
  }, []);

  const _closeModal = () => {
    Animated.timing(animated, {
      toValue: 0,
      easing: Easing.linear,
      useNativeDriver: true,
      duration: 300,
    }).start(() => {
      closeModal();
    });
  };
  return (
    <Animated.ScrollView
      style={[
        styles.modalStyle,
        {
          transform: [
            {
              translateY: animated.interpolate({
                inputRange: [0, 1],
                outputRange: [height, 0],
                extrapolate: "clamp",
              }),
            },
          ],
        },
      ]}
    >
      <View
        style={{ backgroundColor: "#fff", padding: 10, alignItems: "center" }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 20,
            fontWeight: "600",
            textTransform: "capitalize",
          }}
        >
          {`${data.name}`} Help
        </Text>
        <TouchableOpacity
          onPress={_closeModal}
          activeOpacity={0.8}
          hitSlop={{
            right: 5,
            left: 5,
            top: 5,
            bottom: 5,
          }}
          style={{
            zIndex: 800,
            right: 10,
            borderRadius: 10,
            position: "absolute",
            top: 10,
          }}
        >
          <Entypo name="cross" size={25} color="#333" />
        </TouchableOpacity>
      </View>
      <LinkCopyHelper
        image={data.image}
        label={"Copy Link from " + data.name}
        index={1}
      />
      <LinkCopyHelper
        image={CopyLinkData.paste.image}
        label="paste link"
        index={2}
      />
    </Animated.ScrollView>
  );
};
const HelpEntryPoint = () => {
  const [data, setData] = React.useState(null);
  const navigation = useNavigation();
  const [showModal, setShowModal] = React.useState(false);
  const onPress = React.useCallback((label) => {
    setData(CopyLinkData[label]);
    setShowModal(true);
  }, []);
  const closeModalHandler = React.useCallback(() => {
    setShowModal(false);
  }, []);
  const goBack = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={goBack}
          activeOpacity={0.8}
          hitSlop={{
            right: 5,
            left: 5,
            top: 5,
            bottom: 5,
          }}
        >
          <AntDesign name="arrowleft" size={25} color="#000" />
        </TouchableOpacity>
        <Text style={styles.helpText}>How to copy link?</Text>
      </View>
      <SocialMediaButton onPress={onPress} label="instagram" />
      <SocialMediaButton onPress={onPress} label="facebook" />
      <SocialMediaButton onPress={onPress} label="pinterest" />
      <SocialMediaButton onPress={onPress} label="twitter" />
      {showModal && (
        <LinkCopySection data={data} closeModal={closeModalHandler} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  button: {
    padding: 10,
    margin: 8,
    borderRadius: 2,
    backgroundColor: "#eee",
  },
  label: {
    fontSize: 18,
    color: "#222",
    textTransform: "capitalize",
    fontWeight: "500",
    textAlign: "center",
  },
  modalStyle: {
    ...StyleSheet.absoluteFillObject,
    // margin: 5,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    elevation: 5,
    overflow: "hidden",
  },
  image: {
    height: 200,
    width: width,
    alignSelf: "center",
    marginTop: 10,
    maxWidth: 400,
  },
  lText: {
    fontSize: 18,
    fontWeight: "500",
    // textAlign: "center",
    marginTop: 5,
    marginLeft: 3,
  },
  header: {
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  helpText: {
    marginLeft: 35,
    fontSize: 20,
    fontWeight: "700",
  },
});

export default HelpEntryPoint;
