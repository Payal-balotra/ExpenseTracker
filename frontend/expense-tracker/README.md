# Expense Tracker Frontend

A modern React application for tracking personal expenses and income with beautiful charts and analytics.

## Features

- **User Authentication**: Login and signup with JWT tokens
- **Expense Management**: Add, edit, delete, and categorize expenses
- **Income Tracking**: Record and manage income sources
- **Dashboard**: Overview of financial health with charts and statistics
- **Data Visualization**: Interactive charts using Recharts
- **Responsive Design**: Works on desktop and mobile devices
- **Export Data**: Download expense and income data as Excel files

## Tech Stack

- **React 18** - Frontend framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Chart library
- **Lucide React** - Icons
- **Tailwind CSS** - Styling

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend/expense-tracker
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Cards/          # Card components
│   ├── charts/         # Chart components
│   ├── dashboard/      # Dashboard-specific components
│   ├── expense/        # Expense-related components
│   ├── income/         # Income-related components
│   ├── inputs/         # Form input components
│   └── layouts/        # Layout components
├── context/            # React context providers
├── hooks/              # Custom React hooks
├── pages/              # Page components
│   ├── Auth/           # Authentication pages
│   └── Dashboard/      # Dashboard pages
├── utils/              # Utility functions
└── assets/             # Static assets
```

## API Integration

The frontend connects to a backend API running on `http://localhost:5000`. Make sure your backend server is running before starting the frontend.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
