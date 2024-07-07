import { Tables } from "@/database.types";
import { Competition } from "../Competition";
import { PlayerProfile } from "../PlayerProfile";
import { AlertService } from "./AlertService";
import { useDeleteTournamentRegistration, useInsertTournamentRegistration } from "@/api/turniere";

export class RegistrationService {
    private playerProfile: PlayerProfile;
    private registeredTournaments: Tables<'tournament_registration'>[];
    private insertRegistration: (data: any) => void;
    private deleteRegistration: (id: number) => void;

    constructor(playerProfile: PlayerProfile, registeredTournaments: Tables<'tournament_registration'>[]) {
        this.playerProfile = playerProfile;
        this.registeredTournaments = registeredTournaments;

        const { mutate: insertReg } = useInsertTournamentRegistration();
        const { mutate: deleteReg } = useDeleteTournamentRegistration();

        this.insertRegistration = insertReg;
        this.deleteRegistration = deleteReg;
    }

    checkIsRegistered(competition: Competition): { isRegistered: boolean, registrationId: number | null } {
        const registration = this.registeredTournaments.find(
            (reg) =>
                reg.competition_id === competition.id &&
                reg.player_profile_id === this.playerProfile.id
        );
        const isRegistered = registration !== undefined;
        const registrationId = registration ? registration.id : null;

        return { isRegistered, registrationId };
    }

    handleRegistration(competition: Competition) {
        if (!competition.isRegistrationOpen()) {
            AlertService.alert("Der Anmeldezeitraum ist zu Ende");
            return;
        }

        const { isRegistered, registrationId } = this.checkIsRegistered(competition);

        if (!isRegistered) {
            const newRegistration = {
                competition_id: competition.id,
                tournament_id: competition.tournament_id,
                player_profile_id: this.playerProfile.id
            };

            AlertService.confirm(
                "Bestätigung",
                "Möchten Sie sich wirklich für dieses Turnier anmelden?",
                () => {
                    this.insertRegistration(newRegistration);
                    AlertService.alert("Registrierung erfolgreich");
                }
            );
        } else {
            if (registrationId) {
                AlertService.confirm(
                    "Bestätigung",
                    "Möchten Sie Ihre Registrierung wirklich löschen?",
                    () => {
                        this.deleteRegistration(registrationId);
                        AlertService.alert("Registrierung erfolgreich gelöscht");
                    }
                );
            } else {
                AlertService.alert('Hinweis, Sie sind bereits für diesen Wettbewerb im Turnier registriert.');
            }
        }
    }

    checkEligibility(competition: Competition): boolean {
        const isAgeGroupValid = competition.ageGroup ? competition.ageGroup.includes(this.playerProfile.ageGroup) : false;
        const isFedRankValid = (
            competition.fedRankFrom === null || competition.fedRankTo === null || (
                this.playerProfile.fedRank !== null &&
                this.playerProfile.fedRank >= competition.fedRankFrom &&
                this.playerProfile.fedRank <= competition.fedRankTo
            )
        );
        return isAgeGroupValid && isFedRankValid;
    }

}
