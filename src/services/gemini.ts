import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { GastoExtraido } from "../types/";

export class GeminiService {
  private model: GenerativeModel;

  constructor(apiKey: string) {
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
  }

  async analizarTicket(imageUrl: string, descripcionImg: string): Promise<GastoExtraido> {
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    
    const prompt = `Analiza la imagen de este comprobante de pago. CONTEXTO ADICIONAL DEL USUARIO: "${descripcionImg}"
      Extrae los datos en este formato JSON exacto, sin texto adicional:
      {
        "concepto": "Poner tal cual el contexto del usuario o parafrasearlo, si no tiene nada inventarlo de acuerdo a lo que puede llegar a ser"
        "comercio": "Nombre del lugar",
        "monto": 1234.56,
        "categoria": "Comida/Transporte/Hogar/Viajes/Ocio/Varios",
        "fecha": "YYYY-MM-DD"
      }
      Si no ves la fecha, usa la de hoy. Si no ves el comercio, pon 'Desconocido'.
    `;

    const result = await this.model.generateContent([
      prompt,
      {
        inlineData:{
          data: Buffer.from(buffer).toString("base64"),
          mimeType: "image/jpeg"
        }
      }
    ]);

    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  }
}