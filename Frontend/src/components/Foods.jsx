import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { FaCartPlus } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import logo from "../../src/assets/virat.png";

const Foods = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4001/api/v1/food/foods",
          {
            withCredentials: true,
          }
        );
        setData(data.foods);
        setFilteredData(data.foods);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching foods:", error);
        toast.error("Failed to fetch foods. Please try again.");
      }
    };
    fetchFoods();
  }, []);

  const handleLogout = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4001/api/v1/user/logout",
        {
          withCredentials: true,
        }
      );
      toast.success(data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  // Handle Add to Cart
  const handleAddToCart = (food) => {
    // Check if user is logged in
    if (!isLoggedIn) {
      toast.error("Please login to add items to cart");
      return;
    }

    // Get the current cart from localStorage, or create an empty array if it doesn't exist
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if the food item is already in the cart
    const isItemInCart = cart.some((item) => item._id === food._id);

    if (isItemInCart) {
      toast.error("Item is already in the cart");
      return;
    }

    // Add food to cart
    cart.push(food);

    // Save updated cart back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    toast.success("Item added to cart");
  };

  const handleSearch = () => {
    if (!searchQuery) {
      setFilteredData(data);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = data
      .filter((food) => food.title.toLowerCase().includes(query))
      .sort((a, b) =>
        a.title.toLowerCase().localeCompare(b.title.toLowerCase())
      );

    setFilteredData(results);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500 mt-20">Loading...</p>;
  }

  return (
    <div className="bg-black w-full min-h-screen">
      <div className="container mx-auto text-white">
        {/* Header */}
        <header className="bg-black fixed top-0 left-0 w-full flex justify-between items-center p-5 shadow-lg z-10">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
            <Link to="/" className="text-2xl font-bold text-white">
              Foodie
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="flex items-center border border-gray-600 rounded-full px-4 py-1 h-10">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search foods..."
                className="w-full text-gray-300 bg-transparent outline-none"
              />
              <FiSearch
                className="text-xl text-gray-300 cursor-pointer"
                onClick={handleSearch}
              />
            </div>

            <Link to="/cart" className="p-2">
              <FaCartPlus className="text-2xl text-white" />
            </Link>
            <Link
              to="/orders"
              className="text-md p-2 border border-white rounded"
            >
              Orders
            </Link>

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="text-md p-2 border border-white rounded"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-md p-2 border border-white rounded"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-md p-2 border border-white rounded"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-28 pb-10 px-6">
          {filteredData.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">No foods found</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              {filteredData.map((food) => (
                <div
                  key={food._id}
                  className="border border-gray-900 rounded-lg p-4 shadow-sm bg-gray-950 hover:shadow-lg transition-shadow"
                >
                  <img
                    src={food.image.url}
                    alt={food.title}
                    className="rounded mb-4 w-full h-40 object-cover"
                  />
                  <h2 className="font-bold text-lg mb-2 text-white">
                    {food.title}
                  </h2>
                  <p className="text-gray-400 mb-4">
                    {food.description.length > 80
                      ? `${food.description.slice(0, 80)}...`
                      : food.description}
                  </p>
                  <div className="flex justify-between items-center mb-4 text-white">
                    <span className="font-bold text-xl">
                      Rs {food.price}{" "}
                      <span className="text-gray-500 line-through">599</span>
                    </span>
                    <span className="text-green-500">20% off</span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(food)}
                    className="bg-blue-950 w-full text-center text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors block"
                  >
                    Add to Cart
                  </button>

                  <Link
                    to={`/buy/${food._id}`} //pass foodId in url
                    onClick={(e) => {
                      if (!isLoggedIn) {
                        e.preventDefault();
                        toast.error("Please login to buy");
                      }
                    }}
                    className="bg-orange-600 w-full text-center text-white mt-2 px-4 py-2 rounded-lg hover:bg-orange-500 transition-colors block"
                  >
                    Buy Now
                  </Link>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Foods;
