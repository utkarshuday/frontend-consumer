import { useEffect, useRef, useState } from 'react';
import { QRReader } from '../components/QRReader';
import QrScanner from 'qr-scanner';
import { getProduct, getSeller } from '../requests';
import { useUser } from '../context/hooks';
const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
import contractJson from '../data/App.json';
import { ethers } from 'ethers';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AddSeller() {
  const [showReader, setShowReader] = useState(false);
  const [qrResult, setQrResult] = useState(null);
  const [sellerWalletAddress, setSellerWalletAddress] = useState('');
  const [product, setProduct] = useState(null);
  const { user } = useUser();
  const { toast } = useToast();
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
  async function handleForm(e) {
    e.preventDefault();
    const data = await getSeller(sellerWalletAddress);
    console.log(qrResult);
    console.log(data.id);
    if (!data) return;
    const contract = new ethers.Contract(
      contractAddress,
      contractJson.abi,
      user.signer
    );
    const tx = await contract.addSeller(qrResult, data.id);
    await tx.wait();
    setSellerWalletAddress('');
    setProduct(null);
    handleClearFile();
    toast({ description: 'Seller added successfully!' });
  }
  const fileInputRef = useRef(null);

  const handleClearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };
  useEffect(() => {
    if (!qrResult) return;
    (async () => {
      const product = await getProduct(qrResult);
      console.log(product);
      setProduct(product);
    })();
  }, [qrResult]);
  return (
    <div className='max-w-[600px] mx-auto py-4 flex flex-col'>
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
      <form onSubmit={handleForm}>
        <Label htmlFor='wallet-address' className='mb-4 block'>
          Wallet Address
        </Label>
        <Input
          id='wallet-address'
          className='mb-4'
          type='text'
          value={sellerWalletAddress}
          onChange={e => setSellerWalletAddress(e.target.value)}
          placeholder='Wallet Address'
        />
        <Button className='mb-6'>Add Seller</Button>
      </form>
      {showReader && <QRReader setQrResult={setQrResult} />}
      {product && (
        <Card>
          <CardHeader className='-mb-2'>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col gap-2'>
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}
