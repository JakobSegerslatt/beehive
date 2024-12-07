import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  doc,
  docData,
  DocumentData,
  DocumentReference,
  Firestore,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { filter, map, max, mergeMap, Observable, switchMap, tap } from 'rxjs';
import { GameUser } from '../models/user.model';
import { Answer, GameInfo, GameStatus } from '../models/game.model';
import { AdminConfig } from '../models/admin-config.model';
import { DEFAULT_WORDS } from './word-list';
import { NEW_GAME } from './default-game';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private firestore = inject(Firestore);

  configRef = doc(this.firestore, 'admin', 'config');
  config$: Observable<AdminConfig> = (
    docData(this.configRef) as Observable<AdminConfig>
  ).pipe(tap((x) => this.config === x));
  config: AdminConfig = {
    words: [],
  };

  gameCollectionRef?: CollectionReference<DocumentData>;
  gameCollection$?: Observable<Array<GameInfo>>;
  gameCollection?: Array<GameInfo>;

  activeGameRef?: DocumentReference<DocumentData>;
  activeGame$?: Observable<GameInfo>;
  activeGame?: GameInfo;

  answersRef?: CollectionReference<DocumentData>;
  answers$?: Observable<Array<Answer>>;
  answers?: Array<Answer>;

  userRef?: DocumentReference<DocumentData>;
  user$?: Observable<GameUser>;
  user?: GameUser;

  userCollectionRef?: CollectionReference<DocumentData>;
  userCollection$?: Observable<Array<GameUser>>;
  userCollection?: Array<GameUser>;

  constructor() {
    this.setGames();
  }

  public submitAnswer(user: GameUser, answer: string, word: string) {
    const answerCollectionRef = collection(
      this.firestore,
      'games',
      this.activeGameRef!.id,
      'answers',
    );
    const update: Answer = {
      user: {
        name: user.name,
        gameId: user.gameId,
        answer: answer,
        id: this.userRef?.id,
      },
      answer,
      word,
    };
    updateDoc(this.userRef!, { answer });
    return addDoc(answerCollectionRef!, update).then((ref) => {
      console.log('Answer submitted', ref.id);
    });
  }

  // Admin methods
  nextWord() {
    const words = this.activeGame!.words;
    const randomIndex = Math.floor(Math.random() * words.length);
    const selectedWord = words[randomIndex];
    words.splice(randomIndex, 1);

    updateDoc(this.activeGameRef!, { words, word: selectedWord });
  }

  addWord(word: string) {
    // Update the word list for the active game
    const update: Partial<GameInfo> = {
      words: [...(this.activeGame!.words || []), word],
    };
    updateDoc(this.activeGameRef!, update);
  }

  removeWord(word: string) {
    const update = this.activeGame!.words.filter((w) => w !== word);
    updateDoc(this.activeGameRef!, { words: update });
  }

  updatetime(seconds: number) {
    updateDoc(this.activeGameRef!, { maxTime: seconds });
  }

  createGame() {
    return addDoc(this.gameCollectionRef!, NEW_GAME);
  }

  startGame() {
    updateDoc(this.activeGameRef!, { status: GameStatus.STARTED }).then(() =>
      this.nextWord(),
    );
  }

  endGame() {
    updateDoc(this.activeGameRef!, { status: GameStatus.COMPLETE }).then(() =>
      this.nextWord(),
    );
  }

  // Register methods
  createUser(name: string, gameId: string) {
    return addDoc(this.userCollectionRef!, { name, gameId }).then((ref) => {
      this.setUser(this.activeGameRef!.id, ref.id);
    });
  }

  private setUsers(gameId: string) {
    this.userCollectionRef = collection(
      this.firestore,
      'games',
      gameId,
      'users',
    );
    this.userCollection$ = collectionData(this.userCollectionRef).pipe(
      tap((x: Array<GameUser>) => (this.userCollection = x)),
    );
  }

  setUser(gameId: string, userId: string) {
    localStorage.setItem('hive-user', userId);

    this.userRef = doc(this.firestore, 'games', gameId, 'users', userId);
    this.user$ = docData(this.userRef).pipe(
      tap((x: GameUser) => (this.user = x)),
    );
  }

  private setGames() {
    this.gameCollectionRef = collection(this.firestore, 'games');
    this.gameCollection$ = collectionData(this.gameCollectionRef).pipe(
      tap((x: Array<GameInfo>) => (this.gameCollection = x)),
    );
  }

  setActiveGame(gameId: string) {
    localStorage.setItem('active-game', gameId);
    this.activeGameRef = doc(this.firestore, 'games', gameId);
    this.activeGame$ = docData(this.activeGameRef).pipe(
      tap((x: GameInfo) => (this.activeGame = x)),
    );
    this.setUsers(gameId);
    this.setAnswers(gameId);
  }

  setAnswers(gameId: string) {
    this.answersRef = collection(this.firestore, 'games', gameId, 'answers');
    this.answers$ = collectionData(this.answersRef).pipe(
      tap((x: Array<Answer>) => (this.answers = x)),
    );
  }
}
