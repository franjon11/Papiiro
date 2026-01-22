import { TelegramService } from "../services/telegram";
import { AlertType, GastoExtraido } from "../types";

const TemplateMsg: Record<AlertType, string> = {
  started: '🤖 Bot de Gastos Activo',
  defaultError: '❌ **Error:** pruebe en unos instantes o contactese con los administradores',
  analysisError: '❌ **Error:** no se pudo identificar el gasto',
  analyzing: '🔍 **Analizando gasto...**',
  success: '✅ **Registrado**',
  analyzed: '☑️ **Gasto analizado**',
}

interface ParamsShowMsg {
  chatId: number
  type: AlertType
  gasto?: GastoExtraido
}

export const useMsgAlerts = (telegram: TelegramService) => {
  const getGastoData = (gasto: GastoExtraido) => {
    return `
    🏪 **Comercio:** ${gasto.comercio}
    💰 **Monto:** $${gasto.monto}
    📂 **Categoría:** ${gasto.categoria.map(c => c.name).join(" | ")}`
  }

  return {
    showMsg: async ({ chatId, type, gasto }: ParamsShowMsg) => {
      if (!chatId) return;
      const gastoMsg = gasto ? getGastoData(gasto) : "";
      await telegram.enviarMensaje(chatId, `${TemplateMsg[type]}${gastoMsg}`);
    }
  }
}