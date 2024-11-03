import { Component, inject } from '@angular/core';
import { GameService } from '../../services/game.service';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';
import { groupArrayByProperty } from 'papilion';

@Component({
  selector: 'app-answers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './answers.component.html',
  styleUrl: './answers.component.scss',
})
export class AnswersComponent {
  public gameService: GameService = inject(GameService);

  user$ = this.gameService.user$;
  answers$ = this.gameService.answers$?.pipe(
    map((answers) => {
      const currentWord = this.gameService.activeGame?.word;
      const trimmed = answers
        .filter((a) => a.word === currentWord)
        .map((a) => ({ ...a, answer: a.answer?.trim()?.toLocaleLowerCase() }));

      const grouped = groupArrayByProperty(trimmed, (t) => t.answer)
        .sort((a, b) => b.length - a.length)
        .map((g) => ({
          word: g[0].answer,
          answers: g.sort((a, b) => {
            if (a.user.id === this.gameService.userRef?.id) {
              return -1;
            }
            return 1;
          }),
        }));

      return grouped;
    }),
  );

  expand: Record<string, boolean> = {};

  isSameWord(a: string, b: string): boolean {
    return a?.trim()?.toLocaleLowerCase() === b?.trim()?.toLocaleLowerCase();
  }
}
