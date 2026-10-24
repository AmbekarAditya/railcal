import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import InterdependentPickers from './InterdependentPicker';
import { styles } from '../styles_component/styles_homescreen';
import { designations, months } from '../utils/constants';
import {
  saveEmployeeInfoStateToFirestore,
  loadEmployeeInfoStateFromFirestore,
} from './employeeInfo/saveEmployeeInfoStateToFirestore';
import {
  NeuColors,
  NeuCard,
  NeuSelect,
  NeuButton,
  NeuBottomBar,
  NeuContainer,
} from '../src/components/neomorphic';

interface EmployeeInfoProps {
  navigation?: any;
  route?: any;
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
    try {
      const loadedState = await loadEmployeeInfoStateFromFirestore();
      if (loadedState) {
        this.setState(loadedState);
      }
    } catch (e) {
      console.warn('Could not load saved state from Firestore:', e);
    }
  }

  onContinuePress = async () => {
    const { designation, payBand, level, rateOfPay, selectedMonth } = this.state;
    if (!designation || !payBand || !level || !rateOfPay || !selectedMonth) {
      this.setState({ showWarning: true });
      return;
    }

    const selectedDesignation = designations.find((item) => item.label === designation);
    const designationValue = selectedDesignation ? selectedDesignation.value : designation;
    this.setState({ showWarning: false });

    // Save the state before navigating
    try {
      await saveEmployeeInfoStateToFirestore(this.state);
    } catch (e) {
      console.warn('Could not save employee info state:', e);
    }

    this.props.navigation.navigate('CalculationPage', {
      designation: designationValue,
      payBand: payBand,
      level: level,
      rateOfPay: rateOfPay,
      selectedMonth: selectedMonth,
    });
  };

  isFormComplete = () => {
    const { designation, payBand, level, rateOfPay, selectedMonth } = this.state;
    return !!(
      designation &&
      designation !== 'Designation Not Selected' &&
      payBand &&
      level &&
      rateOfPay &&
      selectedMonth
    );
  };

  render() {
    const { designation, payBand, level, rateOfPay, selectedMonth, showWarning } = this.state;
    const isComplete = this.isFormComplete();

    // Map designation items for NeuSelect
    const designationItems = designations
      .filter((d) => d.value !== 'Designation Not Selected')
      .map((item) => ({
        label: item.label,
        value: item.label,
      }));

    // Map month items for NeuSelect
    const monthItems = months
      .filter((m) => m.value !== '')
      .map((item) => ({
        label: item.label,
        value: item.value,
      }));

    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={NeuColors.background} />
        
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.contentWrapper}>
            {/* Header with Neomorphic Pill Badge */}
            <View style={styles.headerContainer}>
              <NeuContainer variant="convexSmall" style={styles.logoBadge}>
                <Text style={styles.logoText}>INDIAN RAILWAYS</Text>
              </NeuContainer>
              <Text style={styles.mainTitle}>Allowance Calculator</Text>
              <Text style={styles.subtitle}>
                Set up employee profile to calculate monthly running allowances
              </Text>
            </View>

            {/* Warning Banner */}
            {showWarning && (
              <View style={styles.warningContainer}>
                <Text style={styles.warningText}>
                  ⚠️ Please fill in all required employee information before proceeding.
                </Text>
              </View>
            )}

            {/* Card 1: Role & Period */}
            <NeuCard
              title="Employee Profile & Period"
              subtitle="Designation and salary calculation month"
              variant="convex"
            >
              <NeuSelect
                label="Designation"
                placeholder="Select Employee Designation"
                selectedValue={designation}
                items={designationItems}
                onValueChange={(itemValue) =>
                  this.setState({ designation: itemValue, showWarning: false })
                }
              />

              <NeuSelect
                label="Calculation Month"
                placeholder="Select Month"
                selectedValue={selectedMonth}
                items={monthItems}
                onValueChange={(itemValue) =>
                  this.setState({ selectedMonth: itemValue, showWarning: false })
                }
              />
            </NeuCard>

            {/* Card 2: Pay Scale & Grade */}
            <NeuCard
              title="Pay Structure"
              subtitle="7th CPC Pay Band, Level & Basic Rate of Pay"
              variant="convex"
            >
              <InterdependentPickers
                payBand={payBand}
                setPayBand={(value: string) =>
                  this.setState({
                    payBand: value,
                    showWarning: false,
                  })
                }
                level={level}
                setLevel={(value: string) =>
                  this.setState({
                    level: value,
                    showWarning: false,
                  })
                }
                rateOfPay={rateOfPay}
                setRateOfPay={(value: string) =>
                  this.setState({
                    rateOfPay: value,
                    showWarning: false,
                  })
                }
              />
            </NeuCard>
          </View>
        </ScrollView>

        {/* Ergonomic Mobile-First Bottom-Anchored Action Bar */}
        <NeuBottomBar>
          <View style={styles.bottomBarInner}>
            <View style={styles.summaryIndicator}>
              <Text style={styles.summaryLabel}>Status</Text>
              <Text
                style={[
                  styles.summaryValue,
                  { color: isComplete ? NeuColors.success : NeuColors.textSecondary },
                ]}
                numberOfLines={1}
              >
                {isComplete ? '✓ Ready to Calculate' : 'Fill all fields'}
              </Text>
            </View>

            <View style={styles.proceedBtn}>
              <NeuButton
                title="Proceed"
                onPress={this.onContinuePress}
                variant="accent"
                size="md"
                disabled={!isComplete && showWarning}
              />
            </View>
          </View>
        </NeuBottomBar>
      </SafeAreaView>
    );
  }
}

export default EmployeeInfo;
