import { Component, inject } from '@angular/core';
import { GameService } from '../../services/game.service';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, take, takeUntil, tap, timer } from 'rxjs';
import { Router } from '@angular/router';
import { GameUser } from '../../models/user.model';
import { GameInfo } from '../../models/game.model';
import { AdminControlsComponent } from '../admin-controls/admin-controls.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AnswersComponent } from '../answers/answers.component';
import { Timer } from 'papilion';
import { FinalScoreComponent } from '../../final-score/final-score.component';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [
    CommonModule,
    AdminControlsComponent,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    FinalScoreComponent,
    AnswersComponent,
  ],
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss',
})
export class PlayComponent {
  private gameService: GameService = inject(GameService);
  private router: Router = inject(Router);

  user$?: Observable<GameUser>;
  game$?: Observable<GameInfo>;
  previousGame?: GameInfo;

  /** Timer in seconds */
  timer$ = new BehaviorSubject<number>(0);
  countdown$ = new BehaviorSubject<number>(0);

  inputAnswer = '';
  constructor() {
    // Wait for the game to load before we get the user
    this.game$ = this.gameService.activeGame$?.pipe(
      tap(() => {
        if (!this.user$) {
          this.user$ = this.gameService.user$?.pipe(
            tap((user) => {
              if (!user) {
                this.router.navigate(['/']);
              }
            }),
          );
        }
      }),
      tap((game) => {
        if (game.word !== this.previousGame?.word) {
          this.previousGame = game;
          // NEW WORD!
          // Start a countdown of 3 seconds
          this.countdown$.next(3);
          timer(1000, 1000)
            .pipe(take(3))
            .subscribe(() => {
              this.countdown$.next(this.countdown$.value - 1);
              if (this.countdown$.value === 0) {
                this.startTimer(game.maxTime);
              }
            });
        }
      }),
    );
  }

  startTimer(seconds: number) {
    const milliseconds = seconds * 1000;
    this.timer$.next(milliseconds);

    // const myTimer = new Timer(() => {
    //   this.timer$.next(this.timer$.value - 100);
    //   if (this.timer$.value <= 0) {
    //     this.timer$.next(0);
    //     myTimer?.stop();
    //   }
    // }, 100);

    const timeSub = timer(200, 200).subscribe(() => {
      this.timer$.next(this.timer$.value - 200);
      if (this.timer$.value <= 0) {
        this.timer$.next(0);
        timeSub.unsubscribe();
      }
    });

    timer(milliseconds)
      .pipe(take(1))
      .subscribe(() => {
        this.submitAnswer();
      });
  }

  submitAnswer() {
    if (this.inputAnswer?.length > 0) {
      this.gameService.submitAnswer(
        this.gameService.user!,
        this.inputAnswer,
        this.gameService.activeGame?.word!,
      );
      this.inputAnswer = '';
    }
  }

  calculatePercentage(val: number, max: number): number {
    const percentage = (val / max) * 100;
    return percentage;
  }
}
