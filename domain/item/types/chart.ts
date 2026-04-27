export interface DailyCloseChartItem {
  name: string;
  price: number;
  date: number;
}

export interface ChartSignalMarker {
  id: string;
  time: string;
  position: "aboveBar" | "belowBar" | "atPriceTop" | "atPriceBottom";
  shape: "arrowUp" | "arrowDown";
  color: string;
  text: string;
  price?: number;
}
