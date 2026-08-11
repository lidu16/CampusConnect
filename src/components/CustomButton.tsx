import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { theme } from '../theme';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
}) => {
  const variantStyle =
    variant === 'primary'
      ? styles.primary
      : variant === 'danger'
        ? styles.danger
        : styles.secondary;

  const textStyle = variant === 'secondary' ? styles.secondaryText : styles.text;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        variantStyle,
        disabled && styles.disabled,
        pressed && !disabled && !loading && styles.pressed,
        Platform.OS === 'web' && styles.webButton,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? theme.colors.primary : '#fff'} />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    minHeight: 52,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  webButton: {
    cursor: 'pointer' as any,
  },
  primary: {
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  danger: {
    backgroundColor: theme.colors.danger,
  },
  disabled: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  secondaryText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CustomButton;
