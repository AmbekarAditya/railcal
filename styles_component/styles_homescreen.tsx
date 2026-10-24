import { StyleSheet, Platform } from 'react-native';
import { NeuColors, NeuSpacing, NeuRadii, NeuErgonomics } from '../src/theme/neomorphicTheme';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: NeuColors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: NeuSpacing.md,
    paddingTop: NeuSpacing.md,
    paddingBottom: NeuErgonomics.bottomBarHeight + NeuSpacing.xl,
    alignItems: 'center',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 480, // Prevents overly stretched layout on tablets or web while keeping strictly mobile-first
    alignItems: 'center',
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: NeuSpacing.lg,
    marginTop: NeuSpacing.sm,
  },
  logoBadge: {
    paddingHorizontal: NeuSpacing.md,
    paddingVertical: 6,
    borderRadius: NeuRadii.full,
    marginBottom: NeuSpacing.sm,
    backgroundColor: NeuColors.surface,
  },
  logoText: {
    fontSize: 11,
    fontWeight: '800',
    color: NeuColors.accent,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: NeuColors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: NeuColors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
  },
  warningContainer: {
    width: '100%',
    marginVertical: NeuSpacing.sm,
    padding: NeuSpacing.sm + 4,
    borderRadius: NeuRadii.md,
    backgroundColor: NeuColors.dangerSubtle,
    borderWidth: 1,
    borderColor: '#FECACA',
    alignItems: 'center',
  },
  warningText: {
    color: NeuColors.danger,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  bottomBarInner: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: NeuSpacing.sm,
  },
  summaryIndicator: {
    flex: 1,
    paddingRight: NeuSpacing.sm,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: NeuColors.textSecondary,
    textTransform: 'uppercase',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: NeuColors.textPrimary,
  },
  proceedBtn: {
    flex: 1.5,
  },
});
