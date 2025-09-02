import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import style from "./Auth.module.css";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { login } from "../../store/features/authSlice";
import AuthLayout from "../../components/Auth/AuthLayout";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthorized } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const email = formData.email.trim().toLowerCase();
      if (!email || !formData.password) {
        toast.error("Plase enter valid credentails");
        return;
      }
      const res = await dispatch(login(formData)).unwrap();
      toast.success(res.message);
    } catch (error) {
      toast.error(error.error);
    }
  };

  useEffect(() => {
    if (isAuthorized) navigate("/home");
  }, [isAuthorized, navigate]);

  return (
    <AuthLayout info={true} visual="/main.png">
      <div className={style.formContainer}>
        <div>
          <h1 className={style.title}>Log in to your account</h1>
          <p className={style.subtitle}>
            Welcome back! Please enter your details
          </p>
        </div>
        <form onSubmit={handleLogin} className={style.form}>
          <Input
            id="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder="john@domain.com"
          />
          <Input
            id="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            placeholder="At least be 8 digit"
          />
          <Link to="/forgot-pass" style={{ textAlign: "end" }}>
            Forgot Password ?
          </Link>

          <Button type="submit" className={style.btn}>
            Log in
          </Button>
        </form>

        <span className={style.end}>
          Don't have an account ? <Link to="/signup">Sign up</Link>
        </span>
      </div>
    </AuthLayout>
  );
};

export default Login;
