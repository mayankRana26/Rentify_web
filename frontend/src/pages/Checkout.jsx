import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ;

const Checkout = ({ sellerId }) => {
  const payNow = async () => {
    const { data } = await axios.post(
      `${API_URL}/api/payments/create-order`,
      {
        amount: 1000,
        sellerId,
      },
      { withCredentials: true }
    );

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: data.order.amount,
      currency: "INR",
      order_id: data.order.id,
      name: "Rentify",
      description: "Rental Payment",
      handler: function (response) {
        alert("Payment Successful 🎉");
        console.log(response);
      },
      theme: { color: "#000" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return <button onClick={payNow}>Pay ₹1000</button>;
};

export default Checkout;
