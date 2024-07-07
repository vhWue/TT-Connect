import { Tables } from "@/types";

export class Competition {
    ageGroup: string | null;
    fedRankFrom: number | null;
    fedRankRemarks: string | null;
    fedRankTo: number | null;
    fedRankValuation: boolean;
    id: number;
    name: string;
    playerCapacityRemaining: number | null;
    playerCapacityTotal: number | null;
    playmode: string;
    registrationEndDatetime: string | null;
    startDatetime: string | null;
    tournament_id: number | null;

    constructor(data: Tables<'competitions'>) {
        this.ageGroup = data.ageGroup;
        this.fedRankFrom = data.fedRankFrom;
        this.fedRankRemarks = data.fedRankRemarks;
        this.fedRankTo = data.fedRankTo;
        this.fedRankValuation = data.fedRankValuation;
        this.id = data.id;
        this.name = data.name;
        this.playerCapacityRemaining = data.playerCapacityRemaining;
        this.playerCapacityTotal = data.playerCapacityTotal;
        this.playmode = data.playmode;
        this.registrationEndDatetime = data.registrationEndDatetime;
        this.startDatetime = data.startDatetime;
        this.tournament_id = data.tournament_id;
    }

    isRegistrationOpen(): boolean {
        if (this.registrationEndDatetime) {
            const registrationEndDate = new Date(this.registrationEndDatetime).getTime();
            return registrationEndDate > Date.now();
        }
        return false;
    }
}