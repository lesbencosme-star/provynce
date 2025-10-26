import * as StellarSdk from '@stellar/stellar-sdk';
import { CONTRACT_IDS, getNetworkConfig } from './config';

// Types matching the contract
export interface Project {
  id: number;
  name: string;
  owner: string;
  total_budget: string;
  released_funds: string;
  active: boolean;
}

export interface Milestone {
  id: number;
  project_id: number;
  description: string;
  amount: string;
  verifications_required: number;
  verifications_received: number;
  completed: boolean;
}

// Initialize Stellar Server
export const getServer = () => {
  const config = getNetworkConfig();
  return new StellarSdk.SorobanRpc.Server(config.sorobanRpcUrl);
};

// Build and submit a transaction
export async function submitTransaction(
  sourceKeypair: StellarSdk.Keypair,
  operation: StellarSdk.xdr.Operation
): Promise<StellarSdk.SorobanRpc.Api.GetTransactionResponse> {
  const config = getNetworkConfig();
  const server = getServer();

  // Get account
  const sourceAccount = await server.getAccount(sourceKeypair.publicKey());

  // Build transaction
  const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: config.networkPassphrase,
  })
    .addOperation(operation)
    .setTimeout(30)
    .build();

  // Simulate transaction
  const simulated = await server.simulateTransaction(transaction);

  if (StellarSdk.SorobanRpc.Api.isSimulationError(simulated)) {
    throw new Error(`Simulation failed: ${simulated.error}`);
  }

  // Prepare transaction
  const prepared = StellarSdk.SorobanRpc.assembleTransaction(
    transaction,
    simulated
  ).build();

  // Sign transaction
  prepared.sign(sourceKeypair);

  // Submit transaction
  const result = await server.sendTransaction(prepared);

  // Wait for transaction
  let status = await server.getTransaction(result.hash);
  while (status.status === 'NOT_FOUND') {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    status = await server.getTransaction(result.hash);
  }

  return status;
}

// Contract Methods

export async function createProject(
  sourceKeypair: StellarSdk.Keypair,
  name: string,
  totalBudget: bigint
): Promise<number> {
  const contract = new StellarSdk.Contract(CONTRACT_IDS.cityworksEscrow);

  const operation = contract.call(
    'create_project',
    StellarSdk.nativeToScVal(name, { type: 'string' }),
    StellarSdk.nativeToScVal(sourceKeypair.publicKey(), { type: 'address' }),
    StellarSdk.nativeToScVal(totalBudget, { type: 'i128' })
  );

  const result = await submitTransaction(sourceKeypair, operation);

  if (result.status === 'SUCCESS' && result.returnValue) {
    return StellarSdk.scValToNative(result.returnValue) as number;
  }

  throw new Error('Failed to create project');
}

export async function createMilestone(
  sourceKeypair: StellarSdk.Keypair,
  projectId: number,
  description: string,
  amount: bigint,
  verificationsRequired: number
): Promise<number> {
  const contract = new StellarSdk.Contract(CONTRACT_IDS.cityworksEscrow);

  const operation = contract.call(
    'create_milestone',
    StellarSdk.nativeToScVal(projectId, { type: 'u32' }),
    StellarSdk.nativeToScVal(description, { type: 'string' }),
    StellarSdk.nativeToScVal(amount, { type: 'i128' }),
    StellarSdk.nativeToScVal(verificationsRequired, { type: 'u32' })
  );

  const result = await submitTransaction(sourceKeypair, operation);

  if (result.status === 'SUCCESS' && result.returnValue) {
    return StellarSdk.scValToNative(result.returnValue) as number;
  }

  throw new Error('Failed to create milestone');
}

export async function verifyMilestone(
  sourceKeypair: StellarSdk.Keypair,
  milestoneId: number
): Promise<void> {
  const contract = new StellarSdk.Contract(CONTRACT_IDS.cityworksEscrow);

  const operation = contract.call(
    'verify_milestone',
    StellarSdk.nativeToScVal(milestoneId, { type: 'u32' }),
    StellarSdk.nativeToScVal(sourceKeypair.publicKey(), { type: 'address' })
  );

  const result = await submitTransaction(sourceKeypair, operation);

  if (result.status !== 'SUCCESS') {
    throw new Error('Failed to verify milestone');
  }
}

export async function releasePayment(
  sourceKeypair: StellarSdk.Keypair,
  milestoneId: number,
  tokenAddress: string,
  recipient: string
): Promise<void> {
  const contract = new StellarSdk.Contract(CONTRACT_IDS.cityworksEscrow);

  const operation = contract.call(
    'release_payment',
    StellarSdk.nativeToScVal(milestoneId, { type: 'u32' }),
    StellarSdk.nativeToScVal(tokenAddress, { type: 'address' }),
    StellarSdk.nativeToScVal(recipient, { type: 'address' })
  );

  const result = await submitTransaction(sourceKeypair, operation);

  if (result.status !== 'SUCCESS') {
    throw new Error('Failed to release payment');
  }
}

export async function getProject(projectId: number): Promise<Project> {
  const server = getServer();
  const contract = new StellarSdk.Contract(CONTRACT_IDS.cityworksEscrow);

  // This is a simplified version - in production, you'd need to properly call the contract
  // For now, this demonstrates the structure
  const operation = contract.call(
    'get_project',
    StellarSdk.nativeToScVal(projectId, { type: 'u32' })
  );

  // Note: Reading from contract requires a different approach in production
  // This is a placeholder for the actual implementation
  throw new Error('Not implemented - use demo data for now');
}

export async function getMilestone(milestoneId: number): Promise<Milestone> {
  const server = getServer();
  const contract = new StellarSdk.Contract(CONTRACT_IDS.cityworksEscrow);

  const operation = contract.call(
    'get_milestone',
    StellarSdk.nativeToScVal(milestoneId, { type: 'u32' })
  );

  // Note: Reading from contract requires a different approach in production
  // This is a placeholder for the actual implementation
  throw new Error('Not implemented - use demo data for now');
}

// Helper: Generate a random keypair for testing
export function generateKeypair(): StellarSdk.Keypair {
  return StellarSdk.Keypair.random();
}

// Helper: Fund account on testnet
export async function fundTestnetAccount(publicKey: string): Promise<void> {
  const response = await fetch(
    `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`
  );
  if (!response.ok) {
    throw new Error('Failed to fund account');
  }
}

// Helper: Format stroops to XLM
export function stroopsToXlm(stroops: string | bigint): string {
  const amount = typeof stroops === 'string' ? BigInt(stroops) : stroops;
  return (Number(amount) / 10_000_000).toFixed(2);
}

// Helper: Format XLM to stroops
export function xlmToStroops(xlm: number): bigint {
  return BigInt(Math.floor(xlm * 10_000_000));
}
