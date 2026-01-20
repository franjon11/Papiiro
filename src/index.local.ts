import { TelegramService } from './services/telegram';
import { GeminiService } from './services/gemini';
import { NotionService } from './services/notion';
import { ENV } from './config/env';

// Instancias
const telegram = new TelegramService(ENV.TELEGRAM_TOKEN);
const ai = new GeminiService(ENV.GEMINI_API_KEY);
const db = new NotionService(ENV.NOTION_TOKEN, ENV.NOTION_DATABASE_ID);

async function run() {
  let offset = 0;
  console.log("🤖 Bot de Gastos Activo");

  while (true) {
    let chatId;
    try {
      const updates = await telegram.getUpdates(offset + 1);

      for (const update of updates) {
        offset = update.update_id;
        if (!update.message?.photo) continue;

        chatId = update.message.chat.id;
        const user = update.message.from.first_name;

        const msjInit = "🔍 Analizando comprobante..."
        console.log(msjInit);
        await telegram.enviarMensaje(chatId, msjInit);

        // Flujo de trabajo usando las instancias
        const descripcion = update.message.caption || "";
        const file = update.message.photo.pop();
        const imgUrl = await telegram.getImageUrl(file.file_id);
        const gasto = await ai.analizarTicket(imgUrl, descripcion);
        console.log(`🔍 Ticket analizado: 
          ***
            - concepto: ${gasto.concepto}
            - comercio: ${gasto.comercio}
            - monto: ${gasto.monto}
            - categoria: ${gasto.categoria}
            - fecha: ${gasto.fecha}
          ***
        `)
        await db.guardarGasto(gasto, user);

        console.log(`🔍 Gasto registrado: 
          ***
            - concepto: ${gasto.concepto}
            - usuario: ${user}
            - comercio: ${gasto.comercio}
            - monto: ${gasto.monto}
            - categoria: ${gasto.categoria}
            - fecha: ${gasto.fecha}
          ***
        `)
        await telegram.enviarMensaje(chatId, `✅ Guardado: *${gasto.comercio}* por *$${gasto.monto}*`);
      }
    } catch (err) {
      console.log("❌ Ocurrió un error: ", err);
      await telegram.enviarMensaje(chatId, `❌ Ocurrió un error: pruebe en unos instantes o contactese con los administradores`);
    }
  }
}

run();