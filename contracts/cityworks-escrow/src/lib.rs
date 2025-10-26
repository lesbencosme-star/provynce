#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env, String, Vec};

// Data Structures
#[contracttype]
#[derive(Clone)]
pub struct Project {
    pub id: u32,
    pub name: String,
    pub owner: Address,
    pub total_budget: i128,
    pub released_funds: i128,
    pub active: bool,
}

#[contracttype]
#[derive(Clone)]
pub struct Milestone {
    pub id: u32,
    pub project_id: u32,
    pub description: String,
    pub amount: i128,
    pub verifications_required: u32,
    pub verifications_received: u32,
    pub completed: bool,
}

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Project(u32),
    Milestone(u32),
    ProjectCount,
    MilestoneCount,
    Verifier(Address),
    MilestoneVerification(u32, Address), // (milestone_id, verifier)
}

#[contract]
pub struct CityWorksEscrow;

#[contractimpl]
impl CityWorksEscrow {
    /// Create a new infrastructure project
    pub fn create_project(
        env: Env,
        name: String,
        owner: Address,
        total_budget: i128,
    ) -> u32 {
        owner.require_auth();

        let project_count: u32 = env
            .storage()
            .instance()
            .get(&DataKey::ProjectCount)
            .unwrap_or(0);

        let project_id = project_count + 1;

        let project = Project {
            id: project_id,
            name,
            owner,
            total_budget,
            released_funds: 0,
            active: true,
        };

        env.storage()
            .instance()
            .set(&DataKey::Project(project_id), &project);
        env.storage()
            .instance()
            .set(&DataKey::ProjectCount, &project_id);

        project_id
    }

    /// Fund a project by transferring tokens to the contract
    pub fn fund_project(
        env: Env,
        project_id: u32,
        funder: Address,
        token_address: Address,
        amount: i128,
    ) {
        funder.require_auth();

        let project: Project = env
            .storage()
            .instance()
            .get(&DataKey::Project(project_id))
            .expect("Project not found");

        assert!(project.active, "Project is not active");

        // Transfer tokens from funder to contract
        let token_client = token::Client::new(&env, &token_address);
        token_client.transfer(&funder, &env.current_contract_address(), &amount);
    }

    /// Create a milestone for a project
    pub fn create_milestone(
        env: Env,
        project_id: u32,
        description: String,
        amount: i128,
        verifications_required: u32,
    ) -> u32 {
        let project: Project = env
            .storage()
            .instance()
            .get(&DataKey::Project(project_id))
            .expect("Project not found");

        project.owner.require_auth();

        let milestone_count: u32 = env
            .storage()
            .instance()
            .get(&DataKey::MilestoneCount)
            .unwrap_or(0);

        let milestone_id = milestone_count + 1;

        let milestone = Milestone {
            id: milestone_id,
            project_id,
            description,
            amount,
            verifications_required,
            verifications_received: 0,
            completed: false,
        };

        env.storage()
            .instance()
            .set(&DataKey::Milestone(milestone_id), &milestone);
        env.storage()
            .instance()
            .set(&DataKey::MilestoneCount, &milestone_id);

        milestone_id
    }

    /// Register a verifier (engineer/inspector)
    pub fn register_verifier(env: Env, verifier: Address, admin: Address) {
        admin.require_auth();
        env.storage()
            .instance()
            .set(&DataKey::Verifier(verifier.clone()), &true);
    }

    /// Submit verification for a milestone
    pub fn verify_milestone(env: Env, milestone_id: u32, verifier: Address) {
        verifier.require_auth();

        // Check if verifier is registered
        let is_verifier: bool = env
            .storage()
            .instance()
            .get(&DataKey::Verifier(verifier.clone()))
            .unwrap_or(false);

        assert!(is_verifier, "Not an authorized verifier");

        // Check if verifier hasn't already verified this milestone
        let already_verified: bool = env
            .storage()
            .instance()
            .get(&DataKey::MilestoneVerification(
                milestone_id,
                verifier.clone(),
            ))
            .unwrap_or(false);

        assert!(!already_verified, "Already verified by this verifier");

        // Get and update milestone
        let mut milestone: Milestone = env
            .storage()
            .instance()
            .get(&DataKey::Milestone(milestone_id))
            .expect("Milestone not found");

        assert!(!milestone.completed, "Milestone already completed");

        milestone.verifications_received += 1;

        // Store verification
        env.storage().instance().set(
            &DataKey::MilestoneVerification(milestone_id, verifier),
            &true,
        );

        // Update milestone
        env.storage()
            .instance()
            .set(&DataKey::Milestone(milestone_id), &milestone);
    }

    /// Release payment if milestone is fully verified
    pub fn release_payment(
        env: Env,
        milestone_id: u32,
        token_address: Address,
        recipient: Address,
    ) {
        let mut milestone: Milestone = env
            .storage()
            .instance()
            .get(&DataKey::Milestone(milestone_id))
            .expect("Milestone not found");

        assert!(!milestone.completed, "Milestone already paid");
        assert!(
            milestone.verifications_received >= milestone.verifications_required,
            "Insufficient verifications"
        );

        // Get project
        let mut project: Project = env
            .storage()
            .instance()
            .get(&DataKey::Project(milestone.project_id))
            .expect("Project not found");

        // Update project funds
        project.released_funds += milestone.amount;

        // Mark milestone as completed
        milestone.completed = true;

        // Transfer tokens
        let token_client = token::Client::new(&env, &token_address);
        token_client.transfer(&env.current_contract_address(), &recipient, &milestone.amount);

        // Save updates
        env.storage()
            .instance()
            .set(&DataKey::Milestone(milestone_id), &milestone);
        env.storage()
            .instance()
            .set(&DataKey::Project(project.id), &project);
    }

    /// Get project details
    pub fn get_project(env: Env, project_id: u32) -> Project {
        env.storage()
            .instance()
            .get(&DataKey::Project(project_id))
            .expect("Project not found")
    }

    /// Get milestone details
    pub fn get_milestone(env: Env, milestone_id: u32) -> Milestone {
        env.storage()
            .instance()
            .get(&DataKey::Milestone(milestone_id))
            .expect("Milestone not found")
    }

    /// Check if address is a verified verifier
    pub fn is_verifier(env: Env, address: Address) -> bool {
        env.storage()
            .instance()
            .get(&DataKey::Verifier(address))
            .unwrap_or(false)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Address, Env, String};

    #[test]
    fn test_create_project() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CityWorksEscrow);
        let client = CityWorksEscrowClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        let name = String::from_str(&env, "Highway Expansion");

        env.mock_all_auths();

        let project_id = client.create_project(&name, &owner, &1_000_000);

        assert_eq!(project_id, 1);

        let project = client.get_project(&project_id);
        assert_eq!(project.name, name);
        assert_eq!(project.total_budget, 1_000_000);
        assert_eq!(project.released_funds, 0);
        assert!(project.active);
    }

    #[test]
    fn test_milestone_verification() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CityWorksEscrow);
        let client = CityWorksEscrowClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        let admin = Address::generate(&env);
        let verifier1 = Address::generate(&env);
        let verifier2 = Address::generate(&env);

        env.mock_all_auths();

        // Create project
        let project_id = client.create_project(
            &String::from_str(&env, "Bridge Repair"),
            &owner,
            &500_000,
        );

        // Create milestone
        let milestone_id = client.create_milestone(
            &project_id,
            &String::from_str(&env, "Foundation Complete"),
            &100_000,
            &2,
        );

        // Register verifiers
        client.register_verifier(&verifier1, &admin);
        client.register_verifier(&verifier2, &admin);

        // Submit verifications
        client.verify_milestone(&milestone_id, &verifier1);
        client.verify_milestone(&milestone_id, &verifier2);

        let milestone = client.get_milestone(&milestone_id);
        assert_eq!(milestone.verifications_received, 2);
    }
}
