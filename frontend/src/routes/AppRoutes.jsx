import { Routes, Route } from "react-router-dom";
import Home from '../pages/Home';
import Dashboard from "../pages/user/Dashboard";
import Explore from "../pages/user/Explore";
import Auth from "../pages/Auth";
import ExploreCategory from "../pages/user/ExploreCategory";
import TailorDashboard from "../pages/Tailor/Dashboard"
import OrdersListPage from "../pages/Tailor/OrdersList"
import Profile from "../pages/Tailor/Profile"
import Inventory from "../pages/Tailor/Inventory"
import AddProduct from "../pages/Tailor/AddProduct"
import Artisans from "../pages/user/Artisans"
import OrderList from "../pages/user/Order"

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/deshboard" element={<Dashboard />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/explore/:category" element={<ExploreCategory />} />
            <Route path="/tailordahboard" element={<TailorDashboard/>} />
            <Route path="/OrdersList" element={<OrdersListPage/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/inventory" element={<Inventory/>} />
            <Route path="/addproduct" element={<AddProduct/>} />
            <Route path="/Artisans" element={<Artisans/>} />
            <Route path="/OrderList" element={<OrderList/>} />

        </Routes>
    );
};

export default AppRoutes;