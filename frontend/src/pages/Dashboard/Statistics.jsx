import { useEffect, useState } from "react";
import styles from "./Statistics.module.css";
import MyChart from "../../components/MyChart";
import TopProducts from "../../components/TopProducts";
import { useFetchCompareMonthDataQuery } from "../../store/api/statsApi";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWidget,
  setStaticsOrder,
  updateWidget,
} from "../../store/features/widgetSlice";

const Statistics = () => {
  const dispatch = useDispatch();
const { user } = useSelector((state)=>state.auth);
    const { statics } = useSelector((state) => state.widget);
  const { data } = useFetchCompareMonthDataQuery();

  const [topPanelOrder, setTopPanelOrder] = useState([
    "revenue",
    "sold",
    "stock",
  ]);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchWidget(user._id));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (statics) {
      const order = [];
      const positions = [
        { key: "revenue", pos: statics.revenue },
        { key: "sold", pos: statics.sold },
        { key: "stock", pos: statics.inStock },
      ];
      positions
        .sort((a, b) => a.pos - b.pos)
        .forEach((p) => order.push(p.key));

      setTopPanelOrder(order);
    }
  }, [statics]);

  const handleDragStart = (event, panel) => {
    event.dataTransfer.setData("panel", panel);
  };

  const handleDrop = (event, targetPanel) => {
    event.preventDefault();
    const draggedPanel = event.dataTransfer.getData("panel");

    if (draggedPanel !== targetPanel) {
      const newOrder = [...topPanelOrder];
      const draggedIndex = newOrder.indexOf(draggedPanel);
      const targetIndex = newOrder.indexOf(targetPanel);

      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedPanel);
      setTopPanelOrder(newOrder);

      const staticsPositions = {
        revenue: newOrder.indexOf("revenue") + 1,
        sold: newOrder.indexOf("sold") + 1,
        inStock: newOrder.indexOf("stock") + 1,
      };
      dispatch(setStaticsOrder(staticsPositions));
      dispatch(updateWidget({ userId: user._id, statics: staticsPositions }));
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const renderTopPanel = (panel) => {
    if (panel === "revenue") {
      return (
        <div
          key="revenue"
          className={`${styles.topPanel} ${styles.revenue}`}
          draggable
          onDragStart={(event) => handleDragStart(event, "revenue")}
          onDrop={(event) => handleDrop(event, "revenue")}
          onDragOver={handleDragOver}
        >
          <h3 className={styles.panelTitle}>Total Revenue</h3>
          <div className={styles.statsText}>
            <span>₹{Math.round(data?.currentMonthRevenue)}</span>
            <span>{data?.revenueChangePercentage}% from last month</span>
          </div>
        </div>
      );
    }
    if (panel === "sold") {
      return (
        <div
          key="sold"
          className={`${styles.topPanel} ${styles.sold}`}
          draggable
          onDragStart={(event) => handleDragStart(event, "sold")}
          onDrop={(event) => handleDrop(event, "sold")}
          onDragOver={handleDragOver}
        >
          <h3 className={styles.panelTitle}>Products Sold</h3>
          <div className={styles.statsText}>
            <span>{data?.currentMonthProductSold}</span>
            <span>{data?.productSoldChangePercentage}% from last month</span>
          </div>
        </div>
      );
    }
    if (panel === "stock") {
      return (
        <div
          key="stock"
          className={`${styles.topPanel} ${styles.stock}`}
          draggable
          onDragStart={(event) => handleDragStart(event, "stock")}
          onDrop={(event) => handleDrop(event, "stock")}
          onDragOver={handleDragOver}
        >
          <h3 className={styles.panelTitle}>Products in Stock</h3>
          <div className={styles.statsText}>
            <span>{data?.currentMonthProductStock}</span>
            <span>{data?.stockChangePercentage}% from last month</span>
          </div>
        </div>
      );
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.topContainer}>
        {topPanelOrder.map((panel) => renderTopPanel(panel))}
      </div>
      <div className={styles.bottomContainer}>
        <div className={styles.largePanel}>
          <MyChart />
        </div>
        <div className={styles.rightPanel}>
          <TopProducts />
        </div>
      </div>
    </div>
  );
};

export default Statistics;
