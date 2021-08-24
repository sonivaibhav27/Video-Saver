import React from 'react';
import {View, ActivityIndicator, StyleSheet, Text} from 'react-native';

export default ({text}) => {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <ActivityIndicator color="#999" size="large" />
        <Text style={styles.textStyle}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    marginHorizontal: 40,
    borderRadius: 5,
  },
  main: {
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingVertical: 20,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#eee',
    borderRadius: 3,
  },
  textStyle: {
    marginLeft: 20,
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
});
