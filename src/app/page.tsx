'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Issue, IssueCategory } from '@/types';

const categoryColors: Record<IssueCategory, string> = {
  registration: 'bg-blue-100 text-blue-800',
  advising: 'bg-green-100 text-green-800',
  accessibility: 'bg-purple-100 text-purple-800',
  tech: 'bg-orange-100 text-orange-800',
};

export default function Home() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory | 'all'>('all');

  useEffect(() => {
    fetchIssues();
  }, [selectedCategory]);

  const fetchIssues = async () => {
    try {
      const url = selectedCategory === 'all' 
        ? '/api/issues' 
        : `/api/issues?category=${selectedCategory}`;
      const res = await fetch(url);
      const data = await res.json();
      setIssues(data.issues || []);
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Fix My Campus</h1>
          <p className="mt-2 text-gray-600">Share pain points. Find solutions. Make change happen.</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            {(['registration', 'advising', 'accessibility', 'tech'] as IssueCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium capitalize ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <Link
            href="/issues/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            + Submit Issue
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading issues...</p>
          </div>
        ) : issues.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No issues found. Be the first to submit one!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {issues.map((issue) => (
              <Link
                key={issue.id}
                href={`/issues/${issue.id}`}
                className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${categoryColors[issue.category]}`}>
                        {issue.category}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{issue.title}</h2>
                    <p className="text-gray-600 line-clamp-2">{issue.description}</p>
                  </div>
                  <div className="ml-4 flex items-center gap-1 text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    <span className="font-medium">{issue.upvotes}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}