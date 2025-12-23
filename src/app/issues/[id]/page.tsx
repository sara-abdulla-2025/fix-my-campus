'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Issue, Comment, Solution, IssueCategory } from '@/types';

const categoryColors: Record<IssueCategory, { bg: string; text: string; border: string; gradient: string }> = {
  registration: {
    bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-200',
    gradient: 'from-blue-500 to-blue-600',
  },
  advising: {
    bg: 'bg-gradient-to-br from-green-50 to-emerald-100',
    text: 'text-green-700',
    border: 'border-green-200',
    gradient: 'from-green-500 to-emerald-600',
  },
  accessibility: {
    bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
    text: 'text-purple-700',
    border: 'border-purple-200',
    gradient: 'from-purple-500 to-purple-600',
  },
  tech: {
    bg: 'bg-gradient-to-br from-orange-50 to-amber-100',
    text: 'text-orange-700',
    border: 'border-orange-200',
    gradient: 'from-orange-500 to-amber-600',
  },
};

export default function IssueDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [issue, setIssue] = useState<Issue | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [solutionTitle, setSolutionTitle] = useState('');
  const [solutionDesc, setSolutionDesc] = useState('');
  const [showSolutionForm, setShowSolutionForm] = useState(false);
  const [upvoting, setUpvoting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      const [issueRes, commentsRes, solutionsRes] = await Promise.all([
        fetch(`/api/issues/${id}`),
        fetch(`/api/issues/${id}/comments`),
        fetch(`/api/issues/${id}/solutions`),
      ]);

      const issueData = await issueRes.json();
      const commentsData = await commentsRes.json();
      const solutionsData = await solutionsRes.json();

      setIssue(issueData.issue);
      setComments(commentsData.comments || []);
      setSolutions(solutionsData.solutions || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    if (!issue || upvoting) return;
    setUpvoting(true);
    try {
      const res = await fetch(`/api/issues/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upvotes: issue.upvotes + 1 }),
      });
      const data = await res.json();
      setIssue(data.issue);
    } catch (error) {
      console.error('Error upvoting:', error);
    } finally {
      setUpvoting(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await fetch(`/api/issues/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentText }),
      });
      const data = await res.json();
      setComments([...comments, data.comment]);
      setCommentText('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleSolutionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!solutionTitle.trim() || !solutionDesc.trim()) return;

    try {
      const res = await fetch(`/api/issues/${id}/solutions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: solutionTitle, description: solutionDesc }),
      });
      const data = await res.json();
      setSolutions([data.solution, ...solutions]);
      setSolutionTitle('');
      setSolutionDesc('');
      setShowSolutionForm(false);
    } catch (error) {
      console.error('Error posting solution:', error);
    }
  };

  const handleSolutionUpvote = async (solutionId: string, currentUpvotes: number) => {
    try {
      const res = await fetch(`/api/solutions/${solutionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upvotes: currentUpvotes + 1 }),
      });
      const data = await res.json();
      setSolutions(solutions.map(s => s.id === solutionId ? data.solution : s));
    } catch (error) {
      console.error('Error upvoting solution:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this issue? This action cannot be undone and will delete all comments and solutions.')) {
      return;
    }

    try {
      const res = await fetch(`/api/issues/${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        router.push('/');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete issue');
      }
    } catch (error) {
      console.error('Error deleting issue:', error);
      alert('Failed to delete issue');
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setComments(comments.filter(c => c.id !== commentId));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    }
  };

  const handleSolutionDelete = async (solutionId: string) => {
    if (!confirm('Are you sure you want to delete this solution? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`/api/solutions/${solutionId}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setSolutions(solutions.filter(s => s.id !== solutionId));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete solution');
      }
    } catch (error) {
      console.error('Error deleting solution:', error);
      alert('Failed to delete solution');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
          <p className="text-gray-500 text-lg">Loading issue...</p>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Issue not found</h3>
          <p className="text-gray-500 mb-6">The issue you're looking for doesn't exist.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Issues
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-indigo-600 font-semibold transition-colors group">
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Issues
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Issue Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 p-10 mb-10 transform hover:shadow-3xl transition-all duration-500 animate-fadeInUp">
          <div className="flex items-center gap-4 mb-8">
            <div className={`px-5 py-3 rounded-2xl text-sm font-bold capitalize ${categoryColors[issue.category].bg} ${categoryColors[issue.category].text} border-2 ${categoryColors[issue.category].border} shadow-lg`}>
              {issue.category}
            </div>
            <span className="text-sm text-gray-500 flex items-center gap-2 font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(issue.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-8 leading-tight">{issue.title}</h1>
          <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-2xl p-8 mb-8 border border-gray-100">
            <p className="text-gray-700 whitespace-pre-wrap text-lg leading-relaxed">{issue.description}</p>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={handleUpvote}
              disabled={upvoting}
              className="group inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
            >
              <svg className={`w-7 h-7 ${upvoting ? 'animate-bounce' : 'group-hover:scale-125'} transition-transform`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              <span className="text-2xl font-extrabold">{issue.upvotes}</span>
              <span className="text-sm opacity-90 font-medium">Upvotes</span>
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-2xl font-bold shadow-2xl hover:shadow-3xl hover:from-red-700 hover:to-rose-700 transform hover:scale-110 transition-all duration-300 text-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Issue
            </button>
          </div>
        </div>

        {/* Enhanced Solutions Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-extrabold text-gray-900 flex items-center gap-4">
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Solutions
              </span>
              <span className="text-2xl font-bold text-gray-400">({solutions.length})</span>
            </h2>
            <button
              onClick={() => setShowSolutionForm(!showSolutionForm)}
              className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-110 ${
                showSolutionForm
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-lg'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-2xl hover:shadow-3xl'
              }`}
            >
              {showSolutionForm ? '✕ Cancel' : '+ Propose Solution'}
            </button>
          </div>

          {showSolutionForm && (
            <form onSubmit={handleSolutionSubmit} className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-green-200 p-8 mb-8 animate-fadeInUp">
              <input
                type="text"
                placeholder="Solution title"
                value={solutionTitle}
                onChange={(e) => setSolutionTitle(e.target.value)}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl mb-5 focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all text-lg font-medium"
                required
              />
              <textarea
                placeholder="Describe your solution in detail..."
                value={solutionDesc}
                onChange={(e) => setSolutionDesc(e.target.value)}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl mb-6 focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all resize-none text-lg"
                rows={5}
                required
              />
              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
              >
                Submit Solution
              </button>
            </form>
          )}

          <div className="space-y-4">
            {solutions.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No solutions yet</h3>
                <p className="text-gray-500">Be the first to propose a solution!</p>
              </div>
            ) : (
              solutions.map((solution, index) => (
                <div key={solution.id} className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-green-100 p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.01] animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="text-3xl font-extrabold text-gray-900 flex-1 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{solution.title}</h3>
                    <div className="ml-6 flex items-center gap-3">
                      <button
                        onClick={() => handleSolutionUpvote(solution.id, solution.upvotes)}
                        className="flex items-center gap-3 px-6 py-3 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-125"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                        <span className="text-xl">{solution.upvotes}</span>
                      </button>
                      <button
                        onClick={() => handleSolutionDelete(solution.id)}
                        className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl hover:from-red-700 hover:to-rose-700 transition-all transform hover:scale-110"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-2xl p-6 mb-5 border border-green-100">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">{solution.description}</p>
                  </div>
                  <p className="text-sm text-gray-500 flex items-center gap-2 font-medium">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(solution.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Enhanced Comments Section */}
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-8 flex items-center gap-4">
            <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </span>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Comments
            </span>
            <span className="text-2xl font-bold text-gray-400">({comments.length})</span>
          </h2>
          <form onSubmit={handleCommentSubmit} className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-blue-200 p-8 mb-8">
            <textarea
              placeholder="Share your thoughts and join the conversation..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl mb-6 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all resize-none text-lg"
              rows={5}
              required
            />
            <button
              type="submit"
              className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
            >
              Post Comment
            </button>
          </form>

          <div className="space-y-5">
            {comments.length === 0 ? (
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-gray-200 p-16 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 mb-6">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No comments yet</h3>
                <p className="text-gray-500 text-lg">Start the conversation and share your thoughts!</p>
              </div>
            ) : (
              comments.map((comment, index) => (
                <div key={comment.id} className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-blue-100 p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 hover:scale-[1.01] animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-2xl p-6 mb-5 border border-blue-100">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">{comment.content}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 flex items-center gap-2 font-medium">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <button
                      onClick={() => handleCommentDelete(comment.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:from-red-700 hover:to-rose-700 transition-all transform hover:scale-110"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}