import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
const { width } = Dimensions.get("window");
const RewardAlert = ({ close, loading, showAdCallback }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.crossContainer}
        onPress={close}
      >
        <Entypo name="cross" size={20} color="#fff" />
      </TouchableOpacity>
      <View style={styles.subContainer}>
        <View>
          <Text style={styles.bigText}>
            Your Support makes a huge difference
          </Text>
        </View>
        <View>
          <Text style={styles.smallText}>
            Building and improving the app takes great deal of time and effort.
          </Text>
          <Text style={styles.smallText}>
            Watch a ad to help us and others to make this app ads free forever
          </Text>
        </View>
        <TouchableOpacity
          onPress={showAdCallback}
          activeOpacity={0.5}
          style={styles.btnContainer}
        >
          {!loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.btnText}>Watch ad to help us😇</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  subContainer: {
    backgroundColor: "#fff",
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  bigText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  smallText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  btnContainer: {
    backgroundColor: "#3b7deb",
    padding: 10,
    borderRadius: 4,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  crossContainer: {
    position: "absolute",
    bottom: 60,
    left: width / 2 - 10,
    backgroundColor: "#111",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RewardAlert;
