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
    profile: any;
    playerProfile: Tables<'player_profiles'> | null;
    loading: boolean;
    isAdmin: boolean;
};

const AuthContext = createContext<AuthData>({
    session: null,
    loading: true,
    profile: null,
    playerProfile: null,
    isAdmin: false,
});

export default function AuthProvider({ children }: PropsWithChildren) {
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState(null);
    const [playerProfile, setPlayerProfile] = useState(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            setSession(session);

            if (session) {
                // fetch profile
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                setProfile(data || null);

                const { data: player_profile } = await supabase
                    .from('player_profiles')
                    .select('*')
                    .eq('profile_id', session.user.id)
                    .single();
                setPlayerProfile(player_profile || null);
            }

            setLoading(false);
        };

        fetchSession();
        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);





    return (
        <AuthContext.Provider
            value={{ session, loading, profile, playerProfile, isAdmin: profile?.group === 'ADMIN' }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);