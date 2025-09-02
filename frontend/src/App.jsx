import { Route, Routes, Navigate } from "react-router";
import Signup from "./pages/Auth/Signup";
import Login from "./pages/Auth/Login";
import ForgotPass from "./pages/Auth/ForgotPass";
import Home from "./pages/Dashboard/Home";
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import Product from "./pages/Dashboard/Product";
import OTPVerification from "./pages/Auth/OTPVerification";
import UpdatePass from "./pages/Auth/UpdatePass";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { refresh } from "./store/features/authSlice";
import Setting from "./pages/Dashboard/Setting";
import Invoice from "./pages/Dashboard/Invoice";
import Statistics from "./pages/Dashboard/Statistics";

const App = () => {
  const dispatch = useDispatch();
  const { isLoading, isAuthorized } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleRefresh = async () => {
      try {
        await dispatch(refresh()).unwrap();
      } catch (error) {
        console.error(error.error);
      }
    };
    handleRefresh();
  }, [dispatch]);

  if (isLoading)
    return (
      <div className="loader">
        <img src="/loader.gif" alt="loader" />
      </div>
    );

  return (
    <>
      <Toaster />
      <Routes>
        {!isAuthorized ? (
          <>
            <Route index element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-pass" element={<ForgotPass />} />
            <Route path="/otp" element={<OTPVerification />} />
            <Route path="/reset-password" element={<UpdatePass />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route element={<DashboardLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/product" element={<Product />} />
              <Route path="/invoice" element={<Invoice />} />
              <Route path="/stats" element={<Statistics />} />
              <Route path="/setting" element={<Setting />} />
            </Route>

            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </>
        )}
      </Routes>
    </>
  );
};

export default App;
