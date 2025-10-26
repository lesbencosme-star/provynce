import { useEffect, useState } from 'react';

interface CategoryAnimationProps {
  category: string;
  isActive: boolean;
  onComplete: () => void;
}

export default function CategoryAnimation({ category, isActive, onComplete }: CategoryAnimationProps) {
  const [elements, setElements] = useState<number[]>([]);

  useEffect(() => {
    if (isActive) {
      // Create animation elements
      const count = category === 'Water' ? 15 : category === 'Public Transit' ? 1 : 8;
      setElements(Array.from({ length: count }, (_, i) => i));

      // Auto-complete animation after duration
      const duration = category === 'Public Transit' ? 3000 : 2500;
      const timer = setTimeout(() => {
        onComplete();
        setElements([]);
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setElements([]);
    }
  }, [isActive, category, onComplete]);

  if (!isActive || elements.length === 0) return null;

  // Water dripping animation
  if (category === 'Water') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
        {elements.map((i) => (
          <div
            key={i}
            className="absolute animate-water-drop"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-20px',
              animationDelay: `${i * 150}ms`,
              animationDuration: '2s',
            }}
          >
            <svg className="w-4 h-6 text-blue-400 opacity-80" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          </div>
        ))}
      </div>
    );
  }

  // Public Transit - Train animation
  if (category === 'Public Transit') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 animate-train-slide">
          <div className="flex items-center gap-1">
            {/* Train Engine */}
            <div className="w-16 h-12 bg-gradient-to-r from-stellar-blue to-blue-600 rounded-lg relative shadow-lg">
              <div className="absolute top-1 right-1 w-3 h-3 bg-yellow-300 rounded-full animate-pulse"></div>
              <div className="absolute bottom-2 left-2 w-3 h-3 bg-gray-800 rounded-full"></div>
              <div className="absolute bottom-2 right-2 w-3 h-3 bg-gray-800 rounded-full"></div>
            </div>
            {/* Train Cars */}
            {[1, 2].map((car) => (
              <div key={car} className="w-14 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg relative shadow-lg">
                <div className="absolute top-2 left-2 right-2 h-4 bg-white/20 rounded"></div>
                <div className="absolute bottom-2 left-2 w-3 h-3 bg-gray-800 rounded-full"></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 bg-gray-800 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Bridge - Building blocks animation
  if (category === 'Bridge') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
        {elements.map((i) => (
          <div
            key={i}
            className="absolute animate-build-blocks"
            style={{
              left: `${10 + (i * 10)}%`,
              bottom: '-40px',
              animationDelay: `${i * 100}ms`,
              animationDuration: '1.5s',
            }}
          >
            <div className="w-8 h-8 bg-orange-500 rounded opacity-80 shadow-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  // Renewable Energy - Lightning/energy bolts
  if (category === 'Renewable Energy') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
        {elements.map((i) => (
          <div
            key={i}
            className="absolute animate-energy-bolt"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 200}ms`,
            }}
          >
            <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
            </svg>
          </div>
        ))}
      </div>
    );
  }

  // Green Infrastructure - Leaves falling
  if (category === 'Green Infrastructure') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
        {elements.map((i) => (
          <div
            key={i}
            className="absolute animate-leaf-fall"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-30px',
              animationDelay: `${i * 250}ms`,
              animationDuration: '3s',
            }}
          >
            <svg className="w-6 h-6 text-green-400 opacity-70" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
            </svg>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
