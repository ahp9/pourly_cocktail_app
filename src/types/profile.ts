export type ProfileUser = {
  id: string;
  name: string;
  email: string;
};

export type TasteScore = {
  key: string;
  label: string;
  value: number;
  delta?: number;
};

export type Personality = {
  name: string;
  description: string;
  drinksRated: number;
  updatedAt: string;
};

export type Recommendation = {
  id: string;
  name: string;
  needs: string;
  match: number;
  accent: string;
};

export type Profile = {
  user: ProfileUser;
  taste: TasteScore[];
  personality: Personality | null;
  recommendations: Recommendation[];
};
