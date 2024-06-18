export interface Team {
  id: string;
  name: string;
  teamColor: string;
}

export interface Driver {
  id: string;
  fullName: string;
  number: number;
  countryCode: string;
  team: Team;
}
