"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const OrderSuccessPage = () => {
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState({
    icon: "ri-error-warning-line",
    color: "red",
    headMessage: "Something went wrong",
    message: "Your payment is not done. If amount was deducted, please contact support.",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    const detail = sessionStorage.getItem("orderDetail");

    if (!detail) {
      router.push("/");
      return;
    }

    const parsedDetail = JSON.parse(detail);

    const fetchOrderPaymentInfo = async () => {
      try {
        const route = `http://localhost/stayinbraj/ecommerce-order-check-payment-status?store_id=${parsedDetail.storeId}&order_id=${parsedDetail.orderId}&txn_id=${parsedDetail.mchTxnId}&payment_method=${parsedDetail.paymentMethod}`;

        const res = await fetch(route, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            access: "stayinbraj2025osculant",
          },
        });

        const data = await res.json();

        if (data.status) {
          const { order_status, payment_status, payment_method } = data.data.info;
          setProducts(data.data.items);
          if (payment_method == "cod") {
            setStatus({
              icon: "ri-check-double-line",
              color: "green",
              headMessage: "Order Placed Successfully",
              message: "Thank you for your purchase. Your order has been confirmed.",
            });
          } else {
            if (payment_status != "pending" && order_status != "FAILED") {
              setStatus({
                icon: "ri-check-double-line",
                color: "green",
                headMessage: "Order Placed Successfully",
                message: "Thank you for your purchase. Your order has been confirmed.",
              });
            }
          }

          setOrderDetail({
            ...parsedDetail,
            ...data.data.info,
          });
        } else {
          setErrorMsg("Order not found or payment failed.");
        }
      } catch (error) {
        setErrorMsg("Error verifying payment status.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderPaymentInfo();
  }, [router]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-500 border-opacity-50 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">Please wait, Stayinbraj is responding...</p>
        </div>
      </div>
    );

  if (errorMsg)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <i className="ri-emotion-sad-line text-9xl text-red-600"></i>
          <p className="text-red-600 font-medium">{errorMsg}</p>
        </div>
      </div>
    );

  if (!orderDetail) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="flex justify-center mb-2">
        <div className={`w-16 h-16 bg-${status.color}-100 rounded-full flex items-center justify-center`}>
          <i className={`${status.icon} text-3xl text-${status.color}-600`}></i>
        </div>
      </div>
      <div className="flex flex-col items-center mb-2">
        <h1 className={`lg:text-2xl text-xl font-semibold text-${status.color}-700 mb-2`}>{status.headMessage}</h1>
        <p className="text-gray-600 mb-6 text-sm text-center">
          {status.message} <br />
          Your order number is <span className="font-medium text-black">#{orderDetail.orderId}</span>.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 text-left mb-6 w-full max-w-md">
        <h4 className="text-lg text-red-600 font-medium mb-2">Order Summary</h4>
        <div className="space-y-3">
          {products.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <img src={item.img[0]} alt={item.product_name} className="w-12 h-12 object-cover rounded-md border border-gray-300" />
                <div className="flex flex-col flex-1">
                  <span className="font-medium capitalize">
                    {item.product_name} ({item.product_quantity})
                  </span>
                  <span className="text-xs text-gray-500 tabular-nums">
                    ₹{item.price} × {item.quantity}
                  </span>
                </div>
              </div>
              <span className="text-gray-900 font-medium">₹ {item.payable}</span>
            </div>
          ))}
          <hr className="w-full border-b border-gray-100 my-2" />
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-500">{orderDetail.item_count} items</span>
            <span className="text-sm text-black tabular-nums">₹{orderDetail.total_amount}</span>
          </div>
          <hr className="w-full border-b border-gray-100 my-2" />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Delivery</span>
            <span className="text-sm text-black tabular-nums">₹{orderDetail.delivery_charge}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">GST ({orderDetail.gst}%)</span>
            <span className="text-sm text-black tabular-nums">₹{orderDetail.gst_amount}</span>
          </div>
          <hr className="w-full border-b border-gray-100 my-2" />
          {orderDetail.payment_method === "cod" && (
            <>
              <div className="flex justify-between items-center font-medium mb-2">
                <span className="text-lg ">Total Payable:</span>
                <span className={`text-lg text-${status.color}-600 tabular-nums`}>₹ {orderDetail.payable_amount}</span>
              </div>
            </>
          )}
          {orderDetail.payment_method === "phonepe" && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Convenience Fees</span>
                <span className="text-sm text-red-600 tabular-nums">₹{orderDetail.convenience_fees}</span>
              </div>
              <hr className="w-full border-b border-gray-100 my-2" />
              <div className="flex justify-between items-center font-medium mb-2">
                <span className="text-lg ">Total Payable:</span>
                <span className={`text-lg text-${status.color}-600 tabular-nums`}>₹ {orderDetail.payable_amount}</span>
              </div>
            </>
          )}

          <hr className="w-full border-b border-gray-100 my-2" />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Payment Status</span>
            <span className={`text-sm text-${status.color}-600 capitalize`}>{orderDetail.payment_status}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Order Status</span>
            <span className={`text-sm text-${status.color}-600 capitalize`}>{orderDetail.order_status.toLowerCase()}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link href="/my-orders" className="bg-red-600 text-white text-center px-4 py-2 rounded-lg text-sm hover:bg-red-700">
          View Orders
        </Link>
        <Link href="/" className="border border-red-600 text-center text-black px-4 py-2 rounded-lg text-sm hover:bg-red-600 hover:text-white">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
