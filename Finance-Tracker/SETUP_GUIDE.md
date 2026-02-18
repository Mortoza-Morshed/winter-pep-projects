# 🚀 Quick Start Guide - Finance Tracker

Follow these steps to get your Finance Tracker up and running!

## Step 1: Install Dependencies

Open PowerShell or Command Prompt in the project folder and run:

```powershell
npm install
```

Wait for all packages to install (this may take 2-3 minutes).

## Step 2: Set Up Firebase

### 2.1 Create Firebase Project
1. Visit https://console.firebase.google.com/
2. Click "Add project"
3. Enter project name: "finance-tracker" (or your choice)
4. Disable Google Analytics (optional)
5. Click "Create project"

### 2.2 Register Web App
1. In your Firebase project, click the **Web icon** (</>)
2. Register app with nickname: "Finance Tracker Web"
3. **Copy the firebaseConfig object**

### 2.3 Update Firebase Configuration
1. Open `src/firebase.js` in your code editor
2. Replace the placeholder values with your copied config:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",              // Your actual API key
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123:web:abc123"
};
```

### 2.4 Enable Authentication
1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Click "Email/Password"
4. Enable the first toggle (Email/Password)
5. Click "Save"

### 2.5 Create Firestore Database
1. Go to **Firestore Database**
2. Click "Create database"
3. Select "Start in **test mode**"
4. Choose your location (closest to you)
5. Click "Enable"

### 2.6 Set Security Rules
1. In Firestore, click the "Rules" tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /transactions/{transaction} {
      allow read, write: if request.auth != null && 
                         request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

3. Click "Publish"

## Step 3: Run the Application

In your terminal, run:

```powershell
npm run dev
```

The app will automatically open at http://localhost:3000

## Step 4: Test the Application

1. **Sign Up**: Create a new account
2. **Add Transaction**: Click "Add Transaction" button
3. **View Charts**: See your data visualized
4. **Toggle Theme**: Click moon/sun icon for dark/light mode
5. **Filter**: Use search and filters to find transactions

## 🎯 Terminal Commands Summary

```powershell
# Navigate to project folder
cd C:\Users\prana\OneDrive\Desktop\Taz_Projects\Finance-Tracker

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production (optional)
npm run build

# Preview production build (optional)
npm run preview
```

## ✅ Verification Checklist

- [ ] Node.js installed (check with `node --version`)
- [ ] Dependencies installed successfully
- [ ] Firebase project created
- [ ] Firebase config updated in `src/firebase.js`
- [ ] Authentication enabled
- [ ] Firestore database created
- [ ] Security rules published
- [ ] App running on localhost:3000
- [ ] Can sign up and login
- [ ] Can add/edit/delete transactions

## 🐛 Common Issues

**Issue**: `npm install` fails
- **Solution**: Make sure Node.js is installed. Download from https://nodejs.org/

**Issue**: Firebase errors when signing up
- **Solution**: Check that Email/Password authentication is enabled in Firebase Console

**Issue**: Can't add transactions
- **Solution**: Verify Firestore database is created and security rules are published

**Issue**: Port 3000 already in use
- **Solution**: The app will automatically use port 3001. Check terminal for the actual URL.

## 📞 Need Help?

Check the main README.md for detailed documentation and troubleshooting.

---

**You're all set! Enjoy tracking your finances! 💰**
