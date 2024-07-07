import { useAuth } from "@/providers/AuthProvider";
import { Tables } from "@/types";

// PlayerProfile.ts
export class PlayerProfile {
    id: number;
    ageGroup: string;
    fedRank: number | null;
    profile_id: string

    constructor(data: Tables<'player_profiles'>) {
        this.id = data.id;
        this.ageGroup = data.ageGroup;
        this.fedRank = data.fedRank;
        this.profile_id = data.profile_id
    }
}