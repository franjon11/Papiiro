export class TelegramService {
  private baseUrl: string;

  constructor(token: string) {
    this.baseUrl = `https://api.telegram.org/bot${token}`;
  }

  async getUpdates(offset: number) {
    const res = await fetch(`${this.baseUrl}/getUpdates?offset=${offset}&timeout=30`);
    const data: any = await res.json();
    return data.result || [];
  }

  async getImageUrl(fileId: string): Promise<string> {
    const res = await fetch(`${this.baseUrl}/getFile?file_id=${fileId}`);
    const data: any = await res.json();
    return `https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN}/${data.result.file_path}`;
  }

  async enviarMensaje(chatId: number, texto: string) {
    await fetch(`${this.baseUrl}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: texto, parse_mode: 'Markdown' })
    });
  }
}