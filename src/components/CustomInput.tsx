import React from 'react';
import { TextInput, StyleSheet, View, TextInputProps } from 'react-native';

interface CustomInputProps extends TextInputProps {
  placeholder: string;
  secureTextEntry?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({ placeholder, secureTextEntry, ...props }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#95a5a6"
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#ecf0f1',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#2c3e50',
    borderWidth: 1,
    borderColor: 'transparent',
  },
});

export default CustomInput;