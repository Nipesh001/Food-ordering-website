import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Check user login status
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token; // using optional chaining to avoid app crashing

  console.log("Orders: ", orders);

  // Token handling
  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  if (!token) {
    navigate("/login");
  }

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4001/api/v1/user/purchases`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setOrders(response.data.foodData);
      } catch (error) {
        setErrorMessage("Failed to fetch orders data");
      }
    };
    fetchOrders();
  }, []);

  // Logout handler
  const handleLogout = useCallback(async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4001/api/v1/user/logout",
        { withCredentials: true }
      );
      toast.success(data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.error("Error in logging out:", error);
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  }, [navigate]);

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
              to="/foods"
              className="text-md p-2 border border-white rounded"
            >
              Explore Foods
            </Link>
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
                  to="/login"
                  className="bg-transparent text-white text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-transparent text-white text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </header>

        {/* Render orders */}
        <div className="pt-20">
          <h2 className="font-bold my-6 ">My Orders</h2>
          {errorMessage && (
            <div className="text-red-500 text-center mb-4">{errorMessage}</div>
          )}
          {orders.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* {console.log("Orders:", orders)} */}
              {orders.map((purchase, index) => (
                <div
                  key={index}
                  className="bg-gray-950 rounded-lg shadow-md p-6 mb-6"
                >
                  <div className="flex flex-col items-center space-y-4">
                    <img
                      className="rounded-lg w-full h-48 object-cover"
                      src={
                        purchase.image?.url || "https://via.placeholder.com/200"
                      }
                      alt={purchase.title || "Food Image"}
                    />
                    <div className="text-center">
                      <h3 className="text-lg font-bold">{purchase.title}</h3>
                      <p className="text-gray-500">
                        {purchase.description?.length > 100
                          ? `${purchase.description.slice(0, 100)}...`
                          : purchase.description}
                      </p>
                      <span className="text-green-700 font-semibold text-sm">
                        ${purchase.price} only
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !errorMessage && (
              <p className="text-gray-500 text-center mt-6">
                You have no orders yet.
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
