import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [data, setData] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [showOrderSummary, setShowOrderSummary] = useState(false); // For showing order summary
  const navigate = useNavigate();

  // token
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = savedCart.map((item) => ({
      ...item,
      quantity: item.quantity || 1,
    }));
    setCartItems(updatedCart);
  }, []);

  const handleRemoveFromCart = (foodId) => {
    const updatedCart = cartItems.filter((item) => item._id !== foodId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Item removed from cart");
  };

  const handleQuantityChange = (foodId, increment) => {
    const updatedCart = cartItems.map((item) =>
      item._id === foodId
        ? { ...item, quantity: Math.max(item.quantity + increment, 1) } // Ensure quantity is at least 1
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4001/api/v1/user/logout",
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response.data.errors || "Error in logging out");
    }
  };
  const handleBuyAll = () => {
    setShowOrderSummary(true);
  };

  const handleConfirmOrder = () => {
    // Optionally, here you could send the order data to your backend
    toast.success("Order placed successfully!");
    setShowOrderSummary(false); // Close the summary view
    setCartItems([]); // Clear cart items
    localStorage.removeItem("cart");
    navigate("/"); // Redirect to home page
  };

  return (
    <div className="bg-black w-full min-h-screen">
      <div className="container mx-auto text-white">
        {/* Header */}
        <header className="bg-black fixed top-0 left-0 w-full flex justify-between items-center p-5 shadow-lg z-10">
          <div className="flex items-center space-x-2">
            <Link to="/" className="text-2xl font-bold text-white">
              Foodie
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/orders"
              className="text-md p-2 border border-white rounded"
            >
              Orders
            </Link>
            <Link
              to={"/foods"}
              className="text-md p-2 border border-white rounded"
            >
              Explore Foods
            </Link>
            <div className="space-x-4">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="bg-transparent text-white text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to={"/login"}
                    className="bg-transparent text-white text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded"
                  >
                    Login
                  </Link>
                  <Link
                    to={"/signup"}
                    className="bg-transparent text-white text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded"
                  >
                    Signup
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-28 pb-10 px-6">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">
              Your cart is empty
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="border border-gray-900 rounded-lg p-4 shadow-sm bg-gray-950 hover:shadow-lg transition-shadow"
                >
                  <img
                    src={item.image.url}
                    alt={item.title}
                    className="rounded mb-4 w-full h-40 object-cover"
                  />
                  <h2 className="font-bold text-lg mb-2 text-white">
                    {item.title}
                  </h2>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => handleQuantityChange(item._id, -1)}
                      className="bg-gray-700 text-white px-3 py-1 rounded-md"
                    >
                      -
                    </button>
                    <span className="text-white">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item._id, 1)}
                      className="bg-gray-700 text-white px-3 py-1 rounded-md"
                    >
                      +
                    </button>
                  </div>

                  {/* Price */}
                  <div className="flex justify-between items-center mb-4 text-white">
                    <span className="font-bold text-xl">
                      Rs {item.price * item.quantity}
                    </span>
                  </div>

                  {/* Remove from Cart */}
                  <button
                    onClick={() => handleRemoveFromCart(item._id)}
                    className="bg-red-600 w-full text-center text-white px-4 py-2 rounded-lg hover:bg-red-500 transition-colors block"
                  >
                    Remove
                  </button>

                  {/* Buy Now */}
                  <Link
                    to={`/buy/${item._id}`}
                    className="bg-orange-600 w-full text-center text-white mt-2 px-4 py-2 rounded-lg hover:bg-orange-500 transition-colors block"
                  >
                    Buy Now
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Total Price */}
          {cartItems.length > 0 && (
            <div className="mt-6 text-right">
              <span className="font-bold text-xl text-white">
                Total: Rs {calculateTotal()}
              </span>
            </div>
          )}

          {/* Buy All Button */}
          {cartItems.length > 0 && !showOrderSummary && (
            <div className="mt-6 text-center">
              <button
                onClick={handleBuyAll}
                className="bg-green-600 px-6 py-3 text-white rounded-lg hover:bg-green-500 transition-colors"
              >
                Buy All
              </button>
            </div>
          )}

          {/* Order Summary Form (When Buy All is clicked) */}
          {showOrderSummary && (
            <div className="bg-gray-800 p-6 mt-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-4">
                Order Summary
              </h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between text-white"
                  >
                    <span>
                      {item.title} * {item.quantity}
                    </span>
                    <span>Rs {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-white mt-4 font-bold">
                <span>Total</span>
                <span>Rs {calculateTotal()}</span>
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={handleConfirmOrder}
                  className="bg-blue-600 px-6 py-3 text-white rounded-lg hover:bg-blue-500 transition-colors"
                >
                  Confirm Order
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Cart;
