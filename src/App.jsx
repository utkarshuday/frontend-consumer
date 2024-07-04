import QrScanner from 'qr-scanner';
import './App.css';
import { QRReader } from './components/QRReader';
import { useState } from 'react';
import ConnectButton from './components/ConnectButton';
import contractJson from './data/App.json';
import { ethers } from 'ethers';
import { getProduct, getSellerById } from './requests';
const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const abi = contractJson.abi;
function App() {
  const [qrResult, setQrResult] = useState();
  const [showReader, setShowReader] = useState(false);
  const [user, setUser] = useState();

  const handleFileChange = async event => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const result = await QrScanner.scanImage(file);
      console.log(result);
      setQrResult(result);
    } catch (err) {
      setQrResult(null);
    }
  };
  async function handleVerify() {
    if (!qrResult) return;
    const contract = new ethers.Contract(contractAddress, abi, user.provider);
    const tx = await contract.getProduct(qrResult);
    // console.log(tx[0].toString());
    const product = await getProduct(tx[0].toString());
    console.log(product);
    const promises = tx[1].map(id => getSellerById(id));
    const sellers = await Promise.all(promises);
    console.log(sellers);
  }
  return (
    <div className='flex gap-4 items-center'>
      <ConnectButton user={user} setUser={setUser} />
      <button onClick={handleVerify}>Verify</button>
      <button onClick={() => setShowReader(res => !res)}>Show Scanner</button>
      <button>
        <input type='file' accept='image/*' onChange={handleFileChange} />
      </button>
      {showReader && <QRReader setQrResult={setQrResult} />}
      Product ID: {qrResult}
    </div>
  );
}

export default App;
