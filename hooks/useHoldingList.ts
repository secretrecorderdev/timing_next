// import { useQuery } from "@tanstack/react-query";
// import { request, gql } from "graphql-request";
// import { GetHoldingListQuery } from "@/lib/graphql/generated";

// const query = gql`
//   query GetHoldingList {
//     getHoldingList {
//       id
//       name
//       timingDate
//       regDate
//     }
//   }
// `;

// export const useGetHoldingList = (
//   options?: Parameters<typeof useQuery<GetHoldingListQuery>>[1]
// ) => {
//   return useQuery({
//     queryKey: ["GetHoldingList"],
//     queryFn: () => request("/graphql", query),
//     ...options,
//   });
// };