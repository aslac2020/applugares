import {Component, OnInit} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {Router} from '@angular/router';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './splash.html',
  styleUrl: './splash.scss',
})
export class Splash implements OnInit {

  constructor(private router: Router)
  {
  }


    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }


    avancar(){
      this.router.navigate(['/home']);
    }

}
