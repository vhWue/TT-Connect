import { supabase } from '@/app/lib/supabase';
import { Tables } from '@/types';
import { Session } from '@supabase/supabase-js';
import {
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';

type AuthData = {
    session: Session | null;
    setSession: any;
    profile: any;
    playerProfile: Tables<'player_profiles'> | null;
    loading: boolean;
    isAdmin: boolean;
};

const AuthContext = createContext<AuthData>({
    session: null,
    setSession: null,
    loading: true,
    profile: null,
    playerProfile: null,
    isAdmin: false,
});

export default function AuthProvider({ children }: PropsWithChildren) {
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState(null);
    const [playerProfile, setPlayerProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfileData = async (session: Session) => {
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
        setProfile(profile || null);

        const { data: playerProfile } = await supabase
            .from('player_profiles')
            .select('*')
            .eq('profile_id', session.user.id)
            .single();
        setPlayerProfile(playerProfile || null);
    };

    const handleAuthChange = async (event: string, session: Session | null) => {
        if (session) {
            await fetchProfileData(session);
        } else {
            setProfile(null);
            setPlayerProfile(null);
        }
        setSession(session);
        setLoading(false);
    };

    useEffect(() => {
        const fetchSession = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (session) {
                await fetchProfileData(session);
            }
            setSession(session);
            setLoading(false);
        };

        fetchSession();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                handleAuthChange(event, session);
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider
            value={{ session, setSession, loading, profile, playerProfile, isAdmin: profile?.group === 'ADMIN' }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
