import { inject, Injectable, OnDestroy } from '@angular/core';
import { AuthStore } from '@/app/core/auth/auth.store';
import { environment } from '@/environments/environment';

@Injectable({ providedIn: 'root' })
export class SocketService implements OnDestroy {
  private socket: WebSocket | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly authStore = inject(AuthStore);
  private readonly listeners = new Map<string, (data: unknown) => void>();

  connect(): void {
    if (this.socket?.readyState === WebSocket.OPEN) return;

    const token = this.authStore.accessToken() ?? localStorage.getItem('accessToken');
    if (!token) return;

    const url = `${environment.wsBaseUrl}/notifications?token=${token}`;
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log('[WebSocket] Connected');
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data as string);
        for (const callback of this.listeners.values()) {
          callback(data);
        }
      } catch {
        console.error('[WebSocket] Failed to parse message');
      }
    };

    this.socket.onclose = (event) => {
      console.warn('[WebSocket] Disconnected:', event.reason || `code ${event.code}`);
      this.scheduleReconnect();
    };

    this.socket.onerror = () => {
      console.error('[WebSocket] Connection error');
    };
  }

  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.socket?.close();
    this.socket = null;
  }

  subscribe(event: string, callback: (data: unknown) => void): void {
    this.listeners.set(event, callback);
  }

  unsubscribe(event: string): void {
    this.listeners.delete(event);
  }

  ngOnDestroy(): void {
    this.disconnect();
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, 5000);
  }
}
