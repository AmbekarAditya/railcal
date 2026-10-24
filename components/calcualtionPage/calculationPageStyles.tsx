import { StyleSheet } from "react-native";
import { NeuColors, NeuSpacing, NeuRadii } from "../../src/theme/neomorphicTheme";

export const calculationPageStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: NeuColors.background,
    width: "100%",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: NeuSpacing.sm,
    paddingTop: NeuSpacing.sm,
    paddingBottom: NeuSpacing.xxl,
    backgroundColor: NeuColors.background,
    width: "100%",
    maxWidth: "100%",
  },
  container: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },
  employeeCard: {
    backgroundColor: NeuColors.surface,
    padding: NeuSpacing.md,
    borderRadius: NeuRadii.lg,
    marginBottom: NeuSpacing.md,
    borderWidth: 1,
    borderColor: NeuColors.divider,
    shadowColor: NeuColors.shadowDark,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: NeuSpacing.xs + 2,
  },
  headerBadge: {
    fontSize: 11,
    fontWeight: "800",
    color: NeuColors.accent,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  monthBadge: {
    backgroundColor: NeuColors.accentSubtle,
    paddingHorizontal: NeuSpacing.sm,
    paddingVertical: 3,
    borderRadius: NeuRadii.full,
  },
  monthText: {
    fontSize: 12,
    fontWeight: "700",
    color: NeuColors.accent,
  },
  designationText: {
    fontSize: 17,
    fontWeight: "800",
    color: NeuColors.textPrimary,
    marginBottom: NeuSpacing.xs,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: NeuSpacing.xs,
    marginTop: 4,
  },
  chip: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: NeuSpacing.sm,
    paddingVertical: 4,
    borderRadius: NeuRadii.sm,
  },
  chipText: {
    fontSize: 11,
    fontWeight: "600",
    color: NeuColors.textSecondary,
  },
  chipTextBold: {
    color: NeuColors.textPrimary,
    fontWeight: "700",
  },
});
