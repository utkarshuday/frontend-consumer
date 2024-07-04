export default function SellerCard({ seller }) {
  return (
    <div>
      <p>Name: {seller.name}</p>
      <p>Wallet Address: {seller.address}</p>
      <p>Phone number: {seller.phoneNumber}</p>
      <p>Address: {seller}</p>
    </div>
  );
}
