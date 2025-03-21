import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";

const OurFoods = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check admin login status
  const admin = JSON.parse(localStorage.getItem("admin"));
  const token = admin?.token; // using optional chaining to avoid app crashing

  //fetch foods
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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching foods:", error);
        toast.error("Failed to fetch foods. Please try again.");
      }
    };
    fetchFoods();
  }, []);

  //delete foods
  const handleDelete = async (id) => {
    if (!token) {
      toast.error("Please login first as Admin");
      navigate("/admin/login");
      return;
    }
    try {
      const response = await axios.delete(
        `http://localhost:4001/api/v1/food/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      toast.success(response.data.message || "Food deleted successfully!");
      const updateddata = data.filter((food) => food._id !== id);
      setData(updateddata);
    } catch (error) {
      console.error("Error deleting food:", error);
      toast.error(
        error.response.data.message ||
          "Failed to delete food. Please try again."
      );
    }
  };

  if (loading) {
    return <p className=" text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="bg-gray-100 p-8 space-y-4">
      <h1 className="text-3xl font-bold text-center mb-8">Our foods</h1>
      <Link
        className="bg-orange-400 py-2 px-4 rounded-lg text-white hover:bg-orange-950 duration-300"
        to={"/admin/dashboard"}
      >
        Go to dashboard
      </Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((food) => (
          <div key={food._id} className="bg-white shadow-md rounded-lg p-4">
            {/* food Image */}
            <img
              src={food?.image?.url}
              alt={food.title}
              className="h-40 w-full object-cover rounded-t-lg"
            />
            {/* food Title */}
            <h2 className="text-xl font-semibold mt-4 text-gray-800">
              {food.title}
            </h2>
            {/* food Description */}
            <p className="text-gray-600 mt-2 text-sm">
              {food.description.length > 200
                ? `${food.description.slice(0, 200)}...`
                : food.description}
            </p>
            {/* food Price */}
            <div className="flex justify-between mt-4 text-gray-800 font-bold">
              <div>
                {" "}
                ₹{food.price}{" "}
                <span className="line-through text-gray-500">₹300</span>
              </div>
              <div className="text-green-600 text-sm mt-2">10 % off</div>
            </div>

            <div className="flex justify-between">
              <Link
                to={`/admin/update-food/${food._id}`}
                className="bg-orange-500 text-white py-2 px-4 mt-4 rounded hover:bg-blue-600"
              >
                Update
              </Link>
              <button
                onClick={() => handleDelete(food._id)}
                className="bg-red-500 text-white py-2 px-4 mt-4 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurFoods;
