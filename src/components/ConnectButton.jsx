import { connectWallet } from '../lib/wallet';
import { useEffect } from 'react';

export default function ConnectButton({ user, setUser }) {
  // const get = async () => {
  //   const ethereum = window.ethereum;
  //   const provider = new ethers.BrowserProvider(ethereum);
  //   const signer = await provider.getSigner();

  //   const contract = new ethers.Contract(contractAddress, abi, signer);
  //   const tx = await contract.createSeller(1);
  //   // const ans =await tx.wait();
  //   console.log(tx[0].toString(), tx[1].toString());
  // };

  // useEffect(() => {
  //   (async () => {
  //     if (!window.ethereum) return;

  //     console.log(await window.ethereum.request({ method: 'isUnlocked' }));
  //   })();
  //   // const provider = new ethers.BrowserProvider(window.ethereum);
  //   // console.log(provider);
  // }, []);
  const connectToMetaMask = async () => {
    try {
      const res = await connectWallet();
      setUser(res);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    connectToMetaMask();
  }, []);

  return (
    <>
      <button
        onClick={connectWallet}
        className='py-2 px-3 bg-blue-600 rounded-lg '
      >
        {user ? `Account: ${user.account}` : 'Connect to Metamask'}
      </button>
      {/* <button>Change Wallet</button> */}
      {/* <button onClick={get}>GetProduct</button> */}
      {/* <button onClick={disconnect}>Disconnect</button> */}
    </>
  );
}
