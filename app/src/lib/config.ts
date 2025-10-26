// Stellar network configuration
export const NETWORK = 'testnet'; // or 'mainnet'
export const HORIZON_URL =
  NETWORK === 'testnet'
    ? 'https://horizon-testnet.stellar.org'
    : 'https://horizon.stellar.org';

export const EXPLORER_URL =
  NETWORK === 'testnet'
    ? 'https://stellar.expert/explorer/testnet'
    : 'https://stellar.expert/explorer/public';

export function getExplorerUrl(path: string): string {
  return `${EXPLORER_URL}${path}`;
}

// Token configuration
// For testnet, you'll need to deploy your own PROV token or use a test issuer
export const TOKENS = {
  PROV: {
    code: 'PROV',
    // Replace with your actual token issuer address
    // For now, using a placeholder - you'll need to create this token
    issuer: 'GCZYLRFRR6KMHZSWFE3GK7V2MQXBQYXMJGQ7IQ7Z6PDVGQXPXHQXQQPROV',
    name: 'Provynce Token',
    description: 'Platform governance and utility token',
  },
};

// Escrow wallet address for the platform
// Replace with your actual escrow wallet
export const ESCROW_WALLET = 'GCVXQZ7NJMZTLCWVYP4VJRHQXMQD7WPRQK4HZSYMGNLDRQ';
