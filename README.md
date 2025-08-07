# Habits Tracker

A modern, responsive web application for tracking daily habits built with React, TypeScript, Tailwind CSS, and powered by Supabase.

## Features

- ✅ **Habit Management**: Create, edit, and delete custom habits
- 📅 **Flexible Scheduling**: Support for weekly and monthly date patterns
- 🔐 **Google Authentication**: Secure sign-in with Google OAuth
- ☁️ **Cloud Storage**: Data synced across devices with Supabase
- 🌍 **Multi-language Support**: English and Arabic languages with RTL support
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- ⚡ **Real-time Updates**: Instant visual feedback when marking habits complete
- 🔒 **Data Privacy**: Row-level security ensures your data stays private

## Habit Scheduling Options

1. **Weekly**: Select specific days of the week (e.g., Monday, Wednesday, Friday)
2. **Monthly**: Select specific days of the month (e.g., 1st, 15th, 30th)

## How to Use

1. **Sign In**: Use your Google account to sign in securely
2. **Add a Habit**: Click the "Add Habit" button to create a new habit with your preferred schedule
3. **Track Progress**: Navigate through months and check off completed habits
4. **Edit Habits**: Use the dropdown menu on habit cards to edit or delete habits
5. **Settings**: Configure language preference and first tracking month
6. **Access Anywhere**: Your data syncs across all your devices

## Technology Stack

- **React 19** - Modern UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **Shadcn/ui** - Beautiful, accessible components
- **React Hook Form** - Form state management
- **Vite** - Fast development server and build tool

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- A Supabase account (free tier available)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd habits-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   
   Follow the detailed setup guide in [SUPABASE_SETUP.md](SUPABASE_SETUP.md) to:
   - Create a Supabase project
   - Set up the database schema
   - Configure Google OAuth
   - Set environment variables

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:5173](http://localhost:5173)

## Database Schema

The application uses four main tables:

- **profiles**: User accounts and preferences (includes settings)
- **habits**: Habit definitions with scheduling
- **habit_completions**: Daily completion tracking

All tables include Row Level Security (RLS) policies to ensure data privacy.

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## Deployment

The app can be deployed to any static hosting service like:

- **Vercel** (recommended for easy setup)
- **Netlify**
- **GitHub Pages**
- **Firebase Hosting**

Make sure to set your environment variables in your hosting platform's settings.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues:

1. Check the [SUPABASE_SETUP.md](SUPABASE_SETUP.md) guide
2. Review the [Supabase documentation](https://supabase.com/docs)
3. Open an issue in this repository
