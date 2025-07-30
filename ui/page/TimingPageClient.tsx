"use client";

import dayjs from "dayjs";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { request } from "graphql-request";
import { useTimingDateRangeStore } from "@/store/timing/useTimingDateRangeStore";
import { useLoadingStore } from "@/store/useLoadingStore";
import { getNextServerUrl } from "@/lib/utils/getNextServerUrl";
import {
  GetTimingListQueryVariables,
  GetTimingListQuery,
  GetTimingListDocument,
} from "@/lib/graphql/generated";

export const fetchTimingList = async ({
  pageParam = 0,
  startDate,
  endDate,
}: {
  pageParam?: number;
  startDate: string;
  endDate: string;
}) => {
  const variables: GetTimingListQueryVariables = {
    startDate,
    endDate,
    limit: 50,
    offset: pageParam,
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

export default function TimingPageClient() {
  // const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
  const { startDate, endDate } = useTimingDateRangeStore();
  const { setLoading } = useLoadingStore();
  console.log("날짜", { startDate, endDate });
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["timingList", startDate, endDate],
      initialPageParam: 0,
      queryFn: ({ pageParam = 0 }) =>
        fetchTimingList({ pageParam, startDate, endDate }),
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.nextOffset : undefined,
      staleTime: 1000 * 60 * 5,
    });
  useEffect(() => {
    const isLoading = status === "pending" || isFetchingNextPage;
    console.log("데이터 확인", data)
    setLoading(isLoading);
  }, [status, isFetchingNextPage, setLoading]);
  return <></>;
}
