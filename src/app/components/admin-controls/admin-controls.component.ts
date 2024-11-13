import { Component, inject, Input } from '@angular/core';
import { GameService } from '../../services/game.service';
import { MatButtonModule } from '@angular/material/button';
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
import { Observable } from 'rxjs';
import { GameUser } from '../../models/user.model';
import { MatIconModule } from '@angular/material/icon';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';

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
  ],
  templateUrl: './admin-controls.component.html',
  styleUrl: './admin-controls.component.scss',
})
export class AdminControlsComponent {
  @Input() set id(gameId: string) {
    this.loadGame(gameId);
  }
  private gameService: GameService = inject(GameService);
  game$ = this.gameService.activeGame$;
  users$?: Observable<GameUser[]>;

  form = new FormGroup({
    word: new FormControl('', [Validators.required, Validators.minLength(1)]),
  });

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

  nextWord() {
    this.gameService.nextWord();
  }

  startGame() {
    this.gameService.startGame();
  }

  endGame() {
    this.gameService.endGame();
  }

  loadGame(gameId: string) {
    this.gameService.setActiveGame(gameId);
    this.game$ = this.gameService.activeGame$;
    this.users$ = this.gameService.userCollection$!;
  }
}
