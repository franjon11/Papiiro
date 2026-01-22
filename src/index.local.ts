import { TelegramService } from './services/telegram';
import { GeminiService } from './services/gemini';
import { NotionService } from './services/notion';
import { ENV } from './config/env';
import { useHandlerPhoto } from './handlers/useHandlerPhoto';
import { useHandlerText } from './handlers/useHandlerText';
import { GastoExtraido } from './types';
import { useHandlerLogger } from './handlers/useHandlerLogger';
import { useHandlerAnalysis } from './handlers/useHandlerAnalysis';

// Instancias
const telegram = new TelegramService(ENV.TELEGRAM_TOKEN);
const ai = new GeminiService(ENV.GEMINI_API_KEY);
const db = new NotionService(ENV.NOTION_TOKEN, ENV.NOTION_DATABASE_ID);

const { handler: handlerPhoto } = useHandlerPhoto({ telegram, ai });
const { handler: handlerText } = useHandlerText({ ai });
const { handlerShowError, handlerShowInfo, handlerShowSuccess } = useHandlerLogger({ telegram })
const { getTypeOfAnalysis } = useHandlerAnalysis()

async function run() {
  let offset = 0;

  await handlerShowInfo({ type: "started" })

  while (true) {
    let chatId;
    try {
      const updates = await telegram.getUpdates(offset + 1);

      for (const update of updates) {
        offset = update.update_id;
        
        chatId = update.message.chat.id;
        const user = update.message.from.first_name;

        const typeAnalysis = getTypeOfAnalysis(update.message);
        await handlerShowInfo({ type: "analyzing", chatId })

        // ANALISIS Y EXTRACCION
        let gasto: GastoExtraido | null = null;
        if (typeAnalysis === "photo") {
          gasto = await handlerPhoto(update.message)
        } else if (typeAnalysis === "text") {
          gasto = await handlerText(update.message)
        }

        if (!gasto) {
          await handlerShowError({ type: "analysisError", error: typeAnalysis, chatId })
          continue;
        }
        gasto.user = user;
        await handlerShowInfo({ type: "analyzed", gasto })

        // GUARDADO EN NOTION
        await db.guardarGasto(gasto);

        await handlerShowSuccess({ type: "success", chatId, gasto })
      }
    } catch (err) {
      await handlerShowError({ type: "defaultError", error: err, chatId })
    }
  }
}

run();