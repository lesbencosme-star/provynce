import { useState } from 'react';
import { useWallet } from '@/context/WalletContext';

interface Question {
  id: string;
  projectId: number;
  author: string;
  authorAddress: string;
  question: string;
  timestamp: string;
  upvotes: number;
  answer?: {
    text: string;
    author: string;
    timestamp: string;
  };
}

interface ProjectQAProps {
  projectId: number;
  projectName: string;
}

export default function ProjectQA({ projectId, projectName }: ProjectQAProps) {
  const { isWalletConnected, publicKey } = useWallet();
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      projectId: 1,
      author: 'Sarah Chen',
      authorAddress: 'GCZYLR...QQPROV',
      question: 'What is the expected timeline for completing the steel reinforcement work?',
      timestamp: '2 days ago',
      upvotes: 12,
      answer: {
        text: 'Steel reinforcement is scheduled to be completed by November 15th. We\'re currently ahead of schedule and expect to finish by November 10th, weather permitting.',
        author: 'Michael Foster - Project Manager',
        timestamp: '1 day ago',
      },
    },
    {
      id: '2',
      projectId: 1,
      author: 'James Rodriguez',
      authorAddress: 'GBUILD...BRIDGE',
      question: 'Will there be any weekend closures that might affect local traffic?',
      timestamp: '3 days ago',
      upvotes: 8,
      answer: {
        text: 'We\'re planning minimal weekend disruptions. Only one weekend closure is scheduled for November 5-6 for critical structural work. Alternative routes will be clearly marked.',
        author: 'Michael Foster - Project Manager',
        timestamp: '2 days ago',
      },
    },
    {
      id: '3',
      projectId: 1,
      author: 'Maria Santos',
      authorAddress: 'GCITIZ...WATCH',
      question: 'How is the project addressing environmental concerns during construction?',
      timestamp: '5 days ago',
      upvotes: 15,
    },
  ]);

  const [newQuestion, setNewQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  const handleSubmitQuestion = async () => {
    if (!newQuestion.trim() || !isWalletConnected) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const question: Question = {
      id: Date.now().toString(),
      projectId,
      author: 'You',
      authorAddress: publicKey?.slice(0, 10) + '...' || 'Unknown',
      question: newQuestion,
      timestamp: 'Just now',
      upvotes: 0,
    };

    setQuestions([question, ...questions]);
    setNewQuestion('');
    setIsSubmitting(false);
    setShowSubmitForm(false);
  };

  const handleUpvote = (questionId: string) => {
    if (!isWalletConnected) return;

    setQuestions(questions.map(q =>
      q.id === questionId ? { ...q, upvotes: q.upvotes + 1 } : q
    ));
  };

  return (
    <div className="bg-gradient-to-br from-stellar-navy via-blue-900/50 to-stellar-navy-dark rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <svg className="w-6 h-6 text-stellar-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Community Q&amp;A
        </h3>
        <button
          onClick={() => setShowSubmitForm(!showSubmitForm)}
          disabled={!isWalletConnected}
          className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
            isWalletConnected
              ? 'bg-stellar-blue text-white hover:bg-stellar-blue-dark'
              : 'bg-white/5 text-gray-500 cursor-not-allowed'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ask Question
        </button>
      </div>

      {!isWalletConnected && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-200 text-sm">
          Connect your wallet to ask questions and upvote community discussions.
        </div>
      )}

      {/* Submit Question Form */}
      {showSubmitForm && isWalletConnected && (
        <div className="mb-6 bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="What would you like to know about this project?"
            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-stellar-blue/50 focus:ring-1 focus:ring-stellar-blue/50 min-h-[100px] resize-none"
            disabled={isSubmitting}
          />
          <div className="flex items-center justify-end gap-3 mt-3">
            <button
              onClick={() => {
                setShowSubmitForm(false);
                setNewQuestion('');
              }}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitQuestion}
              disabled={!newQuestion.trim() || isSubmitting}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                newQuestion.trim() && !isSubmitting
                  ? 'bg-stellar-blue text-white hover:bg-stellar-blue-dark'
                  : 'bg-white/5 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit Question'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {questions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No questions yet. Be the first to ask!</p>
          </div>
        ) : (
          questions.map((question) => (
            <div
              key={question.id}
              className="bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10 hover:border-white/20 transition-all"
            >
              {/* Question */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => handleUpvote(question.id)}
                    disabled={!isWalletConnected}
                    className={`p-2 rounded-lg transition-all ${
                      isWalletConnected
                        ? 'hover:bg-white/10 text-gray-400 hover:text-stellar-blue'
                        : 'text-gray-600 cursor-not-allowed'
                    }`}
                    title={isWalletConnected ? 'Upvote' : 'Connect wallet to upvote'}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <span className="text-sm font-bold text-stellar-blue">{question.upvotes}</span>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="text-white font-semibold">{question.question}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                        <span>{question.author}</span>
                        <span>•</span>
                        <span className="font-mono">{question.authorAddress}</span>
                        <span>•</span>
                        <span>{question.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  {/* Answer */}
                  {question.answer && (
                    <div className="mt-4 ml-0 pl-4 border-l-2 border-green-500/50 bg-green-500/5 rounded-r-lg p-3">
                      <div className="flex items-start gap-2 mb-2">
                        <svg className="w-5 h-5 text-green-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-green-300 mb-1">Official Response</p>
                          <p className="text-gray-300 text-sm leading-relaxed">{question.answer.text}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                            <span>{question.answer.author}</span>
                            <span>•</span>
                            <span>{question.answer.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
