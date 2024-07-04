import axios from 'axios';

const URL = 'http://localhost:8000/v1';

export async function getSellerById(id) {
  const res = await axios.get(`${URL}/sellers/id/${id}`);
  return res.data;
}

export async function getProduct(id) {
  const res = await axios.get(`${URL}/consumers/${id}`);
  return res.data;
}
