import style from "./Pro&Inv.module.css";
import { useFetchLast7DaysProductQuery } from "../../store/api/statsApi";
import ProductTable from "../../components/ProductTable";
import { useState } from "react";
import Popup from "../../components/Popup";

const Product = () => {
  const [popup, setPopup] = useState(false);
  const { data: productInventory } = useFetchLast7DaysProductQuery();

  return (
    <>
      <div className={style.container}>
        <div className={style.panel}>
          <h3>Overall Inventory</h3>
          <div className={style.inventoryRow}>
            <div className={style.statsCard}>
              <h3>Category</h3>
              <div className={style.statsContent}>
                <div title="static value">
                  <p>14</p>
                  <span>Last 7 days</span>
                </div>
                <div>
                  <p>{productInventory?.categories.length}</p>
                  <span>Total</span>
                </div>
              </div>
            </div>
            <hr />
            <div className={style.statsCard}>
              <h3>Total Products</h3>
              <div className={style.statsContent}>
                <div>
                  <p>{productInventory?.sold}</p>
                  <span>Last 7 days</span>
                </div>
                <div>
                  <p>₹{productInventory?.revenue}</p>
                  <span>Revenue</span>
                </div>
              </div>
            </div>
            <hr />
            <div className={style.statsCard}>
              <h3>Top Selling</h3>
              <div className={style.statsContent}>
                <div title="static value">
                  <p>5</p>
                  <span>Last 7 days</span>
                </div>
                <div>
                  <p>₹{productInventory?.topFive}</p>
                  <span>Cost</span>
                </div>
              </div>
            </div>
            <hr />
            <div className={style.statsCard}>
              <h3>Low Stock</h3>
              <div className={style.statsContent}>
                <div>
                  <p>{productInventory?.lowStockCount}</p>
                  <span>Low Stock</span>
                </div>
                <div>
                  <p>{productInventory?.outOfStockCount}</p>
                  <span>Not in Stock</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ProductTable setPopup={setPopup} />
      </div>
      {popup && <Popup onClose={() => setPopup(false)} />}
    </>
  );
};

export default Product;
