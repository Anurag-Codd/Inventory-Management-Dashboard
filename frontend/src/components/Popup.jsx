import { useState } from "react";
import Button from "./Button";
import style from "./Popup.module.css";
import SingleProduct from "./SingleProduct";
import MultiProduct from "./MultiProduct";

const Popup = ({ onClose }) => {
  const [selectCreate, setSelectCreate] = useState("main");

  if (selectCreate === "single") return <SingleProduct onClose={onClose} />;

  if (selectCreate === "multiple") return <MultiProduct onClose={onClose} />;

  return (
    <div className={style.container} onClick={onClose}>
      <div
        className={style.card}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Button onClick={() => setSelectCreate("single")}>
          individual product
        </Button>
        <Button onClick={() => setSelectCreate("multiple")}>
          Multiple product
        </Button>
      </div>
    </div>
  );
};

export default Popup;
