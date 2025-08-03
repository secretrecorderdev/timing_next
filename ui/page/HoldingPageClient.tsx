"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { request } from "graphql-request";
// import { useTimingDateRangeStore } from "@/store/timing/useTimingDateRangeStore";
import { useLoadingStore } from "@/store/useLoadingStore";
import { getNextServerUrl } from "@/lib/utils/getNextServerUrl";
import { mapToTradeItem } from "@/ui/sections/Trade/TradeList";
import { TradeList } from "@/ui/sections/Trade/TradeList";
import {
  GetHoldingListQuery,
  GetHoldingListDocument,
  GetHoldingListQueryVariables
} from "@/lib/graphql/generated";

export const fetchHoldingList = async () => {
  const data = await request<GetHoldingListQuery, GetHoldingListQueryVariables>(
    getNextServerUrl("/api/graphql"),
    GetHoldingListDocument,
    {}
  );

  return {
    items: data.getHoldingList, // ✅ 바로 배열로
    hasMore: false,
    nextOffset: undefined,
  };
};
export default function HoldingPageClient() {
  // const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =

  const { setLoading } = useLoadingStore();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["timingList"],
      initialPageParam: 0,
      queryFn: () => fetchHoldingList(),
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.nextOffset : undefined,
      staleTime: 1000 * 60 * 60,
    });
  useEffect(() => {
    const isLoading = status === "pending" || isFetchingNextPage;
    console.log("데이터 확인", data)
    setLoading(isLoading);
  }, [status, isFetchingNextPage, setLoading]);
  
  const holdingItems = data?.pages.flatMap((page) =>
    page.items.map(mapToTradeItem) // ✅ 수정
  ) ?? [];
  // return <></>;
  return <TradeList items={holdingItems} />;
}
