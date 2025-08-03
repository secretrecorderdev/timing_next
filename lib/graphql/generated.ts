import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Query = {
  __typename?: 'Query';
  getHoldingList: Array<TimingListType>;
  getTimingList: Array<TimingListType>;
};


export type QueryGetTimingListArgs = {
  endDate: Scalars['String']['input'];
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  startDate: Scalars['String']['input'];
};

export type TimingListType = {
  __typename?: 'TimingListType';
  benefit?: Maybe<Scalars['String']['output']>;
  buyDate?: Maybe<Scalars['String']['output']>;
  buyPrice?: Maybe<Scalars['Int']['output']>;
  buyState?: Maybe<Scalars['Int']['output']>;
  buyType?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  currentPrice?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
  pairId?: Maybe<Scalars['Int']['output']>;
  period?: Maybe<Scalars['Int']['output']>;
  priceDate?: Maybe<Scalars['String']['output']>;
  regDate?: Maybe<Scalars['String']['output']>;
  sellPrice?: Maybe<Scalars['Int']['output']>;
  sellType?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['Int']['output']>;
  timingDate?: Maybe<Scalars['String']['output']>;
  updDate?: Maybe<Scalars['String']['output']>;
};

export type GetHoldingListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetHoldingListQuery = { __typename?: 'Query', getHoldingList: Array<{ __typename?: 'TimingListType', id: number, code?: string | null, name?: string | null, regDate?: string | null, buyPrice?: number | null, currentPrice?: number | null, benefit?: string | null, timingDate?: string | null, buyDate?: string | null, priceDate?: string | null, buyState?: number | null, sellPrice?: number | null, pairId?: number | null, period?: number | null, buyType?: string | null, sellType?: string | null }> };

export type GetTimingListQueryVariables = Exact<{
  startDate: Scalars['String']['input'];
  endDate: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetTimingListQuery = { __typename?: 'Query', getTimingList: Array<{ __typename?: 'TimingListType', id: number, code?: string | null, name?: string | null, regDate?: string | null, buyPrice?: number | null, currentPrice?: number | null, benefit?: string | null, timingDate?: string | null, buyDate?: string | null, priceDate?: string | null, buyState?: number | null, sellPrice?: number | null, pairId?: number | null, period?: number | null, buyType?: string | null, sellType?: string | null }> };


export const GetHoldingListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetHoldingList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getHoldingList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"regDate"}},{"kind":"Field","name":{"kind":"Name","value":"buyPrice"}},{"kind":"Field","name":{"kind":"Name","value":"currentPrice"}},{"kind":"Field","name":{"kind":"Name","value":"benefit"}},{"kind":"Field","name":{"kind":"Name","value":"timingDate"}},{"kind":"Field","name":{"kind":"Name","value":"buyDate"}},{"kind":"Field","name":{"kind":"Name","value":"priceDate"}},{"kind":"Field","name":{"kind":"Name","value":"buyState"}},{"kind":"Field","name":{"kind":"Name","value":"sellPrice"}},{"kind":"Field","name":{"kind":"Name","value":"pairId"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"buyType"}},{"kind":"Field","name":{"kind":"Name","value":"sellType"}}]}}]}}]} as unknown as DocumentNode<GetHoldingListQuery, GetHoldingListQueryVariables>;
export const GetTimingListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTimingList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getTimingList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"regDate"}},{"kind":"Field","name":{"kind":"Name","value":"buyPrice"}},{"kind":"Field","name":{"kind":"Name","value":"currentPrice"}},{"kind":"Field","name":{"kind":"Name","value":"benefit"}},{"kind":"Field","name":{"kind":"Name","value":"timingDate"}},{"kind":"Field","name":{"kind":"Name","value":"buyDate"}},{"kind":"Field","name":{"kind":"Name","value":"priceDate"}},{"kind":"Field","name":{"kind":"Name","value":"buyState"}},{"kind":"Field","name":{"kind":"Name","value":"sellPrice"}},{"kind":"Field","name":{"kind":"Name","value":"pairId"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"buyType"}},{"kind":"Field","name":{"kind":"Name","value":"sellType"}}]}}]}}]} as unknown as DocumentNode<GetTimingListQuery, GetTimingListQueryVariables>;