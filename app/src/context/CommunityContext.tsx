import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Comment {
  id: string;
  projectId: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

interface Investment {
  id: string;
  projectId: number;
  userId: string;
  userName: string;
  amount: number;
  currency: string;
  timestamp: string;
}

interface CommunityContextType {
  // Likes
  projectLikes: Record<number, number>;
  userLikedProjects: number[];
  likeProject: (projectId: number) => void;
  unlikeProject: (projectId: number) => void;

  // Comments
  comments: Comment[];
  addComment: (projectId: number, content: string, userName: string) => void;
  likeComment: (commentId: string) => void;
  getProjectComments: (projectId: number) => Comment[];

  // Investments
  investments: Investment[];
  addInvestment: (projectId: number, amount: number, userName: string) => void;
  getProjectInvestments: (projectId: number) => Investment[];
  getTotalProjectInvestment: (projectId: number) => number;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

// Seed data for realistic community engagement
const seedComments: Comment[] = [
  // Washington Bridge Project (id: 1)
  {
    id: 'seed-comment-1',
    projectId: 1,
    userId: 'user-sarah',
    userName: 'Sarah Chen',
    content: 'This is exactly what our community needs! The current bridge causes so much congestion during rush hour. When is the expected completion date?',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    likes: 12,
  },
  {
    id: 'seed-comment-2',
    projectId: 1,
    userId: 'user-mike',
    userName: 'Mike Rodriguez',
    content: 'Love the transparency with the milestone tracking. This is how all public infrastructure should be managed.',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    likes: 8,
  },
  {
    id: 'seed-comment-3',
    projectId: 1,
    userId: 'user-emma',
    userName: 'Emma Thompson',
    content: 'As a daily commuter, I appreciate the detailed updates. The blockchain verification gives me confidence that funds are being used properly.',
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
    likes: 15,
  },

  // Solar Grid Project (id: 2)
  {
    id: 'seed-comment-4',
    projectId: 2,
    userId: 'user-david',
    userName: 'David Park',
    content: 'Amazing initiative! How much energy is this expected to generate annually? Would love to see more renewable projects like this.',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 20,
  },
  {
    id: 'seed-comment-5',
    projectId: 2,
    userId: 'user-lisa',
    userName: 'Lisa Johnson',
    content: 'The environmental impact metrics are impressive. This will significantly reduce our carbon footprint!',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 18,
  },
  {
    id: 'seed-comment-6',
    projectId: 2,
    userId: 'user-james',
    userName: 'James Miller',
    content: 'Invested 500 XLM in this project. Clean energy is our future and I want to support that vision.',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    likes: 25,
  },

  // Green Infrastructure Project (id: 3)
  {
    id: 'seed-comment-7',
    projectId: 3,
    userId: 'user-maria',
    userName: 'Maria Garcia',
    content: 'Urban green spaces are essential for mental health and community wellbeing. This project will transform our neighborhood!',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 22,
  },
  {
    id: 'seed-comment-8',
    projectId: 3,
    userId: 'user-kevin',
    userName: 'Kevin Wong',
    content: 'The stormwater management aspect is brilliant. This will help prevent flooding during heavy rains.',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 14,
  },
  {
    id: 'seed-comment-9',
    projectId: 3,
    userId: 'user-rachel',
    userName: 'Rachel Foster',
    content: 'Will there be walking trails and bike paths? Would love to see this become a community gathering space.',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 10,
  },
  {
    id: 'seed-comment-10',
    projectId: 3,
    userId: 'user-alex',
    userName: 'Alex Turner',
    content: 'The native plant selection will support local wildlife. Great to see ecological considerations in urban planning!',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    likes: 16,
  },

  // Smart Water System Project (id: 4)
  {
    id: 'seed-comment-11',
    projectId: 4,
    userId: 'user-sophie',
    userName: 'Sophie Anderson',
    content: 'IoT sensors for leak detection is genius! This will save millions in water waste and infrastructure damage.',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 19,
  },
  {
    id: 'seed-comment-12',
    projectId: 4,
    userId: 'user-daniel',
    userName: 'Daniel Brooks',
    content: 'As someone in the water industry, this is cutting edge technology. Excited to see real-time monitoring implemented.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 13,
  },

  // Metro Expansion Project (id: 5)
  {
    id: 'seed-comment-13',
    projectId: 5,
    userId: 'user-olivia',
    userName: 'Olivia Martinez',
    content: 'Finally! The metro expansion will cut my commute time in half. This is a game-changer for public transit.',
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 28,
  },
  {
    id: 'seed-comment-14',
    projectId: 5,
    userId: 'user-nathan',
    userName: 'Nathan Kim',
    content: 'The projected reduction in traffic congestion is significant. This will improve quality of life for thousands.',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 21,
  },
  {
    id: 'seed-comment-15',
    projectId: 5,
    userId: 'user-isabel',
    userName: 'Isabel Santos',
    content: 'Love that they are using eco-friendly materials and energy-efficient trains. Sustainable transit is the way forward!',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 17,
  },
];

const seedInvestments: Investment[] = [
  // Washington Bridge
  { id: 'seed-inv-1', projectId: 1, userId: 'user-sarah', userName: 'Sarah Chen', amount: 250, currency: 'XLM', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'seed-inv-2', projectId: 1, userId: 'user-mike', userName: 'Mike Rodriguez', amount: 500, currency: 'XLM', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'seed-inv-3', projectId: 1, userId: 'user-emma', userName: 'Emma Thompson', amount: 150, currency: 'XLM', timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString() },
  { id: 'seed-inv-4', projectId: 1, userId: 'user-john', userName: 'John Davis', amount: 1000, currency: 'XLM', timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() },

  // Solar Grid
  { id: 'seed-inv-5', projectId: 2, userId: 'user-david', userName: 'David Park', amount: 750, currency: 'XLM', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'seed-inv-6', projectId: 2, userId: 'user-lisa', userName: 'Lisa Johnson', amount: 400, currency: 'XLM', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'seed-inv-7', projectId: 2, userId: 'user-james', userName: 'James Miller', amount: 500, currency: 'XLM', timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() },
  { id: 'seed-inv-8', projectId: 2, userId: 'user-sophia', userName: 'Sophia Lee', amount: 300, currency: 'XLM', timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() },

  // Green Infrastructure
  { id: 'seed-inv-9', projectId: 3, userId: 'user-maria', userName: 'Maria Garcia', amount: 200, currency: 'XLM', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'seed-inv-10', projectId: 3, userId: 'user-kevin', userName: 'Kevin Wong', amount: 350, currency: 'XLM', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'seed-inv-11', projectId: 3, userId: 'user-rachel', userName: 'Rachel Foster', amount: 600, currency: 'XLM', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'seed-inv-12', projectId: 3, userId: 'user-alex', userName: 'Alex Turner', amount: 450, currency: 'XLM', timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() },
  { id: 'seed-inv-13', projectId: 3, userId: 'user-chris', userName: 'Chris Patel', amount: 800, currency: 'XLM', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },

  // Smart Water System
  { id: 'seed-inv-14', projectId: 4, userId: 'user-sophie', userName: 'Sophie Anderson', amount: 550, currency: 'XLM', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'seed-inv-15', projectId: 4, userId: 'user-daniel', userName: 'Daniel Brooks', amount: 900, currency: 'XLM', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'seed-inv-16', projectId: 4, userId: 'user-amy', userName: 'Amy Chen', amount: 275, currency: 'XLM', timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString() },

  // Metro Expansion
  { id: 'seed-inv-17', projectId: 5, userId: 'user-olivia', userName: 'Olivia Martinez', amount: 1200, currency: 'XLM', timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'seed-inv-18', projectId: 5, userId: 'user-nathan', userName: 'Nathan Kim', amount: 650, currency: 'XLM', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'seed-inv-19', projectId: 5, userId: 'user-isabel', userName: 'Isabel Santos', amount: 425, currency: 'XLM', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'seed-inv-20', projectId: 5, userId: 'user-ryan', userName: 'Ryan O\'Connor', amount: 850, currency: 'XLM', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
];

const seedProjectLikes: Record<number, number> = {
  1: 34,
  2: 52,
  3: 41,
  4: 28,
  5: 67,
};

export function CommunityProvider({ children }: { children: ReactNode }) {
  const [projectLikes, setProjectLikes] = useState<Record<number, number>>({});
  const [userLikedProjects, setUserLikedProjects] = useState<number[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);

  // Load from localStorage on mount, or use seed data if empty
  useEffect(() => {
    const storedLikes = localStorage.getItem('provynce_project_likes');
    const storedUserLikes = localStorage.getItem('provynce_user_liked_projects');
    const storedComments = localStorage.getItem('provynce_comments');
    const storedInvestments = localStorage.getItem('provynce_investments');

    // Use stored data if exists, otherwise use seed data
    setProjectLikes(storedLikes ? JSON.parse(storedLikes) : seedProjectLikes);
    setUserLikedProjects(storedUserLikes ? JSON.parse(storedUserLikes) : []);
    setComments(storedComments ? JSON.parse(storedComments) : seedComments);
    setInvestments(storedInvestments ? JSON.parse(storedInvestments) : seedInvestments);
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('provynce_project_likes', JSON.stringify(projectLikes));
  }, [projectLikes]);

  useEffect(() => {
    localStorage.setItem('provynce_user_liked_projects', JSON.stringify(userLikedProjects));
  }, [userLikedProjects]);

  useEffect(() => {
    localStorage.setItem('provynce_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('provynce_investments', JSON.stringify(investments));
  }, [investments]);

  const likeProject = (projectId: number) => {
    if (!userLikedProjects.includes(projectId)) {
      setProjectLikes(prev => ({
        ...prev,
        [projectId]: (prev[projectId] || 0) + 1
      }));
      setUserLikedProjects(prev => [...prev, projectId]);
    }
  };

  const unlikeProject = (projectId: number) => {
    if (userLikedProjects.includes(projectId)) {
      setProjectLikes(prev => ({
        ...prev,
        [projectId]: Math.max((prev[projectId] || 0) - 1, 0)
      }));
      setUserLikedProjects(prev => prev.filter(id => id !== projectId));
    }
  };

  const addComment = (projectId: number, content: string, userName: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}-${Math.random()}`,
      projectId,
      userId: 'current-user',
      userName,
      content,
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: []
    };
    setComments(prev => [newComment, ...prev]);
  };

  const likeComment = (commentId: string) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    );
  };

  const getProjectComments = (projectId: number) => {
    return comments.filter(comment => comment.projectId === projectId);
  };

  const addInvestment = (projectId: number, amount: number, userName: string) => {
    const newInvestment: Investment = {
      id: `investment-${Date.now()}-${Math.random()}`,
      projectId,
      userId: 'current-user',
      userName,
      amount,
      currency: 'XLM',
      timestamp: new Date().toISOString()
    };
    setInvestments(prev => [newInvestment, ...prev]);
  };

  const getProjectInvestments = (projectId: number) => {
    return investments.filter(inv => inv.projectId === projectId);
  };

  const getTotalProjectInvestment = (projectId: number) => {
    return investments
      .filter(inv => inv.projectId === projectId)
      .reduce((sum, inv) => sum + inv.amount, 0);
  };

  const value: CommunityContextType = {
    projectLikes,
    userLikedProjects,
    likeProject,
    unlikeProject,
    comments,
    addComment,
    likeComment,
    getProjectComments,
    investments,
    addInvestment,
    getProjectInvestments,
    getTotalProjectInvestment,
  };

  return <CommunityContext.Provider value={value}>{children}</CommunityContext.Provider>;
}

export function useCommunity() {
  const context = useContext(CommunityContext);
  if (context === undefined) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
}
