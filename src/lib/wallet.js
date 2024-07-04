import { ethers } from 'ethers';

export async function connectWallet() {
  try {
    const ethereum = window.ethereum;
    if (typeof ethereum === 'undefined') {
      console.error(
        'MetaMask not found. Please install MetaMask to use this application.'
      );
      return;
    }
    const accounts = await ethereum.request({
      method: 'eth_requestAccounts',
    });
    console.log('Connected to MetaMask!', accounts);
    const provider = new ethers.BrowserProvider(ethereum);
    return { account: accounts[0], provider };
  } catch (error) {
    console.error(error);
  }
}

export function checkConnection() {}

export async function changeWallet(accounts) {
  try {
    const ethereum = window.ethereum;
    if (typeof ethereum === 'undefined') {
      console.error(
        'MetaMask not found. Please install MetaMask to use this application.'
      );
      return;
    }
    console.log('Connected to MetaMask!', accounts);
    const provider = new ethers.BrowserProvider(ethereum);
    return { account: accounts[0], provider };
  } catch (error) {
    console.error(error);
  }
}
