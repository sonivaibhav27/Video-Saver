import React, {PureComponent} from 'react';
import {
  View,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import Share from 'react-native-share';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ShareIcon from 'react-native-vector-icons/AntDesign';
import VideoIcon from 'react-native-vector-icons/AntDesign';
const {width, height} = Dimensions.get('window');
import {saveStatus} from '../Whatsapp/Constants';
import RNFetchBlob from 'rn-fetch-blob';
import Toast from '../Toast';

async function ShareWhatsapp(file, ext) {
  try {
    const base64 = await RNFetchBlob.fs.readFile(file, 'base64');
    if (ext === 'video') {
      await Share.open({
        url: `data:video/mp4;base64,${base64}`,
      });
    } else {
      await Share.open({
        url: `data:image/jpeg;base64,${base64}`,
      });
    }
  } catch (error) {
    if (error.message === 'User did not share') {
    } else {
      ToastAndroid.showWithGravityAndOffset(
        'Error: Something went wrong while sharing.',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        0,
        20,
      );
    }
  }
}

export default class WhatsappSection extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  share = async () => {
    this.props.onSharePressed();
    await ShareWhatsapp(
      `file://${this.props.dir}/${this.props.item}`,
      this.props.type,
    );
    this.props.shareDone();
  };

  render() {
    const {dir, type, item} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          {type === 'image' ? (
            <Image
              style={styles.imageStyle}
              source={{uri: `file://${dir}/${item}`}}
            />
          ) : (
            <View style={styles.flex}>
              <Image
                source={{uri: `file://${dir}/${item}`}}
                style={styles.imageStyle}
                resizeMode="cover"
              />
              <View style={styles.positionVideoCaret}>
                <View style={styles.videoCaretContainer}>
                  <VideoIcon name="caretright" color={'#fff'} size={40} />
                </View>
              </View>
            </View>
          )}
        </View>
        <View style={styles.actionContainer}>
          <TouchableOpacity activeOpacity={0.8} onPress={this.share}>
            <View style={styles.shareContainer}>
              <ShareIcon size={20} color="#fff" name="sharealt" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              saveStatus(
                `file://${dir}/${item}`,
                item,
                (destination, error) => {
                  if (error) {
                    Toast('Error:' + error);
                    return;
                  }
                  Toast(`File saved :${destination}`);
                },
                type,
              );
            }}>
            <View style={styles.downloadIconContainer}>
              <Icon name="download" size={20} color={'#fff'} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const commonStyle = {
  elevation: 5,
  height: 50,
  width: 50,
  borderRadius: 50,
  justifyContent: 'center',
  alignItems: 'center',
};
const styles = StyleSheet.create({
  downloadIconContainer: {
    ...commonStyle,
    backgroundColor: '#075e54',
  },
  shareContainer: {
    ...commonStyle,
    backgroundColor: '#000',
  },
  actionContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    flexDirection: 'row',
    left: 5,
    justifyContent: 'space-between',
  },
  videoCaretContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 100,
  },
  positionVideoCaret: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {flex: 1, backgroundColor: '#ccc'},
  flex: {flex: 1},
  mainContainer: {
    width: width / 2.2,
    height: height * 0.3,
    backgroundColor: '#000',
  },
  container: {
    marginBottom: 5,
    marginRight: 5,
    borderRadius: 10,
    overflow: 'hidden',
    // flex: 1,
  },
});
