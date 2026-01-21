import { Client } from "@notionhq/client";
import { GastoExtraido } from "../types";

export class NotionService {
  private client: Client;
  private databaseId: string;

  constructor(token: string, databaseId: string) {
    this.client = new Client({ auth: token });
    this.databaseId = databaseId;
  }

  async guardarGasto(gasto: GastoExtraido, usuario: string, imgUrl: string) {
    return await this.client.pages.create({
      parent: { database_id: this.databaseId },
      properties: {
        "Concepto": { title: [{ text: { content: gasto.concepto } }] },
        "Comercio": { rich_text: [{ text: { content: gasto.comercio } }] },
        "Monto": { number: gasto.monto },
        "Categoria": { multi_select: gasto.categoria },
        "Fecha": { date: { start: gasto.fecha }},
        "Usuario": { select: { name: usuario } },
        "Comprobante": {
          files: [
            {
              name: "Ticket",
              type: "external",
              external: {
                url: imgUrl
              }
            }
          ]
        }
      }
    });
  }
}