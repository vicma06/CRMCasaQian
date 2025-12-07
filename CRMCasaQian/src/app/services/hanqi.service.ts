import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class HanQiService {
  // TODO: Reemplazar con tu API Key real o usar environment variables
  private apiKey = 'AIzaSyCUiCLQmHP4MMjyVWsLYzmWckHeeetcO9g'; 
  // Usamos el modelo nativo de audio para HanQiAI
  private modelName = 'gemini-2.5-flash-preview-09-2025'; // Corregido a un modelo válido conocido con capacidades multimodales
  private apiUrl = `AIzaSyCUiCLQmHP4MMjyVWsLYzmWckHeeetcO9g`;

  constructor(private http: HttpClient) { }

  generateResponseFromAudio(audioBase64: string, mimeType: string, menuContext: Producto[], history: {text: string, sender: string}[] = []): Observable<string> {
    const url = `${this.apiUrl}?key=${this.apiKey}`;

    // Construir el contexto del sistema con el menú actual
    let menuDescription = '';
    if (!menuContext || menuContext.length === 0) {
      menuDescription = 'ACTUALMENTE NO HAY PLATOS DISPONIBLES EN EL MENÚ.';
    } else {
      menuDescription = menuContext.map(p => {
        const estado = p.disponible ? '✅ Disponible' : '❌ AGOTADO';
        return `[ID: ${p.id}] - ${p.nombre} (${p.categoria}) | ${p.precio}€ | ${estado}`;
      }).join('\n');
    }

    const systemPrompt = `
      Eres "HanQiAI", el asistente de voz avanzado de "Casa Qian".
      Tu tono es muy natural, fluido y conversacional, aprovechando tus capacidades de audio nativo.
      
      MENÚ ACTUAL:
      ${menuDescription}

      Instrucciones:
      1. Responde al audio del usuario de forma concisa y natural.
      2. Si piden reservar, extrae la información.
      3. Usa el mismo formato de JSON para reservas si aplica: [RESERVA: {...}].
      4. NO menciones los IDs de los productos en tu respuesta hablada/texto.
      5. Si te preguntan quién eres, di que eres HanQiAI, la inteligencia artificial de voz de Casa Qian.
    `;

    const contents: any[] = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Añadir el audio actual
    contents.push({
      role: 'user',
      parts: [{
        inlineData: {
          mimeType: mimeType,
          data: audioBase64
        }
      }]
    });

    const body = {
      system_instruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    };

    return this.http.post<any>(url, body).pipe(
      map(response => {
        if (response.candidates && response.candidates.length > 0) {
          return response.candidates[0].content.parts[0].text;
        }
        return 'No he podido entender el audio.';
      }),
      catchError(error => {
        console.error('Error en HanQiAI Audio:', error);
        return throwError(() => error);
      })
    );
  }
}
