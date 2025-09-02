import { useFetchTop5ProductsQuery } from "../store/api/statsApi";
import style from "./TopProducts.module.css";

const TopProducts = () => {
  const { data } = useFetchTop5ProductsQuery();
  return (
    <>
      <h3 className={style.title}>Top Products</h3>
      <div className={style.items}>
        {data?.products.map((item, i) => (
          <div className={style.item} key={i}>
            <div>
              {data?.imageUrl && (
                <img src={item?.imageUrl} alt="Product" height="40px" />
              )}
            </div>
            <div>
              <p>{item.name}</p>
              <p>
                <span>⭐</span>
                <span>⭐</span>
                <span>⭐</span>
                <span>⭐</span>
                <span>⭐</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TopProducts;
