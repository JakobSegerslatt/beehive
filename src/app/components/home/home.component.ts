import { Component } from '@angular/core';
import { CreateGameComponent } from '../create-game/create-game.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CreateGameComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
