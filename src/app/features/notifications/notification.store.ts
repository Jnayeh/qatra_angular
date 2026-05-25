import { inject } from '@angular/core';
import { signalStore, withState, withMethods, withComputed, withHooks, patchState } from '@ngrx/signals';
import { pipe, switchMap, tap } from 'rxjs';
import type { Notification } from '@/app/shared/models/notification.model';
import { AuthStore } from '@/app/core/auth/auth.store';
import { SocketService } from '@/app/core/socket/socket.service';
import { NotificationService } from '@/app/features/notifications/notification.service';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  isLoadingMore: boolean;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  currentPage: 0,
  totalPages: 0,
  isLoading: false,
  isLoadingMore: false,
};

export const NotificationStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    recentUnread: () => store.notifications().filter((n) => n.status !== 'READ').slice(0, 5),
  })),
  withMethods((store, notificationService = inject(NotificationService), socketService = inject(SocketService), authStore = inject(AuthStore)) => ({
    loadNotifications(): void {
      patchState(store, { isLoading: true, notifications: [], currentPage: 0 });
      notificationService.getNotifications({ page: 0, size: 20, sort: 'createdAt,desc' }).subscribe({
        next: (res) =>
          patchState(store, {
            notifications: res.data,
            currentPage: res.page?.number ?? 0,
            totalPages: res.page?.totalPages ?? 0,
            unreadCount: res.data.filter((n) => n.status !== 'READ').length,
            isLoading: false,
          }),
        error: () => patchState(store, { isLoading: false }),
      });
    },

    loadMore(): void {
      if (store.isLoadingMore() || store.currentPage() >= store.totalPages() - 1) return;
      patchState(store, { isLoadingMore: true });
      const nextPage = store.currentPage() + 1;
      notificationService.getNotifications({ page: nextPage, size: 20, sort: 'createdAt,desc' }).subscribe({
        next: (res) =>
          patchState(store, {
            notifications: [...store.notifications(), ...res.data],
            currentPage: res.page?.number ?? 0,
            totalPages: res.page?.totalPages ?? 0,
            isLoadingMore: false,
          }),
        error: () => patchState(store, { isLoadingMore: false }),
      });
    },

    loadUnreadCount(): void {
      notificationService.getUnreadCount().subscribe({
        next: (res) => patchState(store, { unreadCount: res.count }),
      });
    },

    markAsRead(id: number): void {
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

    markAllAsRead(): void {
      notificationService.markAllAsRead().subscribe({
        next: () => {
          patchState(store, {
            notifications: store.notifications().map((n) => ({ ...n, status: 'READ' as const, readAt: new Date().toISOString() })),
            unreadCount: 0,
          });
        },
      });
    },

    initSocket(): void {
      const token = authStore.accessToken() ?? localStorage.getItem('accessToken');
      if (!token) return;
      socketService.connect();
      socketService.subscribe('notification', (msg) => {
        try {
          const notification = msg as Notification;
          patchState(store, {
            notifications: [notification, ...store.notifications()],
            unreadCount: store.unreadCount() + 1,
          });
        } catch {
          console.error('[NotificationStore] Failed to parse notification');
        }
      });
    },

    destroySocket(): void {
      socketService.disconnect();
    },
  })),
  withHooks({
    onInit(store) {
      store.initSocket();
      store.loadUnreadCount();
    },
    onDestroy(store) {
      store.destroySocket();
    },
  }),
);
