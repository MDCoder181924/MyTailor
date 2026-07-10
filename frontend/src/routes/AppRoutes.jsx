import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute, PublicRoute } from "../components/RouteGuard";

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
const TailorPublicProfile = lazy(() => import("../pages/user/TailorPublicProfile"));
const OrderList = lazy(() => import("../pages/user/Order"));
const TailorProfileSettings = lazy(() => import("../pages/Tailor/TailorProfileSettings"));
const OrderProduct = lazy(() => import("../pages/user/OrdarProduct"));
const UserProfiie = lazy(() => import("../pages/user/userProfiie"));
const Cart = lazy(() => import("../pages/user/Cart"));
const TailorTerms = lazy(() => import("../pages/TailorTerms"));

const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-black text-sm text-gray-400">
    Loading...
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Guest only routes (redirect to dashboard if logged in) */}
        <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
        <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />

        {/* Public pages available to everyone (guest or logged in) */}
        <Route path="/explore" element={<Explore />} />
        <Route path="/explore/:category" element={<ExploreCategory />} />
        <Route path="/Artisans" element={<Artisans />} />
        <Route path="/tailors/:tailorId" element={<TailorPublicProfile />} />
        <Route path="/tailor-terms" element={<TailorTerms />} />

        {/* Customer only routes */}
        <Route path="/deshboard" element={<ProtectedRoute allowedRole="user"><Dashboard /></ProtectedRoute>} />
        <Route path="/OrderList" element={<ProtectedRoute allowedRole="user"><OrderList /></ProtectedRoute>} />
        <Route path="/OrdarProduct" element={<ProtectedRoute allowedRole="user"><OrderProduct /></ProtectedRoute>} />
        <Route path="/userProfiie" element={<ProtectedRoute allowedRole="user"><UserProfiie /></ProtectedRoute>} />
        <Route path="/Cart" element={<ProtectedRoute allowedRole="user"><Cart /></ProtectedRoute>} />

        {/* Tailor only routes */}
        <Route path="/tailordahboard" element={<ProtectedRoute allowedRole="tailor"><TailorDashboard /></ProtectedRoute>} />
        <Route path="/OrdersList" element={<ProtectedRoute allowedRole="tailor"><OrdersListPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute allowedRole="tailor"><Profile /></ProtectedRoute>} />
        <Route path="/inventory" element={<ProtectedRoute allowedRole="tailor"><Inventory /></ProtectedRoute>} />
        <Route path="/addproduct" element={<ProtectedRoute allowedRole="tailor"><AddProduct /></ProtectedRoute>} />
        <Route path="/TailorSettings" element={<ProtectedRoute allowedRole="tailor"><TailorProfileSettings /></ProtectedRoute>} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
