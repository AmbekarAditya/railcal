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
  NeuSpacing,
  NeuRadii,
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
      designation: 'Locopilot Mail Express',
      payBand: '9300-34800',
      level: '6',
      rateOfPay: '35400',
      selectedMonth: 'January',
      showWarning: false,
    };
  }

  async componentDidMount() {
    try {
      const loadedState = await loadEmployeeInfoStateFromFirestore();
      if (loadedState && loadedState.designation) {
        this.setState(loadedState);
      }
    } catch (e) {
      console.warn('Could not load saved state from Firestore:', e);
    }
  }

  onContinuePress = () => {
    const { designation, payBand, level, rateOfPay, selectedMonth } = this.state;

    const finalDesignation =
      designation && designation !== 'Designation Not Selected'
        ? designation
        : 'Locopilot Mail Express';
    const finalMonth = selectedMonth || 'January';
    const finalPayBand = payBand || '9300-34800';
    const finalLevel = level || '6';
    const finalRate = rateOfPay || '35400';

    const selectedDesignation = designations.find((item) => item.label === finalDesignation);
    const designationValue = selectedDesignation ? selectedDesignation.value : finalDesignation;

    this.setState({ showWarning: false });

    // Save in background without blocking UI
    try {
      saveEmployeeInfoStateToFirestore({
        designation: finalDesignation,
        payBand: finalPayBand,
        level: finalLevel,
        rateOfPay: finalRate,
        selectedMonth: finalMonth,
        showWarning: false,
      });
    } catch (e) {
      console.warn('Could not save employee info state:', e);
    }

    // Direct immediate navigation to CalculationPage
    if (this.props.navigation) {
      this.props.navigation.navigate('CalculationPage', {
        designation: designationValue,
        payBand: finalPayBand,
        level: finalLevel,
        rateOfPay: finalRate,
        selectedMonth: finalMonth,
      });
    }
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

            {/* Direct In-Form Action Button */}
            <View style={{ width: '100%', marginTop: NeuSpacing.md, marginBottom: 80 }}>
              <NeuButton
                title="Proceed to Allowance Sheet →"
                onPress={this.onContinuePress}
                variant="accent"
                size="lg"
                fullWidth
              />
            </View>
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
                {isComplete ? '✓ Ready to Calculate' : 'Tap to Calculate'}
              </Text>
            </View>

            <View style={styles.proceedBtn}>
              <NeuButton
                title="Proceed →"
                onPress={this.onContinuePress}
                variant="accent"
                size="md"
              />
            </View>
          </View>
        </NeuBottomBar>
      </SafeAreaView>
    );
  }
}

export default EmployeeInfo;
