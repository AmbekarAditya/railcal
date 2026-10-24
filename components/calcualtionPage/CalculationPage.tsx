// CalculationPage.tsx
import React from "react";
import { View, Text, ScrollView, SafeAreaView, StatusBar } from "react-native";
import MainTable from "../main-table/MainTable";
import { calculationPageStyles as styles } from "./calculationPageStyles";
import { RouteProp } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { NeuColors } from "../../src/theme/neomorphicTheme";

type RootStackParamList = {
  CalculationPage: {
    designation: string;
    payBand: any;
    level: any;
    rateOfPay: any;
    selectedMonth: string;
  };
};

type CalculationPageRouteProp = RouteProp<RootStackParamList, "CalculationPage">;

interface CalculationPageProps {
  route: CalculationPageRouteProp;
  navigation: NavigationProp<RootStackParamList>;
}

const CalculationPage: React.FC<CalculationPageProps> = ({ route, navigation }) => {
  const { designation, payBand, level, rateOfPay, selectedMonth } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={NeuColors.background} />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Employee & Period Overview Card */}
          <View style={styles.employeeCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.headerBadge}>INDIAN RAILWAYS</Text>
              <View style={styles.monthBadge}>
                <Text style={styles.monthText}>{selectedMonth || "Month"}</Text>
              </View>
            </View>

            <Text style={styles.designationText}>{designation || "Running Staff"}</Text>

            <View style={styles.chipsRow}>
              <View style={styles.chip}>
                <Text style={styles.chipText}>
                  Level: <Text style={styles.chipTextBold}>{level || "-"}</Text>
                </Text>
              </View>
              <View style={styles.chip}>
                <Text style={styles.chipText}>
                  Band: <Text style={styles.chipTextBold}>{payBand || "-"}</Text>
                </Text>
              </View>
              <View style={styles.chip}>
                <Text style={styles.chipText}>
                  Rate: <Text style={styles.chipTextBold}>₹{rateOfPay || "-"}</Text>
                </Text>
              </View>
            </View>
          </View>

          {/* 3 Main Vertical Blocks: Duties Block -> Fortnight Block -> Summary Block */}
          <MainTable
            navigation={navigation}
            rateOfPay={rateOfPay}
            designation={designation}
            payBand={payBand}
            level={level}
            selectedMonth={selectedMonth}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CalculationPage;
