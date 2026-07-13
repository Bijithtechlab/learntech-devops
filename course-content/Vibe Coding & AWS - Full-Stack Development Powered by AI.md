# Vibe Coding & AWS: Full-Stack Development Powered by AI

**Tagline**: *Talk to AI. Build Software. Deploy to AWS.*

| Detail | Info |
|---|---|
| **Duration** | 4 weeks (17 sessions, ~2 hours each) |
| **Level** | Beginner to Intermediate |
| **Category** | Technology |
| **Projects** | Expense Tracker (guided) + Personal Blog Platform (capstone) |

---

## Week 1: Foundations - Vibe Coding & Development Setup

### Session 1: Introduction to Vibe Coding

- What is Vibe Coding? The paradigm shift from traditional coding
- Traditional Coding vs Vibe Coding — comparison
- The Vibe Coding Workflow: Describe → Review → Test → Iterate → Commit → Repeat
- Overview of AI tools: Amazon Q Developer, GitHub Copilot, Cursor
- Why Amazon Q Developer — chat-based, context-aware, AWS-native
- How to talk to AI — prompt patterns for building features
- Course roadmap & what you'll build by the end

### Session 2: Development Environment Setup

- Installing Node.js (using nvm)
- Installing VS Code & essential extensions
- Setting up Amazon Q Developer in VS Code — AWS Builder ID, authentication
- Your first conversation with Amazon Q — asking questions, generating code
- Understanding Amazon Q modes: Chat, Inline, /dev, @workspace
- Creating your first Next.js project via Amazon Q chat
- Hands-on: Build a counter app entirely through conversation

### Session 3: Amazon Q Developer Deep Dive

- The art of prompting — vague vs precise prompts
- Prompt patterns: Creating UI components, Building API routes, Modifying existing code, Fixing bugs, Connecting to AWS
- Using @workspace for project-aware context
- Using /dev for multi-file feature generation
- Debugging with Amazon Q — runtime errors, UI issues, API failures
- Inline completions — Tab to accept, Alt+C / Option+C to trigger
- Hands-on: Build a complete component through step-by-step conversation

### Session 4: Git & Version Control Essentials

- Why version control? The problem it solves
- Git core concepts: Working Directory → Staging Area → Repository
- Essential commands: init, add, commit, status, log, diff
- Branching & merging — feature branch workflow
- Working with GitHub — remote, push, pull, clone
- The .gitignore file — what to never commit (node_modules, .env, .next)
- Git workflow for this course: branch per feature → build with Amazon Q → commit → merge
- Hands-on: Full workflow — create project, branch, build feature via Amazon Q, commit, merge, push

### Session 5: Web Development Fundamentals (Fast Track)

- Why learn this if AI writes the code? (Review, describe, debug, tweak)
- HTML essentials — tags, structure, forms, semantic elements
- CSS & Tailwind CSS — traditional CSS vs utility classes, Tailwind cheat sheet
- JavaScript essentials — variables, arrow functions, arrays, objects, destructuring, spread operator, async/await, ternary, optional chaining
- React concepts — components, props, state (useState), side effects (useEffect), event handling
- Next.js concepts — file-based routing, API routes, 'use client' directive
- Hands-on: Build a mini app via Amazon Q chat (API route + components + page)

---

## Week 2: AWS Foundations - The Cloud Building Blocks

### Session 6: AWS Account & IAM Fundamentals

- What is AWS? Cloud computing benefits
- Creating an AWS account (Free Tier)
- Setting up billing alarms and budgets
- Root User vs IAM User — why never use root for daily work
- IAM core concepts: Users, Groups, Policies, Roles
- Creating an IAM user via Console
- Enabling MFA (Multi-Factor Authentication)
- Installing & configuring AWS CLI with IAM credentials
- Hands-on: Create IAM user, configure CLI, verify with aws sts get-caller-identity

### Session 7: AWS IAM — Policies & Roles Deep Dive

- IAM Policy structure — Version, Statement, Sid, Effect, Action, Resource
- Understanding ARNs (Amazon Resource Names)
- Common policy examples: S3 access, DynamoDB CRUD, Lambda execution, CloudWatch logs
- Combined policy for a full-stack app
- AWS Managed vs Customer Managed vs Inline policies
- IAM Roles — letting services talk to each other (trust policy + permission policy)
- Creating roles via CLI — Lambda execution role with S3, DynamoDB, CloudWatch permissions
- Creating custom policies via CLI
- Using Amazon Q to generate IAM policies
- Security best practices checklist

### Session 8: AWS Lambda — Serverless Computing

- What is Lambda? Serverless concepts, pay-per-use model
- Lambda concepts: Function, Handler, Event, Context, Trigger, Runtime, Timeout, Memory
- Creating your first Lambda function via Console
- Lambda function structure — handler, event parsing, response format, error handling
- Real-world Lambda: CRUD operations with DynamoDB
- Deploying Lambda via CLI — zip, create-function, invoke
- Lambda triggers: API Gateway, S3 events, DynamoDB streams, CloudWatch schedules
- Lambda in Next.js — API routes automatically become Lambda on Amplify
- Lambda pricing & Free Tier (1M requests/month always free)
- Hands-on: Build a Lambda function via Amazon Q and deploy via CLI

### Session 9: AWS RDS — Relational Databases

- What is RDS? Managed database benefits
- Supported engines: PostgreSQL, MySQL, MariaDB, SQL Server, Oracle, Aurora
- SQL basics refresher: CREATE TABLE, INSERT, SELECT, UPDATE, DELETE, JOIN
- Relational concepts: Primary keys, foreign keys, indexes
- Creating an RDS PostgreSQL instance (Console & CLI) — Free Tier settings
- Configuring security groups for database access
- Connecting to RDS from your app — connection string, pg package, connection pool
- Database connection utility (lib/db.ts)
- Creating tables programmatically via API route
- CRUD API routes with RDS — parameterized queries, filtering, sorting
- Testing APIs with curl
- RDS pricing & Free Tier
- Hands-on: Complete database setup via Amazon Q conversation

---

## Week 3: Full-Stack Application - Building Feature by Feature (Expense Tracker)

### Session 10: Project Setup & Landing Page

- Project initialization — create-next-app, install dependencies, Git init
- Project structure plan — pages, API routes, components, lib, types
- Environment variables setup (.env.local) — database, AWS, auth secrets
- TypeScript interfaces — Transaction, Category, User, MonthlyReport, ApiResponse
- Building the root layout with Header component via Amazon Q
- Header component — responsive navbar with logo, links, mobile hamburger menu, active link highlighting
- Landing page — Hero section with gradient, Features grid with icons (Track Spending, Categorize, Monthly Reports), Footer
- Hands-on: Build complete landing page through Amazon Q conversation, commit to Git

### Session 11: Expense Dashboard — Transactions & Categories

- Database schema design — transactions table (id, amount, type income/expense, description, category_id, date, user_id, created_at), categories table (id, name, icon, color, user_id)
- Creating database tables via API route
- Categories API — GET all categories, POST create category, DELETE category
- Transactions API — GET with filtering by date range/category/type, POST create transaction, PUT update, DELETE
- Category management page — add/edit/delete spending categories (Food, Transport, Bills, Entertainment, Salary, etc.)
- TransactionForm component — amount input, type toggle (income/expense), description, category dropdown, date picker
- TransactionCard component — amount with color (green for income, red for expense), category badge, description, date, edit/delete buttons
- TransactionList component — grouped by date, running balance, empty state
- Dashboard layout — summary cards (Total Income, Total Expenses, Net Balance), recent transactions list
- Hands-on: Build complete expense dashboard through Amazon Q conversation

### Session 12: Monthly Reports, Filtering & Search

- Monthly report API — aggregate transactions by month, calculate totals per category, income vs expense breakdown
- Monthly report page — month/year selector, summary cards (income, expenses, savings, savings rate percentage)
- Category-wise breakdown — bar chart or table showing spending per category for selected month
- Income vs Expense trend — monthly comparison view (last 6 months)
- Filter bar component — filter by type (All/Income/Expense), filter by category, date range picker (from date - to date)
- Search functionality — search transactions by description as user types (debounced)
- Sort options — sort by date (newest/oldest), sort by amount (highest/lowest)
- Combining filters, search, and sort — URL query parameters approach
- Transaction detail view — full transaction details with edit capability
- Export to CSV — download filtered transactions as a CSV file
- Hands-on: Build reports, filtering, and search through Amazon Q conversation

### Session 13: Advanced Features & Polish

- Budget setting — set monthly budget per category, show progress bar (spent vs budget), over-budget warnings
- Recurring transactions — mark transactions as recurring (daily/weekly/monthly), auto-create on schedule
- Dashboard statistics enhancements — top spending categories, average daily spending, biggest expense this month
- Data visualization — spending by category (pie/donut chart concept using simple CSS or chart library)
- Responsive design polish — mobile-first layout adjustments, touch-friendly inputs
- Error handling improvements — form validation, API error messages, network error handling, retry logic
- Loading states — skeleton loaders for dashboard, spinner for form submissions
- Empty states — friendly messages when no transactions, no categories, no data for selected month
- Hands-on: Build advanced features and polish through Amazon Q conversation

---

## Week 4: Deployment, CI/CD & Capstone Project

### Session 14: AWS Amplify — Deployment & Hosting

- What is AWS Amplify? Hosting vs Studio vs CLI
- Preparing your app for deployment — environment variables, build settings
- Connecting GitHub repository to Amplify (Console walkthrough)
- amplify.yml build configuration — preBuild, build, artifacts, cache
- Custom domain setup & SSL certificates
- Environment variables in Amplify Console
- First deployment — push to GitHub, watch Amplify build and deploy
- Testing the live application
- Debugging deployment issues — build logs, runtime logs
- Hands-on: Deploy the Expense Tracker app to Amplify

### Session 15: CI/CD Pipeline & Production Best Practices

- CI/CD concepts — Continuous Integration & Continuous Deployment
- Branch-based deployments — main (production), develop (staging)
- Amplify branch auto-detection and preview deployments
- Pull request previews
- Build notifications — email/Slack alerts on success/failure
- Hands-on: Set up branch-based CI/CD pipeline with staging and production

### Session 16: Capstone Project — Personal Blog Platform — Build & Deploy

- Capstone project overview — build a Personal Blog Platform end-to-end using Amazon Q
- Requirements:
  - User authentication (register/login for blog authors)
  - Create, edit, publish, and delete blog posts (rich text: title, content, excerpt)
  - Categories — assign posts to categories, filter posts by category
  - Comments — visitors can leave comments on published posts, author can delete comments
  - Image uploads — featured image per post, images within post content, stored on AWS S3 with presigned URLs
  - Public blog listing — paginated list of published posts, sorted by newest
  - Individual post page — full post content, author info, comments section, related posts
  - Author dashboard — manage posts (draft/published), view comment count, total views
- Database schema design — users, posts, categories, comments tables with relationships
- Workflow: Describe each feature to Amazon Q → Review generated code → Test → Commit → Next feature
- Deployment to AWS Amplify with CI/CD pipeline
- Instructor-guided development session
- Troubleshooting common issues

### Session 17: Capstone Showcase & Next Steps

- Students present their deployed Personal Blog Platform (live URL)
- Code walkthrough and architecture review
- Peer feedback and Q&A
- Career guidance — AWS certifications path (Cloud Practitioner → Solutions Architect → AI Practitioner)
- Advanced topics roadmap: DynamoDB, S3, CloudFront CDN, Route 53 DNS, Docker & ECS, API Gateway, Cognito authentication
- Building a portfolio — showcasing projects on GitHub and LinkedIn
- Course completion & certificates

---

## Course Features

- Live instructor-led sessions
- Hands-on projects in every session
- AI-assisted development throughout (Amazon Q Developer)
- Real AWS deployment (not simulations)
- Two complete projects: Expense Tracker (guided) + Personal Blog Platform (capstone)
- Access to course materials & session recordings

## Prerequisites

- Basic computer literacy
- No prior programming experience required
- AWS Free Tier account (guided setup in Session 6)
- Laptop with internet connection

## Learning Outcomes

By course end, students will be able to:

1. Use Amazon Q Developer chat to build full-stack applications feature by feature
2. Understand and manage AWS IAM (users, policies, roles)
3. Work with Lambda, RDS, and Amplify
4. Build and deploy production-ready web applications on AWS
5. Set up CI/CD pipelines for automated deployments
6. Apply security best practices for cloud applications
7. Independently build and deploy new projects using Vibe Coding
