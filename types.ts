export interface Participant {
  id: string;
  name: string;
}

export interface Group {
  id: string;
  name: string;
  members: Participant[];
}

export enum AppMode {
  INPUT = 'INPUT',
  DRAW = 'DRAW',
  GROUP = 'GROUP'
}

export interface DrawSettings {
  allowDuplicates: boolean;
  numberOfWinners: number;
}
