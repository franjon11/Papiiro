import { GeminiService } from "../services/gemini";

interface UseHandlerTextProps {
  ai: GeminiService;
}

export const useHandlerText = ({ ai }: UseHandlerTextProps) => {
  const handler = async (message: any) => {
    if (!message.text) return null;
    const text = message.text
    // Ignora comandos
    if (text.startsWith('/')) return null;
    return await ai.analizarTexto(text);
  }

  return { handler };
}