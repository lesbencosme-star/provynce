# Provynce - Smart Infrastructure Funding on Stellar

A transparent, blockchain-based platform for infrastructure project funding with milestone-based payments, community engagement, and real-time tracking built on the Stellar network.

## 🌟 Overview

Provynce revolutionizes public infrastructure funding by leveraging Stellar blockchain technology to provide:

- **Transparent Fund Management**: All transactions recorded on Stellar blockchain
- **Milestone-Based Payments**: Funds released only when verified milestones are completed
- **Community Engagement**: Citizens can invest, comment, ask questions, and track progress
- **Real-Time Tracking**: Live updates on project progress, budgets, and impact metrics
- **Smart Contracts**: Automated escrow and payment verification (Soroban integration ready)

## 🚀 Features

### For Citizens
- 💰 **Community Investment**: Invest XLM in projects you care about
- 💬 **Interactive Discussions**: Comment, ask questions, and engage with project teams
- ❤️ **Project Likes & Following**: Track your favorite infrastructure projects
- 📊 **Real-Time Dashboards**: Monitor project progress, budgets, and impact
- 🎨 **Fun Animations**: Category-specific animations when interacting with projects
- 📸 **Photo Galleries**: View construction progress with timestamped images

### For Project Teams
- 📝 **Project Management**: Create and manage infrastructure projects
- 👥 **Team Collaboration**: Assign roles to engineers, architects, and contractors
- 🎯 **Milestone Tracking**: Define and verify project milestones
- 💳 **Automated Payments**: Receive funds when milestones are verified
- 📈 **Impact Metrics**: Track and showcase environmental and social impact

### Platform Features
- 🔐 **Freighter Wallet Integration**: Secure Stellar wallet connection
- 🌍 **Global Impact Dashboard**: Aggregated metrics across all projects
- 🔔 **Live Activity Feed**: Real-time updates and service notices
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 🎭 **User Authentication**: Secure login and profile management

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: Stellar Network (Testnet)
- **Wallet**: Freighter
- **State Management**: React Context API
- **Storage**: LocalStorage (demo), ready for backend integration
- **Smart Contracts**: Soroban-ready (contracts not yet deployed)

## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd app

# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
# Navigate to http://localhost:3000
```

## 🔧 Environment Setup

Create a `.env.local` file:

```env
# Add your environment variables here
# Example:
# NEXT_PUBLIC_STELLAR_NETWORK=testnet
```

## 🌐 Stellar Integration

### Current Setup (Demo)
- Uses Stellar Testnet
- Freighter wallet integration
- Placeholder wallet addresses in demo data

### Ready for Production
To deploy with real smart contracts:

1. **Deploy Soroban Contracts**:
   - Escrow contract for milestone-based payments
   - PROV token contract (optional governance token)
   - Verification contract for milestone approval

2. **Update Configuration**:
   - Add deployed contract addresses
   - Configure mainnet vs testnet
   - Set up backend API for data persistence

## 📁 Project Structure

```
app/
├── src/
│   ├── components/      # React components
│   │   ├── CategoryAnimation.tsx    # Fun project animations
│   │   ├── CommunityTab.tsx         # Community engagement hub
│   │   ├── EnhancedProjectCard.tsx  # Project card with like animations
│   │   ├── ProjectQA.tsx            # Q&A functionality
│   │   └── ...
│   ├── context/         # React Context providers
│   │   ├── CommunityContext.tsx     # Likes, comments, investments
│   │   ├── UserContext.tsx          # User authentication
│   │   ├── WalletContext.tsx        # Stellar wallet integration
│   │   └── ...
│   ├── data/            # Demo data
│   │   └── demo.json    # Project data with metrics
│   ├── pages/           # Next.js pages
│   │   ├── index.tsx    # Main dashboard
│   │   ├── projects/[id].tsx  # Project detail page
│   │   └── ...
│   └── styles/          # Global styles and animations
└── public/              # Static assets
```

## 🎯 Key Components

### Community Features
- **Discussion Tab**: Comment threads with likes
- **Investment Tab**: Community XLM investments with history
- **Q&A Tab**: Ask questions, upvote, get official responses

### Category Animations
Each project type triggers a unique animation when liked:
- 🌊 **Water**: Dripping water droplets
- 🚂 **Public Transit**: Animated train sliding across screen
- 🏗️ **Bridge**: Building blocks flying upward
- ⚡ **Renewable Energy**: Flashing lightning bolts
- 🌳 **Green Infrastructure**: Falling leaves

## 🚧 Current Project Categories

1. **Bridge** - Structural rehabilitation and construction
2. **Renewable Energy** - Solar, wind, and clean energy projects
3. **Green Infrastructure** - Urban forestry and climate resilience
4. **Water** - Smart water systems and quality monitoring
5. **Public Transit** - Metro extensions and accessibility upgrades

## 📊 Demo Projects

1. **Washington Bridge Rehabilitation** - $8.5M bridge restoration
2. **Solar Community Energy Network** - $15M distributed solar grid
3. **Green Infrastructure Bonds** - $6.5M urban forest initiative
4. **Smart Water Distribution** - $10M IoT water system upgrade
5. **Metro Line 4 Extension** - $25M transit expansion

## 🔐 Security Notes

- Wallet integration requires Freighter browser extension
- All transactions currently simulated for demo
- Ready for real Stellar transactions with contract deployment
- User authentication stores data in localStorage (demo only)

## 🌟 Future Enhancements

- [ ] Deploy Soroban smart contracts
- [ ] Backend API for persistent data storage
- [ ] Real-time WebSocket updates
- [ ] Advanced analytics and reporting
- [ ] Mobile app (React Native)
- [ ] Multi-signature approval workflows
- [ ] Integration with government systems
- [ ] Automated compliance reporting

## 📄 License

This project is part of the Stellar blockchain ecosystem demonstration.

## 🤝 Contributing

Contributions welcome! This is a demonstration platform showcasing blockchain-based infrastructure funding.

## 📧 Contact

For questions about Provynce or Stellar integration, please reach out through the platform.

---

Built with ❤️ for transparent infrastructure funding on Stellar
