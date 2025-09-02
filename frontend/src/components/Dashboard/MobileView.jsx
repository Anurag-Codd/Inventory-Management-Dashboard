import style from "./MobileView.module.css";
import { Link, Outlet, useLocation } from "react-router";
import { ChartColumn, House, Inbox, ReceiptText, Settings } from "lucide-react";

const MobileView = () => {
  const location = useLocation();

  return (
    <div className={style.mobileLayout}>
      <div className={style.header}>
        <div className={style.mobileLogo}>
          <img src="/logo.png" alt="logo" />
        </div>
        <Link className={style.settingBtn} to="/setting">
          <Settings />
        </Link>
      </div>
      <hr />
      <div className={style.compWrapper}>
        <Outlet />
      </div>
      <nav className={style.mobileFooter}>
        <Link
          to="/home"
          className={location.pathname === "/home" ? style.active : ""}
        >
          <House />
          <span>Home</span>
        </Link>
        <Link
          to="/product"
          className={location.pathname === "/product" ? style.active : ""}
        >
          <Inbox />
          <span>Product</span>
        </Link>
        <Link
          to="/invoice"
          className={location.pathname === "/invoice" ? style.active : ""}
        >
          <ReceiptText />
          <span>Invoice</span>
        </Link>
        <Link
          to="/stats"
          className={location.pathname === "/stats" ? style.active : ""}
        >
          <ChartColumn />
          <span>Statistics</span>
        </Link>
      </nav>
    </div>
  );
};

export default MobileView;