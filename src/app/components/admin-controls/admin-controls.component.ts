import { Component, inject } from '@angular/core';
import { GameService } from '../../services/game.service';
import { MatButtonModule } from '@angular/material/button';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-controls',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './admin-controls.component.html',
  styleUrl: './admin-controls.component.scss',
})
export class AdminControlsComponent {
  private gameService: GameService = inject(GameService);
  game$ = this.gameService.activeGame$;

  gameForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });
  form = new FormGroup({
    word: new FormControl('', [Validators.required, Validators.minLength(1)]),
  });

  createGame() {
    if (this.gameForm.valid) {
      this.gameService.createGame(this.gameForm.value.name!);
      this.gameForm.reset();
    }
  }

  addWord() {
    if (this.form.valid) {
      this.gameService.addWord(this.form.value.word!);
      this.form.reset();
    }
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
}
