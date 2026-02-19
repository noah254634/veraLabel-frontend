# Veralabel Frontend 🛡️

**The user interface for Veralabel: Making AI work for humans.**

This repository contains the frontend application for Veralabel, a platform building the data foundation for trustworthy, human-centered AI. It provides the interface for users to manage datasets, label data, and for admins to govern the system.

## 🚀 Features

- **Authentication**: Secure login and signup interfaces.
- **User Dashboard**: Profile management and trust score visualization.
- **Dataset Management**: UI for uploading, viewing, and managing datasets.
- **Marketplace**: Browse and order datasets.
- **Admin Panel**: Tools for user moderation (ban, block, promote) and dataset governance (approve, reject, flag).
- **Analytics**: Visualizations for system-wide metrics.

## 🛠️ Tech Stack

- **Framework**: React
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Build Tool**: Vite (Recommended)

## 📦 Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/veralabel-frontend.git
   cd veralabel-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory to connect to the backend API.
   ```env
   VITE_API_URL=http://localhost:3000/api/v1
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 🔗 Backend

This frontend interacts with the Veralabel Backend. Ensure the backend server is running for full functionality.