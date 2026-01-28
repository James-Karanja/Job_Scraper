export interface ChartDataPoint {
  name: string;
  value: number;
  status: 'idle' | 'active';
}

export interface DataSource {
  name: string;
  count: number;
  color: string;
  darkColor: string;
  percent: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  message: string;
  source: string;
}
