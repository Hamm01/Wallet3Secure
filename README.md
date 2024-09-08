# Wallet3Secure

Wallet3Secure is a modern, web-based cryptocurrency wallet that allows users to generate, manage, and interact with Ethereum and Solana wallets. Built with React, Tailwind CSS, Material UI, and shadcn/ui, it provides a seamless and secure experience for both new and experienced crypto users.

---

## 🚀 Features

- **Mnemonic-Based Wallet Generation:**  
  Generate wallets using 12-word BIP39 mnemonic phrases. Restore wallets using your secret phrase.

- **Multi-Blockchain Support:**  
  Create and manage wallets for both **Ethereum** and **Solana** blockchains. Choose your preferred blockchain before generating a wallet.

- **Multiple Wallets:**  
  Create and manage multiple wallets for each blockchain. Each wallet has its own public and private keys.

- **Balance Fetching:**  
  Instantly fetch and display wallet balances for Ethereum (ETH) and Solana (SOL).

- **Send & Receive Crypto:**

  - **Send:** Transfer ETH or SOL to any valid address directly from your wallet.
  - **Receive:** Share your public address or QR code to receive funds.

- **QR Code Generation:**  
  Generate QR codes for your public addresses for easy sharing and receiving.

- **Private Key Management:**  
  Toggle visibility of private keys for security. Copy public/private keys to clipboard.

- **Network Switching:**  
  Easily switch between Mainnet and Devnet/Testnet for both Ethereum and Solana.

- **Animated UI:**  
  Smooth transitions and animations powered by **framer-motion** for a modern user experience.

- **Dark/Light Theme:**  
  Toggle between dark and light modes. Theme preference is saved locally.

---

## 🛠️ Tech Stack

- **Frontend:**

  - [React](https://react.dev/) (with TypeScript)
  - [Vite](https://vitejs.dev/) (for fast development)
  - [Tailwind CSS](https://tailwindcss.com/) (utility-first styling)
  - [Material UI](https://mui.com/) (for some UI components)
  - [shadcn/ui](https://ui.shadcn.com/) (Radix UI + Tailwind component library)
  - [framer-motion](https://www.framer.com/motion/) (animations)

- **Blockchain & Crypto:**

  - [bip39](https://github.com/bitcoinjs/bip39) (mnemonic phrase generation)
  - [@solana/web3.js](https://solana-labs.github.io/solana-web3.js/) (Solana wallet & transactions)
  - [ed25519-hd-key](https://github.com/paulmillr/ed25519-hd-key) (Solana key derivation)
  - [ethereum-cryptography](https://github.com/ethereum/js-ethereum-cryptography) (Ethereum HD key derivation)
  -

- **UI/UX:**
  - [lucide-react](https://lucide.dev/) (icon library)
  - [sonner](https://sonner.emilkowal.ski/) (toast notifications)
  - [Radix UI](https://www.radix-ui.com/) (accessible primitives)

---

## 📦 Libraries Used

- **State & Utility:**

  - `react`, `react-dom`, `clsx`, `class-variance-authority`, `tailwind-merge`

- **Styling:**

  - `tailwindcss`, `postcss`, `autoprefixer`, `tailwindcss-animate`

- **Development:**
  - `vite`, `@vitejs/plugin-react`, `eslint`, `typescript`

---

## 📝 How It Works

1. **Wallet Generation:**

   - Enter or generate a 12-word mnemonic phrase.
   - Select Ethereum or Solana.
   - The app derives the appropriate keypair using BIP39 and blockchain-specific derivation paths.

2. **Wallet Management:**

   - View all created wallets.
   - Copy public/private keys.
   - Toggle private key visibility.

3. **Transactions:**

   - Fetch wallet balance.
   - Send ETH/SOL to another address.
   - Receive funds using your public address or QR code.

4. **Network Switching:**

   - Switch between Mainnet and Devnet for testing or real transactions.

5. **Theming:**
   - Toggle between dark and light modes for better accessibility.

---

## 🖥️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

```sh
git clone https://github.com/hamm01/web-3Wallet.git
cd web-3Wallet
npm install
```
