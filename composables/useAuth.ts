import { useNuxtApp } from "#app";
import type { User } from "@supabase/supabase-js"; // Import the User type

export const useAuth = () => {
  const { $supabase } = useNuxtApp();
  const user = ref<User | null>(null); // Explicitly declare user as User | null
  const error = ref<string | null>(null);

  const login = async (email: string, password: string) => {
    const { data, error: loginError } = await $supabase.auth.signInWithPassword(
      {
        email,
        password,
      }
    );

    if (loginError) {
      error.value = loginError.message;
      return null;
    }

    user.value = data.user; // TypeScript now knows user can be User | null
    return data.user;
  };

  const signup = async (email: string, password: string) => {
    const { data, error: signupError } = await $supabase.auth.signUp({
      email,
      password,
    });

    if (signupError) {
      error.value = signupError.message;
      return null;
    }

    user.value = data.user;
    return data.user;
  };

  const logout = async () => {
    const { error: logoutError } = await $supabase.auth.signOut();
    if (logoutError) {
      error.value = logoutError.message;
    } else {
      user.value = null;
    }
  };

  return { user, error, login, signup, logout };
};
