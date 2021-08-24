import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {TouchableNativeFeedback} from 'react-native-gesture-handler';

export default () => {
  const navigation = useNavigation();
  const navigateToSettings = () => {
    navigation.navigate('Settings');
  };
  return (
    <View style={styles.container}>
      <TouchableNativeFeedback
        onPress={navigateToSettings}
        style={styles.btnContainer}>
        <Text style={styles.btnText}> Settings </Text>
      </TouchableNativeFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    marginHorizontal: 20,
  },
  btnContainer: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {fontSize: 20, color: '#000'},
});
