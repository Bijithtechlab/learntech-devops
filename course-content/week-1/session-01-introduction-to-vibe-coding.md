# Session 1: Introduction to Vibe Coding

**Course**: Vibe Coding & AWS: Full-Stack Development Powered by AI
**Duration**: ~2 hours
**Week**: 1 — Foundations
**Trainer Notes**: This session sets the tone for the entire course. The goal is to inspire students with what's possible, clearly define vibe coding, and build confidence that they can build real software by talking to AI.

---

## 1. What is Vibe Coding? The Paradigm Shift from Traditional Coding

### 1.1 Origin of the Term

The term **"Vibe Coding"** was coined by **Andrej Karpathy** (co-founder of OpenAI, former Tesla AI Director) in February 2025:

> *"There's a new kind of coding I call 'vibe coding', where you fully give in to the vibes, embrace exponentials, and forget that the code even exists."*
> — Andrej Karpathy, February 2025

### 1.2 Definition

**Vibe Coding** is a software development approach where the developer describes what they want in natural language, and an AI assistant generates the code. The developer's role shifts from *writing* code to *directing, reviewing, and iterating* on AI-generated code.

You become the **architect**. AI becomes the **builder**.

### 1.3 The Paradigm Shift

| Aspect | Traditional Development | Vibe Coding |
|---|---|---|
| **Primary skill** | Syntax mastery, language fluency | Clear communication, problem decomposition |
| **How you build** | Type every line of code manually | Describe what you want; AI generates code |
| **Debugging** | Read stack traces, trace logic manually | Paste the error to AI, get a fix |
| **Learning curve** | Months/years before building real apps | Build working apps from day one |
| **Bottleneck** | Typing speed, syntax recall | Clarity of thought, quality of prompts |
| **Who can do it** | Trained programmers | Anyone who can describe a problem clearly |

### 1.4 What Vibe Coding is NOT

- ❌ It is **not** "no-code" — you still work with real code, you just don't write it from scratch
- ❌ It is **not** copy-paste from Stack Overflow — AI understands your project context
- ❌ It is **not** a replacement for understanding — you must review, test, and validate
- ❌ It is **not** magic — garbage prompts produce garbage code

### 1.5 Why This Matters Now

- AI coding tools have crossed the **quality threshold** — they generate production-grade code
- Companies like Google, Amazon, and Microsoft report **30–60% productivity gains** with AI-assisted development
- GitHub reports **46% of all code** on the platform is now AI-generated (2024)
- The developer role is evolving — those who leverage AI will outperform those who don't

> 💡 **Key Takeaway**: Vibe coding doesn't eliminate the need for developers. It eliminates the need for developers to do repetitive, boilerplate work — freeing them to focus on architecture, logic, and user experience.

---

## 2. Traditional Coding vs Vibe Coding — Comparison

### 2.1 Building a Feature: Side-by-Side

**Scenario**: Build a responsive contact form that validates email, shows error messages, and submits data to an API.

#### Traditional Approach
1. Google "React form validation tutorial"
2. Read 3–4 blog posts and Stack Overflow answers
3. Manually write the JSX structure
4. Write CSS or Tailwind classes for styling
5. Write validation logic (regex for email, required fields)
6. Write error state management with useState
7. Write the API call with fetch/axios
8. Handle loading and error states
9. Debug typos, missing imports, incorrect state updates
10. **Time**: 2–4 hours

#### Vibe Coding Approach
1. Open Amazon Q Developer chat
2. Type: *"Create a responsive contact form component with name, email, and message fields. Validate email format, show inline error messages, and submit to /api/contact. Use Tailwind CSS. Show loading spinner during submission and a success toast on completion."*
3. Review the generated code
4. Ask AI to fix any issues or adjust styling
5. Test and commit
6. **Time**: 15–30 minutes

### 2.2 The Developer's Role Changes

```
Traditional Developer          Vibe Coder
─────────────────────          ──────────────────
Writes code                →   Describes intent
Memorizes syntax           →   Understands concepts
Debugs line by line        →   Describes the bug to AI
Reads documentation        →   Asks AI to explain
Builds from scratch        →   Iterates on AI output
```

### 2.3 When Traditional Skills Still Matter

Vibe coding doesn't mean you can ignore fundamentals. You need to understand:

- **What the code does** — so you can review AI output
- **How components connect** — so you can describe features accurately
- **What "good" looks like** — so you can spot bad AI suggestions
- **How to test** — AI can write tests, but you decide what to test
- **Security basics** — AI may generate insecure patterns if not guided

> 💡 **Analogy**: A film director doesn't operate the camera, but they must understand cinematography to direct the shot. You're the director. AI is your crew.

---

## 3. The Vibe Coding Workflow: Describe → Review → Test → Iterate → Commit → Repeat

### 3.1 The Six-Step Loop

```
┌──────────────────────────────────────────────────┐
│                                                  │
│   ① DESCRIBE  →  ② REVIEW  →  ③ TEST           │
│        ↑                          ↓              │
│        │                          │              │
│   ⑥ REPEAT    ←  ⑤ COMMIT  ←  ④ ITERATE        │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 3.2 Step-by-Step Breakdown

#### ① DESCRIBE — Tell AI What You Want
- Be specific about **what**, **where**, and **how**
- Include context: framework, styling, behavior
- Example:
  > *"Create a Next.js API route at /api/students that accepts POST requests with name, email, and course fields. Validate that all fields are present. Store the data in DynamoDB table 'Students'. Return 201 on success, 400 on validation error."*

#### ② REVIEW — Read What AI Generated
- Don't blindly accept. Read through the code.
- Check: Does it match your intent? Are there security issues? Is the logic correct?
- Look for: hardcoded values, missing error handling, incorrect imports

#### ③ TEST — Run It and Verify
- Start the dev server, hit the endpoint, check the UI
- Test happy path AND edge cases
- Use browser DevTools, terminal logs, API testing tools

#### ④ ITERATE — Refine with Follow-Up Prompts
- If something's wrong, describe the issue to AI:
  > *"The form submits even when email is empty. Add validation to prevent submission if any field is blank."*
- Each iteration gets you closer to the final result

#### ⑤ COMMIT — Save Your Work
- Once a feature works, commit to Git with a clear message
- `git add . && git commit -m "feat: add student registration API with DynamoDB"`

#### ⑥ REPEAT — Move to the Next Feature
- Pick the next feature from your plan and start the loop again

### 3.3 The Golden Rule

> **Never commit code you don't understand.**
> AI generates it. You own it. If it breaks in production, it's your responsibility.

---

## 4. Overview of AI Coding Tools

### 4.1 The Big Three

| Tool | Company | Strengths | Pricing |
|---|---|---|---|
| **Amazon Q Developer** | AWS | Chat-based, /dev for multi-file, AWS-native, security scans | Free tier available |
| **GitHub Copilot** | Microsoft/GitHub | Inline completions, wide language support, large community | $10–19/month |
| **Cursor** | Cursor Inc. | Full IDE replacement, composer mode, codebase-aware | $20/month |

### 4.2 Amazon Q Developer

- **Chat panel**: Ask questions, generate code, debug errors — conversational interface in your IDE
- **Inline completions**: AI suggests code as you type (Tab to accept, Alt+C / Option+C to trigger)
- **/dev mode**: Describe a feature, AI generates/modifies multiple files at once
- **@workspace**: AI reads your entire project for context-aware suggestions
- **Security scans**: Detects vulnerabilities in your code
- **AWS integration**: Understands AWS services natively — DynamoDB, Lambda, S3, Amplify

### 4.3 GitHub Copilot

- **Inline completions**: The original AI pair programmer — suggests code as you type
- **Copilot Chat**: Conversational interface for questions and code generation
- **Copilot Edits**: Multi-file editing capability
- **Wide adoption**: Most popular AI coding tool with the largest user base
- **Language support**: Excellent across Python, JavaScript, TypeScript, Go, Java, and more

### 4.4 Cursor

- **Fork of VS Code**: Familiar interface, but AI-first design
- **Composer mode**: Describe a feature, AI modifies multiple files across your project
- **Codebase indexing**: Understands your entire project structure
- **Tab completion**: Context-aware inline suggestions
- **Multiple model support**: Use Claude, GPT-4, or other models

### 4.5 Why We Use Multiple Tools

In practice, professional developers often use **more than one** tool. In this course:
- **Amazon Q Developer** is our primary tool (AWS-native, free tier, excellent for full-stack + cloud)
- You'll understand how other tools work so you can adapt to any team's toolchain

---

## 5. Why Amazon Q Developer — Chat-Based, Context-Aware, AWS-Native

### 5.1 Three Reasons We Chose Amazon Q Developer for This Course

#### Reason 1: Chat-Based Development
Amazon Q Developer lets you have a **conversation** with AI to build features. This is the most natural way to vibe code.

```
You:    "Create a DynamoDB table for storing student registrations 
         with partition key email and sort key registrationDate"

Amazon Q: [Generates the AWS CLI command or CloudFormation template]

You:    "Now create a Next.js API route to write to this table"

Amazon Q: [Generates the API route with AWS SDK integration]

You:    "Add input validation and error handling"

Amazon Q: [Updates the code with validation logic]
```

Each message builds on the previous context. It's like pair programming with an expert.

#### Reason 2: Context-Aware (@workspace)
When you use `@workspace`, Amazon Q reads your project files to understand:
- Your tech stack (Next.js, TypeScript, Tailwind)
- Your existing components and patterns
- Your API structure and database schema
- Your environment variables and configuration

This means generated code **fits your project** — correct imports, matching patterns, consistent style.

#### Reason 3: AWS-Native
Since we deploy to AWS (DynamoDB, SES, Amplify), Amazon Q has **deep knowledge** of:
- AWS SDK patterns and best practices
- IAM policies and security configurations
- DynamoDB query patterns and table design
- Lambda function structure and deployment
- Amplify build and deploy configuration

Other tools can work with AWS, but Amazon Q was **built for it**.

### 5.2 Amazon Q Developer Modes — Quick Reference

| Mode | What It Does | When to Use |
|---|---|---|
| **Chat** | Conversational Q&A and code generation | Asking questions, generating single files, debugging |
| **Inline** | Suggests code as you type | Writing code with AI autocomplete |
| **/dev** | Multi-file feature generation | Building a complete feature across multiple files |
| **@workspace** | Project-aware context | When AI needs to understand your existing code |
| **/review** | Code review and security scan | Before committing, checking for issues |

### 5.3 Free Tier

Amazon Q Developer offers a generous free tier:
- Chat interactions
- Inline code completions
- Security scans
- No credit card required — just an **AWS Builder ID** (free)

---

## 6. How to Talk to AI — Prompt Patterns for Building Features

### 6.1 The Anatomy of a Good Prompt

A good prompt has **four elements**:

```
CONTEXT  +  TASK  +  CONSTRAINTS  +  OUTPUT FORMAT
```

| Element | What It Answers | Example |
|---|---|---|
| **Context** | What's the situation? | "In my Next.js 14 app using TypeScript and Tailwind..." |
| **Task** | What do you want? | "...create a student registration form..." |
| **Constraints** | What are the rules? | "...with name, email, phone, and course dropdown. Validate all fields." |
| **Output format** | How should it look? | "...as a React client component with inline error messages." |

### 6.2 Prompt Patterns for Common Tasks

#### Pattern 1: Creating a UI Component
```
Create a [component name] component in [framework] that:
- [visual description]
- [behavior/interactions]
- [styling approach]
- [data it receives or manages]
```

**Example**:
> *"Create a CourseCard component in Next.js that displays a course title, description, duration, price, and a 'Register' button. Use Tailwind CSS with a white card, rounded corners, and shadow. The button should be blue and change shade on hover. Accept course data as props."*

#### Pattern 2: Building an API Route
```
Create a [method] API route at [path] that:
- Accepts [input fields]
- Validates [rules]
- Stores/retrieves data from [database/service]
- Returns [response format]
- Handles [error cases]
```

**Example**:
> *"Create a POST API route at /api/register that accepts name, email, phone, and courseId. Validate that email is a valid format and all fields are present. Store in DynamoDB table 'Registrations' with email as partition key. Return 201 with the created record on success, 400 with error details on validation failure."*

#### Pattern 3: Fixing a Bug
```
I'm getting this error: [paste error message]

Here's the relevant code: [paste code]

The expected behavior is: [what should happen]
The actual behavior is: [what's happening instead]
```

#### Pattern 4: Modifying Existing Code
```
In [file path], modify the [component/function] to:
- [change 1]
- [change 2]
Keep everything else the same.
```

#### Pattern 5: Connecting to AWS Services
```
Create a utility function to [operation] using AWS [service].
- Region: [region]
- Table/Bucket/Resource: [name]
- Use AWS SDK v3
- Handle errors gracefully
- Use environment variables for configuration
```

### 6.3 Prompt Anti-Patterns (What NOT to Do)

| ❌ Bad Prompt | ✅ Better Prompt |
|---|---|
| "Make a form" | "Create a registration form with name, email, and phone fields using Tailwind CSS in a Next.js client component" |
| "Fix this" | "This API route returns 500 when I POST with a valid email. Here's the error: [error]. Here's the code: [code]" |
| "Build my app" | "Create the landing page with a hero section, feature cards, and a CTA button linking to /register" |
| "Use best practices" | "Add input validation, error handling, and loading states to this form component" |

### 6.4 The Conversation Flow

Vibe coding is **iterative**. You don't write one perfect prompt. You have a conversation:

```
Prompt 1: "Create a student registration form with name, email, phone, course dropdown"
         → AI generates the form

Prompt 2: "Add validation — email must be valid format, phone must be 10 digits"
         → AI adds validation

Prompt 3: "Show a loading spinner on the submit button while the API call is in progress"
         → AI adds loading state

Prompt 4: "After successful submission, show a green success message and reset the form"
         → AI adds success handling

Prompt 5: "The form should be responsive — single column on mobile, two columns on desktop"
         → AI adjusts the layout
```

Each prompt builds on the last. **Start simple, then layer complexity.**

---

## 7. Course Roadmap & What You'll Build by the End

### 7.1 Four-Week Journey

```
WEEK 1: FOUNDATIONS
├── Session 1:  Introduction to Vibe Coding (← You are here)
├── Session 2:  Development Environment Setup
├── Session 3:  Amazon Q Developer Deep Dive
├── Session 4:  Git & Version Control
└── Session 5:  Web Development Fundamentals (Fast Track)

WEEK 2: AWS FOUNDATIONS
├── Session 6:  AWS Account & IAM
├── Session 7:  IAM Policies & Roles Deep Dive
├── Session 8:  AWS Lambda — Serverless Computing
└── Session 9:  AWS RDS — Relational Databases

WEEK 3: FULL-STACK APP (Expense Tracker)
├── Session 10: Project Setup & Landing Page
├── Session 11: Dashboard — Transactions & Categories
├── Session 12: Reports, Filtering & Search
└── Session 13: Advanced Features & Polish

WEEK 4: CAPSTONE & DEPLOYMENT
├── Session 14: Authentication & User Management
├── Session 15: AWS Amplify Deployment
├── Session 16: Capstone Project — Personal Blog Platform
└── Session 17: Capstone Presentations & Next Steps
```

### 7.2 What You'll Build

#### Project 1: Expense Tracker (Guided — Weeks 3–4)
A full-stack expense tracking application with:
- User authentication (login/signup)
- Add, edit, delete income and expense transactions
- Categorize spending (Food, Transport, Bills, etc.)
- Monthly reports with income vs expense breakdown
- Filter, search, and sort transactions
- Budget tracking with over-budget warnings
- Export to CSV
- Deployed live on AWS Amplify

#### Project 2: Personal Blog Platform (Capstone — Week 4)
Your independent project to demonstrate mastery:
- Design and build from scratch using vibe coding
- Choose your own features and design
- Deploy to AWS
- Present to the class

### 7.3 Skills You'll Have After This Course

| Skill | How You'll Demonstrate It |
|---|---|
| Vibe coding with Amazon Q | Build features through AI conversation |
| Next.js full-stack development | Working Expense Tracker + Blog Platform |
| AWS cloud services | DynamoDB, Lambda, RDS, IAM, Amplify |
| Git version control | Feature branch workflow, GitHub collaboration |
| API design | RESTful routes with validation and error handling |
| Database design | DynamoDB and RDS schema design |
| Deployment | Live apps on AWS Amplify |
| Problem solving | Debug and iterate using AI assistance |

### 7.4 What's Expected of You

- **Show up** — each session builds on the previous one
- **Practice** — vibe coding is a skill; the more you prompt, the better you get
- **Ask questions** — in class, in the community, to Amazon Q
- **Commit often** — build the Git habit from day one
- **Review AI output** — never blindly accept; always understand what the code does

---

## Session 1 — Hands-On Activity

### Activity: Your First Vibe Coding Conversation (if time permits)

If Amazon Q Developer is already set up (covered in detail in Session 2), try this:

1. Open VS Code with Amazon Q Developer extension
2. Open the chat panel
3. Type this prompt:

> *"Explain what vibe coding is in 3 bullet points, as if explaining to someone who has never written code before."*

4. Read the response
5. Follow up with:

> *"Now give me a simple HTML page that says 'Hello, I'm a Vibe Coder!' with a centered heading and a blue background. Use inline CSS."*

6. Copy the generated code into a file called `index.html`
7. Open it in your browser

**Congratulations** — you just built your first thing through vibe coding. 🎉

---

## Session 1 — Key Takeaways

1. **Vibe coding** = describe what you want → AI generates code → you review, test, iterate
2. The developer role is shifting from **code writer** to **code director**
3. The workflow is: **Describe → Review → Test → Iterate → Commit → Repeat**
4. **Amazon Q Developer** is our primary tool — chat-based, context-aware, AWS-native
5. Good prompts have: **Context + Task + Constraints + Output Format**
6. Start simple, layer complexity through **conversation**
7. **Never commit code you don't understand**

---

## Preparation for Session 2

Before the next session, please:
- [ ] Install **Node.js** (we'll use nvm — instructions will be provided)
- [ ] Install **VS Code** from [https://code.visualstudio.com](https://code.visualstudio.com)
- [ ] Create a free **AWS Builder ID** at [https://profile.aws](https://profile.aws) (needed for Amazon Q Developer)
- [ ] Create a **GitHub account** at [https://github.com](https://github.com) if you don't have one

---

*LearnTechLab — AI Powered Software Development*
*Course: Vibe Coding & AWS: Full-Stack Development Powered by AI*
*Session 1 of 17*
