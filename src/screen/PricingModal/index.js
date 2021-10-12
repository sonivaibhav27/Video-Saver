import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import Qonversion from "react-native-qonversion";
import { QonversionInApp, Icons } from "../../utils";

const { height } = Dimensions.get("window");
const ICON_SIZE = 20;

export default class PricingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      product: null,
      purchaseStarted: false,
    };
  }

  purchaseUpdateListener;
  purchaseErrorListener;
  componentDidMount = () => {
    this.checkAndInitializePayOptions();
  };

  checkAndInitializePayOptions = async () => {
    try {
      const permission = await Qonversion.checkPermissions();
      const isKeyPresentInPermission = Object.keys(permission).length > 0;
      console.log(permission);
      if (isKeyPresentInPermission) {
        //Already purchased
      } else {
        this.getProducts();
      }
    } catch (err) {}
  };

  async getProducts() {
    const offering = await QonversionInApp.getOfferings();
    if (offering != null) {
      this.setState({ product: offering });
    }
  }

  purchase = async () => {
    this.setState({ purchaseStarted: true });
    const waitForPurchase = await QonversionInApp.purchaseInApp();
    this.setState({ purchaseStarted: false });
  };

  render() {
    if (this.state.product == null) {
      return (
        <View style={styles.alignCenter}>
          <ActivityIndicator size="small" color="#333" />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            style={styles.imageStyle}
            source={require("../../../android/app/src/main/res/mipmap-xhdpi/ic_launcher.png")}
          />
          <Text style={styles.appTitle}>Video Saver</Text>
          <View style={styles.crossButtonContainer}>
            <TouchableOpacity
              hitSlop={{
                top: 5,
                left: 5,
                right: 5,
              }}
              style={styles.crossButtonContainerInner}
              onPress={() => this.props.navigation.pop()}
            >
              <Icons.Entypo size={30} name="cross" color="#000" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.offerContainer}>
          <View style={styles.offer}>
            {/* <Image source={CHECK_ICON} style={styles.iconStyle} /> */}
            <Text style={styles.offerText}>🚫 Remove Annoying Ads</Text>
          </View>
          <View style={styles.offer}>
            {/* <Image source={CHECK_ICON} style={styles.iconStyle} /> */}
            <Text style={styles.offerText}>
              ❤️ Download Unlimited HD videos without watching an ad.
            </Text>
          </View>
        </View>
        <View style={styles.developerNoteContainer}>
          <Text style={styles.developerNoteText}>
            By buying Premium package , you will help the developer and its team
            to maintain and provide seemless experience to user like you.
          </Text>
        </View>
        {this.state.product && (
          <TouchableOpacity
            onPress={this.purchase}
            activeOpacity={0.9}
            style={[styles.buttonContainer, styles.consumableButton]}
          >
            {this.state.purchaseStarted ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>
                {this.state.product.prettyPrice}
              </Text>
            )}
          </TouchableOpacity>
        )}
        <View>
          <Text style={styles.oneTime}>*This is one time offer.</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  alignCenter: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1, backgroundColor: "#fff" },
  offerContainer: {
    marginTop: 20,
    marginHorizontal: 30,
  },
  offer: {
    marginVertical: 10,
    borderBottomWidth: 0.8,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
  },
  offerText: {
    fontWeight: "700",
    color: "#262626",
    fontSize: 18,
    letterSpacing: 1.04,
    flexShrink: 1,
  },
  buttonContainer: {
    padding: 10,
    backgroundColor: "#e1306c",
    borderRadius: 10,
    marginTop: 20,
    marginHorizontal: 10,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1.3,
  },
  consumableButton: {
    marginHorizontal: 30,
    padding: 15,
  },
  oneTime: {
    textAlign: "center",
    marginTop: 10,
    fontWeight: "600",
    fontSize: 18,
    color: "#555",
  },
  header: {
    height: height * 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  imageStyle: {
    height: 100,
    width: 100,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Roboto",
  },
  crossButtonContainer: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  crossButtonContainerInner: {
    padding: 5,
    borderRadius: 100,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  developerNoteContainer: {
    marginHorizontal: 30,
    marginTop: 10,
  },
  developerNoteText: {
    color: "#333",
    fontSize: 16,
    letterSpacing: 1.02,
    textAlign: "center",
    fontStyle: "italic",
  },
});
