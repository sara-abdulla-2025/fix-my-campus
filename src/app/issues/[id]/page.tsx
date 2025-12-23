'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Issue, Comment, Solution, IssueCategory } from '@/types';

const categoryColors: Record<IssueCategory, string> = {
  registration: 'bg-blue-100 text-blue-800',
  advising: 'bg-green-100 text-green-800',
  accessibility: 'bg-purple-100 text-purple-800',
  tech: 'bg-orange-100 text-orange-800',
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
    if (!issue) return;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Issue not found</p>
          <Link href="/" className="text-blue-600 hover:underline">Go back home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-blue-600 hover:underline">← Back to Issues</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${categoryColors[issue.category]}`}>
              {issue.category}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(issue.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{issue.title}</h1>
          <p className="text-gray-700 mb-6 whitespace-pre-wrap">{issue.description}</p>
          <button
            onClick={handleUpvote}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            <span>{issue.upvotes}</span>
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Solutions ({solutions.length})</h2>
            <button
              onClick={() => setShowSolutionForm(!showSolutionForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              {showSolutionForm ? 'Cancel' : '+ Propose Solution'}
            </button>
          </div>

          {showSolutionForm && (
            <form onSubmit={handleSolutionSubmit} className="bg-white rounded-lg shadow-sm border p-6 mb-4">
              <input
                type="text"
                placeholder="Solution title"
                value={solutionTitle}
                onChange={(e) => setSolutionTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg mb-4"
                required
              />
              <textarea
                placeholder="Describe your solution..."
                value={solutionDesc}
                onChange={(e) => setSolutionDesc(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg mb-4"
                rows={4}
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Submit Solution
              </button>
            </form>
          )}

          <div className="space-y-4">
            {solutions.map((solution) => (
              <div key={solution.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{solution.title}</h3>
                  <button
                    onClick={() => handleSolutionUpvote(solution.id, solution.upvotes)}
                    className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    <span className="font-medium">{solution.upvotes}</span>
                  </button>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{solution.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(solution.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Comments ({comments.length})</h2>
          <form onSubmit={handleCommentSubmit} className="bg-white rounded-lg shadow-sm border p-6 mb-4">
            <textarea
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4"
              rows={3}
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Post Comment
            </button>
          </form>

          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white rounded-lg shadow-sm border p-6">
                <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}