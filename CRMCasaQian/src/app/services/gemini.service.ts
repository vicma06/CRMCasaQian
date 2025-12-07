import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  // TODO: Reemplazar con tu API Key real o usar environment variables
  private apiKey = 'AIzaSyCUiCLQmHP4MMjyVWsLYzmWckHeeetcO9g'; 
  // Usamos el modelo estándar gemini-pro que suele dar menos problemas de 404
  private modelName = 'gemini-2.5-flash-preview-09-2025';
  private apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent`;

  constructor(private http: HttpClient) { }

  generateResponse(userMessage: string, menuContext: Producto[], history: {text: string, sender: string}[] = []): Observable<string> {
    const url = `${this.apiUrl}?key=${this.apiKey}`;

    // Construir el contexto del sistema con el menú actual
    let menuDescription = '';
    if (!menuContext || menuContext.length === 0) {
      menuDescription = 'ACTUALMENTE NO HAY PLATOS DISPONIBLES EN EL MENÚ. INFORMA AL CLIENTE DE QUE LA CARTA ESTÁ VACÍA.';
    } else {
      menuDescription = menuContext.map(p => {
        const estado = p.disponible ? '✅ Disponible' : '❌ AGOTADO';
        const picante = p.picante ? '🌶️ Picante' : '';
        const alergenos = p.alergenos && p.alergenos.length > 0 ? `⚠️ Alérgenos: ${p.alergenos.join(', ')}` : 'Sin alérgenos declarados';
        
        return `[ID: ${p.id}] - ${p.nombre} (${p.categoria}) | ${p.precio}€ | ${estado} | ${picante} | ${alergenos} | Desc: ${p.descripcion || 'N/A'}`;
      }).join('\n');
    }

    const systemPrompt = `
      Eres el asistente virtual inteligente del restaurante "Casa Qian".
      Tu tono es amable, servicial y respetuoso, con un toque de hospitalidad china.
      
      IMPORTANTE: Tienes acceso en tiempo real a la base de datos de productos.
      Aquí tienes el menú EXACTO y ACTUALIZADO del restaurante:
      ------------------------------------------------------------
      ${menuDescription}
      ------------------------------------------------------------

      Horarios:
      - Lunes a Domingo: 12:00 - 16:00 (Comida) y 20:00 - 00:00 (Cena).
      
      Instrucciones ESTRICTAS (Anti-Alucinaciones):
      1. **SOLO** recomienda platos que aparezcan en la lista de arriba. Si un plato no está en la lista, NO EXISTE.
      2. **Disponibilidad:** Antes de recomendar, verifica si dice "✅ Disponible". Si dice "❌ AGOTADO", NO lo recomiendes para pedir ahora, pero puedes mencionarlo como opción futura.
      3. **Alérgenos:** Lee los alérgenos listados. Si el cliente tiene alergia, filtra estrictamente.
      4. **Precios:** Usa los precios exactos de la lista.
      5. **Estilo:** Sé EXTREMADAMENTE conciso. Respuestas cortas y directas. Usa emojis ✨.
      6. **FORMATO DE RECOMENDACIÓN:** Si recomiendas platos específicos, AL FINAL de tu respuesta, añade una lista con sus IDs en este formato exacto: [RECOMENDACION_IDS: 1, 5, 10].
      7. **IMPORTANTE:** NO menciones nunca los IDs numéricos de los productos en el texto de tu respuesta. Solo úsalos para la lista oculta al final.
      8. **CONTEXTO:** Mantén el hilo de la conversación. No te presentes de nuevo si ya lo has hecho.
      9. **RESERVAS:** Si el usuario quiere reservar, PIDE: Fecha (YYYY-MM-DD), Hora (HH:mm) y Nº Personas.
         - Si tienes TODOS los datos, genera AL FINAL este JSON exacto: [RESERVA: {"fecha": "2024-01-01", "hora": "14:00", "personas": 2}].
         - IMPORTANTE: No uses bloques de código markdown para el JSON. Ponlo como texto plano al final.
         - Si faltan datos, pídelos amablemente.
    `;

    // Convertir historial de chat al formato de Gemini
    const contents = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Añadir el mensaje actual del usuario
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const body = {
      system_instruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: contents,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    return this.http.post<any>(url, body).pipe(
      map(response => {
        if (response.candidates && response.candidates.length > 0) {
          return response.candidates[0].content.parts[0].text;
        }
        return 'Lo siento, no he podido procesar tu solicitud en este momento.';
      }),
      catchError(error => {
        console.error('Error llamando a Gemini API (Chatbot):', error);
        // Fallback si system_instruction no está soportado (ej. modelos antiguos)
        if (error.status === 400 && error.error?.error?.message?.includes('system_instruction')) {
            console.warn('Modelo no soporta system_instruction, reintentando con prompt en user message');
            return this.generateResponseLegacy(userMessage, systemPrompt, history);
        }

        let errorMessage = 'Lo siento, tuve un problema conectando con el servidor.';
        if (error.status === 400) errorMessage += ' (Petición inválida - Revisa la API Key)';
        if (error.status === 403) errorMessage += ' (Acceso denegado - API Key incorrecta o sin permisos)';
        if (error.status === 429) errorMessage += ' (Demasiadas peticiones - Cuota excedida)';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  // Método de respaldo para modelos que no soportan system_instruction
  private generateResponseLegacy(userMessage: string, systemPrompt: string, history: {text: string, sender: string}[]): Observable<string> {
     const url = `${this.apiUrl}?key=${this.apiKey}`;
     
     // Construir historial combinando system prompt en el primer mensaje si es posible, o simplemente enviando contexto
     // Para simplificar en legacy, enviamos system prompt + ultimo mensaje, o reconstruimos todo.
     // Mejor estrategia legacy: System Prompt + Historial + Mensaje Actual
     
     let contents = [];
     
     if (history.length === 0) {
         contents.push({
             role: 'user',
             parts: [{ text: systemPrompt + '\n\nCliente: ' + userMessage }]
         });
     } else {
         // Si hay historial, inyectamos el system prompt en el primer mensaje del historial simulado o actual
         // Ojo: Gemini requiere alternancia user/model.
         
         // Opción segura: Ignorar historial antiguo en legacy o concatenarlo todo en un solo prompt (menos ideal)
         // Vamos a intentar mantener historial pero poniendo el system prompt al principio del primer mensaje
         
         const firstMsg = history[0];
         const firstRole = firstMsg.sender === 'user' ? 'user' : 'model';
         
         // Mapeamos el historial
         contents = history.map((msg, index) => {
             let text = msg.text;
             if (index === 0 && msg.sender === 'user') {
                 text = systemPrompt + '\n\n' + text;
             }
             return {
                 role: msg.sender === 'user' ? 'user' : 'model',
                 parts: [{ text: text }]
             };
         });
         
         // Si el primer mensaje del historial era del bot (raro pero posible), tenemos un problema porque system prompt debe ir en user.
         // Asumimos que el historial empieza con user o saludo del bot.
         
         contents.push({
             role: 'user',
             parts: [{ text: userMessage }]
         });
     }

     const body = {
        contents: contents,
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
        }
     };

     return this.http.post<any>(url, body).pipe(
        map(response => {
            if (response.candidates && response.candidates.length > 0) {
            return response.candidates[0].content.parts[0].text;
            }
            return 'Lo siento, no he podido procesar tu solicitud en este momento.';
        })
     );
  }

  generateDescription(productName: string): Observable<string> {
    const url = `${this.apiUrl}?key=${this.apiKey}`;
    const systemPrompt = `
      Eres un experto redactor gastronómico para el restaurante "Casa Qian".
      Tu tarea es generar una descripción detallada para la carta del restaurante.
      
      Nombre del plato: "${productName}"
      
      Instrucciones:
      1. Describe el plato mencionando explícitamente sus ingredientes principales y su preparación.
      2. Es para una carta de restaurante, así que el cliente necesita saber qué lleva (carnes, verduras, salsas).
      3. Usa un tono apetitoso y profesional.
      4. Máximo 2 frases.
      5. Usa algún emoji relacionado.
    `;

    const body = {
      contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
      generationConfig: { temperature: 0.8, maxOutputTokens: 100 }
    };

    return this.http.post<any>(url, body).pipe(
      map(response => {
        if (response.candidates && response.candidates.length > 0) {
          const text = response.candidates[0].content.parts[0].text;
          console.log('IA Generó:', text);
          return text;
        }
        return 'Delicioso plato tradicional de nuestra cocina.';
      }),
      catchError(error => {
        console.error('Error generando descripción (Revisa tu API Key):', error);
        // Fallback mejorado para que no parezca siempre lo mismo
        const fallbacks = [
          `Exquisita preparación de ${productName}, cocinado a fuego lento con especias tradicionales y un sabor inigualable. 🥘`,
          `Disfruta de nuestro ${productName}, elaborado con los ingredientes más frescos del mercado y nuestra salsa secreta. ✨`,
          `Un clásico de la casa: ${productName}, preparado al estilo tradicional chino con un toque moderno. 🥢`
        ];
        return of(fallbacks[Math.floor(Math.random() * fallbacks.length)]);
      })
    );
  }

  generateResponseFromAudio(audioBase64: string, mimeType: string, menuContext: Producto[], history: {text: string, sender: string}[] = []): Observable<string> {
    const url = `${this.apiUrl}?key=${this.apiKey}`;

    // Construir el contexto del sistema (reutilizado)
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
      Eres el asistente virtual de "Casa Qian". Escuchas audios de clientes.
      Tu tono es amable y servicial.
      
      MENÚ ACTUAL:
      ${menuDescription}

      Instrucciones:
      1. Responde al audio del usuario de forma concisa y natural.
      2. Si piden reservar, extrae la información.
      3. Usa el mismo formato de JSON para reservas si aplica: [RESERVA: {...}].
      4. NO menciones los IDs de los productos en tu respuesta hablada/texto.
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
        console.error('Error en Gemini Audio:', error);
        return throwError(() => error);
      })
    );
  }
}
