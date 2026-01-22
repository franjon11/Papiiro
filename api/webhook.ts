import { TelegramService } from '../src/services/telegram';
import { GeminiService } from '../src/services/gemini';
import { NotionService } from '../src/services/notion';
import { ENV } from '../src/config/env';
import { GastoExtraido } from '../src/types';
import { useHandlerPhoto } from '../src/handlers/useHandlerPhoto';
import { useHandlerText } from '../src/handlers/useHandlerText';
import { useHandlerAnalysis } from '../src/handlers/useHandlerAnalysis';
import { useHandlerLogger } from '../src/handlers/useHandlerLogger';

const telegram = new TelegramService(ENV.TELEGRAM_TOKEN);
const ai = new GeminiService(ENV.GEMINI_API_KEY);
const db = new NotionService(ENV.NOTION_TOKEN, ENV.NOTION_DATABASE_ID);

const { handler: handlerPhoto } = useHandlerPhoto({ telegram, ai });
const { handler: handlerText } = useHandlerText({ ai });
const { handlerShowError, handlerShowInfo, handlerShowSuccess } = useHandlerLogger({ telegram })
const { getTypeOfAnalysis } = useHandlerAnalysis()

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  let chatId = null
  try {
    const update = req.body;
    if (!update.message || !update.message.chat || !update.message.from) throw new Error("No message");

    chatId = update.message.chat.id;
    const user = update.message.from.first_name;

    const typeAnalysis = getTypeOfAnalysis(update.message)

    await handlerShowInfo({ type: "analyzing", chatId })
    
    // ANALISIS Y EXTRACCION
    let gasto: GastoExtraido | null = null;
    if (typeAnalysis === "photo") {
      gasto = await handlerPhoto(update.message);
    } else if (typeAnalysis === "text") {
      gasto = await handlerText(update.message);
    }

    if (!gasto) {
      await handlerShowError({ type: "analysisError", error: typeAnalysis, chatId })
      return res.status(200).send(`Error al analizar el mensaje de tipo: ${typeAnalysis}`);
    }
    gasto.user = user
    await handlerShowInfo({ type: "analyzed", gasto })

    // GUARDADO EN NOTION
    await db.guardarGasto(gasto);

    await handlerShowSuccess({ type: "success", chatId, gasto })

    return res.status(200).send('OK');
  } catch (error) {
    await handlerShowError({ type: "defaultError", error, chatId })
    
    // Se responde 200 y no 500 porque sino queda loopeado (se podria hacer con reintentos + adelante)
    return res.status(200).send('Error procesado');
  }
}