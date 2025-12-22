export type IssueCategory = 'registration' | 'advising' | 'accessibility' | 'tech';

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  upvotes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  issueId: string;
  createdAt: Date;
}

export interface Solution {
  id: string;
  title: string;
  description: string;
  issueId: string;
  upvotes: number;
  createdAt: Date;
}