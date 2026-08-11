import React from 'react';
import { TextInput, StyleSheet, View, TextInputProps } from 'react-native';
import { theme } from '../theme';

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
        placeholderTextColor={theme.colors.textMuted}
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
    backgroundColor: theme.colors.background,
    padding: 16,
    borderRadius: theme.radius.md,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
});

export default CustomInput;
