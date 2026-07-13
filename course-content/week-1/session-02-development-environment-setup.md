# Session 2: Development Environment Setup

**Course**: Vibe Coding & AWS: Full-Stack Development Powered by AI
**Duration**: ~2 hours
**Week**: 1 — Foundations
**Trainer Notes**: This is a hands-on setup session. Every student must leave with a working development environment — Node.js, VS Code, Amazon Q Developer, and a running Next.js project. Go slow, check on every student, and troubleshoot live. If students completed the prep from Session 1, this will go faster.

---

## 1. Installing Node.js (Using nvm)

### 1.1 What is Node.js and Why Do We Need It?

**Node.js** is a JavaScript runtime that lets you run JavaScript outside the browser. We need it because:

- **Next.js** (our framework) runs on Node.js
- **npm** (Node Package Manager) comes with Node.js — it installs libraries and dependencies
- Every modern web development workflow depends on Node.js

### 1.2 Why nvm Instead of Installing Node.js Directly?

**nvm** (Node Version Manager) lets you install and switch between multiple Node.js versions. This matters because:

- Different projects may need different Node.js versions
- You can upgrade or downgrade without breaking anything
- It's the professional way to manage Node.js

> 💡 **Rule of thumb**: Never install Node.js directly from the website. Always use nvm.

### 1.3 Installing nvm

#### macOS / Linux

Open your terminal and run:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

Close and reopen your terminal, then verify:

```bash
nvm --version
```

You should see a version number like `0.40.1`.

**If nvm command is not found**, add this to your shell profile (`~/.zshrc` for macOS, `~/.bashrc` for Linux):

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

Then run `source ~/.zshrc` (or `source ~/.bashrc`) and try again.

#### Windows

Windows uses **nvm-windows** (a separate project):

1. Go to: [https://github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases)
2. Download `nvm-setup.exe` from the latest release
3. Run the installer (accept all defaults)
4. Open a **new** Command Prompt or PowerShell window
5. Verify: `nvm version`

### 1.4 Installing Node.js via nvm

Install the latest LTS (Long Term Support) version:

```bash
nvm install --lts
```

Set it as the default:

```bash
nvm alias default lts/*
```

Verify the installation:

```bash
node --version    # Should show v20.x.x or v22.x.x
npm --version     # Should show 10.x.x
```

### 1.5 Quick Reference — nvm Commands

| Command | What It Does |
|---|---|
| `nvm install --lts` | Install latest LTS version |
| `nvm install 20` | Install a specific major version |
| `nvm use 20` | Switch to Node.js v20 |
| `nvm ls` | List all installed versions |
| `nvm alias default 20` | Set v20 as the default |
| `nvm current` | Show currently active version |

### 1.6 Verify Everything Works

Run this in your terminal:

```bash
node -e "console.log('Node.js is working! Version:', process.version)"
```

You should see:
```
Node.js is working! Version: v20.x.x
```

> ✅ **Checkpoint**: Every student should have Node.js running before moving on.

---

## 2. Installing VS Code & Essential Extensions

### 2.1 Installing VS Code

Download from: [https://code.visualstudio.com](https://code.visualstudio.com)

- **macOS**: Download the `.zip`, extract, drag to Applications
- **Windows**: Download the `.exe` installer, run it (check "Add to PATH" during install)
- **Linux**: Download the `.deb` or `.rpm` package, or install via snap: `sudo snap install code --classic`

Launch VS Code after installation.

### 2.2 VS Code — Quick Orientation

For students new to VS Code, here's the layout:

```
┌─────────────────────────────────────────────────────┐
│  Menu Bar                                           │
├──────┬──────────────────────────────────────────────┤
│      │                                              │
│  A   │           Editor Area                        │
│  c   │      (where you write code)                  │
│  t   │                                              │
│  i   ├──────────────────────────────────────────────┤
│  v   │                                              │
│  i   │        Terminal / Panel                      │
│  t   │    (integrated terminal at bottom)           │
│  y   │                                              │
│      │                                              │
│  B   ├──────────────────────────────────────────────┤
│  a   │  Status Bar                                  │
│  r   │                                              │
└──────┴──────────────────────────────────────────────┘
```

**Key shortcuts to learn now**:

| Shortcut (Mac / Windows) | Action |
|---|---|
| `Cmd+Shift+P` / `Ctrl+Shift+P` | Command Palette (search any action) |
| `` Ctrl+` `` | Toggle integrated terminal |
| `Cmd+P` / `Ctrl+P` | Quick file open |
| `Cmd+B` / `Ctrl+B` | Toggle sidebar |
| `Cmd+S` / `Ctrl+S` | Save file |
| `Cmd+Shift+E` / `Ctrl+Shift+E` | File Explorer |

### 2.3 Essential Extensions

Open the Extensions panel (`Cmd+Shift+X` / `Ctrl+Shift+X`) and install these:

#### Must-Have for This Course

| Extension | Why |
|---|---|
| **Amazon Q Developer** | Our primary AI coding assistant — chat, inline, /dev |
| **ES7+ React/Redux/React-Native snippets** | Quick React/Next.js code snippets |
| **Tailwind CSS IntelliSense** | Autocomplete for Tailwind CSS classes |
| **Prettier - Code formatter** | Auto-format code on save |

#### Recommended

| Extension | Why |
|---|---|
| **Auto Rename Tag** | Rename matching HTML/JSX tags automatically |
| **Error Lens** | Show errors inline next to the code (not just in the Problems panel) |
| **GitLens** | See who changed what and when, right in the editor |
| **Material Icon Theme** | Better file/folder icons for easier navigation |

### 2.4 Configure Prettier (Auto-Format on Save)

Open VS Code Settings (`Cmd+,` / `Ctrl+,`) and set:

1. Search for "Default Formatter" → set to **Prettier - Code formatter**
2. Search for "Format On Save" → check the box ✅

Or add to your `settings.json` (`Cmd+Shift+P` → "Open User Settings JSON"):

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.tabSize": 2,
  "editor.wordWrap": "on",
  "files.autoSave": "afterDelay"
}
```

> ✅ **Checkpoint**: VS Code is installed, extensions are added, Prettier is configured.

---

## 3. Setting Up Amazon Q Developer in VS Code — AWS Builder ID, Authentication

### 3.1 What is AWS Builder ID?

An **AWS Builder ID** is a free personal profile that gives you access to AWS developer tools — including Amazon Q Developer. It is:

- **Free** — no credit card required
- **Separate from an AWS account** — you don't need an AWS account for this
- **Personal** — tied to your email address

### 3.2 Create Your AWS Builder ID

1. Go to [https://profile.aws](https://profile.aws)
2. Click **"Create Builder ID"**
3. Enter your email address
4. Check your email for a verification code
5. Enter the code
6. Set your name and password
7. Done — your Builder ID is ready

### 3.3 Install Amazon Q Developer Extension

1. Open VS Code
2. Go to Extensions (`Cmd+Shift+X` / `Ctrl+Shift+X`)
3. Search for **"Amazon Q"**
4. Click **Install** on "Amazon Q Developer"
5. Wait for installation to complete

After installation, you'll see the **Amazon Q icon** in the Activity Bar (left sidebar).

### 3.4 Authenticate with Your Builder ID

1. Click the **Amazon Q icon** in the Activity Bar
2. Click **"Sign in to get started"**
3. Select **"Use for Free with Builder ID"**
4. A browser window opens — sign in with your Builder ID credentials
5. Authorize the connection when prompted
6. Return to VS Code — you should see **"Connected"** status

**If the browser doesn't open automatically**:
- Copy the authorization URL from the VS Code notification
- Paste it in your browser manually

### 3.5 Verify the Connection

After authentication, you should see:
- The Amazon Q chat panel is available (click the Q icon)
- The status bar at the bottom shows "Amazon Q" with a connected indicator
- Inline suggestions start appearing when you type code

**Quick test** — open the chat panel and type:

> *"Hello! Are you working?"*

Amazon Q should respond. If it does, you're connected. ✅

### 3.6 Troubleshooting Common Setup Issues

| Issue | Solution |
|---|---|
| Extension not appearing | Restart VS Code after installation |
| Browser auth doesn't redirect back | Copy the code from the browser and paste in VS Code manually |
| "Not connected" status | Click the Q icon → Sign out → Sign in again |
| Inline suggestions not showing | Check that Amazon Q is enabled in settings (not paused) |
| Firewall blocking connection | Ensure `*.amazonaws.com` and `*.aws` domains are allowed |

> ✅ **Checkpoint**: Every student has Amazon Q Developer connected and responding in the chat panel.

---

## 4. Your First Conversation with Amazon Q — Asking Questions, Generating Code

### 4.1 Opening the Chat Panel

- Click the **Amazon Q icon** in the Activity Bar (left sidebar), or
- Use the keyboard shortcut: `Cmd+Shift+I` (Mac) / `Ctrl+Shift+I` (Windows)

The chat panel opens on the side. This is where you'll spend most of your vibe coding time.

### 4.2 Asking Questions

Amazon Q isn't just a code generator — it's a knowledgeable assistant. Try these:

**Ask a concept question**:
> *"What is the difference between a React component and a Next.js page?"*

**Ask about an AWS service**:
> *"Explain DynamoDB in simple terms. When would I use it instead of a regular database?"*

**Ask for a comparison**:
> *"What's the difference between useState and useEffect in React?"*

Notice how Amazon Q gives clear, structured answers — often with code examples.

### 4.3 Generating Code

Now let's generate actual code. Type this in the chat:

> *"Create a simple HTML page with a heading that says 'Welcome to Vibe Coding' and a paragraph that says 'Built with Amazon Q Developer'. Center everything on the page. Use a dark background with white text."*

Amazon Q will generate the HTML. You'll see:
- A code block with the complete HTML
- A **Copy** button to copy the code
- An **Insert at Cursor** option to place it directly in your editor

**Try it**:
1. Create a new file: `File → New File` → save as `welcome.html`
2. Click **Insert at Cursor** on the generated code
3. Right-click the file → **Open with Live Server** (or just open the file in your browser)

### 4.4 Iterating on Generated Code

Now ask Amazon Q to modify what it generated:

> *"Add a button that says 'Start Learning' below the paragraph. When clicked, it should show an alert saying 'Let's go!'. Style the button with rounded corners and a blue background."*

Amazon Q updates the code. This is the **Describe → Review → Iterate** loop from Session 1 in action.

### 4.5 Debugging with Amazon Q

Let's intentionally create an error. In your HTML file, change `</button>` to `</buton>` (typo). Then ask:

> *"My page isn't rendering the button correctly. Here's my code: [paste the code]. What's wrong?"*

Amazon Q will spot the typo and suggest the fix. This is how you debug with AI — describe the problem, share the code, get a solution.

### 4.6 Conversation Tips

| Do | Don't |
|---|---|
| Be specific about what you want | Say "make it better" without details |
| Include the tech stack in your prompt | Assume AI knows your project setup |
| Paste error messages when debugging | Just say "it doesn't work" |
| Ask follow-up questions to refine | Start a new chat for every small change |
| Review the code before using it | Blindly copy-paste everything |

> 💡 **Key Insight**: The chat panel maintains conversation context. Each message builds on the previous ones. Use this — don't repeat yourself, just say "now add X" or "change the Y to Z".

---

## 5. Understanding Amazon Q Modes: Chat, Inline, /dev, @workspace

### 5.1 Mode Overview

Amazon Q Developer has multiple ways to interact with you. Think of them as different tools in a toolbox — each suited for a different job.

```
┌─────────────────────────────────────────────────────────────┐
│                   Amazon Q Developer Modes                  │
├──────────────┬──────────────────────────────────────────────┤
│   CHAT       │  Conversational — ask questions, generate    │
│              │  code, debug errors in a side panel          │
├──────────────┼──────────────────────────────────────────────┤
│   INLINE     │  Real-time — AI suggests code as you type,  │
│              │  press Tab to accept                         │
├──────────────┼──────────────────────────────────────────────┤
│   /dev       │  Multi-file — describe a feature, AI        │
│              │  creates/modifies multiple files at once     │
├──────────────┼──────────────────────────────────────────────┤
│   @workspace │  Context — AI reads your entire project to   │
│              │  give project-aware answers                  │
└──────────────┴──────────────────────────────────────────────┘
```

### 5.2 Chat Mode — Your AI Pair Programmer

**How to use**: Click the Amazon Q icon → type in the chat panel

**Best for**:
- Asking questions about code, concepts, or AWS services
- Generating a single file or component
- Debugging errors (paste the error + code)
- Getting explanations of existing code

**Example conversation**:
```
You:     "Create a TypeScript interface for a Student with 
          name (string), email (string), enrolledCourses 
          (array of strings), and registrationDate (Date)"

Amazon Q: [Generates the interface]

You:     "Now create a function that validates a Student 
          object — name must be non-empty, email must 
          contain @, and enrolledCourses must have at 
          least one item"

Amazon Q: [Generates the validation function]
```

### 5.3 Inline Mode — AI Autocomplete as You Type

**How to use**: Just start typing in any file. Amazon Q suggests completions in gray text.

**Controls**:
| Action | Shortcut |
|---|---|
| Accept suggestion | `Tab` |
| Dismiss suggestion | `Esc` |
| Trigger suggestion manually | `Alt+C` (Windows) / `Option+C` (Mac) |
| Next suggestion | `Alt+]` (Windows) / `Option+]` (Mac) |
| Previous suggestion | `Alt+[` (Windows) / `Option+[` (Mac) |

**Example — try this**:

1. Create a new file `math.ts`
2. Type this comment:
```typescript
// Function that calculates the area of a circle given the radius
```
3. Press `Enter` and wait — Amazon Q will suggest the complete function
4. Press `Tab` to accept

**How it works**: Amazon Q reads:
- The current file content
- The file name and extension
- Open files in your editor
- Comments and function signatures above the cursor

The more context you provide (comments, types, variable names), the better the suggestions.

**Pro tip**: Write a descriptive comment before writing code. Amazon Q uses comments as prompts for inline suggestions.

### 5.4 /dev Mode — Multi-File Feature Generation

**How to use**: In the chat panel, type `/dev` followed by your feature description.

**Best for**:
- Building a complete feature that spans multiple files
- Creating a component + its API route + types together
- Scaffolding a new section of your app

**Example**:
```
/dev Create a student profile page at /student/profile that:
- Shows the student's name, email, and enrolled courses
- Fetches data from /api/student/profile API route
- The API route reads from DynamoDB table "Students" using email as the key
- Use TypeScript interfaces for type safety
- Style with Tailwind CSS — clean card layout
- Include a loading skeleton while data loads
```

Amazon Q will:
1. Show you a **plan** of files it will create/modify
2. Ask for your approval
3. Generate all the files at once
4. Show you a diff of changes

**Important**: Always review the plan before accepting. You can ask Amazon Q to adjust the plan before it generates code.

### 5.5 @workspace — Project-Aware Context

**How to use**: In the chat panel, type `@workspace` before your question.

**Best for**:
- Asking questions about your existing codebase
- Generating code that matches your project's patterns
- Understanding how different parts of your project connect

**Example**:
```
@workspace What database tables does this project use and 
how are they structured?
```

```
@workspace Create a new API route for updating student 
payment status. Follow the same patterns used in the 
existing API routes.
```

Amazon Q reads your project files and gives answers that are **specific to your codebase** — not generic examples.

### 5.6 When to Use Which Mode

| Scenario | Mode |
|---|---|
| "How does useEffect work?" | **Chat** |
| Writing a function, need autocomplete | **Inline** |
| "Build a complete login page with API and database" | **/dev** |
| "How does authentication work in this project?" | **@workspace** |
| "Fix this error: [paste error]" | **Chat** |
| Adding a line of code inside an existing function | **Inline** |
| "Create a dashboard with 3 components and an API route" | **/dev** |
| "Create a new component matching the style of existing ones" | **@workspace** + Chat |

### 5.7 Hands-On: Try Each Mode

**Exercise 1 — Chat**: Ask Amazon Q to explain what `'use client'` means in Next.js.

**Exercise 2 — Inline**: Create a file `greet.ts`, type `// Function that greets a user by name`, press Enter, and accept the suggestion.

**Exercise 3 — @workspace** (once you have a project): Ask `@workspace What is the tech stack of this project?`

> ✅ **Checkpoint**: Students understand all four modes and when to use each one.

---

## 6. Creating Your First Next.js Project via Amazon Q Chat

### 6.1 What is Next.js?

**Next.js** is a React framework for building full-stack web applications. We use it because:

- **File-based routing** — create a file, get a URL (no router configuration)
- **API routes** — build backend APIs in the same project
- **TypeScript support** — built-in, no extra setup
- **Tailwind CSS** — one checkbox during setup
- **Deployment** — deploys easily to AWS Amplify

### 6.2 Create the Project

Open your terminal in VS Code (`` Ctrl+` ``) and navigate to where you want your projects:

```bash
cd ~/Documents   # or wherever you keep projects
```

Now ask Amazon Q in the chat panel:

> *"What is the command to create a new Next.js 14 project called 'my-first-app' with TypeScript, Tailwind CSS, ESLint, and the App Router? Use npm."*

Amazon Q will give you:

```bash
npx create-next-app@14 my-first-app --typescript --tailwind --eslint --app --use-npm
```

Run this command in your terminal. When prompted:

| Prompt | Answer |
|---|---|
| Would you like to use TypeScript? | **Yes** |
| Would you like to use ESLint? | **Yes** |
| Would you like to use Tailwind CSS? | **Yes** |
| Would you like to use `src/` directory? | **No** |
| Would you like to use App Router? | **Yes** |
| Would you like to customize the default import alias? | **No** |

Wait for installation to complete (this downloads dependencies — may take 1–2 minutes).

### 6.3 Open the Project in VS Code

```bash
cd my-first-app
code .
```

This opens the project in a new VS Code window.

### 6.4 Understand the Project Structure

Ask Amazon Q:

> *"@workspace Explain the folder structure of this Next.js project. What does each file and folder do?"*

Here's what you'll see:

```
my-first-app/
├── app/                    # Your application code lives here
│   ├── layout.tsx          # Root layout — wraps every page (HTML shell)
│   ├── page.tsx            # Home page — what you see at localhost:3000
│   └── globals.css         # Global styles + Tailwind imports
├── public/                 # Static files (images, icons)
│   ├── next.svg
│   └── vercel.svg
├── .eslintrc.json          # ESLint configuration
├── .gitignore              # Files Git should ignore
├── next.config.js          # Next.js configuration
├── package.json            # Dependencies and scripts
├── postcss.config.js       # PostCSS config (needed for Tailwind)
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

**The two files you'll work with most**:
- `app/page.tsx` — your home page
- `app/layout.tsx` — the wrapper around every page

### 6.5 Run the Development Server

In the terminal:

```bash
npm run dev
```

Open your browser and go to: [http://localhost:3000](http://localhost:3000)

You should see the default Next.js welcome page. 🎉

**Keep this terminal running** — it auto-refreshes when you save changes.

### 6.6 Make Your First Change

Open `app/page.tsx` and replace ALL the content with:

```tsx
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-900">
      <h1 className="text-4xl font-bold text-white">
        Hello, Vibe Coder! 🚀
      </h1>
    </main>
  )
}
```

Save the file (`Cmd+S` / `Ctrl+S`). Check your browser — it updates instantly.

> ✅ **Checkpoint**: Every student has a running Next.js app showing "Hello, Vibe Coder! 🚀"

---

## 7. Hands-On: Build a Counter App Entirely Through Conversation

This is the main hands-on exercise for Session 2. You will build a complete counter application **without writing any code yourself** — only by talking to Amazon Q.

### 7.1 The Goal

Build a counter app with:
- A number displayed on screen (starts at 0)
- An **Increment (+)** button
- A **Decrement (−)** button
- A **Reset** button
- Styled with Tailwind CSS
- The count changes color: green for positive, red for negative, white for zero

### 7.2 Step-by-Step Conversation

Follow along — type each prompt in the Amazon Q chat panel and apply the generated code.

#### Step 1: Create the Basic Counter

Open the Amazon Q chat and type:

> *"In my Next.js app using TypeScript and Tailwind CSS, replace the content of app/page.tsx with a counter app. It should show a number (starting at 0) and three buttons: Increment (+), Decrement (−), and Reset. Use useState for the count. Center everything on screen with a dark background. This needs to be a client component."*

**What to do with the response**:
1. Review the generated code — does it have `'use client'` at the top? Does it import `useState`?
2. Copy the code into `app/page.tsx` (replace everything)
3. Save and check the browser

**Expected result**: A centered counter with three buttons. Clicking them should change the number.

#### Step 2: Add Color Logic

> *"Update the counter so the number text is green when the count is positive, red when negative, and white when zero."*

Apply the changes. Test by clicking Decrement below zero — the number should turn red.

#### Step 3: Add Styling Polish

> *"Make the buttons larger with rounded corners and spacing between them. The Increment button should be green, Decrement should be red, and Reset should be gray. Add a hover effect that makes each button slightly brighter."*

Apply and verify in the browser.

#### Step 4: Add a Step Size Feature

> *"Add a 'Step Size' input field above the buttons. It should be a number input defaulting to 1. The Increment and Decrement buttons should add/subtract by the step size instead of always 1."*

Apply and test — set step size to 5, click Increment a few times.

#### Step 5: Add a History Log

> *"Add a history section below the buttons that shows the last 5 actions. Each entry should show the action (e.g., '+5', '−1', 'Reset') and the resulting count. Show newest first. Style it as a simple list with smaller gray text."*

Apply and test — perform several actions and verify the history updates.

#### Step 6: Add Keyboard Shortcuts

> *"Add keyboard shortcuts: ArrowUp for increment, ArrowDown for decrement, and 'r' key for reset. Show a small hint text below the history that says 'Keyboard: ↑ Increment · ↓ Decrement · R Reset'."*

Apply and test — press the arrow keys and 'r' on your keyboard.

### 7.3 Review What You Built

Look at your browser. You now have a fully functional counter app with:
- ✅ Increment, Decrement, Reset buttons
- ✅ Color-coded count (green/red/white)
- ✅ Styled buttons with hover effects
- ✅ Configurable step size
- ✅ Action history log
- ✅ Keyboard shortcuts

**And you didn't write a single line of code manually.**

You described what you wanted. Amazon Q built it. You reviewed and iterated. That's vibe coding.

### 7.4 Understanding What Was Generated

Now let's make sure you understand the code. Ask Amazon Q:

> *"@workspace Explain the counter app in app/page.tsx. Break down each section: the state variables, the handler functions, the JSX structure, and the Tailwind classes used."*

Read the explanation carefully. Remember the golden rule from Session 1:

> **Never commit code you don't understand.**

### 7.5 Key React/Next.js Concepts You Just Used

Even though AI wrote the code, you should recognize these patterns:

| Concept | What It Does | Where You Saw It |
|---|---|---|
| `'use client'` | Marks this as a client component (runs in browser) | Top of the file |
| `useState` | Creates reactive state variables | `const [count, setCount] = useState(0)` |
| `useEffect` | Runs side effects (keyboard listener) | Keyboard shortcut setup |
| Event handlers | Functions that respond to user actions | `onClick={() => setCount(count + step)}` |
| Conditional classes | Change styling based on state | `className={count > 0 ? 'text-green-400' : ...}` |
| Template literals | Dynamic strings | `` `+${step}` `` in history entries |

Don't worry if these aren't fully clear yet — **Session 5 (Web Development Fundamentals)** covers all of these in depth. For now, just recognize the patterns.

### 7.6 Challenge (If Time Permits)

Try these on your own using Amazon Q chat:

1. **Add a max/min limit**: Count can't go above 100 or below −100. Show a warning when the limit is reached.
2. **Add a dark/light mode toggle**: Button in the top-right corner that switches the background between dark and light.
3. **Add sound effects**: Play a click sound on increment/decrement (ask Amazon Q how to play audio in React).

---

## Session 2 — Key Takeaways

1. **nvm** is the professional way to manage Node.js — never install Node directly
2. **VS Code** + Amazon Q Developer + Tailwind IntelliSense + Prettier = your development toolkit
3. **AWS Builder ID** is free and gives you access to Amazon Q Developer
4. Amazon Q has **four modes**: Chat (conversation), Inline (autocomplete), /dev (multi-file), @workspace (project context)
5. **Next.js** gives you a full-stack framework with file-based routing, API routes, and TypeScript
6. You built a complete counter app **entirely through conversation** — that's vibe coding in action
7. Always **review and understand** the code AI generates

---

## Preparation for Session 3

Session 3 is a deep dive into Amazon Q Developer. To prepare:

- [ ] Practice using the **chat panel** — ask Amazon Q 5 different questions about web development
- [ ] Practice **inline completions** — create a new `.ts` file, write comments, and let Amazon Q complete the code
- [ ] Try **/dev** — ask it to create a simple component (e.g., a card, a navbar)
- [ ] Read through the counter app code and identify parts you don't understand — bring questions to Session 3

---

*LearnTechLab — AI Powered Software Development*
*Course: Vibe Coding & AWS: Full-Stack Development Powered by AI*
*Session 2 of 17*
