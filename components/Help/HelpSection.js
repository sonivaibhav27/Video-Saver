import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

export default ({type, instructions}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.banner}>{type}</Text>
      <View style={styles.instructionContainer}>
        {instructions.map((item, index) => (
          <Text key={index}>{item}</Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  banner: {color: '#444', fontSize: 18, fontWeight: '500'},
  instructionContainer: {
    backgroundColor: '#fff',
    padding: 10,
    marginTop: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 3,
    borderColor: '#d0d0d0',
    paddingVertical: 20,
  },
});
