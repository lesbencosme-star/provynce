import { signTransaction } from '@stellar/freighter-api';
import * as StellarSdk from '@stellar/stellar-sdk';

// Stellar network configuration
export const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;
export const HORIZON_URL = 'https://horizon-testnet.stellar.org';

// Initialize Stellar Server
const server = new StellarSdk.Horizon.Server(HORIZON_URL);

/**
 * Sign and submit a transaction using Freighter Wallet
 */
export async function signAndSubmitTransaction(
  xdr: string,
  network: string = NETWORK_PASSPHRASE
): Promise<StellarSdk.Horizon.HorizonApi.SubmitTransactionResponse> {
  try {
    // Sign the transaction with Freighter
    const signedResponse = await signTransaction(xdr, {
      networkPassphrase: network,
    });

    if (signedResponse.error) {
      throw new Error(
        signedResponse.error.message ||
          `Signing failed with code ${signedResponse.error.code}`
      );
    }

    const signedXdr = signedResponse.signedTxXdr;

    if (!signedXdr) {
      throw new Error('No signed transaction returned from Freighter');
    }

    // Submit the signed transaction to Stellar
    const transactionToSubmit = StellarSdk.TransactionBuilder.fromXDR(
      signedXdr,
      network
    );

    const response = await server.submitTransaction(transactionToSubmit);
    return response;
  } catch (error: any) {
    console.error('Transaction signing/submission error:', error);
    throw new Error(error.message || 'Failed to sign or submit transaction');
  }
}

/**
 * Build a payment transaction
 */
export async function buildPaymentTransaction(
  sourcePublicKey: string,
  destinationPublicKey: string,
  amount: string,
  memo?: string
): Promise<string> {
  try {
    // Load the source account
    const sourceAccount = await server.loadAccount(sourcePublicKey);

    // Build the transaction
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: destinationPublicKey,
          asset: StellarSdk.Asset.native(),
          amount: amount,
        })
      )
      .setTimeout(180);

    // Add memo if provided
    if (memo) {
      transaction.addMemo(StellarSdk.Memo.text(memo));
    }

    const builtTransaction = transaction.build();

    // Return the XDR
    return builtTransaction.toXDR();
  } catch (error: any) {
    console.error('Error building payment transaction:', error);
    throw new Error(error.message || 'Failed to build transaction');
  }
}

/**
 * Build a payment transaction for a custom asset
 */
export async function buildAssetPaymentTransaction(
  sourcePublicKey: string,
  destinationPublicKey: string,
  amount: string,
  assetCode: string,
  assetIssuer: string,
  memo?: string
): Promise<string> {
  try {
    if (!assetIssuer) {
      throw new Error('Asset issuer is required for custom token payments');
    }

    const sourceAccount = await server.loadAccount(sourcePublicKey);
    const asset = new StellarSdk.Asset(assetCode, assetIssuer);

    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: destinationPublicKey,
          asset,
          amount,
        })
      )
      .setTimeout(180);

    if (memo) {
      transaction.addMemo(StellarSdk.Memo.text(memo));
    }

    return transaction.build().toXDR();
  } catch (error: any) {
    console.error('Error building asset payment transaction:', error);
    throw new Error(
      error.message || 'Failed to build asset payment transaction'
    );
  }
}

/**
 * Build a milestone verification transaction
 */
export async function buildMilestoneVerificationTransaction(
  sourcePublicKey: string,
  contractAddress: string,
  milestoneId: number
): Promise<string> {
  try {
    // Load the source account
    const sourceAccount = await server.loadAccount(sourcePublicKey);

    // This is a placeholder for Soroban contract interaction
    // In a real implementation, you would invoke the Soroban contract here
    // For now, we'll create a simple transaction with a memo indicating verification

    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addMemo(
        StellarSdk.Memo.text(`VERIFY_MILESTONE_${milestoneId}`)
      )
      .setTimeout(180)
      .build();

    return transaction.toXDR();
  } catch (error: any) {
    console.error('Error building verification transaction:', error);
    throw new Error(error.message || 'Failed to build verification transaction');
  }
}

/**
 * Build a milestone payment release transaction
 */
export async function buildMilestonePaymentTransaction(
  sourcePublicKey: string,
  contractAddress: string,
  milestoneId: number,
  recipientPublicKey: string,
  amount: string
): Promise<string> {
  try {
    // Load the source account
    const sourceAccount = await server.loadAccount(sourcePublicKey);

    // Build transaction to release milestone payment
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: recipientPublicKey,
          asset: StellarSdk.Asset.native(),
          amount: amount,
        })
      )
      .addMemo(
        StellarSdk.Memo.text(`MILESTONE_${milestoneId}_PAYMENT`)
      )
      .setTimeout(180)
      .build();

    return transaction.toXDR();
  } catch (error: any) {
    console.error('Error building milestone payment transaction:', error);
    throw new Error(error.message || 'Failed to build milestone payment transaction');
  }
}

/**
 * Get account balance
 */
export async function getAccountBalance(publicKey: string): Promise<string> {
  try {
    const account = await server.loadAccount(publicKey);
    const nativeBalance = account.balances.find(
      (balance) => balance.asset_type === 'native'
    );
    return nativeBalance?.balance || '0';
  } catch (error: any) {
    console.error('Error fetching account balance:', error);
    throw new Error(error.message || 'Failed to fetch account balance');
  }
}

/**
 * Check if account exists on the network
 */
export async function checkAccountExists(publicKey: string): Promise<boolean> {
  try {
    await server.loadAccount(publicKey);
    return true;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return false;
    }
    throw error;
  }
}

/**
 * Get transaction history for an account
 */
export async function getTransactionHistory(
  publicKey: string,
  limit: number = 10
): Promise<StellarSdk.Horizon.ServerApi.TransactionRecord[]> {
  try {
    const transactions = await server
      .transactions()
      .forAccount(publicKey)
      .limit(limit)
      .order('desc')
      .call();

    return transactions.records;
  } catch (error: any) {
    console.error('Error fetching transaction history:', error);
    throw new Error(error.message || 'Failed to fetch transaction history');
  }
}
