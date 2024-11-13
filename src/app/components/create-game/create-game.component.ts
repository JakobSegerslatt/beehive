import { Component, inject, signal } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { GameService } from '../../services/game.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-game',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './create-game.component.html',
  styleUrl: './create-game.component.scss',
})
export class CreateGameComponent {
  private gameService = inject(GameService);
  private router = inject(Router);

  loading = signal(false);

  createGame() {
    this.loading.set(true);
    this.gameService.createGame().then((created) => {
      this.loading.set(false);
      this.router.navigate(['/admin', created.id]);
    });
  }
}
