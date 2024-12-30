import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { GameService } from '../../services/game.service';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, tap, timer } from 'rxjs';
import { GameUser } from '../../models/user.model';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { AnswersComponent } from '../answers/answers.component';
import { GameInfo } from '../../models/game.model';

@Component({
  selector: 'app-admin-controls',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    FormsModule,
    MatIconModule,
    AnswersComponent,
    MatTooltipModule,
  ],
  templateUrl: './admin-controls.component.html',
  styleUrl: './admin-controls.component.scss',
})
export class AdminControlsComponent {
  @Input() set id(gameId: string) {
    this.loadGame(gameId);
  }
  private gameService: GameService = inject(GameService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  game$: Observable<GameInfo> | undefined;
  users$?: Observable<GameUser[]>;

  form = new FormGroup({
    word: new FormControl('', [Validators.required, Validators.minLength(1)]),
  });

  showAnswers$ = new BehaviorSubject<boolean>(true);
  maxTime = 0;

  get gameLink() {
    return window.location.host + '/play/' + this.gameService.activeGameRef?.id;
  }

  removeWord(word: string) {
    this.gameService.removeWord(word);
  }

  addWord(): void {
    if (this.form.invalid) return;

    const value = (this.form.value.word || '').trim();
    if (value) {
      this.gameService.addWord(value);
    }
    this.form.reset();
  }

  nextWord(word?: string) {
    this.showAnswers$.next(false);
    this.gameService.nextWord(word);
    timer(4000 + this.maxTime * 1000).subscribe(() =>
      this.showAnswers$.next(true),
    );
  }

  updateSeconds() {
    this.gameService.updatetime(this.maxTime);
  }

  startGame() {
    this.gameService.startGame();
  }

  endGame() {
    this.gameService.endGame();
  }

  loadGame(gameId: string) {
    this.gameService.setActiveGame(gameId);
    this.game$ = this.gameService.activeGame$?.pipe(
      tap((game) => {
        this.maxTime = game.maxTime;
        this.cdr.detectChanges();
      }),
    );
    this.users$ = this.gameService.userCollection$!;
  }
}
