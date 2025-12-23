# Fix My Campus 🎓

A full-stack web application where students can submit pain points about college life, upvote issues, comment, and propose solutions. Built to empower student voices and drive positive change on campus.

## 🌟 Project Overview

Fix My Campus is a community-driven platform that addresses real pain points in college life across four key categories:
- **Registration** - Issues with class registration, scheduling, and enrollment
- **Advising** - Academic advising and student support challenges
- **Accessibility** - Campus accessibility and accommodation concerns
- **Tech Issues** - Technology and infrastructure problems

### Key Features
- ✅ Submit and categorize campus issues
- 👍 Upvote issues to show support
- 💬 Comment on issues to share experiences
- 💡 Propose solutions to problems
- 🔍 Filter issues by category
- 🗑️ Delete issues, comments, and solutions
- 📱 Responsive, modern UI with smooth animations

## 🛠️ Technologies Used

### Frontend
- **Next.js 16.1.1** - React framework with App Router
- **React 19.2.3** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **Geist Font** - Modern typography

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Vercel Postgres** - Cloud PostgreSQL database
- **SQL** - Database queries and schema

### Deployment
- **Vercel** - Hosting and deployment platform
- **GitHub** - Version control and CI/CD

## 🚀 Installation & Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Vercel account (for deployment)
- GitHub account (for version control)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fix-my-campus.git
   cd fix-my-campus
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   POSTGRES_URL=your_postgres_connection_string
   ```
   
   For local development, you can:
   - Use a local PostgreSQL database
   - Use Vercel Postgres and copy the connection string from your Vercel dashboard
   - Use a service like Supabase or Neon for a free PostgreSQL database

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Database Setup

The database tables are automatically created on first use. The schema includes:
- `issues` - Main issue submissions
- `comments` - Comments on issues
- `solutions` - Proposed solutions for issues

### Deployment to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Create Vercel Postgres Database**
   - In your Vercel project dashboard, go to "Storage"
   - Click "Create Database" → Select "Postgres"
   - Vercel will automatically add `POSTGRES_URL` environment variable

4. **Deploy**
   - Vercel will automatically deploy on push to main branch
   - Or click "Deploy" in the dashboard

## 🌐 Live Application

**Deployed on Vercel:** https://fix-my-campus-git-main-sara-abdulla-2025s-projects.vercel.app/

## 📁 Project Structure

```
fix-my-campus/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── issues/       # Issues endpoints
│   │   │   ├── comments/     # Comments endpoints
│   │   │   └── solutions/    # Solutions endpoints
│   │   ├── issues/           # Issue pages
│   │   │   ├── [id]/         # Issue detail page
│   │   │   └── new/          # New issue form
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   ├── lib/
│   │   └── db.ts             # Database connection & utilities
│   └── types/
│       └── index.ts           # TypeScript type definitions
├── public/                    # Static assets
├── package.json
├── tsconfig.json
└── README.md
```

## 🎯 API Endpoints

### Issues
- `GET /api/issues` - Get all issues (optional `?category=` filter)
- `POST /api/issues` - Create a new issue
- `GET /api/issues/[id]` - Get a single issue
- `PUT /api/issues/[id]` - Update an issue (e.g., upvote)
- `DELETE /api/issues/[id]` - Delete an issue

### Comments
- `GET /api/issues/[id]/comments` - Get comments for an issue
- `POST /api/issues/[id]/comments` - Create a comment
- `DELETE /api/comments/[id]` - Delete a comment

### Solutions
- `GET /api/issues/[id]/solutions` - Get solutions for an issue
- `POST /api/issues/[id]/solutions` - Propose a solution
- `PUT /api/solutions/[id]` - Update a solution (e.g., upvote)
- `DELETE /api/solutions/[id]` - Delete a solution

## 🎨 Features & Design

- **Modern UI** - Gradient backgrounds, glassmorphism effects, smooth animations
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Real-time Updates** - Instant UI updates after actions
- **Category Filtering** - Easy navigation by issue type
- **User-Friendly** - Intuitive interface with clear visual hierarchy

## 🧠 Development Process & Learnings

### Development Approach
This project was built incrementally with meaningful Git commits:
1. Initial Next.js setup with TypeScript and Tailwind CSS
2. Database schema design and implementation
3. API endpoints development (CRUD operations)
4. Frontend UI components and pages
5. Enhanced styling and animations
6. Database migration from SQLite to PostgreSQL for Vercel deployment

### Key Learnings
- **Next.js App Router** - Modern routing and server components
- **Serverless Functions** - Building API routes in Next.js
- **Database Design** - Schema design with foreign keys and cascading deletes
- **TypeScript** - Type safety across the full stack
- **PostgreSQL** - Migrating from SQLite to cloud PostgreSQL
- **Vercel Deployment** - Serverless deployment and database integration
- **UI/UX Design** - Creating modern, responsive interfaces with Tailwind CSS

### Challenges Overcome
- **Database Migration** - Successfully migrated from SQLite (better-sqlite3) to Vercel Postgres for serverless compatibility
- **Async/Await Patterns** - Converting synchronous SQLite queries to async PostgreSQL queries
- **Type Safety** - Maintaining TypeScript types across database operations
- **Deployment** - Configuring Vercel Postgres and environment variables

### AI Tools Used
- **Cursor AI** - Code generation, refactoring, and debugging assistance
- AI assistance for:
  - Database schema design
  - API endpoint implementation
  - UI component development
  - Error troubleshooting
  - Code optimization

## 📝 Future Enhancements

Potential features for future iterations:
- User authentication and profiles
- Issue status tracking (open, in-progress, resolved)
- Email notifications for issue updates
- Admin dashboard for managing issues
- Search functionality
- Image uploads for issues
- Analytics and reporting

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📄 License

This project is open source and available for educational purposes.

## 👤 Author

Built as a full-stack learning project demonstrating modern web development practices.

---

**Built with ❤️ using Next.js, TypeScript, and Vercel Postgres**
