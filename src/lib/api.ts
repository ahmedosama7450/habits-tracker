import { supabase } from './supabase';
import type { Habit, HabitCompletion, AppSettings, User } from '@/types';

// Auth functions
export const authApi = {
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}`,
        queryParams: {
          prompt: 'select_account',
        },
      },
    });
    
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut({
      scope: 'global' // This ensures sign out from all sessions
    });
    if (error) throw error;
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        return null;
      }
      
      if (!session?.user) {
        console.log('No session or user found');
        return null;
      }

      const user = session.user;
      console.log('Session user found:', user.id);

      // Get or create profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle(); // Use maybeSingle instead of single to avoid errors when no row exists

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        return null;
      }

      if (!profile) {
        console.log('Creating new profile for user:', user.id);
        // Create profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email!,
            full_name: user.user_metadata?.full_name,
            avatar_url: user.user_metadata?.avatar_url,
            language: 'ar', // Default language
            first_tracking_month: new Date().toISOString().slice(0, 7), // Current month
          })
          .select()
          .maybeSingle();

        if (createError) {
          console.error('Profile creation error:', createError);
          return null;
        }
        
        if (!newProfile) {
          console.error('Failed to create profile - no data returned');
          return null;
        }
        
        return {
          id: newProfile.id,
          email: newProfile.email,
          fullName: newProfile.full_name || undefined,
          avatarUrl: newProfile.avatar_url || undefined,
        };
      }

      console.log('Profile found:', profile.id);
      return {
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name || undefined,
        avatarUrl: profile.avatar_url || undefined,
      };
    } catch (error) {
      console.error('getCurrentUser error:', error);
      return null; // Return null instead of throwing to prevent crashes
    }
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session ? 'session exists' : 'no session');
      
      if (session?.user) {
        try {
          const user = await authApi.getCurrentUser();
          console.log('Auth state change - user loaded:', user?.id);
          callback(user);
        } catch (error) {
          console.error('Error getting user profile in auth state change:', error);
          callback(null);
        }
      } else {
        console.log('Auth state change - no session, setting user to null');
        callback(null);
      }
    });
  },
};

// Habits functions
export const habitsApi = {
  async getHabits(): Promise<Habit[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return data.map(habit => ({
      id: habit.id,
      name: habit.name,
      schedule: {
        type: habit.schedule_type,
        weekdays: habit.weekdays || undefined,
        monthDays: habit.month_days || undefined,
      },
      startDate: new Date(habit.start_date),
      userId: habit.user_id,
    }));
  },

  async createHabit(habit: Omit<Habit, 'id' | 'userId'>): Promise<Habit> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('habits')
      .insert({
        user_id: user.id,
        name: habit.name,
        schedule_type: habit.schedule.type,
        weekdays: habit.schedule.weekdays || null,
        month_days: habit.schedule.monthDays || null,
        start_date: habit.startDate.toISOString().split('T')[0],
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      schedule: {
        type: data.schedule_type,
        weekdays: data.weekdays || undefined,
        monthDays: data.month_days || undefined,
      },
      startDate: new Date(data.start_date),
      userId: data.user_id,
    };
  },

  async updateHabit(id: string, updates: Partial<Omit<Habit, 'id' | 'userId'>>): Promise<Habit> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const updateData: {
      name?: string;
      schedule_type?: 'weekly' | 'monthly';
      weekdays?: number[] | null;
      month_days?: number[] | null;
      start_date?: string;
    } = {};
    
    if (updates.name) updateData.name = updates.name;
    if (updates.schedule) {
      updateData.schedule_type = updates.schedule.type;
      updateData.weekdays = updates.schedule.weekdays || null;
      updateData.month_days = updates.schedule.monthDays || null;
    }
    if (updates.startDate) {
      updateData.start_date = updates.startDate.toISOString().split('T')[0];
    }

    const { data, error } = await supabase
      .from('habits')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      schedule: {
        type: data.schedule_type,
        weekdays: data.weekdays || undefined,
        monthDays: data.month_days || undefined,
      },
      startDate: new Date(data.start_date),
      userId: data.user_id,
    };
  },

  async deleteHabit(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  },
};

// Habit completions functions
export const completionsApi = {
  async getCompletions(habitIds?: string[]): Promise<HabitCompletion[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    let query = supabase
      .from('habit_completions')
      .select('*')
      .eq('user_id', user.id);

    if (habitIds && habitIds.length > 0) {
      query = query.in('habit_id', habitIds);
    }

    const { data, error } = await query.order('date', { ascending: false });

    if (error) throw error;

    return data.map(completion => ({
      id: completion.id,
      habitId: completion.habit_id,
      date: completion.date,
      completed: completion.completed,
      userId: completion.user_id,
    }));
  },

  async updateCompletion(habitId: string, date: string, completed: boolean): Promise<HabitCompletion> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // First try to update existing completion
    const { data: existing } = await supabase
      .from('habit_completions')
      .select('id')
      .eq('habit_id', habitId)
      .eq('user_id', user.id)
      .eq('date', date)
      .single();

    if (existing) {
      // Update existing completion
      const { data, error } = await supabase
        .from('habit_completions')
        .update({ completed })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        habitId: data.habit_id,
        date: data.date,
        completed: data.completed,
        userId: data.user_id,
      };
    } else {
      // Create new completion
      const { data, error } = await supabase
        .from('habit_completions')
        .insert({
          habit_id: habitId,
          user_id: user.id,
          date,
          completed,
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        habitId: data.habit_id,
        date: data.date,
        completed: data.completed,
        userId: data.user_id,
      };
    }
  },
};

// Settings functions
export const settingsApi = {
  async getSettings(): Promise<AppSettings> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .select('language, first_tracking_month')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (!data) {
      // This shouldn't happen if AuthContext is working properly, 
      // but let's handle it gracefully by returning default settings
      console.warn('Profile not found for user, using default settings');
      return {
        language: 'ar',
        firstTrackingMonth: new Date().toISOString().slice(0, 7),
      };
    }

    return {
      language: data.language,
      firstTrackingMonth: data.first_tracking_month,
    };
  },

  async updateSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const updateData: {
      language?: 'en' | 'ar';
      first_tracking_month?: string;
    } = {};
    
    if (settings.language) updateData.language = settings.language;
    if (settings.firstTrackingMonth) updateData.first_tracking_month = settings.firstTrackingMonth;

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)
      .select('language, first_tracking_month')
      .single();

    if (error) throw error;

    return {
      language: data.language,
      firstTrackingMonth: data.first_tracking_month,
    };
  },
};