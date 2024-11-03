import { Component, inject } from '@angular/core';
import { GameService } from '../services/game.service';
import { map, Observable } from 'rxjs';
import { GameUser } from '../models/user.model';
import { groupArrayByProperty } from 'papilion';
import uniqBy from 'lodash-es/uniqBy';
import { Answer } from '../models/game.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-final-score',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './final-score.component.html',
  styleUrl: './final-score.component.scss',
})
export class FinalScoreComponent {
  public gameService: GameService = inject(GameService);

  user$ = this.gameService.user$;

  // Grab all answers
  score$: Observable<Array<GameUser>> = this.gameService.answers$!.pipe(
    map((answers) => {
      // Grab by users and isolate these
      const users: Array<GameUser> = uniqBy(
        answers.map((a) => a.user),
        (u) => u.id,
      );
      console.log(users);

      // Group answers by word
      const words: Array<string> = uniqBy(answers, (a: Answer) => a.word).map(
        (w: Answer) => w.word,
      );

      words.forEach((word) => {
        const answersForWord = answers.filter((a) =>
          this.isSameWord(a.word, word),
        );

        // For each word, group by answer
        const grouped = groupArrayByProperty(answersForWord, (a) => a.answer)
          .sort((a, b) => b.length - a.length)
          .map((g) => ({
            word,
            answers: g.sort((a, b) => {
              if (a.user.id === this.gameService.userRef?.id) {
                return -1;
              }
              return 1;
            }),
          }));
        // For each answer, add a score to the user if the answer is most popular
        const highestScore = grouped[0].answers.length;

        grouped
          .filter((g) => g.answers.length === highestScore)
          .forEach((group) => {
            group.answers.forEach((answer) => {
              const user = users.find((u) => u.id === answer.user.id);
              if (user) {
                user.score = user.score || 0;
                user.score += 1;
              }
            });
          });
      });

      // Return users and scores
      return users.sort((a, b) => (b.score || 0) - (a.score || 0));
    }),
  );

  isSameWord(a: string, b: string): boolean {
    return a?.trim()?.toLocaleLowerCase() === b?.trim()?.toLocaleLowerCase();
  }
}
