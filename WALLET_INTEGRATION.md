# Freighter Wallet Integration Guide

This document explains how Freighter Wallet is integrated into the Provynce platform and how to use the wallet features.

## Overview

The Provynce frontend is now integrated with **Freighter Wallet**, a browser extension wallet for the Stellar blockchain. Users can:

- Connect their Stellar wallet
- View their public address
- Sign and submit transactions to the Stellar network
- Verify milestones on-chain
- Release payments for completed milestones

## Installation Requirements

### 1. Install Freighter Wallet

Users need to have Freighter Wallet installed in their browser:

- Download from: [https://www.freighter.app/](https://www.freighter.app/)
- Available for Chrome, Firefox, Edge, and Brave browsers
- Create or import a Stellar account

### 2. Configure Network

Provynce is configured to use **Stellar Testnet** by default:
- Network: Testnet
- Horizon URL: `https://horizon-testnet.stellar.org`

## Features

### 1. Wallet Connection

**Location**: Top-right corner of every page

**How it works**:
- Click "Connect Wallet" button
- Freighter extension will open
- Approve the connection request
- Your wallet address will be displayed

**Code Example**:
```tsx
import WalletConnect from '@/components/WalletConnect';

function MyComponent() {
  return <WalletConnect />;
}
```

### 2. Wallet Context

The wallet state is managed globally using React Context:

```tsx
import { useWallet } from '@/context/WalletContext';

function MyComponent() {
  const {
    publicKey,           // User's Stellar public address
    isWalletConnected,   // Connection status
    isFreighterInstalled, // Freighter detection
    connectWallet,       // Function to connect
    disconnectWallet,    // Function to disconnect
    error,               // Error messages
  } = useWallet();

  return (
    <div>
      {isWalletConnected ? (
        <p>Connected: {publicKey}</p>
      ) : (
        <button onClick={connectWallet}>Connect</button>
      )}
    </div>
  );
}
```

### 3. Transaction Signing

The platform includes utilities for building and signing transactions:

**Available Functions** (`/src/utils/stellar.ts`):

#### Sign and Submit Transaction
```tsx
import { signAndSubmitTransaction } from '@/utils/stellar';

const xdr = '...'; // Transaction XDR
const result = await signAndSubmitTransaction(xdr);
```

#### Build Payment Transaction
```tsx
import { buildPaymentTransaction } from '@/utils/stellar';

const xdr = await buildPaymentTransaction(
  sourcePublicKey,
  destinationPublicKey,
  '100',  // Amount in XLM
  'Payment for Milestone 1' // Optional memo
);
```

#### Milestone Verification
```tsx
import { buildMilestoneVerificationTransaction } from '@/utils/stellar';

const xdr = await buildMilestoneVerificationTransaction(
  sourcePublicKey,
  contractAddress,
  milestoneId
);
```

#### Milestone Payment Release
```tsx
import { buildMilestonePaymentTransaction } from '@/utils/stellar';

const xdr = await buildMilestonePaymentTransaction(
  sourcePublicKey,
  contractAddress,
  milestoneId,
  recipientPublicKey,
  '5000' // Amount in XLM
);
```

### 4. Verify Milestone Button Component

A ready-to-use component for milestone verification:

```tsx
import VerifyMilestoneButton from '@/components/VerifyMilestoneButton';

function MilestoneCard() {
  return (
    <VerifyMilestoneButton
      milestoneId={1}
      milestoneName="Foundation Complete"
      contractAddress="CONTRACT_ADDRESS_HERE"
      onVerificationComplete={() => {
        console.log('Milestone verified!');
      }}
    />
  );
}
```

## User Flow

### Connecting a Wallet

1. User clicks "Connect Wallet" button
2. Freighter extension opens with permission request
3. User approves connection
4. Wallet address appears in header
5. User can now sign transactions

### Verifying a Milestone

1. Navigate to project detail page
2. Go to "Milestones" tab
3. Find a milestone ready for verification
4. Click "Verify Milestone" button
5. Freighter opens with transaction details
6. Review and approve the transaction
7. Transaction is submitted to Stellar
8. Confirmation message appears

### Disconnecting Wallet

1. Click on connected wallet address in header
2. Dropdown menu appears
3. Click "Disconnect Wallet"
4. Wallet state is cleared

## Security Considerations

- **Never expose private keys**: Private keys stay in Freighter; the app only receives public keys
- **Transaction review**: All transactions must be approved by the user in Freighter
- **Network verification**: Always verify you're on the correct network (Testnet/Mainnet)
- **Amount verification**: Double-check payment amounts before approving

## Testing with Your Address

Your test address: `GC4E3ZK24EFORRFPYCJL7BAMZYMDLOYLPAXWG2RN55UZZ2CXAOMEPTLO`

### Get Test XLM

1. Visit Stellar's Friendbot: [https://friendbot.stellar.org/](https://friendbot.stellar.org/)
2. Enter your public address
3. Click "Get test network lumens"
4. Your account will be funded with 10,000 XLM on testnet

### View Your Account

- Stellar Expert: `https://stellar.expert/explorer/testnet/account/YOUR_ADDRESS`
- StellarChain: `https://testnet.stellarchain.io/accounts/YOUR_ADDRESS`

## Troubleshooting

### Freighter Not Detected

**Problem**: "Freighter wallet is not installed" message appears

**Solution**:
1. Install Freighter from [freighter.app](https://www.freighter.app/)
2. Refresh the page
3. Try connecting again

### Connection Failed

**Problem**: "Failed to connect wallet" error

**Solution**:
1. Ensure Freighter is unlocked
2. Check that you approved the connection request
3. Try refreshing the page and reconnecting
4. Check browser console for detailed errors

### Transaction Failed

**Problem**: Transaction submission fails

**Solution**:
1. Ensure your account has sufficient XLM balance
2. Check network connectivity
3. Verify you're on the correct network (Testnet)
4. Check the transaction details in Freighter
5. Review browser console for error messages

### Account Not Found

**Problem**: "Account does not exist" error

**Solution**:
1. Fund your account using Friendbot (testnet)
2. Ensure the account has been activated with minimum balance

## Technical Architecture

### Components

- **`WalletContext.tsx`**: Global wallet state management
- **`WalletConnect.tsx`**: Connect/disconnect UI component
- **`VerifyMilestoneButton.tsx`**: Milestone verification UI

### Utilities

- **`stellar.ts`**: Transaction building and signing functions

### Dependencies

- `@stellar/freighter-api`: Freighter wallet integration
- `@stellar/stellar-sdk`: Stellar SDK for transaction building

## Future Enhancements

Planned features for future releases:

1. **Multi-signature support**: Enable multiple verifiers per milestone
2. **Soroban contract integration**: Direct smart contract interactions
3. **Transaction history**: Display user's Provynce-related transactions
4. **Account balance display**: Show XLM balance in wallet dropdown
5. **Network switching**: Toggle between Testnet and Mainnet
6. **Custom token support**: Handle non-native assets
7. **Gas estimation**: Show estimated transaction fees

## Resources

- Freighter Documentation: [https://docs.freighter.app/](https://docs.freighter.app/)
- Stellar SDK Documentation: [https://stellar.github.io/js-stellar-sdk/](https://stellar.github.io/js-stellar-sdk/)
- Stellar Network Overview: [https://www.stellar.org/developers](https://www.stellar.org/developers)
- Horizon API Reference: [https://developers.stellar.org/api/horizon](https://developers.stellar.org/api/horizon)

## Support

For issues or questions:
1. Check browser console for error messages
2. Review Freighter documentation
3. Check Stellar status page for network issues
4. Refer to this guide for common solutions
