import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const Input = ({ value, onChangeText, placeholder, secureTextEntry, style, keyboardType, multiline }) => (
  <TextInput
    style={[styles.input, style]}
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
    secureTextEntry={secureTextEntry}
    keyboardType={keyboardType}
    placeholderTextColor="#aaa"
    multiline={multiline}
    autoCapitalize="none"
    textBreakStrategy="simple"
  />
);

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: '100%',
    backgroundColor: '#f8f9fa',
    fontSize: 17,
    color: '#222',
  },
});

export default Input; 