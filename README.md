# Railway Allowance Calculator

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Project Structure](#project-structure)
5. [Installation](#installation)
6. [Usage](#usage)
7. [Contributing](#contributing)
8. [License](#license)

## Introduction

The Railway Allowance Calculator is a comprehensive tool designed for railway employees to calculate various allowances based on their duties, trips, and other factors. This application streamlines the process of tracking and calculating allowances, making it easier for both employees and management to manage compensation accurately.

## Features

- User authentication and data persistence using Firebase
- Dynamic duty and trip management
- Real-time allowance calculations including:
  - Mileage
  - Night Duty Allowance
  - Leave Mileage Allowance
  - Overtime Allowance
  - Dearness Allowance
  - RRA/OSDA (Running Room Allowance/Outstation Duty Allowance)
- PDF generation for reports
- Cross-platform support (web and mobile)
- Fortnight-based overtime calculations
- Customizable employee information (designation, pay band, level, rate of pay)

## Technologies Used

- React Native
- TypeScript
- Firebase (Authentication and Firestore)
- React Navigation
- Expo
- jsPDF (for PDF generation)
- React Native Paper (UI components)

## Project Structure

The project follows a component-based architecture. Here are some key directories and files:

- `/components`: Contains all React components
  - `/main-table`: Main table component and related utilities
  - `/duty`: Duty-related components and logic
  - `/trip`: Trip-related components
  - `/allowancecalculation`: Various allowance calculation modules
  - `/pdfGeneration`: PDF generation logic
- `/firebase`: Firebase configuration and data management
- `/utils`: Utility functions and constants
- `/styles_component`: Styles for various components

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/railway-allowance-calculator.git
   cd railway-allowance-calculator
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up Firebase:
   - Create a new Firebase project at https://console.firebase.google.com/
   - Enable Authentication and Firestore in your Firebase project
   - Copy your Firebase configuration details

4. Create a `.env` file in the root directory and add your Firebase configuration:
   ```
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_auth_domain
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   FIREBASE_APP_ID=your_app_id
   ```

5. Start the development server:
   ```
   npm start
   ```

## Usage

1. Launch the application on your preferred platform (web browser, iOS simulator, or Android emulator).
2. Log in or create a new account.
3. Enter your employee information (designation, pay band, level, rate of pay).
4. Select the month for which you want to calculate allowances.
5. Add duties and trips using the interface provided.
6. The application will automatically calculate various allowances based on the input data.
7. Generate a PDF report for the selected month's allowances.

## Contributing

We welcome contributions to the Railway Allowance Calculator project. Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes and commit them with descriptive commit messages
4. Push your changes to your fork
5. Submit a pull request to the main repository

Please ensure that your code follows the existing style and includes appropriate tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
