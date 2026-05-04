<div align="center">
  <h1>🚀 HireX AI</h1>
  <p>An Autonomous, AI-Powered Job Search & Application Tracking Platform</p>
  
  <p>
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/NVIDIA-76B900?style=for-the-badge&logo=nvidia&logoColor=white" alt="NVIDIA NIM" />
    <img src="https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white" alt="Playwright" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  </p>
</div>

---

## ⚡ Overview

HireX AI is a modern SaaS platform designed to completely automate and optimize your job search process. By leveraging the latest in AI technologies (NVIDIA NIM Llama-3.1), web scraping (Apify), and robust serverless architecture (Next.js + Supabase), HireX acts as your personal, autonomous career agent.

## ✨ Features

- **🤖 Autonomous Auto-Queue Agent**: Upload your resume, and the AI will continuously evaluate pending jobs, score the fit, and automatically queue applications with custom-generated cover letters for jobs matching >75%.
- **📊 Real-time Command Center**: A sleek, bento-grid styled dashboard built with Framer Motion, providing instant insights into your application funnel, ATS scores, and target goals.
- **📄 AI Resume Optimization**: Parses PDFs intelligently to extract key metrics, suggesting high-impact improvements to boost ATS compatibility.
- **🛡️ Enterprise-Grade Testing**: Fully automated End-to-End testing pipeline via Playwright, featuring a unique Supabase SSR cookie-bypass for robust, flake-free authentication testing.
- **⚡ Optimistic UI Updates**: Next.js App Router caching mechanisms combined with Server/Client component architecture ensure instantaneous feedback without full page reloads.

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, Tailwind CSS, Framer Motion, Lucide React
- **Backend:** Next.js Route Handlers, Supabase (PostgreSQL, Auth, RLS Policies)
- **AI/LLM:** NVIDIA NIM (`abacusai/dracarys-llama-3.1-70b-instruct`) via OpenAI SDK
- **QA/Testing:** Playwright, Vitest

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Williamsingh99/hirex-app.git
   cd hirex-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
   NVIDIA_API_KEY=your-nvidia-api-key
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

5. **Run E2E Tests**
   ```bash
   npm run test:e2e
   ```

## 🔒 Security & Architecture

HireX is built with a security-first mindset. All user data is isolated via Row Level Security (RLS) policies in PostgreSQL. The AI agent executes entirely via serverless routes to prevent API key exposure and token leakage.

---
<div align="center">
  <i>Crafted with passion for 10x developer workflows.</i>
</div>
