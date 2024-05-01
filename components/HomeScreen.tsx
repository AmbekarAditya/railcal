import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import InterdependentPickers from './InterdependentPicker';
import { styles } from '../styles_component/styles_homescreen';
import { designations, months } from '../utils/constants';

interface EmployeeInfoProps {
  navigation: any;
}

const EmployeeInfo: React.FC<EmployeeInfoProps> = ({ navigation }) => {
  const [designation, setDesignation] = useState<string>('');
  const [payBand, setPayBand] = useState<string>('');
  const [level, setLevel] = useState<string>('');
  const [rateOfPay, setRateOfPay] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [showWarning, setShowWarning] = useState<boolean>(false);

  const onContinuePress = () => {
    if (!designation || !payBand || !level || !rateOfPay || !selectedMonth) {
      setShowWarning(true);
      return;
    }

    const selectedDesignation = designations.find((item) => item.label === designation);
    const designationValue = selectedDesignation ? selectedDesignation.value : '';

    console.log('Designation value:', designation);
    setShowWarning(false);
    navigation.navigate('CalculationPage', {
      designation: designationValue,
      payBand,
      level,
      rateOfPay,
      selectedMonth,
    });
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={[styles.homepage, styles.homepageFlexBox]}>
        <View style={[styles.allowanceCalculator, styles.homepageFlexBox]}>
          <Text style={styles.allowanceCalculator1}>ALLOWANCE</Text>
          <Text style={styles.allowanceCalculator1}>CALCULATOR</Text>
        </View>
        <View style={styles.homepageChild}>
          <View
            style={{
              flex: 1,
              ...(Platform.OS === 'ios' && { marginBottom: 210 }),
            }}
          >
            <Picker
              selectedValue={designation}
              onValueChange={(itemValue) => setDesignation(itemValue)}
              style={{ height: 40 }}
            >
              {designations.map((item, index) => (
                <Picker.Item key={index} label={item.label} value={item.value} />
              ))}
            </Picker>
          </View>
        </View>
        <View style={[styles.homepageItem, styles.homepageBg]}>
          <View
            style={{
              flex: 1,
              ...(Platform.OS === 'ios' && { marginBottom: 210 }),
            }}
          >
            <Picker
              style={{ height: 40 }}
              selectedValue={selectedMonth}
              onValueChange={(itemValue) => setSelectedMonth(itemValue)}
            >
              {months.map((item, index) => (
                <Picker.Item key={index} label={item.label} value={item.value} />
              ))}
            </Picker>
          </View>
        </View>
        <View style={[styles.homepageInner, styles.homepageBg]}>
          <InterdependentPickers
            payBand={payBand}
            setPayBand={setPayBand}
            level={level}
            setLevel={setLevel}
            rateOfPay={rateOfPay}
            setRateOfPay={setRateOfPay}
          />
        </View>
        {showWarning && (
          <Text style={{ color: 'red', textAlign: 'center', marginVertical: 10 }}>
            Select all values to proceed!
          </Text>
        )}
        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles.rectanglePressable,
            styles.homepageBg,
            (!designation || !payBand || !level || !rateOfPay || !selectedMonth) && { opacity: 0.5 },
          ]}
          onPress={onContinuePress}
          disabled={!designation || !payBand || !level || !rateOfPay || !selectedMonth}
        >
          <Text style={styles.proceedText}>Proceed</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EmployeeInfo;