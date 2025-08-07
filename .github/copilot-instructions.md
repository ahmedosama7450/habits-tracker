# Copilot Instructions: Habits Tracker Website

## Project Setup

The project is created with Vite.js and uses a modern tech stack. React.js, TypeScript, TailwindCSS, Shadcn UI, React Hook Form, React i18next, and Supabase are all installed and configured.

The application now features:
- **Supabase Backend**: PostgreSQL database with real-time capabilities
- **Google Authentication**: OAuth integration via Supabase Auth
- **Multi-route Application**: Sign-in page and main app routes
- **Cloud Data Storage**: User data persisted in Supabase with RLS policies

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

- **Backend**: Supabase (PostgreSQL) with Row Level Security (RLS)
- **Authentication**: Google OAuth via Supabase Auth
- **Real-time sync**: Data synchronized across devices
- **API Layer**: Centralized in `src/lib/api.ts` with type-safe functions
- **Database Schema**: Three main tables (profiles, habits, habit_completions)
- **Error Handling**: Comprehensive error handling throughout the API layer

### Database Tables

1. **profiles**: User information linked to Supabase auth users (includes language and tracking preferences)
2. **habits**: Habit definitions with scheduling configuration
3. **habit_completions**: Daily completion tracking records

### API Structure

All data operations go through the API layer (`src/lib/api.ts`) which provides:

```tsx
// Authentication
authApi.signInWithGoogle()
authApi.signOut()
authApi.getCurrentUser()
authApi.onAuthStateChange(callback)

// Habits CRUD
habitsApi.getHabits()
habitsApi.createHabit(habitData)
habitsApi.updateHabit(id, updates)
habitsApi.deleteHabit(id)

// Completions
completionsApi.getCompletions(habitIds?)
completionsApi.updateCompletion(habitId, date, completed)

// Settings
settingsApi.getSettings()
settingsApi.updateSettings(updates)
```

### Environment Variables

The app requires Supabase configuration:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## React.js Conventions

- Use functional components with hooks instead of class components
- Follow the naming convention of PascalCase for components (e.g., `HabitCard.tsx`)
- Use named exports for components
- Keep components small and focused on a single responsibility
- Use custom hooks to share stateful logic between components
- Use React context for global state when needed (AuthContext is already implemented)
- Use TypeScript interfaces for props
- **Handle async operations**: All API calls are asynchronous and should be properly handled
- **Error boundaries**: Include error handling in components that make API calls
- **Loading states**: Show loading indicators during async operations

```tsx
// Example component structure with async operations
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { habitsApi } from '@/lib/api';

interface HabitCardProps {
  title: string;
  streak: number;
  onComplete: (habitId: string, date: string) => Promise<void>;
}

export function HabitCard({ title, streak, onComplete }: HabitCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleComplete = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await onComplete(habitId, today);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-lg border">
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-gray-500">Current streak: {streak} days</p>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button onClick={handleComplete} disabled={isLoading}>
        {isLoading ? 'Completing...' : 'Complete'}
      </Button>
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

## RTL (Right-to-Left) Support

The application supports both RTL and LTR layouts to accommodate multiple languages. Follow these guidelines when implementing RTL support.

### RTL Configuration

TailwindCSS has built-in RTL support that works automatically when the `dir="rtl"` attribute is set on the document or parent element. The application automatically switches between RTL and LTR based on the selected language.

```tsx
// Use dir attribute on html element
<html dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
```

### TailwindCSS RTL Utilities

Use TailwindCSS logical properties and `rtl:`/`ltr:` variants to conditionally apply styles based on text direction:

```tsx
// ❌ Avoid directional utilities
<div className="ml-4 text-left border-l-2">

// ✅ Use logical properties (preferred approach)
<div className="ms-4 text-start border-s-2">

// ✅ Or use RTL/LTR variants when logical properties aren't available
<div className="ltr:ml-4 rtl:mr-4 ltr:text-left rtl:text-right">
```

#### Logical Properties (Preferred Approach)

TailwindCSS provides logical properties that automatically adapt to text direction:

| Directional | Logical Property | Description |
|-------------|------------------|-------------|
| `ml-*` / `mr-*` | `ms-*` / `me-*` | Margin start/end |
| `pl-*` / `pr-*` | `ps-*` / `pe-*` | Padding start/end |
| `left-*` / `right-*` | `start-*` / `end-*` | Position start/end |
| `text-left` / `text-right` | `text-start` / `text-end` | Text alignment |
| `border-l-*` / `border-r-*` | `border-s-*` / `border-e-*` | Border start/end |
| `rounded-l-*` / `rounded-r-*` | `rounded-s-*` / `rounded-e-*` | Border radius start/end |

#### RTL/LTR Variants (When Logical Properties Aren't Available)

Use `rtl:` and `ltr:` variants for cases where logical properties don't exist:

```tsx
// Icons that need different behavior in RTL
<ChevronRight className="h-4 w-4 rtl:rotate-180" />
<ArrowLeft className="h-4 w-4 ltr:block rtl:hidden" />
<ArrowRight className="h-4 w-4 ltr:hidden rtl:block" />

// Transform properties
<div className="rtl:scale-x-[-1]">

// Complex positioning scenarios
<div className="absolute ltr:left-4 rtl:right-4 top-0">
```

#### Common RTL-Aware Utility Mappings

| Directional | RTL-Aware | Description |
|-------------|-----------|-------------|
| `ml-*` | `ms-*` | Margin start (left in LTR, right in RTL) |
| `mr-*` | `me-*` | Margin end (right in LTR, left in RTL) |
| `pl-*` | `ps-*` | Padding start |
| `pr-*` | `pe-*` | Padding end |
| `left-*` | `start-*` | Position start |
| `right-*` | `end-*` | Position end |
| `text-left` | `text-start` | Text alignment start |
| `text-right` | `text-end` | Text alignment end |
| `border-l-*` | `border-s-*` | Border start |
| `border-r-*` | `border-e-*` | Border end |
| `rounded-l-*` | `rounded-s-*` | Rounded corners start |
| `rounded-r-*` | `rounded-e-*` | Rounded corners end |

### Shadcn UI RTL Considerations

Most Shadcn UI components work well with RTL by default, but pay attention to these components:

```tsx
// Dropdown menus - ensure proper positioning
<DropdownMenuContent align="start" side="bottom">
  {/* Content */}
</DropdownMenuContent>

// Tooltips - use logical positioning
<TooltipContent side="top" align="start">
  {/* Content */}
</TooltipContent>

// Icons - some icons may need rotation in RTL
<ChevronLeft className="h-4 w-4 rtl:rotate-180" />
<ArrowRight className="h-4 w-4 rtl:scale-x-[-1]" />
```

### Component Development for RTL

When creating components, prefer logical properties:

```tsx
// Example RTL-aware component using logical properties
interface HabitCardProps {
  title: string;
  streak: number;
  isCompleted: boolean;
}

export function HabitCard({ title, streak, isCompleted }: HabitCardProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border">
      {/* Content flows naturally with flexbox */}
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-gray-300'}`} />
        <div>
          <h3 className="font-medium text-start">{title}</h3>
          <p className="text-sm text-gray-500 text-start">{streak} days streak</p>
        </div>
      </div>
      
      {/* Button with logical property spacing */}
      <Button size="sm" className="ms-4">
        Complete
      </Button>
    </div>
  );
}
```

### Icons and Visual Elements

Handle directional icons and visual elements appropriately:

```tsx
// Directional icons that should flip in RTL
<ChevronRight className="h-4 w-4 rtl:rotate-180" />
<ArrowLeft className="h-4 w-4 rtl:scale-x-[-1]" />

// Icons that should NOT flip (like checkmarks, close buttons)
<Check className="h-4 w-4" />
<X className="h-4 w-4" />

// Progress indicators (work automatically with logical properties)
<div className="w-full bg-gray-200 rounded-full h-2">
  <div 
    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
    style={{ width: `${progress}%` }}
  />
</div>
```

### Layout Patterns

Use these patterns for common layout scenarios:

```tsx
// Navigation with proper RTL flow
<nav className="flex items-center justify-between">
  <div className="flex items-center gap-4">
    <Logo />
    <NavLinks />
  </div>
  <UserMenu />
</nav>

// Form layouts
<form className="space-y-4">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Input label="Name" className="text-start" />
    <Input label="Email" className="text-start" />
  </div>
</form>

// Card grids
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {habits.map(habit => (
    <HabitCard key={habit.id} {...habit} />
  ))}
</div>
```

### React i18next Integration

Handle text direction changes with language switching:

```tsx
import { useTranslation } from 'react-i18next';

export function App() {
  const { i18n } = useTranslation();
  
  useEffect(() => {
    // Update document direction when language changes
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return (
    <div className="min-h-screen bg-background">
      {/* App content */}
    </div>
  );
}
```

### Testing RTL Layouts

Always test both RTL and LTR layouts:

```tsx
// Mock language switching for testing
const TestRTLToggle = () => {
  const { i18n } = useTranslation();
  
  return (
    <Button 
      onClick={() => i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar')}
      variant="outline"
    >
      Toggle RTL/LTR
    </Button>
  );
};
```

### Common RTL Pitfalls to Avoid

1. **Prefer logical properties** - Use `ms-*`/`me-*` instead of `ml-*`/`mr-*`
2. **Use `rtl:`/`ltr:` variants sparingly** - Only when logical properties aren't available
3. **Don't assume text direction** - Always use `text-start`/`text-end` instead of `text-left`/`text-right`
4. **Mind flexbox behavior** - Flexbox automatically reverses in RTL, no need for `flex-row-reverse`
5. **Icon direction consistency** - Not all icons should flip in RTL
6. **Test with actual RTL content** - Lorem ipsum doesn't reveal RTL issues

## Authentication & User Management

The application uses Supabase Auth with Google OAuth for user authentication. Always check authentication state before rendering protected content.

### Authentication Flow

```tsx
// Use the AuthContext to access authentication state
import { useAuth } from '@/hooks/useAuth';

export function ProtectedComponent() {
  const { user, isAuthenticated, isLoading, signInWithGoogle, signOut } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div>
        <p>Please sign in to continue</p>
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      </div>
    );
  }

  return (
    <div>
      <p>Welcome, {user?.fullName || user?.email}</p>
      <button onClick={signOut}>Sign Out</button>
      {/* Protected content */}
    </div>
  );
}
```

### User Data Structure

```tsx
interface User {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
}
```

## Database Operations

When working with data operations, always use the centralized API functions:

### Creating New Habits

```tsx
import { habitsApi } from '@/lib/api';

const createNewHabit = async (habitData: Omit<Habit, 'id' | 'userId'>) => {
  try {
    const newHabit = await habitsApi.createHabit(habitData);
    // Handle success
  } catch (error) {
    // Handle error
    console.error('Failed to create habit:', error);
  }
};
```

### Updating Completions

```tsx
import { completionsApi } from '@/lib/api';

const toggleHabitCompletion = async (habitId: string, date: string, completed: boolean) => {
  try {
    await completionsApi.updateCompletion(habitId, date, completed);
    // Handle success
  } catch (error) {
    // Handle error
    console.error('Failed to update completion:', error);
  }
};
```

## Error Handling Best Practices

1. **Always wrap async operations in try-catch blocks**
2. **Provide user-friendly error messages**
3. **Log detailed errors to console for debugging**
4. **Show loading states during async operations**
5. **Handle network errors gracefully**

```tsx
const [error, setError] = useState<string | null>(null);
const [isLoading, setIsLoading] = useState(false);

const handleAction = async () => {
  try {
    setIsLoading(true);
    setError(null);
    await someAsyncOperation();
    // Success handling
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    setError(errorMessage);
    console.error('Operation failed:', err);
  } finally {
    setIsLoading(false);
  }
};
```
