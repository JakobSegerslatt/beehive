import { GameUser } from './user.model';

export interface GameInfo {
  maxTime: number;
  status: GameStatus;
  active: boolean;
  words: Array<string>;
  word?: string;
}

export interface Answer {
  user: GameUser;
  answer: string;
  word: string;
}

export enum GameStatus {
  PENDING = 'PENDING',
  STARTED = 'STARTED',
  COMPLETE = 'COMPLETE',
}
