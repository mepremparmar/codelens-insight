# Code Insight AI

Build a premium, modern, production-quality web application called "CodeLens AI".

PRODUCT:

CodeLens AI is an AI-powered interactive learning platform for students and early-career developers. It transforms source code into an interactive learning experience instead of simply explaining the code.

CORE PRODUCT PHILOSOPHY:

Code → Understand → Visualize → Question → Modify → Evaluate → Learn

The application should feel like a real SaaS product / developer education platform, NOT like a generic AI chatbot or admin dashboard.

TARGET USERS:

- Computer science students

- Beginner/intermediate developers

- Students learning programming, cloud, AI and AWS

- Early-career developers

DESIGN DIRECTION:

Create a premium developer-tool aesthetic inspired by modern products such as Linear, Vercel, Raycast, GitHub Copilot and modern AI developer platforms.

Visual style:

- Dark-first interface

- Deep charcoal / near-black background

- Soft blue-violet accents

- Subtle cyan highlights

- Glassmorphism used carefully

- Thin borders

- Soft shadows

- Large rounded cards

- Excellent typography

- Lots of whitespace

- Smooth micro-interactions

- Modern monospace typography for code

- Clean sans-serif typography for UI

- No childish illustrations

- No excessive gradients

- No generic stock images

- No clutter

The UI must look like a serious AI developer product that could be launched commercially.

TECH STACK:

- React

- TypeScript

- Vite

- Tailwind CSS

- shadcn/ui

- Lucide icons

- Recharts where appropriate

- Framer Motion for subtle animations

Make the entire application responsive for desktop, tablet and mobile.

==================================================

1. LANDING PAGE

==================================================

Create a high-end landing page.

NAVBAR:

Logo:

CodeLens AI

Tagline: "Understand the code. Master the concept."

Navigation:

- Product

- How It Works

- Features

- For Students

- FAQ

Right side:

- Sign In

- Get Started

HERO:

Eyebrow:

"AI-POWERED CODE LEARNING"

Main headline:

"Stop copying code.

Start understanding it."

Supporting text:

"CodeLens AI transforms complex code into visual explanations, interactive questions, personalized challenges, and measurable learning."

Primary CTA:

"Analyze My Code"

Secondary CTA:

"See How It Works"

On the right side of the hero, create a beautiful animated code-analysis interface.

Show a code editor containing sample JavaScript/React code.

When the user hovers or clicks "Analyze":

- code lines subtly highlight

- concept tags appear

- an execution flow card appears

- AI explanation panel appears

Example detected concepts:

ASYNC/AWAIT

API REQUEST

PROMISE

JSON

ERROR HANDLING

Use smooth Framer Motion animations.

==================================================

2. HOW IT WORKS

==================================================

Create a visually strong 5-step section.

01 — Paste Your Code

02 — AI Understands It

03 — Visualize the Logic

04 — Test Your Understanding

05 — Build Your Skills

Each step should have:

- Number

- Icon

- Short description

- Subtle animation

Create a connecting visual line between steps.

==================================================

3. MAIN DASHBOARD

==================================================

After login, create a premium dashboard.

LEFT SIDEBAR:

CodeLens AI logo

Navigation:

- Dashboard

- Analyze Code

- My Learning

- Challenges

- Concepts

- Progress

- History

Bottom:

- Settings

- User profile

TOP BAR:

- Search

- Notifications

- User avatar

MAIN DASHBOARD:

Header:

"Good morning, Prem 👋"

Subtitle:

"Let's turn some code into knowledge."

Stats cards:

Code Analyses

24

Concepts Learned

68

Challenges Completed

31

Learning Streak

7 days

Use clean cards with subtle animated counters.

==================================================

4. ANALYZE CODE PAGE

==================================================

This is the MOST IMPORTANT SCREEN.

Create a professional split-screen code learning workspace.

LEFT:

Large code editor.

Top controls:

- Language selector

- Upload File

- Paste Code

- Analyze

Language options:

JavaScript

TypeScript

Python

Java

React

HTML/CSS

Code editor should support:

- line numbers

- syntax highlighting

- highlighted selected lines

- dark theme

Use realistic sample code.

RIGHT:

AI Analysis panel.

Tabs:

Overview

Concepts

Execution Flow

AI Tutor

OVERVIEW:

Show:

Code Complexity

Medium

Concepts Detected

8

Difficulty

Intermediate

Then:

"AI Explanation"

Explain the submitted code in beginner-friendly language.

==================================================

5. CONCEPT DETECTION

==================================================

Create a beautiful concept visualization.

Example:

Detected Concepts

[Async/Await]

[API Request]

[Promise]

[JSON]

[Error Handling]

Each concept should have:

- proficiency indicator

- difficulty

- short explanation

- "Learn More" button

Example:

ASYNC/AWAIT

Intermediate

"Allows asynchronous operations to be written in a readable, sequential style."

Progress:

72%

==================================================

6. EXECUTION FLOW

==================================================

Create a visual execution/data flow diagram.

Example:

User Action

      ↓

fetchUser()

      ↓

API Request

      ↓

Await Response

      ↓

Parse JSON

      ↓

Return Data

Use animated nodes and connecting lines.

When hovering a node:

- highlight the related code lines

- show explanation tooltip

Make this section visually impressive.

==================================================

7. AI TUTOR

==================================================

Do NOT make this look like a generic ChatGPT clone.

Create an AI learning tutor specifically connected to the submitted code.

Header:

"CodeLens Tutor"

Subtitle:

"Ask me anything about this code."

Example conversation:

Student:

"Why are we using await here?"

AI:

"await pauses the execution of this async function until the Promise resolves..."

Then AI can ask the student questions:

"Before I explain further, what do you think happens if the API request fails?"

Answer options:

A

B

C

D

After answer:

✓ Correct

"Great! You understand the relationship between async/await and Promises."

==================================================

8. CHALLENGE MODE

==================================================

Create a challenge screen.

Header:

"Test Your Understanding"

Challenge card:

Challenge #04

Difficulty:

Intermediate

Concept:

Error Handling

Task:

"Modify the function so that it gracefully handles an API request failure."

Provide an editable code editor.

Buttons:

- Run Code

- Submit

- Get Hint

IMPORTANT:

Hints should be progressive.

Hint 1:

"Think about where an asynchronous operation can fail."

Hint 2:

"Which JavaScript structure is commonly used to catch errors from awaited Promises?"

Do NOT immediately reveal the answer.

After submission show:

Understanding Score: 86%

Concept Mastery:

Async/Await — 91%

Error Handling — 58%

==================================================

9. LEARNING PROGRESS

==================================================

Create a beautiful analytics dashboard.

Header:

"My Learning Progress"

Show:

Overall Understanding

78%

Concept Mastery

JavaScript

92%

React

84%

AWS

61%

Python

74%

Async Programming

68%

Error Handling

55%

Use interactive charts.

Learning activity graph:

Last 30 days

Show:

- Code analyzed

- Challenges completed

- Concepts learned

Also show:

"Your Weakest Concepts"

1. Error Handling

2. Promises

3. API Authentication

CTA:

"Practice These Concepts"

==================================================

10. CONCEPT LIBRARY

==================================================

Create searchable concept library.

Categories:

Programming

Web Development

Cloud

AWS

AI/ML

Databases

Concept cards:

Async/Await

Promises

REST APIs

React Hooks

State Management

AWS Lambda

API Gateway

DynamoDB

Authentication

Error Handling

Each card shows:

- Difficulty

- Mastery percentage

- Related concepts

- Start Learning button

==================================================

11. ANALYSIS HISTORY

==================================================

Create history page.

Each analysis card:

Project:

"Expense Tracker"

Language:

React + TypeScript

Concepts:

12

Score:

84%

Analyzed:

2 hours ago

Button:

"Continue Learning"

Allow filtering by:

- Language

- Difficulty

- Date

==================================================

12. USER PROFILE

==================================================

Create a developer learning profile.

Profile header:

Prem Parmar

"Developer in Progress"

Stats:

24 Analyses

68 Concepts

31 Challenges

7 Day Streak

Skill radar chart:

Frontend

Backend

Cloud

AI

Programming

Problem Solving

Show:

"Learning Style"

Project-based learner

"Current Goal"

Become a stronger full-stack/cloud developer

==================================================

13. ONBOARDING

==================================================

Create a beautiful 3-step onboarding flow.

Step 1:

"What are you learning?"

Options:

JavaScript

Python

Java

React

AWS

AI/ML

Other

Step 2:

"What's your experience?"

Beginner

Intermediate

Advanced

Step 3:

"What do you want to achieve?"

Understand existing code

Improve debugging

Learn cloud

Prepare for interviews

Build projects

Then:

"Create My Learning Path"

==================================================

14. EMPTY STATES

==================================================

Create polished empty states.

Example:

"No code analyzed yet."

"Your first analysis will turn code into concepts, visual flows and interactive challenges."

CTA:

"Analyze Your First Code"

==================================================

15. LOADING EXPERIENCE

==================================================

Create a beautiful AI analysis animation.

When analyzing code:

Stage 1:

"Reading your code..."

Stage 2:

"Detecting concepts..."

Stage 3:

"Building execution flow..."

Stage 4:

"Creating learning challenges..."

Stage 5:

"Your learning experience is ready."

Use animated progress indicators.

==================================================

16. MICRO INTERACTIONS

==================================================

Add subtle high-quality animations:

- Button hover animations

- Card hover elevation

- Sidebar active state animation

- Code line highlighting

- Flow diagram node animations

- Progress bar animations

- Smooth page transitions

- Number count-up animations

- Toast notifications

- Skeleton loaders

Animations must be subtle and professional.

Do NOT over-animate the interface.

==================================================

17. RESPONSIVENESS

==================================================

Desktop:

Full dashboard with sidebar and split code workspace.

Tablet:

Collapsible sidebar and stacked analysis panels.

Mobile:

Bottom navigation or collapsible sidebar.

Code editor must remain usable on mobile with horizontal scrolling.

==================================================

18. COMPONENT SYSTEM

==================================================

Create reusable components:

Button

Card

Badge

ProgressBar

CodeEditor

ConceptCard

StatCard

ChallengeCard

FlowNode

FlowConnector

AIMessage

QuizOption

LearningChart

Sidebar

Topbar

Modal

Toast

Skeleton

Keep components modular and production-ready.

==================================================

19. DEMO DATA

==================================================

Use realistic demo data so the application looks complete.

Sample project:

"AI Resume Analyzer"

Sample code should use:

React

TypeScript

API request

Async/Await

AWS Lambda

API Gateway

Detected concepts:

React Hooks

Async/Await

REST API

Error Handling

AWS Lambda

API Gateway

JSON

Make all dashboard screens populated with realistic data.

==================================================

20. IMPORTANT UX RULE

==================================================

This is NOT a generic AI chat application.

The central experience must always be:

CODE

↓

CONCEPTS

↓

VISUAL EXECUTION

↓

AI EXPLANATION

↓

INTERACTIVE QUESTION

↓

CODING CHALLENGE

↓

UNDERSTANDING SCORE

↓

PERSONALIZED LEARNING

The UI should communicate this learning loop clearly.

==================================================

21. FINAL QUALITY BAR

==================================================

The result should look like a startup-ready AI developer education product.

Prioritize:

- Excellent typography

- Strong visual hierarchy

- Consistent spacing

- Premium dark UI

- Beautiful code editor

- Interactive execution visualization

- Meaningful data visualization

- Smooth animations

- Accessibility

- Responsive design

- Clean reusable components

Avoid:

- Generic dashboard templates

- Excessive gradients

- Cartoon illustrations

- Generic chatbot UI

- Huge unnecessary text blocks

- Clutter

- Fake features that don't make sense

Build the complete frontend with working navigation, realistic demo interactions, reusable components and polished responsive UI.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3a4ae874-ce73-47b1-9e01-7a74d979a116).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
