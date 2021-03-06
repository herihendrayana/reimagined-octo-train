import { TransactionResponse } from 'ethers/providers';
import { bigNumberify } from 'ethers/utils';

import {
  ITxObject,
  ITxReceipt,
  IPendingTxReceipt,
  ISuccessfulTxReceipt,
  IFailedTxReceipt,
  ITxStatus
} from '@types';

import { default as ethNonWeb3TxResponse } from './ethNonWeb3TxResponse.json';
import { default as ethNonWeb3TxReceipt } from './ethNonWeb3TxReceipt.json';
import { default as ethWeb3TxResponse } from './ethWeb3TxResponse.json';
import { default as ethWeb3TxReceipt } from './ethWeb3TxReceipt.json';

import { default as erc20NonWeb3TxResponse } from './erc20NonWeb3TxResponse.json';
import { default as erc20NonWeb3TxReceipt } from './erc20NonWeb3TxReceipt.json';
import { default as erc20Web3TxResponse } from './erc20Web3TxResponse.json';
import { default as erc20Web3TxReceipt } from './erc20Web3TxReceipt.json';

import { default as erc20Web3TxReceiptFinished } from './erc20Web3TxReceiptFinished.json';
import { default as erc20NonWeb3TxReceiptFinished } from './erc20NonWeb3TxReceiptFinished.json';

const toTxResponse = (fixtureTxResponse: any): TransactionResponse => ({
  ...fixtureTxResponse,
  gasPrice: bigNumberify(fixtureTxResponse.gasPrice),
  gasLimit: bigNumberify(fixtureTxResponse.gasLimit),
  value: bigNumberify(fixtureTxResponse.value)
});

const toTxReceipt = (fixtureTxReceipt: any): ITxReceipt => ({
  ...fixtureTxReceipt,
  gasPrice: bigNumberify(fixtureTxReceipt.gasPrice),
  gasLimit: bigNumberify(fixtureTxReceipt.gasLimit),
  value: bigNumberify(fixtureTxReceipt.value),
  status: fixtureTxReceipt.status as ITxStatus.PENDING | ITxStatus.SUCCESS | ITxStatus.FAILED
});

export const fTransaction: ITxObject = {
  to: '0x909f74Ffdc223586d0d30E78016E707B6F5a45E2',
  value: '0x38d7ea4c68000',
  data: '0x',
  gasLimit: '21000',
  gasPrice: '0xee6b2800',
  nonce: '0x9',
  chainId: 3
};

export const fETHNonWeb3TxResponse: TransactionResponse = toTxResponse(ethNonWeb3TxResponse);
export const fETHWeb3TxResponse: TransactionResponse = toTxResponse(ethWeb3TxResponse);
export const fERC20NonWeb3TxResponse: TransactionResponse = toTxResponse(erc20NonWeb3TxResponse);
export const fERC20Web3TxResponse: TransactionResponse = toTxResponse(erc20Web3TxResponse);

export const fETHNonWeb3TxReceipt = toTxReceipt(ethNonWeb3TxReceipt) as IPendingTxReceipt;
export const fETHWeb3TxReceipt = toTxReceipt(ethWeb3TxReceipt) as IPendingTxReceipt;
export const fERC20NonWeb3TxReceipt = toTxReceipt(erc20NonWeb3TxReceipt) as IPendingTxReceipt;
export const fERC20Web3TxReceipt = toTxReceipt(erc20Web3TxReceipt) as IPendingTxReceipt;
export const fFinishedERC20NonWeb3TxReceipt = toTxReceipt(erc20NonWeb3TxReceiptFinished) as
  | ISuccessfulTxReceipt
  | IFailedTxReceipt;
export const fFinishedERC20Web3TxReceipt = toTxReceipt(erc20Web3TxReceiptFinished) as
  | ISuccessfulTxReceipt
  | IFailedTxReceipt;
