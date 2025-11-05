import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {HomeComponent} from '../home/home';
import {ServicosCompartilhados} from '../../services/servicos-compartilhados';
import {Rodape} from '../../shared/rodape/rodape';
import {MatCard, MatCardTitle} from '@angular/material/card';
import {MatToolbar} from '@angular/material/toolbar';
import {CommonModule, NgForOf} from '@angular/common';
import {PesquisaLugaresParam, TipoDeCategoriasModel} from '../../model/tipoDeCategoriasModel';
import {TipoDeCategorias} from '../../enums/tiposDeCategoria.enum';
import {Subscription} from 'rxjs';
import {Apiservices} from '../../services/apiservices';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {MatIconModule} from '@angular/material/icon';
import * as maplibregl from 'maplibre-gl';


@Component({
  selector: 'app-places',
  imports: [
    Rodape,
    MatCard,
    MatCardTitle,
    MatToolbar,
    MatIconModule,
    CommonModule,
    HttpClientModule,
    NgForOf
  ],
  templateUrl: './places.html',
  styleUrls: ['./places.scss'],
  standalone: true,
  providers: [Apiservices]
})
export class Places implements OnInit, AfterViewInit {
  private readonly GEOAPIFY_API_KEY = '31f3bc0744ce492195b612e694b61d8c';
  private map!: maplibregl.Map;
  private userMarker?: maplibregl.Marker;
  private markers: maplibregl.Marker[] = [];
  private coordenadas = { lat: 0, lon: 0 };
  private subscriptions = new Subscription();
  userCoords!: [number, number];

  tituloCategoria!: string;
  codigoCategoria!: string;

  constructor(
    private categoriaService: ServicosCompartilhados,
    private apiService: Apiservices
  ) {}

  ngOnInit() {
    this.trazerCategorias();
  }

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private initMap() {
    navigator.geolocation.getCurrentPosition((pos) => {
      this.userCoords = [pos.coords.longitude, pos.coords.latitude];

      this.map = new maplibregl.Map({
        container: 'map',
        style: `https://maps.geoapify.com/v1/styles/osm-bright/style.json?apiKey=${this.GEOAPIFY_API_KEY}`,
        center: this.userCoords,
        zoom: 15
      });

      this.map.addControl(new maplibregl.NavigationControl());

      // Atualiza posição do marcador pulsante
      const pulse = document.getElementById('user-location');
      this.atualizarPosicaoMarker(pulse!, this.userCoords);
      this.map.on('move', () => {
        this.atualizarPosicaoMarker(pulse!, this.userCoords);
      });
    });
  }

  private atualizarPosicaoMarker(element: HTMLElement, coords: [number, number]) {
    if (!this.map) return;
    const pixel = this.map.project(coords);
    element.style.left = `${pixel.x}px`;
    element.style.top = `${pixel.y}px`;
  }


  buscarLugares() {
    if (!this.userCoords || !this.codigoCategoria) return;
    const [lon, lat] = this.userCoords;

    this.apiService.localizarLugaresProximos({
      lat: lat,
      lon: lon,
      categoria: this.codigoCategoria
    }).subscribe((res: any) => {
      console.log(res);
      res.features.forEach((place: any) => {
        const [lon, lat] = place.geometry.coordinates;
        const name = place.properties.name || 'Lugar próximo';
        const endereco = place.properties.address_line2 || '';

        new maplibregl.Marker({ color: '#64dfdf' })
          .setLngLat([lon, lat])
          .setPopup(
            new maplibregl.Popup().setHTML(`
              <b>${name}</b><br>${endereco}<br><br>
              <button style="background:#5e60ce;color:white;border:none;border-radius:8px;padding:6px 10px;cursor:pointer"
                onclick="window.open('https://www.waze.com/ul?ll=${lat},${lon}&navigate=yes', '_blank')">
                Abrir no Waze
              </button>
            `)
          )
          .addTo(this.map);
      });
    });
  }

  private trazerCategorias() {
    this.categoriaService.getCategoria().subscribe(categoria => {
      this.dadosTelaDinamico(categoria);
    });
  }

  private dadosTelaDinamico(categoria: TipoDeCategoriasModel) {
    switch (categoria.codigo) {
      case TipoDeCategorias.CAFES:
        this.tituloCategoria = 'Cafés';
        this.codigoCategoria = TipoDeCategorias.CAFES;
        break;
      case TipoDeCategorias.RESTAURANTES:
        this.tituloCategoria = 'Restaurantes';
        this.codigoCategoria = TipoDeCategorias.RESTAURANTES;
        break;
      case TipoDeCategorias.PARQUES:
        this.tituloCategoria = 'Parques';
        this.codigoCategoria = TipoDeCategorias.PARQUES;
        break;
      default:
        this.tituloCategoria = 'Salões de Beleza';
        this.codigoCategoria = TipoDeCategorias.SALOESBELEZA;
        break;
    }
  }

}
