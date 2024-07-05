import QrScanner from 'qr-scanner';
import { useEffect, useRef } from 'react';
import QrFrame from '../assets/qr-frame.svg';

export function QRReader({
  setQrResult,
  setShowReader,
  setSellers,
  setProduct,
  handleClearFile,
}) {
  const videoEl = useRef(null);
  const scanner = useRef(null);
  const qrBoxEl = useRef(null);

  useEffect(() => {
    const cur = videoEl?.current;
    if (cur && !scanner.current) {
      scanner.current = new QrScanner(
        cur,
        result => {
          try {
            setQrResult(result?.data);
            setShowReader(false);
            setSellers([]);
            setProduct(null);
            handleClearFile();
          } catch {
            setQrResult(null);
          }
        },
        {
          preferredCamera: 'environment',
          highlightScanRegion: true,
          highlightCodeOutline: true,
          overlay: qrBoxEl?.current || undefined,
        }
      );

      scanner?.current?.start();
    }

    return () => {
      if (!cur) {
        scanner?.current?.stop();
      }
    };
  }, [setQrResult, setShowReader]);

  return (
    <>
      <div className='qr-reader w-[250px] h-[250px]'>
        <video ref={videoEl} className='w-20 h-20'></video>
        <div ref={qrBoxEl} className='qr-box'>
          <img
            src={QrFrame}
            alt='Qr Frame'
            width={220}
            height={220}
            className='qr-frame'
          />
        </div>
      </div>
    </>
  );
}
