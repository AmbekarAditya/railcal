import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NeuColors, NeuRadii, NeuSpacing, getNeuShadowStyle } from '../../theme/neomorphicTheme';

export interface NeuBottomBarProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const NeuBottomBar: React.FC<NeuBottomBarProps> = ({ children, style }) => {
  let bottomInset = 0;
  try {
    const insets = useSafeAreaInsets();
    bottomInset = insets?.bottom || 0;
  } catch (e) {
    bottomInset = Platform.OS === 'ios' ? 20 : 12;
  }

  const floatingShadow = getNeuShadowStyle('floating', NeuRadii.xl);

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrapper, { paddingBottom: Math.max(bottomInset, NeuSpacing.md) }]}
    >
      <View pointerEvents="auto" style={[styles.barContainer, floatingShadow, style]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: NeuSpacing.md,
    backgroundColor: 'transparent',
    alignItems: 'center',
    zIndex: 9999,
  },
  barContainer: {
    width: '100%',
    maxWidth: 500,
    paddingVertical: NeuSpacing.sm + 4,
    paddingHorizontal: NeuSpacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: NeuColors.surface,
    zIndex: 10000,
  },
});

export default NeuBottomBar;
