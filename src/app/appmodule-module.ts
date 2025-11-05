import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Rodape} from './shared/rodape/rodape';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';

import {App} from './app';
import {Apiservices} from './services/apiservices';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    Rodape,
  ],
  providers: [],
  bootstrap: [],
})
export class AppmoduleModule { }
