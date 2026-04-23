"use client";

import { useLoadingStore } from "@/shared/store/useLoadingStore";
import GlobalLoadingSpinner from "./GlobalLoadingSpinner";

export default function GlobalLoading() {
  const { isGlobalLoading } = useLoadingStore();
  if (!isGlobalLoading) return null;

  return <GlobalLoadingSpinner />;
}