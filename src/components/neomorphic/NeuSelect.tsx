import React from 'react';
import { View, Text, StyleSheet, Platform, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {
  NeuColors,
  NeuRadii,
  NeuSpacing,
  NeuErgonomics,
  getNeuShadowStyle,
} from '../../theme/neomorphicTheme';

export interface NeuSelectItem<T = string | number> {
  label: string;
  value: T;
}

export interface NeuSelectProps<T = string | number> {
  label?: string;
  selectedValue: T;
  onValueChange: (itemValue: T, itemIndex: number) => void;
  items: NeuSelectItem<T>[];
  placeholder?: string;
  icon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  pickerStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

export const NeuSelect = <T extends string | number>({
  label,
  selectedValue,
  onValueChange,
  items,
  placeholder,
  icon,
  containerStyle,
  pickerStyle,
  disabled = false,
}: NeuSelectProps<T>) => {
  const insetStyle = getNeuShadowStyle('concave', NeuRadii.md);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && (
        <View style={styles.labelRow}>
          {icon && <View style={styles.labelIcon}>{icon}</View>}
          <Text style={styles.labelText}>{label}</Text>
        </View>
      )}
      <View
        style={[
          styles.pickerContainer,
          insetStyle,
          disabled && styles.disabled,
          Platform.OS === 'ios' && styles.iosPickerContainer,
        ]}
      >
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          enabled={!disabled}
          style={[
            styles.picker,
            Platform.OS === 'ios' && styles.iosPicker,
            pickerStyle,
          ]}
          dropdownIconColor={NeuColors.accent}
        >
          {placeholder && (
            <Picker.Item
              label={placeholder}
              value={'' as unknown as T}
              color={NeuColors.textMuted}
            />
          )}
          {items.map((item, index) => (
            <Picker.Item
              key={index}
              label={item.label}
              value={item.value}
              color={NeuColors.textPrimary}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginVertical: NeuSpacing.xs + 2,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: NeuSpacing.xs + 2,
    paddingLeft: NeuSpacing.xs,
  },
  labelIcon: {
    marginRight: 6,
  },
  labelText: {
    fontSize: 13,
    fontWeight: '700',
    color: NeuColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  pickerContainer: {
    minHeight: NeuErgonomics.inputHeight,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: Platform.OS === 'web' ? NeuSpacing.sm : 0,
  },
  disabled: {
    opacity: 0.5,
  },
  picker: {
    height: NeuErgonomics.inputHeight,
    width: '100%',
    color: NeuColors.textPrimary,
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web' && {
      outlineWidth: 0,
      borderWidth: 0,
      fontSize: 15,
      fontWeight: '600',
      cursor: 'pointer',
    }),
  },
  iosPickerContainer: {
    height: 180,
    justifyContent: 'center',
  },
  iosPicker: {
    height: 180,
    marginTop: -20,
  },
});

export default NeuSelect;
