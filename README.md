# **Impact Arc**  
🚀 **Redefining Influence with AI-Powered Analytics**  

Impact Arc is a modern **Next.js** web application designed to analyze and visualize **Instagram influence**. It goes beyond simple popularity metrics, using AI-driven insights to measure **credibility, engagement, and long-term relevance**—bringing fairness and transparency to digital influence.  

---

## 🌟 **Why Impact Arc?**  
In today's world, virality often overshadows **real, lasting influence**. Impact Arc solves this by:  
✅ Identifying **credible** influencers, not just viral sensations  
✅ Measuring **long-term relevance** instead of short-lived trends  
✅ Analyzing **meaningful engagement** beyond likes and followers  
✅ Providing **real-time, AI-powered insights**  

With **Impact Arc**, brands, recruiters, and researchers can distinguish **genuine industry leaders** from short-term internet fame.  

---

## 🔥 **Key Features**  

### 🎨 **Modern UI/UX**  
- Dark-themed, responsive interface  
- Smooth animations with **Framer Motion**  
- Accessible components via **Radix UI**  

### 📊 **AI-Driven Instagram Analytics**  
- **Influencer Rankings** based on credibility, engagement, and longevity  
- **Real-time Score Updates** tracking influence dynamics  
- **Advanced Filtering** to sort influencers by industry, niche, and impact  

### 📈 **Interactive Data Visualization**  
- **Dynamic charts & graphs** with **Recharts** and **React Chart.js 2**  
- **Profile Gallery** showcasing key influencer metrics  
- **Feature Showcase & Call-to-Action Sections**  

### 🔍 **Smart Data Processing**  
- **AI Integration**: Google Generative AI for credibility analysis  
- **Web Scraping**: Puppeteer with stealth mode for real-time data collection  
- **Spam Detection**: Filtering out fake engagement & bot-driven metrics  

---

## 🛠 **Tech Stack**  

| Category           | Technologies Used |
|-------------------|-----------------|
| **Framework**      | Next.js 15+ |
| **Language**      | TypeScript |
| **UI Components** | Radix UI, Tailwind CSS, Framer Motion |
| **Data Visualization** | Recharts, React Chart.js 2 |
| **AI & ML** | Google Generative AI |
| **Web Scraping** | Puppeteer (Stealth Plugin) |
| **State Management** | React (built-in hooks) |

---

## 🚀 **Getting Started**  

### **1️⃣ Installation**  
Clone the repository:  
```bash
git clone https://github.com/21prnv/impact-arc
cd impact-arc
```
Install dependencies:  
```bash
npm install
# or
yarn install
```
Start the development server:  
```bash
npm run dev
# or
yarn dev
```
The app will be available at **[http://localhost:3000](http://localhost:3000)**.  

---

## 📁 **Project Structure**  

```
impact-arc/
├── app/                    # Next.js app directory
│   ├── analyzer/          # Analysis tools
│   ├── api/              # API routes
│   ├── components/       # Shared components
│   ├── dashboard/        # Dashboard views
│   ├── filter/          # Filtering system
│   └── results/         # Results display
├── components/           # Reusable UI components
├── lib/                 # Utility functions and shared logic
├── public/             # Static assets
└── utils/              # Helper functions
```

## 🔐 **Environment Variables**

Create a `.env.local` file in the root directory with the following variables:

```bash
# Instagram Credentials
INSTAGRAM_USERNAME=your_username
INSTAGRAM_PASSWORD=your_password
INSTAGRAM_SESSIONID=your_session_id

# API Keys
GEMINI_API_KEY=your_gemini_api_key

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# Backend Service
BACKEND_URL=your_backend_url
```

Replace placeholder values with your actual credentials and API keys.


---

## 🌍 **Deployment**  

Deploy on **Vercel** or any Next.js-supported hosting:  
```bash
npm run build
npm run start
```

---

## 🤝 **Contributing**  

Contributions are welcome! If you'd like to improve Impact Arc, follow these steps:  
1. Fork the repository  
2. Create a new branch (`feature-xyz`)  
3. Commit changes  
4. Submit a pull request  

---

## 📜 **License**  

This project is licensed under the **Apache License Version 2.0** – see the `LICENSE` file for details.  

---

## 📢 **Join the Movement!**  
Impact Arc is more than an analytics tool—it’s a step towards **fair, AI-driven influence measurement**. Let’s **redefine digital credibility** together! 🚀  

💬 **Have questions?** Open an issue or connect with us on GitHub!