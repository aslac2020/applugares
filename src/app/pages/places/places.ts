import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {HomeComponent} from '../home/home';
import {ServicosCompartilhados} from '../../services/servicos-compartilhados';
import {Rodape} from '../../shared/rodape/rodape';
import {MatCard, MatCardTitle} from '@angular/material/card';
import {MatToolbar} from '@angular/material/toolbar';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-places',
  imports: [
    Rodape,
    MatCard,
    MatCardTitle,
    MatToolbar,
    NgForOf
  ],
  templateUrl: './places.html',
  styleUrl: './places.scss',
  standalone: true
})
export class Places implements OnInit, AfterViewInit {
  categoriaSelecionada!: string;

  constructor(private categoriaService: ServicosCompartilhados) {
  }

  ngOnInit() {
    this.categoriaService.getCategoria().subscribe(categoria => {
      this.categoriaSelecionada = categoria;
      console.log('Categoria recebida via serviço:', categoria);
    });
  }

  ngAfterViewInit() {
  }


}
