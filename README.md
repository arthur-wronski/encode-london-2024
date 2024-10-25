# Encode London 2024 Project

A full-stack decentralized application built with Expo (React Native), Supabase, and Stellar blockchain integration. This project demonstrates a modern mobile-first approach to blockchain interactions, supporting iOS, Android, and Web platforms.

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