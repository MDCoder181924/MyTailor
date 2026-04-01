import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

const Home = lazy(() => import("../pages/Home"));
const Auth = lazy(() => import("../pages/Auth"));
const Dashboard = lazy(() => import("../pages/user/Dashboard"));
const Explore = lazy(() => import("../pages/user/Explore"));
const ExploreCategory = lazy(() => import("../pages/user/ExploreCategory"));
const TailorDashboard = lazy(() => import("../pages/Tailor/Dashboard"));
const OrdersListPage = lazy(() => import("../pages/Tailor/OrdersList"));
const Profile = lazy(() => import("../pages/Tailor/Profile"));
const Inventory = lazy(() => import("../pages/Tailor/Inventory"));
const AddProduct = lazy(() => import("../pages/Tailor/AddProduct"));
const Artisans = lazy(() => import("../pages/user/Artisans"));
const OrderList = lazy(() => import("../pages/user/Order"));
const TailorProfileSettings = lazy(() => import("../pages/Tailor/TailorProfileSettings"));
const OrderProduct = lazy(() => import("../pages/user/OrdarProduct"));


const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-black text-sm text-gray-400">
    Loading...
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/deshboard" element={<Dashboard />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/explore/:category" element={<ExploreCategory />} />
        <Route path="/tailordahboard" element={<TailorDashboard />} />
        <Route path="/OrdersList" element={<OrdersListPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/Artisans" element={<Artisans />} />
        <Route path="/OrderList" element={<OrderList />} />
        <Route path="/TailorSettings" element={<TailorProfileSettings />} />
        <Route path="/OrdarProduct" element={<OrderProduct />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
