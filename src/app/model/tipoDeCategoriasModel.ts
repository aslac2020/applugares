export class TipoDeCategoriasModel {
  nome!: string;
  icone!: string ;
  codigo!: string;
}

export class PesquisaLugaresParam {
  categoria?: string;
  lat?: number;
  lon?: number;
}
