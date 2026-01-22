import { GeminiService } from "../services/gemini";
import { TelegramService } from "../services/telegram";

interface UseHandlerPhotoProps {
  telegram: TelegramService;
  ai: GeminiService;
}

export const useHandlerPhoto = ({ telegram, ai }: UseHandlerPhotoProps) => {
  const handler = async (message: any) => {
    if (!message.photo) return null;

    const caption = message.caption || "";

    const fileId = message.photo.pop().file_id;
    const imgUrl = await telegram.getImageUrl(fileId);
    const gasto = await ai.analizarTicket(imgUrl, caption);

    gasto.comprobante = imgUrl;

    return gasto
  }

  return { handler };
}
