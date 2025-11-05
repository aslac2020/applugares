import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PesquisaLugaresParam} from '../model/tipoDeCategoriasModel';


@Injectable({
  providedIn: 'root'
})
export class Apiservices {
  private baseUrl = "https://api.geoapify.com/v2/places";
  geoapifyApiKey = '31f3bc0744ce492195b612e694b61d8c';


  constructor(private http: HttpClient) { }


  localizarLugaresProximos(param: PesquisaLugaresParam) {
    console.log(param)
    const url = `https://api.geoapify.com/v2/places?categories=${param.categoria}&filter=circle:${param.lon},${param.lat},5000&apiKey=${this.geoapifyApiKey}`;
    return this.http.get<any>(url);
  }

}
