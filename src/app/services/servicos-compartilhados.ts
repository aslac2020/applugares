import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicosCompartilhados {
  private categoria$ = new BehaviorSubject<string>('');

  setCategoria(codigo: string) {
    this.categoria$.next(codigo);
  }

  getCategoria(): Observable<string> {
    return this.categoria$.asObservable();
  }

  getCategoriaAtual(): string {
    return this.categoria$.value;
  }

}
