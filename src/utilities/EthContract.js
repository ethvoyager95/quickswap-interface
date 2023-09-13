import Web3 from 'web3'; // eslint-disable-line import/no-unresolved
import * as constants from 'utilities/constants';

export const sendSupply = async (web3, from, amount, callback) => {
  try {
    const contract = new web3.eth.Contract(
      JSON.parse(constants.CONTRACT_SETH_ABI),
      constants.CONTRACT_SBEP_ADDRESS.eth.address
    );
    const contractData = contract.methods.mint().encodeABI();

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
