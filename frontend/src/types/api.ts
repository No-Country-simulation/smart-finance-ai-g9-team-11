export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

export interface ApiConnectionStatus {
  connected: boolean;
  message: string;
}
