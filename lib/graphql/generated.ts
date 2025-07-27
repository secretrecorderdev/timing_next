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

export type GetTimingListQueryVariables = Exact<{
  startDate: Scalars['String']['input'];
  endDate: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetTimingListQuery = { __typename?: 'Query', getTimingList: Array<{ __typename?: 'TimingListType', id: number, name?: string | null, timingDate?: string | null, regDate?: string | null }> };
