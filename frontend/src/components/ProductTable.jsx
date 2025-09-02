import Button from "./Button";
import { useEffect, useState } from "react";
import style from "./ProductTable.module.css";
import { useSearchParams } from "react-router";
import dateFormatter from "../utils/dateFormatter";

import {
  useCreateInvoiceMutation,
  useFetchProductsQuery,
  useLazySearchProductsQuery,
} from "../store/api/productApi";
import toast from "react-hot-toast";

const ProductTable = ({ setPopup }) => {
  const [page, setPage] = useState(1);
  const [product, setProduct] = useState("");
  const [popupInvoice, setPopupInvoice] = useState(false);

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("query");

  const { data } = useFetchProductsQuery({ page: page });
  const [createInvoice, { error }] = useCreateInvoiceMutation();
  const [triggerSearch, { data: searchData }] = useLazySearchProductsQuery();

  useEffect(() => {
    if (searchQuery && searchQuery.length > 2) {
      triggerSearch({ query: searchQuery });
    }
  }, [searchQuery, triggerSearch]);

  const handleCreateInvoice = async () => {
    try {
      await createInvoice({
        products: [{ productId: product._id, quantity: 1 }],
      }).unwrap();
      toast.success("Invoice Created");
      setPopupInvoice(false);
    } catch (err) {
      console.log(err);
      toast.error(error.data.error);
    }
  };

  const displayData = searchQuery && searchQuery.length > 2 ? searchData : data;

  return (
    <>
      <div className={style.panel} style={{ position: "relative" }}>
        <h3>Products</h3>
        <div className={style.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>Products</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Threshold</th>
                <th>Expiry Date</th>
                <th>Availability</th>
              </tr>
            </thead>
            <tbody>
              {displayData?.products.map((item, index) => (
                <tr
                  key={index}
                  onClick={() => {
                    setProduct(item);
                    setPopupInvoice(true);
                  }}
                >
                  <td>{item.name}</td>
                  <td>₹{item.price}</td>
                  <td>{item.quantity} Pack</td>
                  <td>{item.threshold}</td>
                  <td>{dateFormatter(item.expiryDate)}</td>
                  <td
                    className={
                      item.availability == "In Stock"
                        ? style.inStock
                        : item.availability === "Low Stock"
                        ? style.lowStock
                        : style.outStock
                    }
                  >
                    {item.availability}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={style.tableFooter}>
          <Button
            className={style.footerBtn}
            onClick={() => setPage((prev) => prev - 1)}
            disabled={page === 1}
          >
            Prev
          </Button>
          <span>
            Page {page} of {displayData?.totalPages}
          </span>
          <Button
            className={style.footerBtn}
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page === displayData?.totalPages}
          >
            Next
          </Button>
        </div>

        <Button className={style.prodBtn} onClick={() => setPopup(true)}>
          Add Product
        </Button>
      </div>
      {popupInvoice && (
        <div
          className={style.createBackdrop}
          onClick={() => setPopupInvoice(false)}
        >
          <div
            className={style.craeteContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Create Invoice</h2>
            <div className={style.productDeatisk}>
              <span>{product.name}</span>
              <span className={style.orderQuantity}>Quantity : 1</span>
            </div>
            <Button onClick={handleCreateInvoice}>Place Order</Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductTable;
