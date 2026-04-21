"use client";

import { useLoadingStore } from "@/store/useLoadingStore";
import GlobalLoadingSpinner from "./GlobalLoadingSpinner";

export default function GlobalLoading() {
  const { isLoading } = useLoadingStore();
  if (!isLoading) return null;

  return <GlobalLoadingSpinner />;
}