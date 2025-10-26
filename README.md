# CityWorks: Real-Time Infrastructure Transparency on Stellar

**CityWorks** is a blockchain-powered transparency platform that redefines how governments, engineers, and citizens track public infrastructure projects. Built entirely on the **Stellar network**, CityWorks automates milestone-based funding and real-time verification for public works — ensuring every dollar spent is **visible, verifiable, and accountable**.

## Overview

Traditional infrastructure projects suffer from:
- Opaque budget allocation and spending
- Delayed or incomplete reporting
- Lack of public accountability
- Manual verification processes prone to errors

CityWorks solves these problems by:
- Using Stellar's Soroban smart contracts to automatically release funds when verified milestones are completed
- Creating a user-friendly interface that lets citizens track real-time project progress and spending
- Integrating tokenized credentials for engineers and verifiers to ensure only licensed professionals can approve work
- Providing an open data trail of all transactions to strengthen public trust and reduce corruption

## Architecture

### Smart Contract Layer (Soroban on Stellar)

The CityWorks escrow contract manages:
- **Project Creation**: Governments create projects with total budgets and milestones
- **Fund Escrow**: Project funds are held in the smart contract
- **Milestone Management**: Each project has multiple milestones with specific verification requirements
- **Multi-Signature Verification**: Licensed engineers/inspectors verify milestone completion
- **Automated Payment Release**: Funds are automatically released when verification quorum is met

### Frontend Layer (Next.js)

- **Public Dashboard**: Real-time view of all infrastructure projects
- **Project Detail Pages**: Deep dive into individual projects with milestone timelines
- **Verification Interface**: For licensed verifiers to submit proof and approvals
- **Blockchain Explorer Integration**: Direct links to view transactions on Stellar

## Project Structure

```
cityworks/
├─ contracts/                       # Soroban smart contracts
│  └─ cityworks-escrow/
│     ├─ Cargo.toml                # Contract dependencies
│     └─ src/lib.rs                # Main contract logic
├─ app/                            # Next.js frontend
│  ├─ package.json
│  ├─ next.config.js
│  ├─ tsconfig.json
│  ├─ src/
│  │  ├─ pages/
│  │  │  ├─ index.tsx             # Homepage with project list
│  │  │  └─ projects/[id].tsx     # Individual project details
│  │  ├─ lib/
│  │  │  ├─ stellar.ts            # Stellar SDK integration
│  │  │  └─ config.ts             # Network & contract config
│  │  ├─ components/
│  │  │  ├─ ProjectCard.tsx       # Project card component
│  │  │  └─ MilestoneTimeline.tsx # Timeline visualization
│  │  └─ data/
│  │     └─ demo.json             # Demo data for testing
└─ scripts/
   ├─ build_contract.sh           # Build Soroban contract
   ├─ deploy_contract.sh          # Deploy to Stellar testnet
   └─ seed_demo.ts                # Seed demo data
```

## Getting Started

### Prerequisites

1. **Rust & Cargo** - For building Soroban contracts
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. **Soroban CLI** - For contract deployment
   ```bash
   cargo install --locked soroban-cli
   ```

3. **Node.js 18+** - For the frontend
   ```bash
   # Install from https://nodejs.org/
   node --version  # Should be 18.x or higher
   ```

4. **Stellar Account** - Get testnet XLM from friendbot (automatic in deployment script)

### Installation

#### 1. Build the Smart Contract

```bash
# Navigate to project root
cd cityworks

# Build the contract
./scripts/build_contract.sh
```

This will:
- Compile the Rust contract to WASM
- Optimize the WASM binary for deployment

#### 2. Deploy to Stellar Testnet

```bash
./scripts/deploy_contract.sh
```

This will:
- Create a deployer identity (if needed)
- Fund the deployer account on testnet
- Deploy the contract
- Output the contract ID

**Important**: Copy the contract ID from the output!

#### 3. Configure the Frontend

Create a `.env.local` file in the `app/` directory:

```bash
cd app
cat > .env.local << EOF
NEXT_PUBLIC_ESCROW_CONTRACT_ID=<your-contract-id-here>
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
EOF
```

#### 4. Install Frontend Dependencies

```bash
# In the app/ directory
npm install
```

#### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app!

## Usage

### For Citizens (Public View)

1. **Browse Projects**: View all active and completed infrastructure projects
2. **Filter Projects**: Filter by category (Roads, Bridges, Water, etc.)
3. **Track Progress**: See real-time milestone completion and budget utilization
4. **View Details**: Click any project to see detailed milestone timelines
5. **Verify Transparency**: All data is backed by Stellar blockchain transactions

### For Project Managers

1. **Create Project**: Define project name, budget, and owner
2. **Define Milestones**: Break down project into verifiable milestones
3. **Submit Proof**: Upload proof of completion for each milestone
4. **Track Verifications**: Monitor verification progress from licensed engineers

### For Verifiers (Licensed Engineers/Inspectors)

1. **Register**: Admin registers your address as an authorized verifier
2. **Review Milestones**: Review submitted proof for milestone completion
3. **Submit Verification**: Sign and submit verification transactions
4. **Trigger Payment**: Once quorum is met, payment is automatically released

## Smart Contract API

### Core Functions

#### `create_project(name, owner, total_budget) -> project_id`
Creates a new infrastructure project.

**Parameters:**
- `name: String` - Project name
- `owner: Address` - Project owner (government entity)
- `total_budget: i128` - Total budget in stroops

**Returns:** `u32` - Project ID

---

#### `create_milestone(project_id, description, amount, verifications_required) -> milestone_id`
Creates a new milestone for a project.

**Parameters:**
- `project_id: u32` - Parent project ID
- `description: String` - Milestone description
- `amount: i128` - Milestone budget
- `verifications_required: u32` - Number of verifications needed

**Returns:** `u32` - Milestone ID

---

#### `verify_milestone(milestone_id, verifier)`
Submit a verification for a milestone (verifier must be registered).

**Parameters:**
- `milestone_id: u32` - Milestone to verify
- `verifier: Address` - Verifier's address

---

#### `release_payment(milestone_id, token_address, recipient)`
Release payment for a fully verified milestone.

**Parameters:**
- `milestone_id: u32` - Milestone ID
- `token_address: Address` - Payment token contract
- `recipient: Address` - Payment recipient

---

#### `get_project(project_id) -> Project`
Retrieve project details.

#### `get_milestone(milestone_id) -> Milestone`
Retrieve milestone details.

## Demo Data

The project includes realistic demo data with 6 infrastructure projects:

1. **Downtown Highway Expansion** - $15M highway widening project
2. **River Crossing Bridge Rehabilitation** - $8.5M bridge restoration
3. **Eastside Water Treatment Facility** - $12M water system upgrade (completed)
4. **Northside Road Resurfacing** - $3.5M road maintenance
5. **Central Park Pedestrian Bridge** - $2.8M new pedestrian bridge
6. **Southside Stormwater Management** - $6.2M flood prevention system

Each project includes multiple milestones at various stages of completion.

## Technology Stack

### Blockchain
- **Stellar Network** - Fast, low-cost blockchain for payments
- **Soroban** - Rust-based smart contract platform
- **Stellar SDK** - JavaScript SDK for blockchain interaction

### Frontend
- **Next.js 14** - React framework with server-side rendering
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React** - Component-based UI library

### Development Tools
- **Rust** - Systems programming language for contracts
- **Cargo** - Rust package manager
- **Soroban CLI** - Contract deployment and testing

## Roadmap

### Phase 1: Core Platform (Current)
- ✅ Escrow smart contract with milestone verification
- ✅ Public dashboard for project tracking
- ✅ Demo data and testnet deployment

### Phase 2: Enhanced Features
- 🔄 Wallet integration (Freighter, Albedo)
- 🔄 Real-world verifier credential system
- 🔄 Photo/document proof uploads (IPFS)
- 🔄 Email notifications for stakeholders

### Phase 3: Advanced Analytics
- 📋 Budget vs. actual spending analytics
- 📋 Project timeline predictions
- 📋 Public audit trails
- 📋 Export to PDF reports

### Phase 4: Multi-Region Support
- 📋 Support for multiple municipalities
- 📋 Cross-region comparisons
- 📋 Standardized reporting templates
- 📋 Integration with existing government systems

## Security Considerations

1. **Multi-Signature Verification**: Prevents single points of failure
2. **On-Chain Audit Trail**: All actions are permanently recorded
3. **Role-Based Access**: Only registered verifiers can approve milestones
4. **Escrow Protection**: Funds are locked until verification quorum is met
5. **Transparent Calculations**: All budget calculations visible on-chain

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Testing

### Test the Smart Contract

```bash
cd contracts/cityworks-escrow
cargo test
```

### Test the Frontend

```bash
cd app
npm run build  # Ensure it builds without errors
npm run lint   # Check for linting issues
```

## Deployment

### Testnet Deployment (Current)

Follow the "Getting Started" section above.

### Mainnet Deployment (Future)

⚠️ **Warning**: Deploying to mainnet requires:
1. Real XLM for transaction fees
2. Security audits of smart contracts
3. Legal compliance with local regulations
4. Backup and disaster recovery plans

## License

MIT License - See LICENSE file for details

## Support

- **Documentation**: This README
- **Issues**: GitHub Issues
- **Community**: Stellar Developer Discord
- **Email**: support@cityworks.example (placeholder)

## Acknowledgments

- **Stellar Development Foundation** - For the incredible Stellar network and Soroban platform
- **Open source community** - For the tools and libraries that made this possible
- **Public infrastructure workers** - The real heroes building our communities

---

**Built with ❤️ on Stellar**

*Making infrastructure transparent, one block at a time.*
