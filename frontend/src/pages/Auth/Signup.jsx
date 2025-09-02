import { useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";

import style from "./Auth.module.css";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { signup } from "../../store/features/authSlice";
import AuthLayout from "../../components/Auth/AuthLayout";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cnfPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trim() }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const email = formData.email.trim().toLowerCase();
      if (!email || formData.password !== formData.cnfPassword) {
        toast.error("Please enter valid credentails");
        return;
      }
      const res = await dispatch(signup(formData)).unwrap();
      toast.success(res.message);
      navigate("/");
    } catch (error) {
      console.log(error)
      toast.error(error.error);
    }
  };

  return (
    <AuthLayout info={true} visual="/main.png">
      <div className={style.formContainer}>
        <div>
          <h1 className={style.title}>Create an account</h1>
          <p className={style.subtitle}>Start Inventory Management</p>
        </div>
        <form onSubmit={handleSignup} className={style.form}>
          <Input
            id="name"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            type="text"
            placeholder="Your Name"
          />
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
          <Input
            id="cnfPassword"
            label="Confirm Password"
            value={formData.cnfPassword}
            onChange={handleChange}
            type="password"
            placeholder="Confirm Password"
          />

          <Button type="submit" className={style.btn}>
            Sign up
          </Button>
        </form>

        <span className={style.end}>
          Do you have an account ? <Link to="/">Log in</Link>
        </span>
      </div>
    </AuthLayout>
  );
};

export default Signup;
