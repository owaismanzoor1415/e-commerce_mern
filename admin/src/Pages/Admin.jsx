import React from "react";
import AddProduct from "../Components/AddProduct/AddProduct";
import { Route, Routes } from "react-router-dom";
import ListProduct from "../Components/ListProduct/ListProduct";
import Dashboard from "../Components/Dashboard/Dashboard";
import Orders from "../Components/Orders/Orders";

const Admin = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/addproduct" element={<AddProduct />} />
      <Route path="/listproduct" element={<ListProduct />} />
      <Route path="/orders" element={<Orders />} />
    </Routes>
  );
};

export default Admin;

