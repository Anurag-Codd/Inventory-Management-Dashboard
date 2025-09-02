import AuthLayout from "../../components/Auth/AuthLayout";
import Input from "../../components/Input";
import style from "./Auth.module.css";
import Button from "../../components/Button";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { updatePassword } from "../../store/features/authSlice";

const UpdatePass = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { Message, Error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    password: "",
    cnfPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetPass = async (e) => {
    e.preventDefault();
    try {
      if (formData.password.trim() !== formData.cnfPassword.trim()) {
        toast.error("Password did not match");
        return;
      }

      const res = await dispatch(
        updatePassword({ password: formData.password })
      ).unwrap();
      toast.success(res.message);
      navigate("/");
    } catch (error) {
      toast.error(error.error);
    }
  };

  return (
    <AuthLayout visual="/Group.png">
      <div className={style.formContainer}>
        <div>
          <h1 className={style.title}>Inventory Guru</h1>
          <p className={style.subtitle}>Be haste create some secure password</p>
        </div>
        <form onSubmit={handleResetPass} className={style.form}>
          <Input
            id="password"
            label="Enter New Password"
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
            Reset Password
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default UpdatePass;
