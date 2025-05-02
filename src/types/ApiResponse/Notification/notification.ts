export interface Notification {
    id: number;
    title: string;
    content: string;
    isRead: boolean;
    userId: number;
    actionUrl: string;
    createdAt: string;
}