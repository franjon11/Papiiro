import { AlertType, AnalysisType, GastoExtraido } from "../types";

const TemplateMsg: Record<AlertType, string> = {
  started: '🤖 Bot de Gastos Activo',
  defaultError: '❌ Ocurrió un error',
  analysisError: '❌ Error identificacion de gasto por:',
  success: '✅ Gasto registrado',
  analyzing: '🔍 Analizando gasto...',
  analyzed: '☑️ Gasto analizado'
}

interface ParamsLogMsg {
  type: AlertType
  error?: unknown
  gasto?: GastoExtraido
}

export const useMsgLogger = () => {
  const getGastoData = (gasto: GastoExtraido) => {
    return `\n\n
      ***
        - concepto: ${gasto.concepto}
        - usuario: ${gasto.user}
        - comercio: ${gasto.comercio}
        - monto: ${gasto.monto}
        - categoria: ${gasto.categoria.map(c => c.name).join(" | ")}
        - fecha: ${gasto.fecha}
      ***
    `
  }

  return {
    logMsg: ({ type, error, gasto }: ParamsLogMsg) => {
      const gastoMsg = gasto ? getGastoData(gasto) : "";
      const msg = `${TemplateMsg[type]}${gastoMsg}`;

      if (error) console.log(msg, error)
      else console.log(msg)
    }
  }
}