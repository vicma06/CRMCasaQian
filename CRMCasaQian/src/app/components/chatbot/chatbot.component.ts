import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GeminiService } from '../../services/gemini.service';
import { HanQiService } from '../../services/hanqi.service';
import { ProductoService } from '../../services/producto.service';
import { ReservaService } from '../../services/reserva.service';
import { AuthService } from '../../services/auth.service';
import { Producto } from '../../models/producto.model';

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  recommendedProducts?: Producto[];
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  isOpen = false;
  userMessage = '';
  messages: ChatMessage[] = [
    { text: '¡Hola! Soy el asistente virtual de Casa Qian. 🏮 ¿En qué puedo ayudarte hoy?', sender: 'bot', timestamp: new Date() }
  ];
  isLoading = false;
  menuContext: Producto[] = [];
  isRecording = false;
  private mediaRecorder: any;
  private audioChunks: any[] = [];
  isVoiceMode = false;
  voiceResponseText = '';
  isSpeaking = false;
  
  // Flags para control robusto del micrófono
  shouldBeRecording = false;
  isInitializingRecording = false;

  constructor(
    private geminiService: GeminiService,
    private hanQiService: HanQiService,
    private productoService: ProductoService,
    private reservaService: ReservaService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  toggleVoiceChat(): void {
    this.isVoiceMode = !this.isVoiceMode;
    // this.isOpen = false; // REMOVED: El overlay está dentro de la ventana de chat, así que debe mantenerse abierta
    if (!this.isVoiceMode) {
      this.stopRecording();
      window.speechSynthesis.cancel();
    }
  }

  async startRecording() {
    if (this.isRecording || this.isInitializingRecording) return;
    
    this.isInitializingRecording = true;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event: any) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/mp3' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = (reader.result as string).split(',')[1];
          this.sendAudioToGemini(base64Audio, this.menuContext);
        };
        
        stream.getTracks().forEach(track => track.stop());
      };

      this.mediaRecorder.start();
      this.ngZone.run(() => {
        this.isRecording = true;
        this.isInitializingRecording = false;
        this.cdr.detectChanges();
      });

    } catch (err) {
      console.error('Error accediendo al micrófono:', err);
      this.ngZone.run(() => {
        this.isInitializingRecording = false;
        this.messages.push({ 
          text: 'No pude acceder al micrófono. Verifica los permisos.', 
          sender: 'bot', 
          timestamp: new Date() 
        });
      });
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.ngZone.run(() => {
        this.isRecording = false;
        this.isLoading = true;
        this.cdr.detectChanges();
      });
    }
  }

  private sendAudioToGemini(base64: string, productos: Producto[]) {
    const history = this.messages.slice(0, -1).map(msg => ({
      text: msg.text,
      sender: msg.sender
    }));

    // Usamos HanQiService para el audio (Voice Mode)
    this.hanQiService.generateResponseFromAudio(base64, 'audio/mp3', productos, history).subscribe({
      next: (response) => {
        this.ngZone.run(() => {
          this.processBotResponse(response);
          this.speakResponse(response);
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          console.error('Error HanQiAI Audio:', err);
          this.messages.push({ 
            text: 'Lo siento, hubo un error procesando tu audio con HanQiAI.', 
            sender: 'bot', 
            timestamp: new Date() 
          });
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  speakResponse(text: string) {
    if ('speechSynthesis' in window) {
      let textToSpeak = text.replace(/\[RESERVA:.*?\]/g, '')
                            .replace(/\[RECOMENDACION_IDS:.*?\]/g, '')
                            .replace(/\*/g, ''); 

      this.ngZone.run(() => {
        this.voiceResponseText = textToSpeak;
        this.isSpeaking = true;
        this.cdr.detectChanges();
      });

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'es-ES';
      utterance.rate = 1.0;

      utterance.onend = () => {
        this.ngZone.run(() => {
          this.isSpeaking = false;
          this.voiceResponseText = '';
          this.cdr.detectChanges();
        });
      };

      utterance.onerror = () => {
        this.ngZone.run(() => {
          this.isSpeaking = false;
          this.voiceResponseText = '';
          this.cdr.detectChanges();
        });
      };

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  }

  ngOnInit(): void {
    this.loadMenuContext();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  loadMenuContext(): void {
    this.productoService.getProductos().subscribe({
      next: (productos) => {
        this.menuContext = productos;
      },
      error: (err) => console.error('Error cargando menú para contexto IA', err)
    });
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  sendMessage(): void {
    if (!this.userMessage.trim()) return;

    const messageText = this.userMessage;
    this.messages.push({ text: messageText, sender: 'user', timestamp: new Date() });
    this.userMessage = '';
    this.isLoading = true;

    // 1. Intentar obtener el menú actualizado
    this.productoService.getProductos().subscribe({
      next: (productos) => {
        this.menuContext = productos; // Actualizar contexto local
        this.callGemini(messageText, productos);
      },
      error: (err) => {
        console.error('Error obteniendo productos (usando contexto vacío):', err);
        // Si falla el backend, seguimos funcionando pero sin conocimiento del menú
        this.callGemini(messageText, []);
      }
    });
  }

  private callGemini(message: string, productos: Producto[]): void {
    // Preparamos el historial excluyendo el último mensaje (que es el actual que acabamos de añadir)
    // para evitar duplicarlo, ya que el servicio lo añade explícitamente.
    const history = this.messages.slice(0, -1).map(msg => ({
      text: msg.text,
      sender: msg.sender
    }));

    this.geminiService.generateResponse(message, productos, history).subscribe({
      next: (response) => {
        this.processBotResponse(response);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error Gemini:', err);
        const errorMsg = 'Lo siento, estoy teniendo problemas para conectar con mi servicio de IA. Por favor, verifica tu conexión o la API Key.';
        this.messages.push({ text: errorMsg, sender: 'bot', timestamp: new Date() });
        this.isLoading = false;
      }
    });
  }

  processBotResponse(response: string): void {
    const recommendationRegex = /\[RECOMENDACION_IDS: (.*?)\]/;
    const reservaRegex = /\[RESERVA: (.*?)\]/;
    
    let cleanText = response;
    let recommendedProducts: Producto[] = [];

    // Procesar Recomendaciones
    const matchRec = response.match(recommendationRegex);
    if (matchRec) {
      cleanText = cleanText.replace(matchRec[0], '').trim();
      try {
        const ids = matchRec[1].split(',').map(id => parseInt(id.trim()));
        recommendedProducts = this.menuContext.filter(p => ids.includes(p.id));
      } catch (e) {
        console.error('Error parseando recomendaciones', e);
      }
    }

    // Procesar Reservas
    const matchRes = response.match(reservaRegex);
    if (matchRes) {
      cleanText = cleanText.replace(matchRes[0], '').trim();
      try {
        const reservaData = JSON.parse(matchRes[1]);
        this.crearReservaAutomatica(reservaData);
      } catch (e) {
        console.error('Error parseando reserva', e);
        cleanText += '\n(Hubo un error técnico procesando la reserva automática)';
      }
    }

    this.messages.push({ 
      text: cleanText, 
      sender: 'bot', 
      timestamp: new Date(),
      recommendedProducts: recommendedProducts.length > 0 ? recommendedProducts : undefined
    });
  }

  crearReservaAutomatica(data: {fecha: string, hora: string, personas: number}) {
    const currentUser = this.authService.currentUserValue;
    
    if (!currentUser) {
      this.messages.push({ 
        text: '⚠️ Necesitas iniciar sesión para confirmar la reserva. Te redirijo al login...', 
        sender: 'bot', 
        timestamp: new Date() 
      });
      setTimeout(() => this.router.navigate(['/login']), 2000);
      return;
    }

    if (!currentUser.cliente) {
      this.messages.push({ 
        text: '⚠️ No tienes un perfil de cliente asociado. Por favor contacta con administración.', 
        sender: 'bot', 
        timestamp: new Date() 
      });
      return;
    }

    const nuevaReserva = {
      clienteId: currentUser.cliente.id,
      nombreCliente: `${currentUser.cliente.nombre} ${currentUser.cliente.apellidos}`,
      fecha: data.fecha, // Enviamos el string YYYY-MM-DD directamente
      hora: data.hora,
      numeroPersonas: data.personas,
      estado: 'pendiente',
      notas: 'Reserva creada vía Chatbot IA 🤖'
    };

    this.reservaService.addReserva(nuevaReserva as any).subscribe({
      next: () => {
        this.messages.push({ 
          text: `✅ ¡Reserva confirmada! Te esperamos el ${data.fecha} a las ${data.hora} para ${data.personas} personas.`, 
          sender: 'bot', 
          timestamp: new Date() 
        });
      },
      error: (err) => {
        console.error('Error creando reserva', err);
        this.messages.push({ 
          text: '❌ Hubo un error al guardar tu reserva. Por favor intenta de nuevo o llama al restaurante.', 
          sender: 'bot', 
          timestamp: new Date() 
        });
      }
    });
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  startPushToTalk(event: Event) {
    event.preventDefault(); // Evitar comportamientos por defecto en móviles
    this.shouldBeRecording = true;
    this.startRecording();
  }

  stopPushToTalk(event: Event) {
    event.preventDefault();
    this.shouldBeRecording = false;
    if (this.isRecording) {
      this.stopRecording();
    }
  }
}
