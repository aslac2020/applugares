import {Component, OnInit} from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {NgForOf} from '@angular/common';
import {Rodape} from '../../shared/rodape/rodape';
import {Router} from '@angular/router';
import {ServicosCompartilhados} from '../../services/servicos-compartilhados';

export const TipoDeCategoriasModel = [
  { nome: 'Restaurantes', icone: 'logorestaurante.png', codigo: 'catering.restaurant' },
  { nome: 'Cafés', icone: 'logocafe.png', codigo: 'catering.cafe' },
  { nome: 'Parques', icone: 'logoparque.png', codigo: 'leisure.park' },
  { nome: 'Salões de beleza', icone: 'logosalao.png', codigo: 'beauty.hairdresser' }
]


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatToolbar,
    MatCardModule,
    NgForOf,
    Rodape,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit {

  listaCategorias = TipoDeCategoriasModel;

  constructor(
    private router: Router,
    private categoriaService: ServicosCompartilhados
  ) {}

  ngOnInit(): void {
  }

  aoClicarCard(codigo: any){
    this.categoriaService.setCategoria(codigo);
    this.router.navigate(['/localizar']);
  }

}
