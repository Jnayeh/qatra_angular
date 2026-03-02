export interface DataDeletionRequest {
  id: number;
  userId: number;
  reason: string | null;
  status: DeletionStatus;
  requestedAt: string;
  processedAt: string | null;
}

export type DeletionStatus = 'IN_PROGRESS' | 'CANCELED' | 'COMPLETED';
