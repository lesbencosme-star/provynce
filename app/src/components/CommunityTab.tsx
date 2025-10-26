import { useState } from 'react';
import { useCommunity } from '@/context/CommunityContext';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/context/ToastContext';
import ProjectQA from '@/components/ProjectQA';

interface CommunityTabProps {
  projectId: number;
  projectName: string;
}

export default function CommunityTab({ projectId, projectName }: CommunityTabProps) {
  const { user } = useUser();
  const { showSuccess, showError } = useToast();
  const {
    addComment,
    getProjectComments,
    likeComment,
    addInvestment,
    getProjectInvestments,
    getTotalProjectInvestment,
  } = useCommunity();

  const [activeSection, setActiveSection] = useState<'discussion' | 'investments' | 'qa'>('discussion');
  const [newComment, setNewComment] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');

  const comments = getProjectComments(projectId);
  const investments = getProjectInvestments(projectId);
  const totalInvestment = getTotalProjectInvestment(projectId);

  const handleAddComment = () => {
    if (!newComment.trim()) {
      showError('Please enter a comment');
      return;
    }

    if (!user) {
      showError('Please sign in to comment');
      return;
    }

    addComment(projectId, newComment, user.name || user.email);
    setNewComment('');
    showSuccess('Comment posted successfully!');
  };

  const handleInvest = () => {
    const amount = parseFloat(investmentAmount);

    if (!amount || amount <= 0) {
      showError('Please enter a valid amount');
      return;
    }

    if (!user) {
      showError('Please sign in to invest');
      return;
    }

    addInvestment(projectId, amount, user.name || user.email);
    setInvestmentAmount('');
    showSuccess(
      <div>
        <p className="font-bold">Investment Successful!</p>
        <p className="text-sm">You invested {amount} XLM in {projectName}</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Section Toggle */}
      <div className="flex gap-4 border-b border-white/10">
        <button
          onClick={() => setActiveSection('discussion')}
          className={`px-6 py-3 font-semibold transition-all border-b-2 ${
            activeSection === 'discussion'
              ? 'text-stellar-blue border-stellar-blue'
              : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Discussion ({comments.length})
          </div>
        </button>
        <button
          onClick={() => setActiveSection('investments')}
          className={`px-6 py-3 font-semibold transition-all border-b-2 ${
            activeSection === 'investments'
              ? 'text-stellar-blue border-stellar-blue'
              : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Community Investment ({totalInvestment.toFixed(2)} XLM)
          </div>
        </button>
        <button
          onClick={() => setActiveSection('qa')}
          className={`px-6 py-3 font-semibold transition-all border-b-2 ${
            activeSection === 'qa'
              ? 'text-stellar-blue border-stellar-blue'
              : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Q&A
          </div>
        </button>
      </div>

      {/* Discussion Section */}
      {activeSection === 'discussion' && (
        <div className="space-y-6">
          {/* Add Comment */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-stellar-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Join the Discussion
            </h3>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts, ask questions, or provide feedback..."
              className="w-full h-24 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-stellar-blue resize-none"
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={handleAddComment}
                className="px-6 py-2 bg-stellar-blue hover:bg-stellar-blue-dark text-white rounded-lg font-semibold transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Post Comment
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-gray-400">No comments yet. Be the first to start the conversation!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-stellar-blue/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-stellar-blue font-bold text-sm">
                        {comment.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-white font-semibold">{comment.userName}</span>
                        <span className="text-gray-500 text-xs">
                          {new Date(comment.timestamp).toLocaleDateString()} at{' '}
                          {new Date(comment.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{comment.content}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <button
                          onClick={() => likeComment(comment.id)}
                          className="flex items-center gap-2 text-gray-400 hover:text-stellar-blue transition-colors text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                          {comment.likes > 0 && <span>{comment.likes}</span>}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Investment Section */}
      {activeSection === 'investments' && (
        <div className="space-y-6">
          {/* Investment Form */}
          <div className="bg-gradient-to-br from-stellar-blue/10 via-purple-500/10 to-stellar-blue/10 backdrop-blur-md rounded-xl p-6 border border-stellar-blue/30">
            <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
              <svg className="w-6 h-6 text-stellar-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Support This Project
            </h3>
            <p className="text-gray-300 mb-4">
              Invest in {projectName} and help accelerate infrastructure development in your community
            </p>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Amount (XLM)
                </label>
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  placeholder="100"
                  min="1"
                  step="1"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-stellar-blue"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleInvest}
                  className="px-6 py-3 bg-gradient-to-r from-stellar-blue to-purple-600 hover:from-stellar-blue-dark hover:to-purple-700 text-white rounded-lg font-bold transition-all flex items-center gap-2 shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Invest
                </button>
              </div>
            </div>

            <div className="mt-4 p-4 bg-white/5 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Total Community Investment</p>
                  <p className="text-2xl font-bold text-stellar-blue">{totalInvestment.toFixed(2)} XLM</p>
                </div>
                <div>
                  <p className="text-gray-400">Community Investors</p>
                  <p className="text-2xl font-bold text-white">{investments.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Investment History */}
          <div>
            <h3 className="text-white font-bold mb-4">Recent Investments</h3>
            <div className="space-y-3">
              {investments.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                  <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-gray-400">No investments yet. Be the first to support this project!</p>
                </div>
              ) : (
                investments.map((investment) => (
                  <div
                    key={investment.id}
                    className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-semibold">{investment.userName}</p>
                        <p className="text-gray-400 text-xs">
                          {new Date(investment.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-bold text-lg">+{investment.amount} XLM</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Q&A Section */}
      {activeSection === 'qa' && (
        <ProjectQA projectId={projectId} projectName={projectName} />
      )}
    </div>
  );
}
