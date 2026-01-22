# 🤖 Bot de Control de Gastos (Telegram + Gemini 3.0 + Notion)

Este es un bot inteligente de Telegram diseñado para automatizar el registro de gastos personales. Solo envía una foto de tu ticket o comprobante, y la IA se encargará de extraer los datos y guardarlos organizadamente en una base de datos de Notion privada para despues analizar los gastos en dicha herramienta.

## 🚀 Características

* **IA:** Utiliza **Gemini 2.5 Flash** para realizar OCR (reconocimiento de texto) y análisis de contexto.
* **Multimodal:** Capaz de entender tanto la imagen del ticket como los comentarios adicionales del usuario.
* **Notion Sync:** Clasificación automática por categorías, comercios, montos y fechas directamente en tu workspace.
* **Serverless:** Optimizado para correr 24/7 en **Vercel** mediante Webhooks.
* **Arquitectura Limpia:** Construido con TypeScript utilizando Clases y hooks para una fácil mantenibilidad.

## 🛠️ Requisitos Previos

1.  **Telegram Bot:** Crea uno con [@BotFather](https://t.me/botfather) y te da tu `TOKEN`.
2.  **Google AI Studio:** Crear una API Key para los modelos Gemini en [aistudio.google.com](https://aistudio.google.com/).
3.  **Notion Integración:** Crea una integración en [notion.so/my-integrations](https://www.notion.so/my-integrations).
    * Crea una base de datos con las columnas: `Concepto` (Title), `Comercio` (RichText), `Monto` (Number), `Categoria` (MultiSelect), `Usuario` (Select), `Fecha` (Date) y `Comprobante` (Files&Media).
    * Conecta la integración a tu base de datos (Add Connection).

## ⚙️ Configuración del Entorno

Crea un archivo `.env` en la raiz con las siguientes variables de entorno:
```env
TELEGRAM_TOKEN=tu_token_de_telegram
GEMINI_API_KEY=tu_api_key_de_google
NOTION_TOKEN=tu_token_de_notion
NOTION_DATABASE_ID=tu_id_de_la_base_de_datos
```
