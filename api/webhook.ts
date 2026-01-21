import { TelegramService } from '../src/services/telegram';
import { GeminiService } from '../src/services/gemini';
import { NotionService } from '../src/services/notion';
import { ENV } from '../src/config/env';

const telegram = new TelegramService(ENV.TELEGRAM_TOKEN);
const ai = new GeminiService(ENV.GEMINI_API_KEY);
const db = new NotionService(ENV.NOTION_TOKEN, ENV.NOTION_DATABASE_ID);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  let chatId = null
  try {
    const update = req.body;

    // Solo procesamos si hay una foto
    if (update.message?.photo) {
      chatId = update.message.chat.id;

      const msjInit = "🔍 Analizando comprobante..."
      console.log(msjInit);
      await telegram.enviarMensaje(chatId, msjInit);

      const user = update.message.from.first_name;
      const caption = update.message.caption || "";

      const fileId = update.message.photo.pop().file_id;
      const imgUrl = await telegram.getImageUrl(fileId);
      const gasto = await ai.analizarTicket(imgUrl, caption);

      console.log(`🔍 Ticket analizado: 
          ***
            - concepto: ${gasto.concepto}
            - comercio: ${gasto.comercio}
            - monto: ${gasto.monto}
            - categoria: ${gasto.categoria.map(c => c.name).join(" | ")}
            - fecha: ${gasto.fecha}
          ***
        `)

      await db.guardarGasto(gasto, user, imgUrl);

      console.log(`✅ Gasto registrado: 
          ***
            - concepto: ${gasto.concepto}
            - usuario: ${user}
            - comercio: ${gasto.comercio}
            - monto: ${gasto.monto}
            - categoria: ${gasto.categoria.map(c => c.name).join(" | ")}
            - fecha: ${gasto.fecha}
          ***
        `)
      await telegram.enviarMensaje(chatId, `✅ Registrado: ${gasto.comercio} ($${gasto.monto})`);
    }

    return res.status(200).send('OK');
  } catch (error) {
    console.error('❌ Error en Webhook: ', error);
    if (chatId) {
      await telegram.enviarMensaje(chatId, `❌ Ocurrió un error: pruebe en unos instantes o contactese con los administradores`);
    }
    return res.status(200).send('Error procesado');
  }
}