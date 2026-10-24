import { StyleSheet } from "react-native";
import { NeuColors, NeuSpacing, NeuRadii } from "../../src/theme/neomorphicTheme";

export const calculationPageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NeuColors.background,
    padding: NeuSpacing.sm,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: NeuColors.background,
  },
  background: {
    backgroundColor: NeuColors.surface,
    padding: NeuSpacing.md,
    borderRadius: NeuRadii.md,
    marginBottom: NeuSpacing.md,
    borderWidth: 1,
    borderColor: NeuColors.divider,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  text: {
    marginRight: NeuSpacing.md,
    marginVertical: 4,
    fontSize: 14,
    fontWeight: "600",
    color: NeuColors.textPrimary,
  },
});
