import React from 'react';
import { View, StyleProp, ViewStyle, StyleSheet, TouchableOpacity } from 'react-native';
import { NeuColors, NeuRadii, NeuSpacing, getNeuShadowStyle } from '../../theme/neomorphicTheme';

export interface NeuContainerProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'convex' | 'convexSmall' | 'concave' | 'flat' | 'floating';
  borderRadius?: number;
  padding?: number;
  onPress?: () => void;
  activeOpacity?: number;
}

export const NeuContainer: React.FC<NeuContainerProps> = ({
  children,
  style,
  variant = 'convex',
  borderRadius = NeuRadii.lg,
  padding = NeuSpacing.md,
  onPress,
  activeOpacity = 0.85,
}) => {
  const shadowStyle = getNeuShadowStyle(variant, borderRadius);

  const containerStyle: ViewStyle = {
    padding,
    ...shadowStyle,
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPress={onPress}
        style={[containerStyle, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[containerStyle, style]}>
      {children}
    </View>
  );
};

export default NeuContainer;
