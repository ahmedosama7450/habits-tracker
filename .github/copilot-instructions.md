# Copilot Instructions: Habits Tracker Website

## Project Setup

The project is already created with Vite.js. React.js, TypeScript, TailwindCSS, Shadcn UI and React Hook Form are all installed and configured.

For now, this is a single-page application with one route.

### Adding Shadcn UI Components

Use the Shadcn CLI to add components to the project as needed:

```bash
# Example command to add a component
npx shadcn@latest add button
```

Always import Shadcn UI components from the local components directory:

```tsx
// Correct way to import Shadcn UI components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
```

## Color Preferences

The application uses a green-focused color palette to represent growth, progress, and healthy habits:

- Primary colors: Use green shades as the primary brand color
- Secondary colors: Complementary colors that work well with green
- Use Tailwind's built-in green color palette as a starting point

Preferred green color scales:
- For primary actions and emphasis: `emerald-500` to `emerald-700`
- For success states: `green-500` to `green-600`
- For secondary accents: `teal-400` to `teal-600`
- For subtle backgrounds: `emerald-50` to `emerald-100`

Example usage:

```tsx
// Button with primary green styling
<Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
  Complete Habit
</Button>

// Success indicator
<div className="text-green-500 flex items-center gap-1">
  <CheckCircle className="h-4 w-4" />
  <span>Completed</span>
</div>

// Card with subtle green background
<div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
  <h3 className="text-emerald-800 font-medium">Meditation</h3>
</div>
```

## Data Handling

- No backend is available for this project
- Use fake/mock data for development
- Structure mock data in `src/data` directory
- Use TypeScript interfaces to define data structures
- Simulate API calls with timeouts for realistic behavior

```tsx
// Example of mock data usage
import { habits } from '@/data/habits';

function HabitsList() {
  const [userHabits, setUserHabits] = useState(habits);
  
  // Simulate API call
  useEffect(() => {
    const timer = setTimeout(() => {
      setUserHabits(habits);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    // Component JSX
  );
}
```

## React.js Conventions

- Use functional components with hooks instead of class components
- Follow the naming convention of PascalCase for components (e.g., `HabitCard.tsx`)
- Use named exports for components
- Keep components small and focused on a single responsibility
- Use custom hooks to share stateful logic between components
- Use React context for global state when needed
- Use TypeScript interfaces for props

```tsx
// Example component structure
import React from 'react';
import { Button } from '@/components/ui/button';

interface HabitCardProps {
  title: string;
  streak: number;
  onComplete: () => void;
}

export function HabitCard({ title, streak, onComplete }: HabitCardProps) {
  return (
    <div className="p-4 rounded-lg border">
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-gray-500">Current streak: {streak} days</p>
      <Button onClick={onComplete}>Complete</Button>
    </div>
  );
}
```

## TailwindCSS Conventions

- Use TailwindCSS utility classes directly in JSX instead of separate CSS files
- Follow mobile-first responsive design patterns
- Use `className` prop for styling
- Extract common patterns to components or custom utility classes
- Use design tokens for colors, spacing, etc. via Tailwind theme configuration
- Prefer Tailwind's built-in utilities over custom CSS when possible
- Use `@apply` directive in CSS files only when absolutely necessary

```tsx
// Example of TailwindCSS usage
<div className="flex flex-col md:flex-row gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
  <div className="flex-1 min-w-0">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
      {title}
    </h2>
  </div>
</div>
```
