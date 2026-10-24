import React, { useState } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
  Platform,
  View,
} from 'react-native';
import {
  NeuColors,
  NeuRadii,
  NeuErgonomics,
  NeuSpacing,
  getNeuShadowStyle,
} from '../../theme/neomorphicTheme';

export interface NeuButtonProps {
  title?: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
  fullWidth?: boolean;
}

export const NeuButton: React.FC<NeuButtonProps> = ({
  title,
  onPress,
  disabled = false,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  children,
  fullWidth = false,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  // Ergonomic sizing
  const height = size === 'sm' ? 48 : size === 'lg' ? 56 : NeuErgonomics.buttonHeight;
  const borderRadius = size === 'sm' ? NeuRadii.md : NeuRadii.lg;

  // Determine shadow style according to state
  const baseShadowStyle = isPressed
    ? getNeuShadowStyle('concave', borderRadius)
    : getNeuShadowStyle(variant === 'accent' ? 'floating' : 'convex', borderRadius);

  // Variant color accents
  let textColor = NeuColors.textPrimary;
  let customBg = NeuColors.surface;

  if (variant === 'accent') {
    textColor = NeuColors.accent;
  } else if (variant === 'danger') {
    textColor = NeuColors.danger;
  } else if (variant === 'primary') {
    textColor = NeuColors.accent;
  }

  const buttonStyle: ViewStyle = {
    height,
    minHeight: NeuErgonomics.minTouchTarget,
    minWidth: NeuErgonomics.minTouchTarget,
    borderRadius,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: size === 'sm' ? NeuSpacing.md : NeuSpacing.lg,
    opacity: disabled ? 0.45 : 1,
    alignSelf: fullWidth ? 'stretch' : 'auto',
    ...(customBg ? { backgroundColor: customBg } : {}),
    ...baseShadowStyle,
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={({ pressed }) => [
        buttonStyle,
        pressed && styles.pressedTransform,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      {children ? (
        children
      ) : (
        <View style={styles.contentContainer}>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          {title && (
            <Text
              style={[
                styles.defaultText,
                size === 'sm' && styles.smallText,
                size === 'lg' && styles.largeText,
                { color: textColor },
                textStyle,
              ]}
            >
              {title}
            </Text>
          )}
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  smallText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 18,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  pressedTransform: {
    transform: [{ scale: 0.985 }],
  },
});

export default NeuButton;
