import Web3 from 'web3'; // eslint-disable-line import/no-unresolved
import { toast } from 'react-toastify';
import BigNumber from 'bignumber.js';
import * as constants from 'utilities/constants';

const checkGas = async (web3, method, params, amount, from) => {
  let estimatedGasAmount;
  await method(...params).estimateGas(
    { from, value: new BigNumber(amount) },
    (error, gasAmount) => {
      estimatedGasAmount = gasAmount;
    }
  );

  const walletBalance = await web3.eth.getBalance(from);
  const gasPrice = await web3.eth.getGasPrice();
  const estimatedGas = new BigNumber(gasPrice).times(estimatedGasAmount);

  if (
    new BigNumber(amount).plus(estimatedGas).gt(new BigNumber(walletBalance))
  ) {
    toast.error('Your ETH balance is insufficient to execute the transaction.');
    return false;
  }
  return true;
};

export const sendSupply = async (web3, from, amount, callback) => {
  try {
    const contract = new web3.eth.Contract(
      JSON.parse(constants.CONTRACT_SETH_ABI),
      constants.CONTRACT_SBEP_ADDRESS.eth.address
    );
    const contractData = contract.methods.mint().encodeABI();

    const result = await checkGas(
      web3,
      contract.methods.mint,
      [],
      amount,
      from
    );

    if (!result) {
      callback(false);
      return;
    }

    const tx = {
      from,
      to: constants.CONTRACT_SBEP_ADDRESS.eth.address,
      value: amount,
      data: contractData
    };
    // // Send transaction
    // eslint-disable-next-line
    await web3.eth.sendTransaction(tx, (err, transactionHash) => {
      if (!err) {
        callback(true);
      }
      callback(false);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    callback(false);
  }
};

export const sendRepay = async (web3, from, amount, callback) => {
  try {
    const contract = new web3.eth.Contract(
      JSON.parse(constants.CONTRACT_SETH_ABI),
      constants.CONTRACT_SBEP_ADDRESS.eth.address
    );
    const contractData = contract.methods.repayBorrow().encodeABI();

    const result = await checkGas(
      web3,
      contract.methods.repayBorrow,
      [],
      amount,
      from
    );

    if (!result) {
      callback(false);
      return;
    }

    const tx = {
      from,
      to: constants.CONTRACT_SBEP_ADDRESS.eth.address,
      value: amount,
      data: contractData
    };
    // Send transaction
    // eslint-disable-next-line
    await web3.eth.sendTransaction(tx, (err, transactionHash) => {
      if (!err) {
        callback(true);
      }
      callback(false);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    callback(false);
  }
};

export const liquidateBorrow = async (
  web3,
  from,
  borrower,
  sTokenCollateral,
  amount
) => {
  try {
    const contract = new web3.eth.Contract(
      JSON.parse(constants.CONTRACT_SETH_ABI),
      constants.CONTRACT_SBEP_ADDRESS.eth.address
    );
    const contractData = contract.methods
      .liquidateBorrow(borrower, sTokenCollateral)
      .encodeABI();

    const result = await checkGas(
      web3,
      contract.methods.liquidateBorrow,
      [borrower, sTokenCollateral],
      amount,
      from
    );

    if (!result) {
      return null;
    }

    const tx = {
      from,
      to: constants.CONTRACT_SBEP_ADDRESS.eth.address,
      value: amount,
      data: contractData
    };
    // Send transaction
    return await web3.eth.sendTransaction(tx).then(receipt => {
      return receipt;
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    return null;
  }
};

export const nftMint = async (web3, from, totalPrice, amount) => {
  try {
    const contract = new web3.eth.Contract(
      JSON.parse(constants.NFT_ABI),
      constants.NFT_ADDRESS
    );
    const contractData = contract.methods.mint(from, amount).encodeABI();

    const result = await checkGas(
      web3,
      contract.methods.mint,
      [from, amount],
      amount,
      from
    );

    if (!result) {
      return null;
    }

    const tx = {
      from,
      to: constants.NFT_ADDRESS,
      value: totalPrice,
      data: contractData
    };
    // Send transaction
    return await web3.eth.sendTransaction(tx).then(receipt => {
      return receipt;
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    return null;
  }
};
