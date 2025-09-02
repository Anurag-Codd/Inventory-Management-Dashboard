import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";

import style from "./Auth.module.css";
import Input from "../../components/Input";
import Button from "../../components/Button";
import AuthLayout from "../../components/Auth/AuthLayout";
import { forgotPassword } from "../../store/features/authSlice";

const ForgotPass = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSendingMail = async (e) => {
    e.preventDefault();
    try {
      const normalEmail = email.trim().toLowerCase();
      if (!normalEmail) {
        toast.error("Email is not valid");
        return;
      }
      const res = await dispatch(
        forgotPassword({ email: normalEmail })
      ).unwrap();
      toast.success(res.message);
      navigate("/otp", { state: { email: normalEmail } });
    } catch (error) {
      toast.error(error.error);
    }
  };

  return (
    <AuthLayout visual="/women.png">
      <div className={style.formContainer}>
        <div>
          <h1 className={style.title}>Inventory Guru</h1>
          <p className={style.subtitle}>
            Please enter your registered email ID to receive an OTP
          </p>
        </div>
        <form onSubmit={handleSendingMail} className={style.form}>
          <Input
            id="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter your registered email"
          />
          <Button type="submit" className={style.btn}>
            Send mail
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ForgotPass;
