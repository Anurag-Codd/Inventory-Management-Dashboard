import { useState } from "react";
import style from "./Setting.module.css";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { logout, updateProfile } from "../../store/features/authSlice";
import { useNavigate } from "react-router";
import { X } from "lucide-react";

const Setting = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (
      (!formData.name || !formData.name.trim()) &&
      (!formData.password || !formData.password.trim())
    ) {
      toast.error("At least one field (name or password) must be provided");
      return;
    }

    if (
      formData.password &&
      formData.password.trim() &&
      formData.password.trim() !== formData.confirmPassword.trim()
    ) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const res = await dispatch(updateProfile(formData)).unwrap();
      toast.success(res.message);
    } catch (error) {
      toast.error(error.error);
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap()
      toast.success("logout Sucess")
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className={style.container}>
      <div className={style.contentArea}>
        <div className={style.tab}>
          <div className={style.activeTab}>Edit Profile</div>
        </div>

        <form onSubmit={handleUpdate} className={style.form}>
          <div className={style.inputContainer}>
            <Input
              id="name"
              label="Name"
              value={formData.name}
              onChange={handleChange}
              type="text"
              placeholder={user?.name || ""}
            />

            <Input
              id="email"
              label="Email"
              type="email"
              disabled={true}
              placeholder={user?.email || ""}
            />

            <Input
              id="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              placeholder="••••••••••••"
            />

            <Input
              id="confirmPassword"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              type="password"
              placeholder="••••••••••••"
            />
          </div>

          <div className={style.buttonContainer}>
            <Button className={style.logoutBtn} onClick={handleLogout}>
              logout
            </Button>
            <Button type="submit" className={style.saveBtn}>
              Save
            </Button>
          </div>
        </form>
        <div className={style.mobileClose} onClick={() => navigate(-1)}>
          <X />
        </div>
      </div>
    </div>
  );
};

export default Setting;
