import { useState, MouseEvent } from 'react';
import Link from 'next/link';
import { useCommunity } from '@/context/CommunityContext';
import FollowButton from '@/components/FollowButton';
import CategoryAnimation from '@/components/CategoryAnimation';

interface Milestone {
  completed: boolean;
}

interface TeamMember {
  role: string;
  name: string;
  avatar: string;
  walletAddress: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  category: string;
  location: string;
  total_budget: string;
  released_funds: string;
  active: boolean;
  milestones: Milestone[];
  team: TeamMember[];
  owner: string;
}

interface EnhancedProjectCardProps {
  project: Project;
}

const categoryImages: Record<string, string> = {
  'Bridge': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
  'Renewable Energy': 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80',
  'Green Infrastructure': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
  'Water': 'https://images.unsplash.com/photo-1548337138-e87d889cc369?w=800&q=80',
  'Public Transit': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
};

const categoryIcons: Record<string, JSX.Element> = {
  'Bridge': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  'Renewable Energy': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  'Green Infrastructure': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  'Water': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
  ),
  'Public Transit': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  ),
};

export default function EnhancedProjectCard({ project }: EnhancedProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const {
    projectLikes,
    userLikedProjects,
    likeProject,
    unlikeProject,
  } = useCommunity();

  const completedMilestones = project.milestones.filter((m) => m.completed).length;
  const totalMilestones = project.milestones.length;
  const progressPercentage = (completedMilestones / totalMilestones) * 100;
  const budgetUsed = (parseFloat(project.released_funds) / parseFloat(project.total_budget)) * 100;

  const bannerImage = categoryImages[project.category] || categoryImages['Bridge'];
  const categoryIcon = categoryIcons[project.category] || categoryIcons['Bridge'];

  // Get key team members (PM, Engineer, Architect)
  const keyTeam = project.team.slice(0, 3);

  const handleLikeClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const isLiked = userLikedProjects.includes(project.id);
    if (isLiked) {
      unlikeProject(project.id);
    } else {
      likeProject(project.id);
      // Trigger fun animation!
      setShowAnimation(true);
    }
  };

  return (
    <>
      <Link href={`/projects/${project.id}`}>
        <div
          className={`group relative bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-stellar-blue/50 transition-all duration-500 cursor-pointer ${
            isHovered ? 'transform -translate-y-2 shadow-2xl shadow-stellar-blue/20' : 'shadow-lg'
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
        {/* Fun Category Animation */}
        <CategoryAnimation
          category={project.category}
          isActive={showAnimation}
          onComplete={() => setShowAnimation(false)}
        />
        {/* Banner Image with Gradient Overlay */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-stellar-navy to-blue-900">
          <img
            src={bannerImage}
            alt={project.name}
            className={`w-full h-full object-cover transition-all duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stellar-navy via-stellar-navy/80 to-transparent"></div>

          {/* Like Button, Follow Button, and Status Badge */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {/* Like Button */}
            <button
              onClick={handleLikeClick}
              className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border flex items-center gap-1.5 transition-all ${
                userLikedProjects.includes(project.id)
                  ? 'bg-red-500/30 text-red-300 border-red-400/50 hover:bg-red-500/40'
                  : 'bg-white/10 text-gray-300 border-white/30 hover:bg-white/20 hover:text-white'
              }`}
            >
              <svg
                className={`w-4 h-4 transition-transform ${userLikedProjects.includes(project.id) ? 'scale-110' : ''}`}
                fill={userLikedProjects.includes(project.id) ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {projectLikes[project.id] || 0}
            </button>

            <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
              <FollowButton projectId={project.id} projectName={project.name} variant="compact" />
            </div>
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border flex items-center gap-1.5 ${
                project.active
                  ? 'bg-green-500/30 text-green-300 border-green-400/50'
                  : 'bg-gray-500/30 text-gray-300 border-gray-400/50'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${project.active ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
              {project.active ? 'Active' : 'Completed'}
            </span>
          </div>

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <div className="px-3 py-1.5 bg-stellar-blue/30 backdrop-blur-md text-stellar-blue border border-stellar-blue/50 rounded-full text-xs font-bold flex items-center gap-1.5">
              {categoryIcon}
              {project.category}
            </div>
          </div>

          {/* Project Title Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-bold text-white drop-shadow-lg line-clamp-2 group-hover:text-stellar-blue transition-colors">
              {project.name}
            </h3>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 space-y-4">
          {/* Location */}
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {project.location}
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">
            {project.description}
          </p>

          {/* Team Avatars */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {keyTeam.map((member, index) => (
                <div
                  key={index}
                  className="relative group/avatar"
                  title={`${member.name} - ${member.role}`}
                >
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-9 h-9 rounded-full border-2 border-stellar-navy hover:border-stellar-blue transition-all hover:scale-110 hover:z-10"
                  />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-stellar-navy"></div>
                </div>
              ))}
            </div>
            <span className="text-xs text-gray-400">
              {project.team.length} verified professionals
            </span>
          </div>

          {/* Progress Section */}
          <div className="space-y-3">
            {/* Milestones Progress */}
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-gray-400">Milestones</span>
                <span className="text-white font-semibold">
                  {completedMilestones}/{totalMilestones}
                </span>
              </div>
              <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-green-500 via-stellar-blue to-green-500 bg-[length:200%_100%] animate-shimmer transition-all duration-1000"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Budget Progress */}
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-gray-400">Funding Released</span>
                <span className="text-stellar-blue font-semibold">
                  ${(parseFloat(project.released_funds) / 1_000_000).toFixed(1)}M / $
                  {(parseFloat(project.total_budget) / 1_000_000).toFixed(1)}M
                </span>
              </div>
              <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-stellar-blue transition-all duration-1000"
                  style={{ width: `${budgetUsed}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* View on Stellar Link */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <button className="text-stellar-blue text-sm font-semibold flex items-center gap-2 hover:gap-3 transition-all group-hover:text-stellar-blue-light">
              <span>View Details</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

            <a
              href={`https://testnet.stellarchain.io/accounts/${project.team[0]?.walletAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-xs text-gray-400 hover:text-stellar-blue"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
              Stellar
            </a>
          </div>
        </div>
        </div>
      </Link>
    </>
  );
}
