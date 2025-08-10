"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useCallback } from "react";
import { request } from "graphql-request";
import { useLoadingStore } from "@/store/useLoadingStore";
import { getNextServerUrl } from "@/lib/utils/getNextServerUrl";
import { mapToTradeItem } from "@/ui/sections/Trade/TradeList";
import { TradeList } from "@/ui/sections/Trade/TradeList";
import {
  GetTimingListQueryVariables,
  GetTimingListQuery,
  GetTimingListDocument,
  TimingListInput
} from "@/lib/graphql/generated";
// import { useSocket } from "@/hooks/useSocket"; // 새로 만든 useSocket 훅
import type { SocketMessage } from '@/types/socket';

export const fetchHoldingList = async ({
  pageParam = 0,
  // startDate,
  // endDate,
  buyState = 1, // 기본값을 1로 설정
}: {
  pageParam?: number;
  // startDate: string;
  // endDate: string;
  buyState?: number; // buyState를 매개변수로 추가
}) => {
   const variables: GetTimingListQueryVariables = {
    input: {
      // startDate,
      // endDate,
      limit: 500,
      offset: pageParam,
      buyState
    } as TimingListInput,
  };

  try {
    const data = await request<GetTimingListQuery, GetTimingListQueryVariables>(
      getNextServerUrl("/api/graphql"),
      GetTimingListDocument,
      variables
    );

    console.log("📦 타이밍 데이터:", data);

    return {
      items: data.getTimingList,
      nextOffset: pageParam + data.getTimingList.length,
      hasMore: data.getTimingList.length > 0,
    };
  } catch (error) {
    console.error("GraphQL 요청 실패:", error);
    throw error;
  }
};

export default function HoldingPageClient() {
  // const startDate = "2000000000"
  // const endDate
    // const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
  // const { startDate, endDate } = useTimingDateRangeStore();
  
  // 웹소켓 연결 및 수신된 타임스탬프 처리
  // const queryClient = useQueryClient();
 
  const handleMessage = useCallback((msg: SocketMessage) => {
    console.log("핸들 메세지", msg)
  // ...
  }, []);
  // const { socket } = useSocket(handleMessage);
  // useSocket(handleMessage);

  

  const { setLoading } = useLoadingStore();
  // console.log("날짜", { startDate, endDate });
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["holdingList"],
      initialPageParam: 0,
      queryFn: ({ pageParam = 0 }) =>
        fetchHoldingList({ pageParam, buyState:1 }), // buyState 필터링 추가
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.nextOffset : undefined,
        staleTime: 1000 * 60 * 60,
    });
    
  useEffect(() => {
    const isLoading = status === "pending" || isFetchingNextPage;
    console.log("데이터 확인", data)
    setLoading(isLoading);
  }, [status, isFetchingNextPage, setLoading, data]);
  const tradeItems = data?.pages.flatMap((page) => page.items.map(mapToTradeItem)) ?? [];
  // return <></>;
  return <TradeList items={tradeItems} />;
}
