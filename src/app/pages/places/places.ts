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
import {latLng, Marker, tileLayer} from 'leaflet';
import * as L from 'leaflet';
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
  private map!: maplibregl.Map;
  private userMarker?: maplibregl.Marker;
  private markers: maplibregl.Marker[] = [];
  private coordenadas = { lat: 0, lon: 0 };
  private subscriptions = new Subscription();

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
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.coordenadas = { lat: pos.coords.latitude, lon: pos.coords.longitude };

        this.map = new maplibregl.Map({
          container: 'map',
          style: `https://maps.geoapify.com/v1/styles/osm-bright/style.json?apiKey=31f3bc0744ce492195b612e694b61d8c`,
          center: [this.coordenadas.lon, this.coordenadas.lat],
          zoom: 14
        });

        new maplibregl.Marker({ color: '#2A9D8F' })
          .setLngLat([this.coordenadas.lon, this.coordenadas.lat])
          .setPopup(new maplibregl.Popup().setText('Você está aqui 😄'))
          .addTo(this.map);
      },
      (err) => {
        console.error('Erro ao pegar localização:', err);
      },
      { enableHighAccuracy: true }
    );
  }

   pegarLocalizacaoUsuario() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.coordenadas = { lat: latitude, lon: longitude };

          this.map.setCenter([longitude, latitude]);
          this.map.setZoom(15);

          this.userMarker = new maplibregl.Marker({ color: '#0078ff' })
            .setLngLat([longitude, latitude])
            .setPopup(new maplibregl.Popup().setHTML('<b>Você está aqui 😄</b>'))
            .addTo(this.map);
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          this.map.setCenter([-46.6333, -23.5505]); // São Paulo
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  }

  buscarLugares() {
    const { lat, lon } = this.coordenadas;
    if (!lat || !this.codigoCategoria) return;

    this.apiService.localizarLugaresProximos({
      lat: lat,
      lon: lon,
      categoria: this.codigoCategoria
    }).subscribe((res: any) => {
      res.features.forEach((place: any) => {
        const [lng, lat] = place.geometry.coordinates;
        const name = place.properties.name || 'Lugar próximo';

        const popupHTML = `
          <div style="text-align:center">
            <strong>${name}</strong><br>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank">Google Maps</a> |
            <a href="https://waze.com/ul?ll=${lat},${lng}&navigate=yes" target="_blank">Waze</a>
          </div>
        `;

        new maplibregl.Marker({ color: '#FF6F61' })
          .setLngLat([lng, lat])
          .setPopup(new maplibregl.Popup().setHTML(popupHTML))
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
