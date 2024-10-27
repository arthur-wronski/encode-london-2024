# Encode London 2024 Project

Cresco allows the mobile money ecosystem to seamlessly plug-and-play with the Stellar dApp ecosystem. It is a full-stack decentralized application built with Expo (React Native), Supabase, and Stellar blockchain. This project allows users without traditional banking access to interact with blockchain services using Mobile Money. 

Users can seamlessly stake their mobile money in XLM without needing to hold or manage crypto assets themselves. With just a few taps, they can start earning rewards while we handle all the complex blockchain interactions in the background. Designed to bring Web3 to everyday Web2 users, this app is the bridge that makes decentralized finance (DeFi) accessible to anyone, even without prior crypto experience. Future updates will unlock a full suite of dApps and DeFi services, all through a simple, mobile-first interface—empowering users to stake, lend, borrow, and more directly from their mobile phones.

<img width="371" alt="Screenshot 2024-10-27 at 10 59 42" src="https://github.com/user-attachments/assets/474d50c0-f58b-48bf-b767-fdd5547201fd">
<img width="383" alt="Screenshot 2024-10-27 at 10 49 44" src="https://github.com/user-attachments/assets/fd18d758-9bd3-4937-bc3a-9fc1b78ba623">
<img width="381" alt="Screenshot 2024-10-27 at 10 50 27" src="https://github.com/user-attachments/assets/a3bd02ac-eaf4-402d-be4d-efd598600930">

## 🌟 Features

- **Cross-Platform Support**: Built with Expo/React Native for iOS, Android, and Web
- **Stellar Blockchain Integration**: Complete wallet management and payment system
- **Modern UI Components**: 
  - Parallax scrolling effects
  - Dark/Light theme support
  - Animated components
  - Responsive layouts
- **Backend Infrastructure**: 
  - Supabase Functions for serverless operations
  - Secure wallet management
  - Real-time database capabilities

## 🏗 Architecture

### Frontend (Expo/React Native)

The frontend is built using Expo's managed workflow with TypeScript, featuring:

- **File-based Routing**: Using Expo Router for seamless navigation
- **Theming System**: Complete dark/light mode support with context-aware components
- **Reusable Components**:
  - `ThemedText` & `ThemedView` for consistent styling
  - `ParallaxScrollView` for enhanced scrolling experiences
  - `HelloWave` for animated interactions
  - `Collapsible` for expandable content sections

### Backend (Supabase)

The backend leverages Supabase's ecosystem:

- **Edge Functions**:
  - `create-wallet`: Generates and manages Stellar wallets
  - `send-payment`: Handles Stellar payment transactions
- **Database**: Secure storage for wallet credentials and user data
- **Authentication**: Built-in auth system with multiple provider support

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS version)
- npm or yarn
- Supabase CLI
- Expo CLI

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npx expo start
```
### Backend Setup

1. Start Supabase locally:
```bash
supabase start
```
2. Deploy functions:
```bash
supabase functions deploy
```


## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
STELLAR_NETWORK=testnet
```


### Supabase Configuration

The project uses Supabase with the following configuration:
- Authentication enabled with email/password
- Edge functions for blockchain operations
- Real-time subscriptions enabled
- Storage buckets configured

## 📱 Application Structure
```
frontend/
├── app/ # Expo Router pages
├── components/ # Reusable React components
├── constants/ # Theme and configuration constants
├── hooks/ # Custom React hooks
└── assets/ # Images, fonts, and other static files
supabase/
├── functions/ # Edge Functions
└── migrations/ # Database migrations
```


## 🔐 Security

- Private keys are securely stored in Supabase database
- All blockchain transactions are processed server-side
- Environment variables for sensitive data
- Authentication required for all sensitive operations

## 🧪 Testing

Run the test suite:
```bash
cd frontend
npm test
```
