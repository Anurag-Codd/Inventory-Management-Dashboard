import style from "./DesktopView.module.css";
import {
  Link,
  useLocation,
  Outlet,
  useNavigate,
  useSearchParams,
} from "react-router";
import {
  ChartColumn,
  House,
  Inbox,
  ReceiptText,
  Search,
  Settings,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const DesktopView = () => {
  const { user } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      if (location.pathname === "/product" && searchParams.get("query")) {
        setSearchParams({});
      }
      return;
    }
    const timer = setTimeout(() => {
      if (location.pathname === "/product") {
        setSearchParams({ query: searchQuery });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, location.pathname, setSearchParams,searchParams]);

  return (
    <div className={style.desktopLayout}>
      <section className={style.sidebar}>
        <div className={style.logo}>
          <img src="/logo.png" alt="logo" />
          <span>Inventory Guru</span>
        </div>
        <hr />
        <div className={style.option}>
          <Link
            to="/home"
            className={location.pathname === "/home" ? style.activePath : ""}
          >
            <House />
            Home
          </Link>
          <Link
            to="/product"
            className={location.pathname === "/product" ? style.activePath : ""}
          >
            <Inbox />
            Product
          </Link>
          <Link
            to="/invoice"
            className={location.pathname === "/invoice" ? style.activePath : ""}
          >
            <ReceiptText />
            Invoice
          </Link>
          <Link
            to="/stats"
            className={location.pathname === "/stats" ? style.activePath : ""}
          >
            <ChartColumn />
            Statistics
          </Link>
          <Link
            to="/setting"
            className={location.pathname === "/setting" ? style.activePath : ""}
          >
            <Settings />
            Setting
          </Link>
        </div>
        <hr />
        <div className={style.userInfo}>
          <img src="/user.svg" alt="user" />
          <span>{user?.name}</span>
        </div>
      </section>
      <section className={style.dashboard}>
        <div className={style.header}>
          <h3>
            {location.pathname === "/home"
              ? "Home"
              : location.pathname === "/product"
              ? "Product"
              : location.pathname === "/invoice"
              ? "Invoice"
              : location.pathname === "/stats"
              ? "Stats"
              : "Setting"}
          </h3>
          <div className={style.searchbar}>
            <Search size={18} />
            <input
              type="search"
              name="search"
              id="search"
              value={searchQuery || ""}
              placeholder="Search here..."
              onFocus={() => navigate("/product")}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <hr />
        <div className={style.compWrapper}>
          <Outlet />
        </div>
      </section>
    </div>
  );
};

export default DesktopView;
