"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  AreaSeries,
  ColorType,
  createChart,
  createSeriesMarkers,
  type IChartApi,
  type ISeriesApi,
  type ISeriesMarkersPluginApi,
  type SeriesMarker,
  type AreaData,
  type Time,
} from "lightweight-charts";
import type { ChartSignalMarker, DailyCloseChartItem } from "@/domain/item/types/chart";

interface LightweightLineChartProps {
  data: DailyCloseChartItem[];
  markers?: ChartSignalMarker[];
}

function toChartDate(value: number): Time {
  const raw = String(value).slice(0, 8);
  return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
}

function formatChartLabel(time: Time): string {
  if (typeof time === "string") {
    const [year, month, day] = time.split("-");
    return `${year.slice(2, 4)}년 ${month}월 ${day}일`;
  }

  if (typeof time === "object" && "year" in time) {
    return `${String(time.year).slice(2, 4)}년 ${String(time.month).padStart(2, "0")}월 ${String(time.day).padStart(2, "0")}일`;
  }

  const date = new Date(time * 1000);
  const year = String(date.getUTCFullYear()).slice(2, 4);
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}년 ${month}월 ${day}일`;
}

export function LightweightLineChart({ data, markers = [] }: LightweightLineChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);
  const markersRef = useRef<ISeriesMarkersPluginApi<Time> | null>(null);

  const chartData = useMemo<AreaData<Time>[]>(() => {
    return data.map((item) => ({
      time: toChartDate(item.date),
      value: item.price,
    }));
  }, [data]);

  const chartMarkers = useMemo<SeriesMarker<Time>[]>(() => {
    return markers.reduce<SeriesMarker<Time>[]>((acc, marker) => {
      const baseMarker = {
        id: marker.id,
        time: marker.time,
        shape: marker.shape,
        color: marker.color,
        text: marker.text,
        size: 1.2,
      };

      if (marker.position === "atPriceTop" || marker.position === "atPriceBottom") {
        if (marker.price != null) {
          acc.push({
            ...baseMarker,
            position: marker.position,
            price: marker.price,
          });
        }

        return acc;
      }

      acc.push({
        ...baseMarker,
        position: marker.position,
      });

      return acc;
    }, []);
  }, [markers]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: window.innerWidth < 640 ? 280 : 320,
      layout: {
        background: { type: ColorType.Solid, color: "#ffffff" },
        textColor: "#374151",
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: "#f3f4f6" },
        horzLines: { color: "#f3f4f6" },
      },
      rightPriceScale: {
        borderColor: "#e5e7eb",
      },
      localization: {
        locale: "ko-KR",
        timeFormatter: formatChartLabel,
        priceFormatter: (price: number) => Math.round(price).toLocaleString("ko-KR"),
      },
      timeScale: {
        borderColor: "#e5e7eb",
        tickMarkFormatter: (time: Time) => formatChartLabel(time),
      },
      crosshair: {
        vertLine: { color: "#cbd5e1" },
        horzLine: { color: "#cbd5e1" },
      },
    });

    const series = chart.addSeries(AreaSeries, {
      lineColor: "#2563eb",
      topColor: "rgba(37, 99, 235, 0.22)",
      bottomColor: "rgba(37, 99, 235, 0.02)",
      lineWidth: 2,
      priceLineVisible: true,
      crosshairMarkerRadius: 4,
      priceFormat: {
        type: "price",
        precision: 0,
        minMove: 1,
      },
    });

    chartRef.current = chart;
    seriesRef.current = series;
    markersRef.current = createSeriesMarkers(series, []);

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry || !chartRef.current) {
        return;
      }

      chartRef.current.applyOptions({
        width: entry.contentRect.width,
        height: window.innerWidth < 640 ? 280 : 320,
      });
      chartRef.current.timeScale().fitContent();
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      markersRef.current = null;
      seriesRef.current = null;
      chartRef.current?.remove();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!seriesRef.current || !chartRef.current) {
      return;
    }

    seriesRef.current.setData(chartData);
    markersRef.current?.setMarkers(chartMarkers);
    chartRef.current.timeScale().fitContent();
  }, [chartData, chartMarkers]);

  return <div ref={containerRef} className="h-[280px] w-full sm:h-80" />;
}
