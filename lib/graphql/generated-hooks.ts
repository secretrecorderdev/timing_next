import { useQuery, UseQueryOptions } from '@tanstack/react-query';

function fetcher<TData, TVariables>(endpoint: string, requestInit: RequestInit, query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    const res = await fetch(endpoint, {
      method: 'POST',
      ...requestInit,
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  }
}


export const GetTimingListDocument = `
    query GetTimingList($startDate: String!, $endDate: String!, $limit: Int, $offset: Int) {
  getTimingList(
    startDate: $startDate
    endDate: $endDate
    limit: $limit
    offset: $offset
  ) {
    id
    name
    timingDate
    regDate
  }
}
    `;

export const useGetTimingListQuery = <
      TData = GetTimingListQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: GetTimingListQueryVariables,
      options?: UseQueryOptions<GetTimingListQuery, TError, TData>
    ) => {
    
    return useQuery<GetTimingListQuery, TError, TData>(
      ['GetTimingList', variables],
      fetcher<GetTimingListQuery, GetTimingListQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetTimingListDocument, variables),
      options
    )};
