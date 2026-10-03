export interface Participant {
  id: string;
  name: string;
  dateOfBirth: string;
  email: string;
  phone: string;
}

export type ParticipantFormData = Omit<Participant, "id">;
