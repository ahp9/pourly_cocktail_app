import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "@/services/supabase";

type User = { id: string; name: string; email: string; token?: string };

type AuthContextValue = {
  user: User | null;
  loading: boolean;

  signIn: (email: string, password: string) => Promise<void>;

  signUp: (name: string, email: string, password: string) => Promise<void>;

  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  // --------------------------------------------------
  // Convert a Supabase user into your app's User type
  // --------------------------------------------------

  async function loadUser(
    authUser: {
      id: string;
      email?: string;
    } | null,
  ) {
    if (!authUser) {
      setUser(null);
      return;
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("display_name, username")
      .eq("id", authUser.id)
      .single();

    if (error) {
      console.error("Failed to load profile:", error.message);
    }

    setUser({
      id: authUser.id,

      name: profile?.display_name ?? profile?.username ?? "",

      email: authUser.email ?? "",
    });
  }

  // --------------------------------------------------
  // Restore session when app starts
  // --------------------------------------------------

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (mounted) {
        await loadUser(session?.user ?? null);

        setLoading(false);
      }
    }

    initializeAuth();

    // Listen for login / logout changes

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      await loadUser(session?.user ?? null);

      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // --------------------------------------------------
  // SIGN IN
  // --------------------------------------------------

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    // onAuthStateChange will update `user`
  };

  // --------------------------------------------------
  // SIGN UP
  // --------------------------------------------------

  const signUp = async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,

      options: {
        data: {
          display_name: name.trim(),
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error("Could not create user");
    }

    // Your DB trigger should have created the profile.
    // Now put the person's name into it.

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        display_name: name.trim(),
      })
      .eq("id", data.user.id);

    if (profileError) {
      throw new Error(profileError.message);
    }
  };

  // --------------------------------------------------
  // SIGN OUT
  // --------------------------------------------------

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }

  return ctx;
}
