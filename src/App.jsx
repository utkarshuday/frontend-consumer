import QrScanner from 'qr-scanner';
import './App.css';
import { QRReader } from './components/QRReader';
import { useRef, useState } from 'react';
import ConnectButton from './components/ConnectButton';
import contractJson from './data/App.json';
import { ethers } from 'ethers';
import { getProduct, getSellerById } from './requests';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from './components/ui/breadcrumb';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from './components/ui/hover-card';
const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const abi = contractJson.abi;
function App() {
  const [qrResult, setQrResult] = useState();
  const [showReader, setShowReader] = useState(false);
  const [user, setUser] = useState();
  const [sellers, setSellers] = useState([]);
  const [product, setProduct] = useState(null);
  const handleFileChange = async event => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const result = await QrScanner.scanImage(file);
      console.log(result);
      setSellers([]);
      setProduct(null);
      setQrResult(result);
    } catch (err) {
      setQrResult(null);
    }
  };
  const fileInputRef = useRef(null);

  const handleClearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  async function handleVerify() {
    if (!qrResult) return;
    const contract = new ethers.Contract(contractAddress, abi, user.provider);
    const tx = await contract.getProduct(qrResult);
    const product = await getProduct(tx[0].toString());
    console.log(product);
    const promises = tx[1].map(id => getSellerById(id));
    const sellers = await Promise.all(promises);
    setSellers(sellers);
    setProduct(product);
    handleClearFile();
    console.log(sellers);
  }
  return (
    <main className=''>
      <header className='flex p-2'>
        <ConnectButton user={user} setUser={setUser} />
      </header>
      <div className='flex justify-center gap-4 bg-slate-900 text-slate-200 py-3 mb-8'>
        <p>Verify your product</p>
      </div>
      <div className='max-w-[500px] mx-auto'>
        <Label className='mb-4 block'>Add Product</Label>
        <div className='grid grid-cols-2 gap-4 mb-6'>
          <Button onClick={() => setShowReader(res => !res)}>
            {showReader ? 'Stop Scanner' : 'Show Scanner'}
          </Button>
          <Input
            id='picture'
            ref={fileInputRef}
            type='file'
            accept='image/*'
            className='cursor-pointer'
            onChange={handleFileChange}
          />
        </div>
        <div className='flex  gap-4 mb-8'>
          <Button onClick={handleVerify}>Verify</Button>
          <Button onClick={handleClearFile} variant='secondary'>
            Clear
          </Button>
        </div>
        {showReader && (
          <QRReader
            setQrResult={setQrResult}
            setShowReader={setShowReader}
            setProduct={setProduct}
            setSellers={setSellers}
            handleClearFile={handleClearFile}
          />
        )}
        <p className='mb-2'>{qrResult && 'Product selected'}</p>
        {product && (
          <div className='border border-black p-3 rounded-lg mb-4'>
            <p>
              <span className='font-medium'>Name</span>: {product.name}
            </p>
            <p>
              <span className='font-medium'>Brand</span>: {product.brand}
            </p>
            <p>
              <span className='font-medium'>Type</span>: {product.type}
            </p>
          </div>
        )}
        <div className='flex justify-center'>
          {sellers?.length > 0 && (
            <Breadcrumb className='border border-black p-4 rounded-lg'>
              <BreadcrumbList>
                {sellers.map((res, index) => (
                  <>
                    <BreadcrumbItem className='text-[1.2rem] px-3'>
                      <HoverCard>
                        <HoverCardTrigger className='cursor-pointer'>
                          {res.name}
                        </HoverCardTrigger>
                        <HoverCardContent className='w-80'>
                          <p>Address: {res.place}</p>
                          <p>Phone number: {res.phoneNumber}</p>
                          {/* <p>Wallet: {res.address}</p> */}
                        </HoverCardContent>
                      </HoverCard>
                    </BreadcrumbItem>
                    {index !== sellers.length - 1 && <BreadcrumbSeparator />}
                  </>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>
      </div>
    </main>
  );
}

export default App;
