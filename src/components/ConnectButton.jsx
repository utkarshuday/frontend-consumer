import { connectWallet } from '../lib/wallet';
import { useEffect } from 'react';
import { Button } from './ui/button';

export default function ConnectButton({ user, setUser }) {
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
    <Button onClick={connectWallet} className='ml-auto'>
      {user ? `Account: ${user.account}` : 'Connect to Metamask'}
    </Button>
  );
}
