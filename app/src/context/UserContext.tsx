import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

interface UserContextValue {
  user: UserProfile | null;
  followedProjects: number[];
  createAccount: (name: string, email: string, password?: string) => Promise<void>;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  toggleFollow: (projectId: number) => void;
  isProjectFollowed: (projectId: number) => boolean;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

const USER_STORAGE_KEY = 'provynce:user';
const FOLLOW_STORAGE_KEY = 'provynce:user:followed';

function generateId() {
  return `usr-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [followedProjects, setFollowedProjects] = useState<number[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.warn('Failed to load stored user', err);
    }

    try {
      const storedFollow = localStorage.getItem(FOLLOW_STORAGE_KEY);
      if (storedFollow) {
        setFollowedProjects(JSON.parse(storedFollow));
      }
    } catch (err) {
      console.warn('Failed to load followed projects', err);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!user) {
      localStorage.removeItem(USER_STORAGE_KEY);
      return;
    }
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(FOLLOW_STORAGE_KEY, JSON.stringify(followedProjects));
  }, [followedProjects]);

  const createAccount = async (name: string, email: string) => {
    if (!name.trim() || !email.trim()) {
      throw new Error('Please provide both name and email.');
    }

    const profile: UserProfile = {
      id: generateId(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
    };

    setUser(profile);
    setFollowedProjects([]);
  };

  const login = async (email: string) => {
    if (!email.trim()) {
      throw new Error('Enter the email associated with your account.');
    }

    const stored = typeof window !== 'undefined'
      ? localStorage.getItem(USER_STORAGE_KEY)
      : null;

    if (!stored) {
      throw new Error('No account found. Create an account to get started.');
    }

    const parsed: UserProfile = JSON.parse(stored);
    if (parsed.email !== email.trim().toLowerCase()) {
      throw new Error('Email does not match our records.');
    }

    setUser(parsed);

    const storedFollow = typeof window !== 'undefined'
      ? localStorage.getItem(FOLLOW_STORAGE_KEY)
      : null;
    if (storedFollow) {
      setFollowedProjects(JSON.parse(storedFollow));
    }
  };

  const logout = () => {
    setUser(null);
  };

  const toggleFollow = (projectId: number) => {
    setFollowedProjects((prev) => {
      if (prev.includes(projectId)) {
        return prev.filter((id) => id !== projectId);
      }
      return [...prev, projectId];
    });
  };

  const isProjectFollowed = (projectId: number) =>
    followedProjects.includes(projectId);

  const value = useMemo(
    () => ({
      user,
      followedProjects,
      createAccount,
      login,
      logout,
      toggleFollow,
      isProjectFollowed,
    }),
    [user, followedProjects]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return ctx;
}
