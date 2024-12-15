import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BehaviorSubject, take, timer } from 'rxjs';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss',
})
export class ProgressBarComponent {
  /** amount of time to load */
  @Input() time: number = 3000;

  /** Percentage of the progressbar, 0-100 */
  timer$ = new BehaviorSubject(0);

  ngOnInit() {
    this.startTimer(this.time);
  }

  startTimer(ms: number) {
    this.timer$.next(0);

    const two_percent = ms / 50;

    const timeSub = timer(0, two_percent).subscribe(() => {
      this.timer$.next(this.timer$.value + 2);
      if (this.timer$.value >= ms) {
        timeSub.unsubscribe();
      }
    });
  }
}
