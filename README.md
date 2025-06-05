# IBM Natural Language Understanding App

[![TypeScript](https://img.shields.io/badge/TypeScript-49.9%25-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](https://opensource.org/licenses/MIT)

Transform resumes into powerful career opportunities with advanced NLP analysis. This application provides actionable feedback on resumes, interactive visualizations, and seamless database integration.

![App Screenshot](https://via.placeholder.com/800x400?text=IBM+NLU+App+Screenshot)

---

## ✨ Features

* **Resume Analysis**: Upload and analyze DOCX resumes with actionable feedback.
* **Interactive Visualizations**: Dynamic sentiment charts and emotion radars.
* **Database Integration**: Efficient data storage and retrieval.
* **Responsive Design**: Built with Tailwind CSS for consistent styling across devices.
* **Fast Development**: Next.js framework for rapid iterations and optimized performance.

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

* Node.js (v16 or later)
* npm
* An **IBM Cloud account** (for the Natural Language Understanding API).
* A **Neon Database account** (for PostgreSQL).
* A **Google Gemini API key** (optional, for additional AI features).

### Installation

1.  **Clone the repository**:

    ```bash
    git clone [https://github.com/tanmaydev56/ibm-Natural-language-understanding-app](https://github.com/tanmaydev56/ibm-Natural-language-understanding-app)
    ```

2.  **Navigate to the project directory**:

    ```bash
    cd ibm-Natural-language-understanding-app
    ```

3.  **Install dependencies**:

    ```bash
    npm install
    ```

4.  **Create a `.env` file** in the project root and add your API keys:

    ```
    IBM_API_KEY=your_ibm_api_key
    IBM_URL=your_ibm_service_url
    NEON_DATABASE_URL=your_neon_db_url
    GEMINI_API_KEY=your_gemini_api_key
    ```

### Usage

1.  **Start the development server**:

    ```bash
    npm run dev
    ```

2.  **Build for production**:

    ```bash
    npm run build
    ```

3.  **Start the production server**:

    ```bash
    npm start
    ```

---

## 🧪 Testing

Run tests with:

```bash
npm test
```

##🔧 Technologies Used
Frontend: Next.js, React, TypeScript
Styling: Tailwind CSS
Database: PostgreSQL (Neon)
NLP: IBM Watson Natural Language Understanding
AI: Google Gemini API (optional features)
Build Tools: npm
