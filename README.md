# Impact Arc

Impact Arc is a modern web application built with Next.js that provides powerful analytics and visualization tools. The application features a sleek, dark-themed interface with multiple interactive components and data analysis capabilities.

## Features

- **Modern UI/UX**: Built with a beautiful dark theme and responsive design
- **Interactive Components**: 
  - Profile Gallery
  - Advanced Filtering System
  - Feature Showcase
  - Dynamic Call-to-Action Sections
- **Analytics Dashboard**: Comprehensive data visualization and analysis tools
- **Real-time Data Processing**: Integration with various data sources and APIs

## Tech Stack

- **Framework**: Next.js 15+
- **Language**: TypeScript
- **UI Components**: 
  - Radix UI for accessible components
  - Tailwind CSS for styling
  - Framer Motion for animations
- **Data Visualization**: 
  - Recharts
  - React Chart.js 2
- **AI Integration**: Google Generative AI
- **Web Scraping**: Puppeteer with stealth plugin
- **State Management**: React (built-in hooks)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/21prnv/impact-arc
cd impact-arc
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

##  Project Structure

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

##  Configuration

The project uses various configuration files:
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `postcss.config.mjs` - PostCSS configuration
- `components.json` - UI components configuration

##  Deployment

The application can be deployed using Vercel or any other hosting platform that supports Next.js applications.

```bash
npm run build
npm run start
```

##  Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
