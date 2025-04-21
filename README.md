# Monify: Student Budgeting App 🚀
We deployed our website to open : <a href="https://myfinanceapp-d9be2.web.app">click me</a>
---

## 📌 Project Overview

**Monify** is a modern, user-friendly financial management web application designed specifically for students. Built for a hackathon, Monify empowers students to track expenses, manage budgets, set savings goals, and gain financial insights, all within an intuitive and visually appealing interface. With features like real-time budget tracking, AI-powered insights, and customizable categories, Monify helps students make smarter financial decisions.

---

## 🎯 Key Features

### 💸 Budget Management

- **Flexible Budget Periods**: Set and track weekly, monthly, or yearly budgets.
- **Category Budgets**: Allocate budgets to specific categories (e.g., Food, Shopping) and monitor spending.
- **Real-Time Alerts**: Receive notifications when approaching or exceeding budget limits.

### 📊 Transaction Tracking

- **Add Transactions**: Log expenses and income with details like amount, category, date, and description.
- **Import/Export**: Import transactions via CSV and export data for analysis.
- **Transaction History**: View and delete transactions with a responsive table.

### 🎉 Savings Goals

- **Goal Creation**: Set savings goals with target amounts and deadlines (e.g., "Concert ticket").
- **Progress Tracking**: Monitor progress with visual progress bars and percentage completion.
- **Achievements**: Unlock achievements for reaching goals or staying within budget.

### 🧠 AI-Powered Insights

- **Spending Insights**: Get alerts for high spending or budget overruns.
- **Forecasting**: View projected spending based on historical data.
- **Money-Saving Tips**: Receive tailored tips for students, like meal prepping or using discounts.

### 🎨 Customization & UI

- **Dark/Light Mode**: Toggle between themes for comfortable viewing.
- **Custom Categories**: Create new spending categories with icons and colors.
- **Interactive Charts**: Visualize spending with pie, line, and bar charts using Recharts.

---

## 🛠️ Technical Details

### Tech Stack

- **Frontend**: React, JSX, Tailwind CSS
- **Charts**: Recharts for data visualization
- **Authentication**: Firebase Authentication
- **State Management**: React Hooks (`useState`, `useEffect`)
- **Notifications**: React Toastify
- **Storage**: LocalStorage for persistent state
- **Icons**: Lucide React

### Architecture

- **Component-Based**: Modular React components for reusability (e.g., `TransactionTable`).
- **State Persistence**: Uses `loadState` and `saveState` utilities to store data in LocalStorage.
- **Responsive Design**: Tailwind CSS ensures a mobile-friendly, adaptive layout.
- **Data Flow**:
  - Transactions, budgets, and goals are stored in state and synced to LocalStorage.
  - Filtered transactions drive charts and insights.
  - AI insights and forecasts analyze transaction patterns.

### Key Components

- **FinanceApp.jsx**: Main component handling state, UI, and logic.
- **TransactionTable.jsx**: Displays transaction history with delete functionality.
- **forecast.js**: Utility for budget forecasting.
- **storage.js**: Utilities for LocalStorage operations.

---

## 🚀 Hackathon Highlights

### Why Monify Stands Out

- **Student-Centric**: Tailored for students with features like student-specific saving tips.
- **Engaging UX**: Gamified with achievements and a clean, modern design.
- **Scalable**: Modular codebase allows easy addition of features like cloud sync or multi-currency support.
- **Impactful**: Empowers financial literacy among students, addressing a critical need.

### Challenges Overcome

- **Real-Time Updates**: Ensured seamless state updates across components using React Hooks.
- **Data Visualization**: Integrated Recharts for dynamic, responsive charts.
- **Persistent Storage**: Implemented LocalStorage to maintain user data without a backend.
- **UI/UX**: Balanced functionality with a visually appealing, accessible design.

---

## 📈 Future Enhancements

- **Cloud Sync**: Integrate Firebase Firestore for cross-device data access.
- **Multi-Currency Support**: Allow users to track budgets in different currencies.
- **Recurring Transactions**: Support automatic logging of recurring expenses (e.g., subscriptions).
- **Mobile App**: Develop a native mobile version using React Native.
- **Advanced AI**: Enhance insights with machine learning for personalized budgeting advice.

---

## 🖥️ Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or Yarn
- Firebase project for authentication

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-repo/monify.git
   cd monify
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Configure Firebase**:

   - Create a Firebase project at console.firebase.google.com.

   - Enable Authentication (Email/Password).

   - Add your Firebase config to `src/firebase.js`:

     ```javascript
     import { initializeApp } from 'firebase/app';
     import { getAuth } from 'firebase/auth';
     
     const firebaseConfig = {
       apiKey: "your-api-key",
       authDomain: "your-auth-domain",
       projectId: "your-project-id",
       // ... other config
     };
     
     const app = initializeApp(firebaseConfig);
     export const auth = getAuth(app);
     ```

4. **Run the App**:

   ```bash
   npm start
   ```

   The app will run at `http://localhost:5173`.


---

## 🙌 Team Contributions

- **Vikas Kumar**: Implemented core React components, state management, and charts.
- **Hrishav Kumar**: Designed UI with Tailwind CSS and integrated Firebase Authentication.
- **Shreya singh**: youtube vid , debugging and error fixing
- **Kashish Kumari**: PPt making, logo desinging , website designing

---



---

## 🌟 Thank You!

Monify is our passion project to make financial management accessible and fun for students. We hope you love it as much as we do! 🙏

For questions or feedback, reach out at: **monify.team@gmail.com**
