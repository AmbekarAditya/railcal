import { StyleSheet } from "react-native";
import { NeuColors, NeuSpacing, NeuRadii, NeuErgonomics } from "../../src/theme/neomorphicTheme";

export const colors = {
  primary: NeuColors.accent,
  border: NeuColors.divider,
};

export const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  verticalContent: {
    flexDirection: "column",
    width: "100%",
    paddingBottom: NeuSpacing.xl,
  },
  blockBox: {
    backgroundColor: NeuColors.surface,
    borderRadius: NeuRadii.lg,
    padding: 12,
    marginBottom: NeuSpacing.md,
    borderWidth: 1,
    borderColor: NeuColors.divider,
    shadowColor: NeuColors.shadowDark,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 3,
    width: "100%",
    overflow: "hidden",
  },
  blockHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: NeuSpacing.md,
  },
  blockTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: NeuColors.textPrimary,
    letterSpacing: -0.3,
  },
  blockSubtitle: {
    fontSize: 12,
    fontWeight: "600",
    color: NeuColors.textSecondary,
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: NeuSpacing.xs + 2,
    marginBottom: NeuSpacing.md,
    width: "100%",
  },
  actionBtn: {
    flex: 1,
    minWidth: 85,
    minHeight: 42,
    paddingHorizontal: 6,
    paddingVertical: 8,
    borderRadius: NeuRadii.md,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: NeuColors.surface,
    borderWidth: 1,
    borderColor: NeuColors.borderLight,
    shadowColor: NeuColors.shadowDark,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  actionBtnPrimary: {
    backgroundColor: NeuColors.accent,
  },
  actionBtnPrimaryText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12,
  },
  actionBtnText: {
    color: NeuColors.textPrimary,
    fontWeight: "700",
    fontSize: 12,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  dutiesList: {
    width: "100%",
  },
});
