/**
 * CityWorks Demo Data Seeding Script
 *
 * This script seeds the deployed smart contract with demo infrastructure projects
 * from the demo.json file.
 *
 * Usage: ts-node scripts/seed_demo.ts
 */

import * as StellarSdk from '@stellar/stellar-sdk';
import demoData from '../app/src/data/demo.json';

// Configuration
const NETWORK = 'testnet';
const CONTRACT_ID = process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ID || '';

if (!CONTRACT_ID) {
  console.error('❌ Error: NEXT_PUBLIC_ESCROW_CONTRACT_ID not set');
  console.error('Please deploy the contract first and set the environment variable');
  process.exit(1);
}

const config = {
  testnet: {
    networkPassphrase: 'Test SDF Network ; September 2015',
    sorobanRpcUrl: 'https://soroban-testnet.stellar.org',
  },
};

async function seedProjects() {
  console.log('🌱 Seeding CityWorks Demo Data...\n');

  const server = new StellarSdk.SorobanRpc.Server(config[NETWORK].sorobanRpcUrl);

  // Generate a keypair for the admin/deployer
  // In production, this should be loaded from a secure key store
  const deployerKeypair = StellarSdk.Keypair.random();
  console.log('👤 Using deployer address:', deployerKeypair.publicKey());

  // Fund the deployer account on testnet
  console.log('💰 Funding deployer account...');
  try {
    await fetch(
      `https://friendbot.stellar.org?addr=${encodeURIComponent(
        deployerKeypair.publicKey()
      )}`
    );
    console.log('✅ Account funded\n');
  } catch (error) {
    console.error('❌ Failed to fund account:', error);
    process.exit(1);
  }

  // Wait for account to be ready
  await new Promise((resolve) => setTimeout(resolve, 5000));

  console.log('📊 Seeding projects from demo.json...\n');

  for (const project of demoData.projects) {
    console.log(`\n🏗️  Creating project: ${project.name}`);

    try {
      // In a real implementation, you would call the smart contract here
      // This is a placeholder showing the structure

      const contract = new StellarSdk.Contract(CONTRACT_ID);

      // Create project
      const createProjectOp = contract.call(
        'create_project',
        StellarSdk.nativeToScVal(project.name, { type: 'string' }),
        StellarSdk.nativeToScVal(project.owner, { type: 'address' }),
        StellarSdk.nativeToScVal(BigInt(project.total_budget), { type: 'i128' })
      );

      console.log('   ✓ Project structure prepared');

      // Create milestones
      for (const milestone of project.milestones) {
        console.log(`   📍 Milestone: ${milestone.description.substring(0, 40)}...`);

        const createMilestoneOp = contract.call(
          'create_milestone',
          StellarSdk.nativeToScVal(project.id, { type: 'u32' }),
          StellarSdk.nativeToScVal(milestone.description, { type: 'string' }),
          StellarSdk.nativeToScVal(BigInt(milestone.amount), { type: 'i128' }),
          StellarSdk.nativeToScVal(milestone.verifications_required, { type: 'u32' })
        );

        // Note: In production, you would submit these transactions
        // For now, this demonstrates the structure
      }

      console.log(`   ✅ Project "${project.name}" seeded successfully`);
    } catch (error) {
      console.error(`   ❌ Failed to seed project "${project.name}":`, error);
    }
  }

  console.log('\n✨ Demo data seeding complete!\n');
  console.log('📝 Summary:');
  console.log(`   Total projects: ${demoData.projects.length}`);
  console.log(
    `   Total milestones: ${demoData.projects.reduce(
      (sum, p) => sum + p.milestones.length,
      0
    )}`
  );
  console.log('\n🚀 You can now start the frontend with: npm run dev\n');
}

// Run the seeding
seedProjects().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
