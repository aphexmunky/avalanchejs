/**
 * @packageDocumentation
 * @module Common-Interfaces
 */

import { Buffer } from 'buffer/';
import { BN } from 'src'
import { TransferableOutput } from 'src/apis/platformvm'

export interface Index {
  address: string
  utxo: string
}

export interface UTXOResponse {
  numFetched: number
  utxos: any
  endIndex: Index
}

export interface Asset {
  name: string
  symbol: string
  assetID: Buffer
  denomination: number
}

export interface StakedOuts {
  nodeID: string
  stakedUntil: string
  stakeOnlyUntil: string
  owners: string[]
  threshold: string
  amount: string
}

export interface GetStakeParams {
  addresses: string[]
  encoding: string
}

export interface GetStakeResponse {
  staked: BN
  stakedOutputs: TransferableOutput[]
}
export interface BaseIndexParams {
  encoding: string
}

export interface BaseIndexResponse {
  id: string
  bytes: string
  timestamp: string
  encoding: string
  index: string
}

export interface GetLastAcceptedParams extends BaseIndexParams { }

export interface GetLastAcceptedResponse extends BaseIndexResponse { }

export interface GetContainerByIndexParams extends BaseIndexParams {
  index: string
}

export interface GetContainerByIndexResponse extends BaseIndexResponse { }

export interface GetContainerByIDParams extends BaseIndexParams {
  containerID: string
}

export interface GetContainerByIDResponse extends BaseIndexResponse { }

export interface GetContainerRangeParams extends BaseIndexParams {
  startIndex: number,
  numToFetch: number
}

export interface GetContainerRangeResponse extends BaseIndexResponse { }

export interface GetIndexParams extends BaseIndexParams {
  containerID: string
}

export interface GetIsAcceptedParams extends BaseIndexParams {
  containerID: string
}

export interface GetBlockchainIDParams {
  alias: string
}

export interface IsBootstrappedParams {
  chain: string
}

export interface PeersParams {
  nodeIDs: string[]
}

export interface PeersResponse {
  ip: string
  publicIP: string
  nodeID: string
  version: string
  lastSent: string
  lastReceived: string
}

export interface GetRewardUTXOsParams {
  txID: string
  encoding: string
}

export interface GetRewardUTXOsResponse {
  numFetched: number
  utxos: string[]
  encoding: string
}

export interface GetAtomicTxStatusParams {
  txID: string
}
