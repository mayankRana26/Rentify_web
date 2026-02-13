import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export default function TransactionActions({ txn, token, refresh }) {

  const call = (url) =>
    axios.put(`${API_URL}${url}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(refresh);

  if (txn.transactionType === "Rent") {
    if (txn.status === "payment_done")
      return <button onClick={() => call(`/api/transactions/${txn._id}/handover`)}>Mark Handed Over</button>;

    if (txn.status === "handed_over")
      return <button onClick={() => call(`/api/transactions/${txn._id}/return`)}>Return Item</button>;

    if (txn.status === "returned")
      return <button onClick={() => call(`/api/transactions/${txn._id}/complete-rent`)}>Complete Rent</button>;
  }

  if (txn.transactionType === "Sale") {
    if (txn.status === "payment_done")
      return <button onClick={() => call(`/api/transactions/${txn._id}/ship`)}>Mark Shipped</button>;

    if (txn.status === "shipped")
      return <button onClick={() => call(`/api/transactions/${txn._id}/confirm-delivery`)}>Confirm Delivery</button>;
  }

  return null;
}
