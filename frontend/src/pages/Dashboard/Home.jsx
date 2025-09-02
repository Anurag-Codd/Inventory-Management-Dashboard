import { useEffect, useState } from "react";
import styles from "./Home.module.css";
import MyChart from "../../components/MyChart";
import TopProducts from "../../components/TopProducts";
import { useFetchOverviewQuery } from "../../store/api/statsApi";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWidget,
  updateWidget,
} from "../../store/features/widgetSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { data } = useFetchOverviewQuery();
  const { home } = useSelector((state) => state.widget);
  const [leftColumnOrder, setLeftColumnOrder] = useState(["overview", "chart"]);
  const [rightColumnOrder, setRightColumnOrder] = useState([
    "summary",
    "topProducts",
  ]);

  const handleDragStart = (event, column, group) => {
    event.dataTransfer.setData("column", column);
    event.dataTransfer.setData("group", group);
  };

  const handleDrop = (event, column, targetGroup) => {
    event.preventDefault();
    const draggedColumn = event.dataTransfer.getData("column");
    const draggedGroup = event.dataTransfer.getData("group");

    if (draggedColumn !== column) return;

    const newOrder =
      column === "left" ? [...leftColumnOrder] : [...rightColumnOrder];

    const draggedIndex = newOrder.indexOf(draggedGroup);
    const targetIndex = newOrder.indexOf(targetGroup);

    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedGroup);

    if (column === "left") {
      setLeftColumnOrder(newOrder);
      dispatch(
        updateWidget({
          userId: user._id,
          home: { ...home, leftOrder: newOrder, rightOrder: rightColumnOrder },
        })
      );
    } else {
      setRightColumnOrder(newOrder);
      dispatch(
        updateWidget({
          userId: user._id,
          home: { ...home, leftOrder: leftColumnOrder, rightOrder: newOrder },
        })
      );
    }
  };

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchWidget(user._id));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (home?.leftOrder && home?.rightOrder) {
      setLeftColumnOrder(home.leftOrder);
      setRightColumnOrder(home.rightOrder);
    }
  }, [home]);

  const renderGroup = (column, group) => {
    if (column === "left" && group === "overview") {
      return (
        <div
          key="leftGroup"
          className={styles.leftGroup}
          draggable
          onDragStart={(event) => handleDragStart(event, "left", "overview")}
          onDrop={(event) => handleDrop(event, "left", "overview")}
          onDragOver={(e)=>e.preventDefault()}
        >
          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Sales Overview</h3>
            <div className={styles.statsRow}>
              <div className={styles.statsCard}>
                <img src="Sales.png" alt="sales icon" />
                <div className={styles.statsText}>
                  <span>{data?.sales.sales}</span>
                  <span>Sales</span>
                </div>
              </div>
              <div className={styles.statsCard}>
                <img src="Revenue.png" alt="revenue icon" />
                <div className={styles.statsText}>
                  <span>₹{data?.sales.revenue}</span>
                  <span>Revenue</span>
                </div>
              </div>
              <div className={styles.statsCard}>
                <img src="Profit.png" alt="profit icon" />
                <div className={styles.statsText}>
                  <span>₹{data?.sales.profit}</span>
                  <span>Profit</span>
                </div>
              </div>
              <div className={styles.statsCard}>
                <img src="Cost.png" alt="cost icon" />
                <div className={styles.statsText}>
                  <span>₹{data?.sales.soldCost}</span>
                  <span>Cost</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Purchase Overview</h3>
            <div className={styles.statsRow}>
              <div className={styles.statsCard}>
                <img src="Purchase.png" alt="purchase icon" />
                <div className={styles.statsText}>
                  <span>{data?.purchase.purchase}</span>
                  <span>Purchase</span>
                </div>
              </div>
              <div className={styles.statsCard}>
                <img src="Cost2.png" alt="cost icon" />
                <div className={styles.statsText}>
                  <span>₹{data?.purchase.purchaseCost}</span>
                  <span>Cost</span>
                </div>
              </div>
              <div className={styles.statsCard} title="static value">
                <img src="Cancel.png" alt="cancel icon" />
                <div className={styles.statsText}>
                  <span>5</span>
                  <span>Cancel</span>
                </div>
              </div>
              <div className={styles.statsCard} title="static value">
                <img src="Return.png" alt="return icon" />
                <div className={styles.statsText}>
                  <span>₹879</span>
                  <span>Return</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (column === "left" && group === "chart") {
      return (
        <div
          key="largePanel"
          className={`${styles.largePanel} ${styles.panel}`}
          draggable
          onDragStart={(event) => handleDragStart(event, "left", "chart")}
          onDrop={(event) => handleDrop(event, "left", "chart")}
          onDragOver={(e)=>e.preventDefault()}
        >
          <MyChart />
        </div>
      );
    }

    if (column === "right" && group === "summary") {
      return (
        <div
          key="rightGroup"
          className={styles.leftGroup}
          draggable
          onDragStart={(event) => handleDragStart(event, "right", "summary")}
          onDrop={(event) => handleDrop(event, "right", "summary")}
          onDragOver={(e)=>e.preventDefault()}
        >
          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Inventory Summary</h3>
            <div className={styles.statsRow}>
              <div className={styles.statsCard}>
                <img src="Quantity.png" alt="quantity icon" />
                <div className={styles.statsText}>
                  <span>{data?.purchase.productInHand}</span>
                  <span>In Stock</span>
                </div>
              </div>
              <div className={styles.statsCard} title="static value">
                <img src="onway.png" alt="On the way icon" />
                <div className={styles.statsText}>
                  <span>20</span>
                  <span>Inbound</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Product Summary</h3>
            <div className={styles.statsRow}>
              <div className={styles.statsCard} title="static value">
                <img src="Suppliers.png" alt="Suppliers icon" />
                <div className={styles.statsText}>
                  <span>27</span>
                  <span>Suppliers</span>
                </div>
              </div>
              <div className={styles.statsCard}>
                <img src="Categories.png" alt="Categories icon" />
                <div className={styles.statsText}>
                  <span>{data?.purchase.categories.length}</span>
                  <span>Categories</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (column === "right" && group === "topProducts") {
      return (
        <div
          key="rightLargePanel"
          className={`${styles.largePanel} ${styles.panel}`}
          draggable
          onDragStart={(event) =>
            handleDragStart(event, "right", "topProducts")
          }
          onDrop={(event) => handleDrop(event, "right", "topProducts")}
          onDragOver={(e)=>e.preventDefault()}
        >
          <TopProducts />
        </div>
      );
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.column}>
        {leftColumnOrder.map((group) => renderGroup("left", group))}
      </div>
      <div className={styles.column}>
        {rightColumnOrder.map((group) => renderGroup("right", group))}
      </div>
    </div>
  );
};

export default Home;
