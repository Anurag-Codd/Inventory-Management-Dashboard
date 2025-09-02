import { useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router";
import { useDispatch } from "react-redux";

import style from "./Auth.module.css";
import Input from "../../components/Input";
import Button from "../../components/Button";
import AuthLayout from "../../components/Auth/AuthLayout";
import { verifyOTP } from "../../store/features/authSlice";

const OTPVerification = () => {
  const location = useLocation();
  const naviagte = useNavigate();
  const email = location.state?.email;
  const [OTP, setOTP] = useState("");
  const dispatch = useDispatch();

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    try {
      const res= await dispatch(verifyOTP({ email, OTP: OTP })).unwrap();
      toast.success(res.message);
      naviagte("/reset-password");
    } catch (error) {
      toast.error(error.error);
    }
  };
  return (
    <AuthLayout visual="/Startup.png">
      <div className={style.formContainer}>
        <div>
          <h1 className={style.title}>Inventory Guru</h1>
          <p className={style.subtitle}>
            Check your email OTP is there. Put that here fast..
          </p>
        </div>
        <form onSubmit={handleOtpVerification} className={style.form}>
          <Input
            id="otp"
            label="OTP"
            value={OTP}
            onChange={(e) => setOTP(e.target.value)}
            type="Number"
            placeholder="xxxx08"
            inputStyle={style.otp}
          />
          <Button type="submit" className={style.btn}>
            Confirm
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default OTPVerification;
