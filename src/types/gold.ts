export interface Observation {
  date: string;
  value: number;
}

export type SeriesId = string;

export interface DateRange {
  from: string;
  to: string;
}
