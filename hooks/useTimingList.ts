import { useQuery } from '@tanstack/react-query'
import { request, gql } from 'graphql-request'
import { GetTimingListQuery, GetTimingListQueryVariables } from '@/lib/graphql/generated'

const query = gql`
  query GetTimingList($startDate: String!, $endDate: String!, $limit: Int, $offset: Int) {
    getTimingList(startDate: $startDate, endDate: $endDate, limit: $limit, offset: $offset) {
      id
      name
      timingDate
      regDate
    }
  }
`

export const useGetTimingList = (
  variables: GetTimingListQueryVariables,
  options?: Parameters<typeof useQuery<GetTimingListQuery>>[1]
) => {
  return useQuery({
    queryKey: ['GetTimingList', variables],
    queryFn: () => request('/graphql', query, variables),
    ...options,
  })
}
