// Cliente para conectar con el servicio de cola
export interface QueueMessage {
  id: string;
  content: string;
  timestamp: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface QueueStats {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
}

class QueueClient {
  private host: string;
  private port: number;
  private protocol: string;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(host: string = window.location.hostname, port: number = parseInt(window.location.port) || 8080, protocol: string = 'ws') {
    this.host = host;
    this.port = port;
    this.protocol = protocol;
  }

  // Conectar al servicio de cola
  connect(onMessage?: (data: any) => void, onError?: (error: Error) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = `${this.protocol}://${this.host}:${this.port}`;
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('Conectado al servicio de cola');
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            onMessage?.(data);
          } catch (error) {
            console.error('Error al parsear mensaje:', error);
          }
        };

        this.ws.onerror = (error) => {
          const errorObj = new Error('Error de conexión WebSocket');
          onError?.(errorObj);
          reject(errorObj);
        };

        this.ws.onclose = () => {
          console.log('Conexión cerrada');
          this.attemptReconnect(onMessage, onError);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private attemptReconnect(onMessage?: (data: any) => void, onError?: (error: Error) => void) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Intentando reconectar... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect(onMessage, onError).catch(() => {});
      }, 3000);
    }
  }

  // Obtener estadísticas de la cola (simulado - ajustar según tu API)
  async getQueueStats(): Promise<QueueStats> {
    try {
      const response = await fetch(`http://${this.host}:${this.port}/api/queue/stats`);
      if (!response.ok) {
        throw new Error('Error al obtener estadísticas');
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      // Retornar datos simulados para desarrollo
      return {
        total: 0,
        pending: 0,
        processing: 0,
        completed: 0,
        failed: 0,
      };
    }
  }

  // Obtener mensajes de la cola
  async getQueueMessages(limit: number = 50): Promise<QueueMessage[]> {
    try {
      const response = await fetch(`http://${this.host}:${this.port}/api/queue/messages?limit=${limit}`);
      if (!response.ok) {
        throw new Error('Error al obtener mensajes');
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener mensajes:', error);
      return [];
    }
  }

  // Enviar mensaje a la cola
  async sendMessage(content: string): Promise<void> {
    try {
      const response = await fetch(`http://${this.host}:${this.port}/api/queue/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) {
        throw new Error('Error al enviar mensaje');
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      throw error;
    }
  }

  // Desconectar
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // Verificar estado de conexión
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

export default QueueClient;

