import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { NeuColors, NeuRadii, NeuSpacing, getNeuShadowStyle } from '../../theme/neomorphicTheme';

export interface NeuCardProps {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  headerRight?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  variant?: 'convex' | 'convexSmall' | 'concave' | 'flat';
  borderRadius?: number;
}

export const NeuCard: React.FC<NeuCardProps> = ({
  children,
  title,
  subtitle,
  icon,
  headerRight,
  style,
  contentStyle,
  titleStyle,
  subtitleStyle,
  variant = 'convex',
  borderRadius = NeuRadii.lg,
}) => {
  const shadowStyle = getNeuShadowStyle(variant, borderRadius);

  return (
    <View style={[styles.card, shadowStyle, style]}>
      {(title || subtitle || icon || headerRight) && (
        <View style={styles.header}>
          <View style={styles.titleRow}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <View style={styles.titleTextContainer}>
              {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
              {subtitle && <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>}
            </View>
          </View>
          {headerRight && <View style={styles.headerRight}>{headerRight}</View>}
        </View>
      )}
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: NeuSpacing.lg,
    marginVertical: NeuSpacing.sm,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: NeuSpacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: NeuSpacing.sm,
  },
  titleTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: NeuColors.textPrimary,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 13,
    color: NeuColors.textSecondary,
    marginTop: 2,
  },
  headerRight: {
    marginLeft: NeuSpacing.sm,
  },
  content: {
    width: '100%',
  },
});

export default NeuCard;
