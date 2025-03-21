import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Foods from "./components/Foods";
import { Toaster } from "react-hot-toast";
import Buy from "./components/Buy";
import Orders from "./components/Orders";
import Cart from "./components/Cart";
import AdminSignup from "./admin/AdminSignup";
import AdminLogin from "./admin/AdminLogin";
import Dashboard from "./admin/Dashboard";
import FoodCreate from "./admin/FoodCreate";
import UpdateFood from "./admin/UpdateFood";
import OurFoods from "./admin/OurFoods";

const App = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const admin = JSON.parse(localStorage.getItem("admin"));
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/foods" element={<Foods />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/buy/:foodId"
          element={ <Buy />}
        />

        {/* Admin Routes */}
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={admin ? <Dashboard /> : <Navigate to={"/admin/login"} />}
        />
        <Route path="/admin/create-food" element={<FoodCreate />} />
        <Route path="/admin/update-food/:id" element={<UpdateFood />} />
        <Route path="/admin/our-foods" element={<OurFoods />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
