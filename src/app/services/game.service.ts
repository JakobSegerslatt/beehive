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
    active: localStorage.getItem('active-game') || '',
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
    this.listenToConfig();
    this.setGames();

    if (this.config.active) {
      this.setActiveGame(this.config.active);
      this.setUsers(this.config.active);

      const userId = localStorage.getItem('user');
      if (userId) {
        this.setUser(this.config.active, userId);
      }
    }

    this.activeGame$ = this.config$.pipe(
      filter((c) => !!c.active),
      mergeMap((config) => {
        const ref = doc(this.firestore, 'games', config.active);
        return docData(ref) as Observable<GameInfo>;
      }),
      tap((game) => (this.activeGame = game))
    );
  }

  public submitAnswer(user: GameUser, answer: string, word: string) {
    const answerCollectionRef = collection(
      this.firestore,
      'games',
      this.config.active,
      'answers'
    );
    const update: Answer = {
      user: {
        name: user.name,
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
    // Update the global word list
    const update: Partial<AdminConfig> = {
      words: [...(this.config.words || []), word],
    };
    updateDoc(this.configRef!, update);

    // Update the word list for the active game
    if (this.activeGame) {
      const update: Partial<GameInfo> = {
        words: [...(this.activeGame.words || []), word],
      };
      updateDoc(this.activeGameRef!, update);
    }
  }

  updatetime(seconds: number) {
    updateDoc(this.activeGameRef!, { maxTime: seconds });
  }

  createGame(name: string) {
    const newGame: GameInfo = {
      name,
      maxTime: 10,
      status: GameStatus.PENDING,
      active: false,
      word: 'Testing your reflexes..',
      words: DEFAULT_WORDS,
    };
    addDoc(this.gameCollectionRef!, newGame).then((ref) => {
      setDoc(this.configRef, { active: ref.id }, { merge: true });
    });
  }

  startGame() {
    setDoc(
      this.activeGameRef!,
      { status: GameStatus.STARTED },
      { merge: true }
    ).then(() => this.nextWord());
  }

  endGame() {
    setDoc(
      this.activeGameRef!,
      { status: GameStatus.COMPLETE },
      { merge: true }
    ).then(() => this.nextWord());
  }

  // Register methods
  createUser(name: string) {
    return addDoc(this.userCollectionRef!, { name }).then((ref) => {
      this.setUser(this.config.active, ref.id);
    });
  }

  private setUsers(gameId: string) {
    this.userCollectionRef = collection(
      this.firestore,
      'games',
      gameId,
      'users'
    );
    this.userCollection$ = collectionData(this.userCollectionRef).pipe(
      tap((x: Array<GameUser>) => (this.userCollection = x))
    );
  }

  private setUser(gameId: string, userId: string) {
    localStorage.setItem('user', userId);

    this.userRef = doc(this.firestore, 'games', gameId, 'users', userId);
    this.user$ = docData(this.userRef).pipe(
      tap((x: GameUser) => (this.user = x))
    );
  }

  private setGames() {
    this.gameCollectionRef = collection(this.firestore, 'games');
    this.gameCollection$ = collectionData(this.gameCollectionRef).pipe(
      tap((x: Array<GameInfo>) => (this.gameCollection = x))
    );
  }

  private setActiveGame(gameId: string) {
    localStorage.setItem('active-game', gameId);
    this.activeGameRef = doc(this.firestore, 'games', gameId);
  }

  private setAnswers(gameId: string) {
    this.answersRef = collection(this.firestore, 'games', gameId, 'answers');
    this.answers$ = collectionData(this.answersRef).pipe(
      tap((x: Array<Answer>) => (this.answers = x))
    );
  }

  private listenToConfig() {
    this.config$.subscribe((config) => {
      if (!config.active) {
        this.config = config;
        console.log('No active game');
        return;
      }

      this.setAnswers(config.active);
      if (config.active !== this.config.active) {
        this.setActiveGame(config.active);
        this.setUsers(config.active);

        const userId = localStorage.getItem('user');
        if (userId) {
          this.setUser(config.active, userId);
        }
      }
      this.config = config;
    });
  }
}
