import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../src/assets/virat.png";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import toast from "react-hot-toast";

const Home = () => {
  const [data, setData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
    const fetchFoods = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4001/api/v1/food/foods",
          {
            withCredentials: true,
          }
        );
        setData(response.data.foods);
      } catch (error) {
        console.log("Error in fetch food", error);
      }
    };
    fetchFoods();
  }, []);

  // logout
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

  var settings = {
    dots: true,
    infinite: true,
    speed: 900,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="bg-gradient-to-r from-black to-black w-full min-h-screen flex flex-col">
      <div className="text-white container mx-auto">
        {/* Header */}
        <header>
          <nav className="flex justify-between items-center py-4 ">
            <div className="flex space-x-2 items-center">
              <img src={logo} alt="" className="h-10 w-10 rounded-full" />
              <h1 className="text-2xl text-white font-bold">Foodie</h1>
            </div>
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
          </nav>
        </header>

        {/* Main section */}

        <div>
          <div>
            <h1 className="text-4xl text-white font-bold py-4">
              Welcome to
              <span className="text-blue-500"> Foodie</span>
            </h1>
            <p className="text-white text-lg py-4">
              "Discover the convenience of food at your fingertips! Our food
              ordering platform brings your favorite meals right to your door.
              With a wide selection of restaurants, fast delivery, and easy
              ordering, satisfying your cravings has never been simpler. Enjoy a
              delicious experience every time, no matter where you are!"
            </p>
          </div>
          <div className="flex justify-center py-4">
            <Link
              to={"/foods"}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-full"
            >
              Explore Foods
            </Link>
          </div>
        </div>

        <div>
          <section className="py-6">
            <Slider {...settings}>
              {data.map((food) => (
                <div key={food._id} className="p-4 ">
                  <div className="relative flex-shrink-0 w-96 transition-transform duration-500 transform hover:scale-105">
                    <div className="bg-gray-900 rounded-lg overflow-hidden m-6 ">
                      <img
                        src={food.image.url}
                        alt=""
                        className="w-full h-32 object-contain"
                      />
                      <div className="p-6 text-center">
                        <h2 className="text-xl text-white font-bold">
                          {food.title}
                        </h2>
                        <p className="text-lg text-white">{food.description}</p>
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
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </section>
        </div>

        <hr />
        {/* Footer */}
        <footer className="mt-4">
          <div className="flex justify-between items-center py-4">
            <div className=" flex flex-col py-4">
              <h1 className="text-white font-bold text-xl">
                Follow us on social media
              </h1>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/" target="_blank">
                  <FaFacebook className="text-3xl text-white" />
                </a>
                <a href=" https://www.instagram.com/" target="_blank">
                  <FaInstagram className="text-3xl text-white" />
                </a>
                <a href=" https://www.x.com/" target="_blank">
                  <FaXTwitter className="text-3xl text-white" />
                </a>
              </div>
            </div>
            <div className=" items-center flex flex-col ">
              <p className="text-lg font-semibold mb-4 text-white text-center">
                Copyright &copy; 2025 Foodie. All rights reserved.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="hover:text-white cursor-pointer duration-500">
                  Terms & Condition
                </li>
                <li className="hover:text-white cursor-pointer duration-500">
                  {" "}
                  Privacy Policy
                </li>
                <li className="hover:text-white cursor-pointer duration-500">
                  {" "}
                  Refund and cancellation
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
export default Home;
