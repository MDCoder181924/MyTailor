import { Routes, Route } from "react-router-dom";
import Home from '../pages/Home';
import Dashboard from "../pages/Dashboard";
import Explore from "../pages/Explore";
import Auth from "../pages/Auth";
import ExploreCategory from "../pages/ExploreCategory";
import TailorDashboard from "../pages/Tailor/Dashboard"
import OrdersListPage from "../pages/Tailor/OrdersList"
import Profile from "../pages/Tailor/Profile"

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

        </Routes>
    );
};

export default AppRoutes;