### Railway Allowance Calculator Mobile Application Documentation

#### Overview
The Railway Allowance Calculator mobile application is designed to help Indian Railways employees calculate their monthly allowances based on various parameters such as designation, pay band, level, rate of pay, and trips undertaken. The application features user authentication, data collection forms, calculation logic, and the ability to generate PDF reports.

---

### Table of Contents
1. [Project Structure](#project-structure)
2. [Key Components](#key-components)
   - [App.tsx](#app.tsx)
   - [SignInScreen.tsx](#signinscreen.tsx)
   - [HomeScreen.tsx](#homescreen.tsx)
   - [CalculationPage.tsx](#calculationpage.tsx)
   - [MainTable.tsx](#maintable.tsx)
3. [Styles](#styles)
4. [Utilities](#utilities)
5. [PDF Generation](#pdf-generation)
6. [Navigation](#navigation)
7. [Firebase Integration](#firebase-integration)
8. [Installation and Setup](#installation-and-setup)

---

### Project Structure
```
/railway-allowance-calculator
│
├── /components
│   ├── HomeScreen.tsx
│   ├── CalculationPage.tsx
│   └── MainTable.tsx
│
├── /styles_component
│   ├── styles_dutyRow.tsx
│   ├── styles_homescreen.tsx
│   └── styles_stationpicker.tsx
│
├── /utils
│   ├── constants.tsx
│   └── combinations.tsx
│
├── /firebase
│   └── firebaseConfig.tsx
│
├── App.tsx
├── index.js
└── package.json
```

---

### Key Components

#### App.tsx
The main entry point of the application. It sets up the navigation using React Navigation and includes the Drawer Navigator to switch between different screens.

```typescript
import { enableScreens } from 'react-native-screens';
enableScreens();
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './components/HomeScreen';
import CalculationPage from './components/calcualtionPage/CalculationPage';
import SignInScreen from './signIN/signInScreen';

const Drawer = createDrawerNavigator();

const App = () => (
  <NavigationContainer>
    <Drawer.Navigator initialRouteName="SignIn">
      <Drawer.Screen name="Log Out" component={SignInScreen} options={{ headerShown: false }}/>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="CalculationPage" component={CalculationPage} />
    </Drawer.Navigator>
  </NavigationContainer>
);

export default App;
```

---

#### SignInScreen.tsx
Manages user authentication using Firebase. It includes fields for email and password, and buttons for sign-in and Google sign-in.

```typescript
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase/firebaseConfig';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      await auth.signInWithEmailAndPassword(email, password);
      navigation.navigate('Home');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <ImageBackground style={styles.backgroundImage}>
        <View style={styles.formContainer}>
          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
          <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TouchableOpacity style={styles.signInButton} onPress={handleSignIn} disabled={loading}>
            {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.signInButtonText}>Sign In</Text>}
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backgroundImage: { width: '100%', height: '100%' },
  formContainer: { width: '80%', padding: 20, backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 10 },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 },
  signInButton: { backgroundColor: '#0288D1', padding: 10, borderRadius: 5, alignItems: 'center' },
  signInButtonText: { color: '#fff', fontWeight: 'bold' },
  errorText: { color: 'red', marginBottom: 10 },
});

export default SignInScreen;
```

---

#### HomeScreen.tsx
Collects initial employee information, such as designation, pay band, level, rate of pay, and the selected month. It includes dynamic pickers and a button to proceed to the calculation page.

```typescript
import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import InterdependentPickers from './InterdependentPicker';
import { styles } from '../styles_component/styles_homescreen';
import { designations, months } from '../utils/constants';

class EmployeeInfo extends Component {
  state = {
    designation: '',
    payBand: '',
    level: '',
    rateOfPay: '',
    selectedMonth: '',
    showWarning: false,
  };

  onContinuePress = () => {
    const { designation, payBand, level, rateOfPay, selectedMonth } = this.state;
    if (!designation || !payBand || !level || !rateOfPay || !selectedMonth) {
      this.setState({ showWarning: true });
    } else {
      this.setState({ showWarning: false });
      this.props.navigation.navigate('CalculationPage', {
        designation, payBand, level, rateOfPay, selectedMonth,
      });
    }
  };

  render() {
    return (
      <ScrollView style={{flex: 1}}>
        <View style={styles.homepage}>
          <Text style={styles.allowanceCalculator1}>Railway Allowance Calculator</Text>
          <Picker selectedValue={this.state.designation} onValueChange={(itemValue) => this.setState({ designation: itemValue })}>
            {designations.map((item) => <Picker.Item key={item.value} label={item.label} value={item.value} />)}
          </Picker>
          <InterdependentPickers
            payBand={this.state.payBand}
            setPayBand={(value) => this.setState({ payBand: value })}
            level={this.state.level}
            setLevel={(value) => this.setState({ level: value })}
            rateOfPay={this.state.rateOfPay}
            setRateOfPay={(value) => this.setState({ rateOfPay: value })}
          />
          <Picker selectedValue={this.state.selectedMonth} onValueChange={(itemValue) => this.setState({ selectedMonth: itemValue })}>
            {months.map((item) => <Picker.Item key={item.value} label={item.label} value={item.value} />)}
          </Picker>
          {this.state.showWarning && <Text style={{color: 'red'}}>Please fill all fields</Text>}
          <TouchableOpacity onPress={this.onContinuePress}>
            <Text style={styles.proceedText}>Proceed</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

export default EmployeeInfo;
```

---

#### CalculationPage.tsx
Displays the detailed calculation results based on user inputs. It shows various employee details and includes the MainTable component for displaying the main calculation data.

```typescript
import React from "react";
import { View, Text, ScrollView } from "react-native";
import MainTable from "../main-table/MainTable";
import { calculationPageStyles as styles } from "./calculationPageStyles";

const CalculationPage = ({ route, navigation }) => {
  const { designation, payBand, level, rateOfPay, selectedMonth } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.background}>
          <Text style={styles.text}>Month: {selectedMonth}</Text>
          <Text style={styles.text}>Designation: {designation}</Text>
          <Text style={styles.text}>Level: {level}</Text>
          <Text style={styles.text}>Pay Band: {payBand}</Text>
          <Text style={styles.text}>Rate of Pay

: {rateOfPay}</Text>
        </View>
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
  );
};

export default CalculationPage;
```

---

#### MainTable.tsx
Manages the display and logic of duty and trip calculations. It includes methods for adding new duties and trips, finalizing duties, and various calculation functions.

```typescript
import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { styles } from '../styles_component/styles_dutyRow';

class MainTable extends React.Component {
  state = {
    duties: [],
  };

  addDuty = () => {
    const newDuty = {
      id: this.state.duties.length + 1,
      trips: [],
    };
    this.setState((prevState) => ({
      duties: [...prevState.duties, newDuty],
    }));
  };

  addTrip = (dutyId) => {
    const newTrip = {
      id: Date.now(),
      date: '',
      dutyType: '',
      trainNo: '',
      stations: '',
      time: '',
      duration: '',
      allowance: '',
      remarks: '',
    };
    this.setState((prevState) => ({
      duties: prevState.duties.map((duty) => 
        duty.id === dutyId ? { ...duty, trips: [...duty.trips, newTrip] } : duty
      ),
    }));
  };

  handleEndDuty = (dutyId) => {
    // Logic to finalize duty
  };

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {this.state.duties.map((duty) => (
          <View key={duty.id} style={styles.dutyContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.serialNumber}>Duty {duty.id}</Text>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={[styles.button, styles.addTripButton]} onPress={() => this.addTrip(duty.id)}>
                  <Text style={styles.buttonText}>Add Trip</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.endDutyButton]} onPress={() => this.handleEndDuty(duty.id)}>
                  <Text style={styles.buttonText}>End Duty</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.deleteDutyButton]} onPress={() => this.deleteDuty(duty.id)}>
                  <Text style={styles.buttonText}>Delete Duty</Text>
                </TouchableOpacity>
              </View>
            </View>
            {duty.trips.map((trip) => (
              <View key={trip.id} style={styles.tripContainer}>
                <Text>{trip.date}</Text>
                <Text>{trip.dutyType}</Text>
                <Text>{trip.trainNo}</Text>
                <Text>{trip.stations}</Text>
                <Text>{trip.time}</Text>
                <Text>{trip.duration}</Text>
                <Text>{trip.allowance}</Text>
                <Text>{trip.remarks}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    );
  }
}

export default MainTable;
```

---

### Styles
All styles are defined in separate files within the `styles_component` directory to ensure consistent design across the application.

#### styles_homescreen.tsx
```typescript
import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  homepageFlexBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  homepageBg: {
    marginTop: 30,
  },
  allowanceCalculator1: {
    fontSize: 26,
    color: "#000",
    textAlign: "center",
    alignSelf: "stretch",
  },
  allowanceCalculator: {
    alignSelf: "stretch",
  },
  homepageChild: {
    marginTop: 52,
    ...(Platform.OS === "ios" && {
      overflow: "hidden",
      justifyContent: "center",
    }),
    display: "flex",
    width: 350,
    height: 60,
  },
  homepageItem: {
    marginTop: 52,
    display: "flex",
    ...(Platform.OS === "ios" && { overflow: "hidden" }),
    justifyContent: "center",
    width: 350,
    height: 60,
  },
  homepageInner: {
    width: 350,
    ...(Platform.OS === "ios" && { overflow: "hidden" }),
    display: "flex",
    justifyContent: "center",
  },
  rectanglePressable: {
    width: 180,
    margin: 10,
    height: 40,
    backgroundColor: "#11c2f7",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  proceedText: {
    fontWeight: "600",
    color: "#fff",
  },
  homepage: {
    backgroundColor: "#fff",
    flex: 1,
    width: "100%",
    height: 855,
    overflow: "hidden",
    paddingHorizontal: 93,
    paddingVertical: 82,
  },
});
```

#### styles_dutyRow.tsx
```typescript
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 15,
    padding: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  serialNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  tripContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
  },
  button: {
    flex: 0.5,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  addTripButton: {
    backgroundColor: '#2196F3',
  },
  endDutyButton: {
    backgroundColor: '#2196F3',
  },
  deleteDutyButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default styles;
```

---

### Utilities

#### constants.tsx
Defines constants used throughout the application, such as designations, months, and various options for pay bands and levels.

```typescript
export const designations = [
  { label: "Select Designation", value: "Designation Not Selected" },
  { label: "Locopilot Mail Express", value: "Locopilot Mail Express" },
  {
    label: "Locopilot Passenger/ Sr Motorman",
    value: "Locopilot Passenger/ Sr Motorman",
  },
  { label: "Locopilot Goods", value: "Locopilot Goods" },
  {
    label: "Locopilot Shunting ( Grade I )",
    value: "Locopilot Shunting ( Grade I )",
  },
  {
    label: "Locopilot Shunting ( Grade II )",
    value: "Locopilot Shunting ( Grade II )",
  },
  { label: "Senior Assistant Locopilot", value: "Senior Assistant Locopilot" },
  { label: "Assistant Locopilot", value: "Assistant Locopilot" },
  { label: "Mail Express Train Manager", value: "Mail Express Train Manager" },
  { label: "Passenger Train Manager", value: "Passenger Train Manager" },
  { label: "Senior Goods Train Manager", value: "Senior Goods Train Manager" },
  { label: "Goods Train Manager", value: "Goods Train Manager" },
];

export const months = [
  { label: "Select Month", value: "" },
  { label: "January", value: "January" },
  { label: "February", value: "February" },
  { label: "March", value: "March" },
  { label: "April", value: "April" },
  { label: "May", value: "May" },
  { label: "June", value: "June" },
  { label: "July", value: "July" },
  { label: "August", value: "August" },
  { label: "September", value: "September" },
  { label: "October", value: "October" },
  { label: "November", value: "November" },
  { label: "December", value: "December" },
];

export const levelOptions: Record<string, string[]> = {
  "5200-20200": ["1", "2", "3", "4", "5"],
  "

9300-34800": ["6", "7", "8", "9"],
};

export const payBandOptions: string[] = ["5200-20200", "9300-34800"];

export const rateOfPayOptions: { [key: string]: string[] } = {
  "1": [
    "18000", "18500", "19100", "19700", "20300", "20900", "21500",
    "22100", "22800", "23500", "24200", "24900", "25600", "26400",
    "27200", "28000", "28800", "29700", "30600", "31500", "32400",
    "33400", "34400", "35400", "36500", "37600", "38700", "39900",
    "41100", "42300", "43600", "44900", "46200", "47600", "49000",
    "50500", "52000", "53600", "55200", "56900",
  ],
  // Add other levels similarly
};
```

---

### PDF Generation

#### PDFGenerator.tsx
Generates PDF reports of the allowances calculated. This implementation is for the web platform using jsPDF.

```typescript
import React from 'react';
import { Button, View } from 'react-native';
import jsPDF from 'jspdf';

const PDFGenerator: React.FC = () => {
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Duty Report", 20, 20);
    // Add more content to the PDF
    doc.save("duty-report.pdf");
  };

  return (
    <View>
      <Button title="Generate PDF" onPress={generatePDF} />
    </View>
  );
};

export default PDFGenerator;
```

#### PdfGeneratorMobile.tsx
Generates PDF reports for the mobile platform using expo-print and expo-sharing.

```typescript
import React from 'react';
import { Button, View } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const PdfGeneratorMobile: React.FC = () => {
  const generatePDF = async () => {
    const htmlContent = `
      <html>
        <body>
          <h1>Duty Report</h1>
          <!-- Add more content here -->
        </body>
      </html>
    `;
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    await Sharing.shareAsync(uri);
  };

  return (
    <View>
      <Button title="Generate PDF" onPress={generatePDF} />
    </View>
  );
};

export default PdfGeneratorMobile;
```

---

### Navigation

#### createNativeStackNavigator.tsx
Defines the navigation structure using React Navigation's Native Stack Navigator.

```typescript
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../components/HomeScreen';
import CalculationPage from '../components/calcualtionPage/CalculationPage';
import SignInScreen from '../signIN/signInScreen';

const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <Stack.Navigator initialRouteName="SignIn">
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CalculationPage" component={CalculationPage} />
    </Stack.Navigator>
  );
};

export default MyStack;
```

---

### Firebase Integration

#### firebaseConfig.tsx
Configures Firebase for the application, including initializing the Firebase app and exporting the authentication module.

```typescript
import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

export { auth };
```

---

### Installation and Setup

#### Prerequisites
- Node.js
- npm or yarn
- Expo CLI (for React Native)

#### Steps
1. **Clone the Repository**:
   ```sh
   git clone https://github.com/yourusername/railway-allowance-calculator.git
   cd railway-allowance-calculator
   ```

2. **Install Dependencies**:
   ```sh
   npm install
   ```

3. **Setup Firebase**:
   - Create a Firebase project and configure the authentication module.
   - Replace the configuration in `firebaseConfig.tsx` with your Firebase project's details.

4. **Run the Application**:
   ```sh
   npm start
   ```

---

This comprehensive documentation covers the main aspects of the Railway Allowance Calculator application, including its structure, key components, styles, utilities, PDF generation, navigation, and Firebase integration. Each section is detailed with code snippets to provide a clear understanding of the implementation.