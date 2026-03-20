import { Routes, Route } from "react-router-dom";
import Home from '../pages/Home';
import Dashboard from "../pages/Dashboard";
import Explore from "../pages/Explore";
import Auth from "../pages/Auth";
import ExploreCategory from "../pages/ExploreCategory";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/deshboard" element={<Dashboard />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/explore/:category" element={<ExploreCategory />} />
        </Routes>
    );
};

export default AppRoutes;