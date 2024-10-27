# Encode London 2024 Project

## What is Cresco?
Mobile money has empowered those without traditional banking to transact peer-to-peer—but it’s limited.

It operates in silos, cut off from the broader financial benefits beyond its ecosystem.

Cresco changes the game, letting mobile money users plug-and-play with the entire Stellar dApp ecosystem for seamless access to staking protocols and more.

## How was Cresco Built?
Under the hood, CrescoIt is a full-stack decentralized application built with Expo (React Native), Supabase, and Stellar blockchain. This project allows users without traditional banking access to interact with blockchain services using Mobile Money. 

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
- A Supabase project (create one at https://supabase.com)
- Mobile Money API credentials (for production)

### Project Setup

1. Clone the repository and install dependencies for all packages:
```bash
cd frontend
npm install

cd ../server
npm install
```

2. Start the development server:
```bash
npx expo start
```


2. Set up your environment variables:

Create a `.env` file in the server directory:
```env
PORT=3000
BASE_URL=your_mobile_money_api_url
CONSUMER_KEY=your_consumer_key
CONSUMER_SECRET=your_consumer_secret
API_KEY=your_api_key
```


Create a `.env` file in the frontend directory:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Setup

1. Initialize your Supabase project:
```bash
supabase init
```

2. Link to your Supabase project:
```bash
supabase link --project-ref your-project-ref
```


3. Start Supabase locally:
```bash
supabase start
```

4. Deploy the Edge Functions:
```bash
supabase functions deploy create-wallet
supabase functions deploy send-payment
supabase functions deploy get-balance
```

5. Set up the required database tables:
```sql
-- Create wallet storage table
create table stellar_wallets (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id),
    public_key text not null,
    private_key text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- Create mobile money links table
create table mobile_money_links (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id),
    mobile_number text not null,
    link_reference text not null,
    status text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
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


### Running the Application

1. Start the proxy server (required for mobile money integration):
```bash
cd server
npm run dev
```

2. Start the frontend application:
```bash
cd frontend
npx expo start
```

The application will start in development mode. You can run it on:
- iOS simulator
- Android emulator
- Physical device using Expo Go
- Web browser

### Development Notes

- The application uses the Stellar testnet by default. For production, update the network configuration in the Edge Functions.
- Mobile money integration requires valid API credentials and runs through the proxy server to handle CORS and security.
- Wallet creation automatically funds accounts using Friendbot on testnet. For production, implement proper funding mechanisms.

## 🔧 Configuration

### Environment Variables

For reference to the full configuration options, see:


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
project-root/
├── frontend/
│   ├── app/                    # Expo Router pages
│   │   ├── (tabs)/            # Tab-based navigation
│   │   │   ├── login.tsx      # Login screen
│   │   │   ├── dashboard.tsx  # Main dashboard
│   │   │   ├── transactions.tsx
│   │   │   ├── earn.tsx      # Staking interface
│   │   │   ├── pay.tsx       # Payment interface
│   │   │   └── settings.tsx
│   │   ├── +html.tsx         # Web-specific configuration
│   │   ├── +not-found.tsx    # 404 page
│   │   └── _layout.tsx       # Root layout configuration
│   ├── components/           # Reusable React components
│   │   ├── BottomNav.tsx    # Navigation bar
│   │   ├── HelloWave.tsx    # Animated components
│   │   ├── ThemedText.tsx   # Theme-aware text
│   │   ├── ThemedView.tsx   # Theme-aware views
│   │   ├── ParallaxScrollView.tsx
│   │   └── Collapsible.tsx
│   ├── lib/                 # Core utilities
│   │   ├── supabase.ts     # Supabase client configuration
│   │   └── config.ts       # Application configuration
│   ├── hooks/              # Custom React hooks
│   │   ├── useColorScheme.ts
│   │   └── useThemeColor.ts
│   ├── constants/          # Application constants
│   │   └── Colors.ts      # Theme colors
│   └── assets/            # Static assets
│
├── server/                # Express proxy server
│   ├── index.ts          # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
└── supabase/             # Supabase backend
    ├── functions/        # Edge Functions
    │   ├── create-wallet/
    │   ├── send-payment/
    │   └── get-balance/
    └── migrations/       # Database migrations
```

### Key Components

#### Frontend
- **App Directory**: Uses Expo Router for file-based routing
- **Components**: Reusable UI components with theming support
- **Hooks**: Custom hooks for theme and color management
- **Lib**: Core utilities including Supabase client setup

#### Server
- Express server acting as a proxy for Mobile Money API
- Handles CORS and API key management
- TypeScript configuration for type safety

#### Supabase
- Edge Functions for blockchain operations
- Database tables for:
  - Stellar wallets
  - Mobile money links
  - User data

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
