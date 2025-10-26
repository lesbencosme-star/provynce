interface Milestone {
  completed: boolean;
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
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const completedMilestones = project.milestones.filter((m) => m.completed).length;
  const totalMilestones = project.milestones.length;
  const progressPercentage = (completedMilestones / totalMilestones) * 100;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition cursor-pointer group">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-stellar-blue transition">
            {project.name}
          </h3>
          <div className="flex gap-2 mt-2">
            <span className="px-2 py-1 bg-stellar-blue/30 text-stellar-blue rounded text-xs font-semibold">
              {project.category}
            </span>
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${
                project.active
                  ? 'bg-green-500/30 text-green-400'
                  : 'bg-gray-500/30 text-gray-400'
              }`}
            >
              {project.active ? 'Active' : 'Completed'}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
        {project.description}
      </p>

      {/* Location */}
      <p className="text-gray-400 text-sm mb-4 flex items-center gap-2">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        {project.location}
      </p>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-300">Progress</span>
          <span className="text-white font-semibold">
            {completedMilestones}/{totalMilestones} milestones
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-stellar-blue h-2 rounded-full transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Budget Info */}
      <div className="flex justify-between items-center pt-4 border-t border-white/10">
        <div>
          <p className="text-gray-400 text-xs">Budget</p>
          <p className="text-white font-bold">
            ${(parseFloat(project.total_budget) / 1_000_000).toFixed(2)}M
          </p>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-xs">Released</p>
          <p className="text-green-400 font-bold">
            ${(parseFloat(project.released_funds) / 1_000_000).toFixed(2)}M
          </p>
        </div>
      </div>
    </div>
  );
}
