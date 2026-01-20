import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN || '',
  NOTION_TOKEN: process.env.NOTION_TOKEN || '',
  NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
};

// Validación simple
if (!ENV.TELEGRAM_TOKEN || !ENV.GEMINI_API_KEY || !ENV.NOTION_TOKEN || !ENV.NOTION_DATABASE_ID) {
  throw new Error("Faltan variables de entorno críticas en el archivo .env");
}