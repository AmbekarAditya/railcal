import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import InterdependentPickers from './InterdependentPicker';
import { styles } from '../styles_component/styles_homescreen';
import { designations, months } from '../utils/constants';
import { saveEmployeeInfoStateToFirestore, loadEmployeeInfoStateFromFirestore } from './employeeInfo/saveEmployeeInfoStateToFirestore';

interface EmployeeInfoProps {
  navigation: any;
}

interface EmployeeInfoState {
  designation: string;
  payBand: string;
  level: string;
  rateOfPay: string;
  selectedMonth: string;
  showWarning: boolean;
}

class EmployeeInfo extends Component<EmployeeInfoProps, EmployeeInfoState> {
  constructor(props: EmployeeInfoProps) {
    super(props);
    this.state = {
      designation: '',
      payBand: '',
      level: '',
      rateOfPay: '',
      selectedMonth: '',
      showWarning: false,
    };
  }

  async componentDidMount() {
    const loadedState = await loadEmployeeInfoStateFromFirestore();
    if (loadedState) {
      this.setState(loadedState);
    }
  }

  onContinuePress = async () => {
    const { designation, payBand, level, rateOfPay, selectedMonth } = this.state;
    if (!designation || !payBand || !level || !rateOfPay || !selectedMonth) {
      this.setState({ showWarning: true });
    } else {
      const selectedDesignation = designations.find((item) => item.label === designation);
      const designationValue = selectedDesignation ? selectedDesignation.value : '';
      this.setState({ showWarning: false });

      // Save the state before navigating
      await saveEmployeeInfoStateToFirestore(this.state);

      this.props.navigation.navigate('CalculationPage', {
        designation: designationValue, 
        payBand: payBand,
        level: level,
        rateOfPay: rateOfPay,
        selectedMonth: selectedMonth,
      });
    }
  };

  render() {
    const { designation, payBand, level, rateOfPay, selectedMonth, showWarning } = this.state;
    return (
      <ScrollView style={{flex: 1}}>
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
                onValueChange={(itemValue) => this.setState({ designation: itemValue })}
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
                onValueChange={(itemValue) => this.setState({ selectedMonth: itemValue })}
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
              setPayBand={(value) => this.setState({ payBand: typeof value === 'function' ? value(payBand) : value })}
              level={level}
              setLevel={(value) => this.setState({ level: typeof value === 'function' ? value(level) : value })}
              rateOfPay={rateOfPay}
              setRateOfPay={(value) => this.setState({ rateOfPay: typeof value === 'function' ? value(rateOfPay) : value })}
            />
          </View>
          {showWarning && (
            <Text style={{ color: 'red', textAlign: 'center', marginVertical: 10 }}>
             Enter Employee Information
            </Text>
          )}
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.rectanglePressable,
              styles.homepageBg,
              (!designation || !payBand || !level || !rateOfPay || !selectedMonth) && { opacity: 0.5 },
            ]}
            onPress={this.onContinuePress}
          >
            <Text style={styles.proceedText}>Proceed</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

export default EmployeeInfo;