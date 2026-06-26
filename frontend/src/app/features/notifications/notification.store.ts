import { inject } from '@angular/core';
import { signalStore, withState, withMethods, withComputed, withHooks, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import type { Notification } from '../../shared/models/notification.model';
import { AuthStore } from '../../core/auth/auth.store';
import { SocketService } from '../../core/socket/socket.service';
import { NotificationService } from './notification.service';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
};

export const NotificationStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    recentUnread: () => store.notifications().filter((n) => n.status !== 'READ').slice(0, 5),
  })),
  withMethods((store, notificationService = inject(NotificationService), socketService = inject(SocketService), authStore = inject(AuthStore)) => ({
    loadNotifications: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          notificationService.getNotifications().pipe(
            tap({
              next: (res) => patchState(store, { notifications: res.data, isLoading: false, unreadCount: res.data.filter((n) => n.status !== 'READ').length }),
              error: () => patchState(store, { isLoading: false }),
            }),
          ),
        ),
      ),
    ),

    markAsRead(id: number) {
      notificationService.markAsRead(id).subscribe({
        next: () => {
          patchState(store, {
            notifications: store.notifications().map((n) =>
              n.id === id ? { ...n, status: 'READ' as const, readAt: new Date().toISOString() } : n,
            ),
            unreadCount: Math.max(0, store.unreadCount() - 1),
          });
        },
      });
    },

    markAllAsRead() {
      notificationService.markAllAsRead().subscribe({
        next: () => {
          patchState(store, {
            notifications: store.notifications().map((n) => ({ ...n, status: 'READ' as const, readAt: new Date().toISOString() })),
            unreadCount: 0,
          });
        },
      });
    },

    initSocket() {
      const token = authStore.accessToken() ?? localStorage.getItem('accessToken');
      if (!token) return;
      socketService.connect();
      socketService.subscribe('/user/queue/notifications', (msg) => {
        try {
          const notification = JSON.parse(msg.body) as Notification;
          patchState(store, {
            notifications: [notification, ...store.notifications()],
            unreadCount: store.unreadCount() + 1,
          });
        } catch {
          console.error('[NotificationStore] Failed to parse notification');
        }
      });
    },

    destroySocket() {
      socketService.disconnect();
    },

    addNotificationFromSocket(notification: Notification) {
      patchState(store, {
        notifications: [notification, ...store.notifications()],
        unreadCount: store.unreadCount() + 1,
      });
    },
  })),
  withHooks({
    onInit(store) {
      store.initSocket();
    },
    onDestroy(store) {
      store.destroySocket();
    },
  }),
);
