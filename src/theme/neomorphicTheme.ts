import { Platform, ViewStyle } from 'react-native';

export const NeuColors = {
  // Foundational Neomorphic Surface & Background (identical for soft UI depth)
  background: '#E0E5EC',
  surface: '#E0E5EC',
  surfacePressed: '#D7DEE8',

  // Opposing shadow palette
  shadowDark: '#A3B1C6',
  shadowLight: '#FFFFFF',
  shadowDarkPressed: '#8A99AE',
  
  // Inset / Sunken field tones
  insetBg: '#DCE2EB',
  insetBorderTop: '#CAD3E0',
  insetBorderBottom: '#FFFFFF',

  // Typography
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textOnAccent: '#FFFFFF',

  // Accents & Signals
  accent: '#2563EB',
  accentLight: '#60A5FA',
  accentSubtle: '#DBEAFE',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  dangerSubtle: '#FEE2E2',

  // Highlight borders for tactile realism on native platforms
  borderLight: 'rgba(255, 255, 255, 0.95)',
  borderDark: 'rgba(163, 177, 198, 0.45)',
  divider: '#D1D9E6',
};

export const NeuRadii = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  full: 9999,
};

export const NeuSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const NeuErgonomics = {
  minTouchTarget: 48,
  buttonHeight: 52,
  inputHeight: 52,
  bottomBarHeight: 76,
};

/**
 * Generates cross-platform neomorphic elevation styles.
 * On Web: native CSS dual opposing box-shadow.
 * On Native (iOS/Android): Combined shadowColor, elevation, and tactile dual-tone highlight borders.
 */
export const getNeuShadowStyle = (
  variant: 'convex' | 'convexSmall' | 'concave' | 'flat' | 'floating' = 'convex',
  radius: number = NeuRadii.lg
): ViewStyle => {
  if (Platform.OS === 'web') {
    switch (variant) {
      case 'convex':
        return {
          backgroundColor: NeuColors.surface,
          borderRadius: radius,
          // @ts-ignore - web box-shadow support
          boxShadow: '6px 6px 14px #A3B1C6, -6px -6px 14px #FFFFFF',
        };
      case 'convexSmall':
        return {
          backgroundColor: NeuColors.surface,
          borderRadius: radius,
          // @ts-ignore
          boxShadow: '3px 3px 7px #A3B1C6, -3px -3px 7px #FFFFFF',
        };
      case 'floating':
        return {
          backgroundColor: NeuColors.surface,
          borderRadius: radius,
          // @ts-ignore
          boxShadow: '10px 10px 24px #9CAEC4, -10px -10px 24px #FFFFFF',
        };
      case 'concave':
        return {
          backgroundColor: NeuColors.insetBg,
          borderRadius: radius,
          // @ts-ignore
          boxShadow: 'inset 4px 4px 8px #A3B1C6, inset -4px -4px 8px #FFFFFF',
        };
      case 'flat':
      default:
        return {
          backgroundColor: NeuColors.surface,
          borderRadius: radius,
          // @ts-ignore
          boxShadow: '2px 2px 5px #A3B1C6, -2px -2px 5px #FFFFFF',
        };
    }
  }

  // Native (iOS & Android)
  switch (variant) {
    case 'convex':
      return {
        backgroundColor: NeuColors.surface,
        borderRadius: radius,
        shadowColor: NeuColors.shadowDark,
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.65,
        shadowRadius: 7,
        elevation: 6,
        borderWidth: 1,
        borderTopColor: NeuColors.borderLight,
        borderLeftColor: NeuColors.borderLight,
        borderRightColor: NeuColors.borderDark,
        borderBottomColor: NeuColors.borderDark,
      };
    case 'convexSmall':
      return {
        backgroundColor: NeuColors.surface,
        borderRadius: radius,
        shadowColor: NeuColors.shadowDark,
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderTopColor: NeuColors.borderLight,
        borderLeftColor: NeuColors.borderLight,
        borderRightColor: NeuColors.borderDark,
        borderBottomColor: NeuColors.borderDark,
      };
    case 'floating':
      return {
        backgroundColor: NeuColors.surface,
        borderRadius: radius,
        shadowColor: NeuColors.shadowDark,
        shadowOffset: { width: 8, height: 8 },
        shadowOpacity: 0.7,
        shadowRadius: 12,
        elevation: 10,
        borderWidth: 1.5,
        borderTopColor: NeuColors.borderLight,
        borderLeftColor: NeuColors.borderLight,
        borderRightColor: NeuColors.borderDark,
        borderBottomColor: NeuColors.borderDark,
      };
    case 'concave':
      return {
        backgroundColor: NeuColors.insetBg,
        borderRadius: radius,
        borderWidth: 1.5,
        borderTopColor: NeuColors.insetBorderTop,
        borderLeftColor: NeuColors.insetBorderTop,
        borderRightColor: NeuColors.insetBorderBottom,
        borderBottomColor: NeuColors.insetBorderBottom,
      };
    case 'flat':
    default:
      return {
        backgroundColor: NeuColors.surface,
        borderRadius: radius,
        borderWidth: 1,
        borderColor: NeuColors.divider,
      };
  }
};
