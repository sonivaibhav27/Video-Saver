import { Alert } from "react-native";
import Qonversion from "react-native-qonversion";
import { Toast } from "../common";

class PaymentManager {
  _makeAlert(message) {
    if (message.indexOf("Qonversion") !== -1) {
      message = message.replace(/Qonversion/g, "");
    }
    Alert.alert(
      "Error",
      message,
      [
        {
          text: "Ok",
        },
      ],
      { cancelable: true }
    );
  }

  async checkIfUserPremium() {
    try {
      const permission = await Qonversion.checkPermissions();
      console.log({
        permission,
      });
      const premiumPermissions = Array.from(permission.values());
      premiumPermissions.some((item) => {
        if (item.isActive) {
          return true;
        }
      });
      return false;
    } catch (err) {
      return false;
    }
  }

  async restorePayment() {
    try {
      const restore = await Qonversion.restore();
      console.log(restore);
    } catch (err) {
      console.log(err);
    }
  }

  async getOfferings() {
    try {
      const offering = await Qonversion.offerings();
      if (
        offering != null &&
        offering.main != null &&
        offering.main.products.length > 0
      ) {
        console.log(offering);
        return offering.main.products[0];
      }
    } catch (err) {
      if (err.code === "BillingUnavailable") {
        Toast("Billing service is unavailable on this device", true);
      } else if (err.code === "NetworkConnectionFailed") {
        Toast("Seems like you need to connect to internet");
      } else {
        Toast("Can't able to fetch the product for purchase now.");
      }
      return null;
    }
  }

  async purchaseInApp() {
    try {
      const purchase = await Qonversion.purchase("com.videosaver_dev10");
      console.log(purchase);
    } catch (err) {
      switch (err.code) {
        case "CanceledPurchase":
          break;
        case "PurchaseInvalid":
          this._makeAlert(
            `Purchase Invalid {'\n'} Make sure you have google account associated to play store OR check payment source   to make payment.`
          );
          break;
        case "ProductAlreadyOwned":
          this._makeAlert("Purchase is already owned.");
          break;
        case "NetworkConnectionFailed":
          this._makeAlert(
            "Network issue on your end, please make sure you have network connectivity to make seamless purchase"
          );
          break;
        case "PlayStoreError":
          this._makeAlert(
            "Their is some issue with your google play store, Can't able to reach play store or maybe you had pending payments."
          );
          break;
        case "FraudPurchase":
          this._makeAlert(
            "Google play store recognised your payment as Fraud , Please try again."
          );
          break;
        case "BillingUnavailable":
          this._makeAlert("Billing service is unavaiable on this device");
          break;
        default:
          console.log(err);
          this._makeAlert(err.message);
          break;
      }
    }
  }
}

export default new PaymentManager();
