import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Rodape} from './shared/rodape/rodape';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Rodape],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('local-agent-app');
}
