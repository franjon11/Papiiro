import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { GastoExtraido } from "../types/";

export class GeminiService {
  private model: GenerativeModel;

  constructor(apiKey: string) {
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }

  async analizarTicket(imageUrl: string, descripcionImg: string): Promise<GastoExtraido> {
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    
    const prompt = `Analiza la imagen de este comprobante de pago. CONTEXTO ADICIONAL DEL USUARIO: "${descripcionImg}"
      Extrae los datos en este formato JSON exacto, sin texto adicional:
      {
        "concepto": "Poner tal cual el contexto del usuario, si no tiene nada inventarlo de acuerdo a lo que puede llegar a ser",
        "comercio": "Nombre del lugar",
        "monto": 1234.56,
        "categoria": [
          { name: "Comida/Transporte/Hogar/Viajes/Ocio/Varios" }
        ],
        "fecha": "YYYY-MM-DD"
      }
      Si no ves la fecha, usa la de hoy.
      Si no ves el comercio, pon 'Desconocido'.
      La propiedad "categoria" puede tener muchas categorias.
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

  async analizarTexto(textoUsuario: string): Promise<GastoExtraido | null> {
    const prompt = `Analiza el siguiente mensaje sobre un gasto: "${textoUsuario}".

    Extrae: comercio, monto, categoria y fecha.

    REGLAS CRÍTICAS:
    1. Si el mensaje NO contiene un monto numérico o un precio, responde exactamente: "ERROR: NO_AMOUNT".
    2. Si no menciona el comercio, pone de acuerdo al rubro del gasto (ej: "Cafe" -> "Cafetería").
    3. Si no menciona categoría, asígnale una lógica (ej: "Cafe" -> "Comida"). Puede ser de varias categorias
    4. La fecha debe ser la del día de hoy (a menos que el mensaje diga otra cosa).
    5. El concepto debe ser interpretado de acuerdo al contexto del mensaje.

    Responde estrictamente en JSON:
    {
      "concepto": string,
      "comercio": string,
      "monto": number,
      "categoria": [
        { name: "Comida/Transporte/Hogar/Viajes/Ocio/Varios" }
      ],
      "fecha": "YYYY-MM-DD"
    }`;

    const result = await this.model.generateContent(prompt);
    const responseText = result.response.text().trim();

    if (responseText.includes("ERROR: NO_AMOUNT")) {
      return null;
    }

    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  }
}