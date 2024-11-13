import { GameInfo, GameStatus } from '../models/game.model';
import { DEFAULT_WORDS } from './word-list';

export const NEW_GAME: GameInfo = {
  maxTime: 10,
  status: GameStatus.PENDING,
  active: false,
  word: 'Testing your reflexes..',
  words: DEFAULT_WORDS,
};
