interface Category {
  id: string
  name?: string
}

export interface GastoExtraido {
  user: string;
  concepto: string;
  comercio: string;
  monto: number;
  categoria: Category[];
  fecha: string;
  comprobante?: string;
}

export type AnalysisType = "photo" | "text"

export type AlertErrorType = "defaultError" | "analysisError"
export type AlertSuccessType = "success"
export type AlertInfoType = "started" | "analyzing" | "analyzed"
export type AlertType = AlertInfoType | AlertErrorType | AlertSuccessType