'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Issue, IssueCategory } from '@/types';

const categoryColors: Record<IssueCategory, { bg: string; text: string; border: string; gradient: string; icon: string }> = {
  registration: {
    bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-200',
    gradient: 'from-blue-500 to-blue-600',
    icon: '📋',
  },
  advising: {
    bg: 'bg-gradient-to-br from-green-50 to-emerald-100',
    text: 'text-green-700',
    border: 'border-green-200',
    gradient: 'from-green-500 to-emerald-600',
    icon: '🎓',
  },
  accessibility: {
    bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
    text: 'text-purple-700',
    border: 'border-purple-200',
    gradient: 'from-purple-500 to-purple-600',
    icon: '♿',
  },
  tech: {
    bg: 'bg-gradient-to-br from-orange-50 to-amber-100',
    text: 'text-orange-700',
    border: 'border-orange-200',
    gradient: 'from-orange-500 to-amber-600',
    icon: '💻',
  },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Hero Header with Glassmorphism */}
      <header className="bg-white/70 backdrop-blur-xl shadow-xl border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Fix My Campus
                </h1>
              </div>
              <p className="mt-3 text-gray-600 text-lg font-medium ml-16">Share pain points. Find solutions. Make change happen.</p>
            </div>
            <Link
              href="/issues/new"
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3 text-lg">
                <svg className="w-6 h-6 transform group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Submit Issue
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Enhanced Category Filters */}
        <div className="mb-10">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`group px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl scale-105'
                  : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white shadow-lg hover:shadow-xl border border-gray-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-xl">📌</span>
                All Issues
              </span>
            </button>
            {(['registration', 'advising', 'accessibility', 'tech'] as IssueCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`group px-8 py-4 rounded-2xl font-bold text-lg capitalize transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === cat
                    ? `bg-gradient-to-r ${categoryColors[cat].gradient} text-white shadow-2xl scale-105`
                    : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white shadow-lg hover:shadow-xl border border-gray-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl">{categoryColors[cat].icon}</span>
                  {cat}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Loading State */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block relative">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-indigo-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
            </div>
            <p className="mt-6 text-gray-600 text-lg font-medium">Loading issues...</p>
          </div>
        ) : issues.length === 0 ? (
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 mb-6">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">No issues yet</h3>
            <p className="text-gray-500 mb-8 text-lg">Be the first to submit an issue and make a difference!</p>
            <Link
              href="/issues/new"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Submit First Issue
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {issues.map((issue, index) => (
              <Link
                key={issue.id}
                href={`/issues/${issue.id}`}
                className="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl border border-gray-200/50 p-8 transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] animate-fadeInUp"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{categoryColors[issue.category].icon}</span>
                    <span className={`px-4 py-2 rounded-xl text-xs font-bold capitalize ${categoryColors[issue.category].bg} ${categoryColors[issue.category].text} border ${categoryColors[issue.category].border} shadow-sm`}>
                      {issue.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl group-hover:from-blue-100 group-hover:to-indigo-100 transition-all">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                    <span className="font-bold text-blue-700">{issue.upvotes}</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                  {issue.title}
                </h2>
                <p className="text-gray-600 line-clamp-3 mb-6 text-sm leading-relaxed">
                  {issue.description}
                </p>
                <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                  <span className="text-xs text-gray-500 flex items-center gap-2 font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(issue.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="text-sm font-bold text-blue-600 group-hover:text-indigo-600 flex items-center gap-2 transition-colors">
                    View Details
                    <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}