import { useRef, useState } from "react";
import { useAddProductMutation } from "../store/api/productApi";
import { useFetchOverviewQuery } from "../store/api/statsApi";
import toast from "react-hot-toast";
import style from "./SingleProduct.module.css";
import { X } from "lucide-react";
import Input from "./Input";
import Button from "./Button";

const SingleProduct = ({ onClose }) => {
  const imageRef = useRef();
  const [file, setFile] = useState();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [productData, setProductData] = useState({
    productName: "",
    productId: "",
    category: "",
    cost: "",
    marketPrice: "",
    quantity: "",
    unit: "",
    expiryDate: "",
    threshold: "",
  });

  const [addProduct, { isLoading ,error}] = useAddProductMutation();
  const { data } = useFetchOverviewQuery();
  const categories = data?.purchase.categories;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith("image/")) {
        setFile(selectedFile);
      } else {
        setFile(null);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(e.target);
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const selectedFile = e.dataTransfer.files[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith("image/")) {
        setFile(selectedFile);
      } else {
        setFile(null);
      }
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      if (
        !productData.productId ||
        !productData.productName ||
        !productData.category ||
        !productData.cost ||
        !productData.marketPrice ||
        !productData.quantity ||
        !productData.unit ||
        !productData.expiryDate ||
        !productData.threshold
      ) {
        toast.error("Missing product information");
      }

      if (!file) {
        toast.error("Image is required");
      }

      formData.append("product", JSON.stringify(productData));
      formData.append("image", file);

      await addProduct(formData).unwrap();
      toast.success("Product added successfully!");
      onClose();
    } catch (err) {
      toast.error(error.data.error);
      console.log(error)
    }
  };

  return (
    <div className={style.container} onClick={onClose}>
      <div
        className={`${style.card} ${style.singleProductCard}`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={style.header}>
          <h2>New Product</h2>
          <button className={style.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleAddProduct} className={style.formContent}>
          <div className={style.imageUpload}>
            <div
              className={style.uploadInputBox}
              onDragOver={(e) => e.preventDefault()}
              onDragLeave={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => file && imageRef.current.click()}
            >
              <input
                type="file"
                ref={imageRef}
                accept="image/*"
                className={style.fileInputField}
                required={true}
                onChange={handleFileChange}
              />
              {file && <img src={URL.createObjectURL(file)} />}
            </div>
            <div className={style.uploadText}>
              <span>Drag image here</span>
              <span>or</span>
              <span>Browse image</span>
            </div>
          </div>

          <Input
            type="text"
            required={true}
            id="productName"
            label={"Product Name"}
            placeholder="Enter product name"
            value={productData.productName}
            onChange={handleInputChange}
          />

          <Input
            type="text"
            label={"Product ID"}
            id="productId"
            required={true}
            placeholder="Enter product ID"
            value={productData.productId}
            onChange={handleInputChange}
          />

          <div className={style.selectGroup}>
            <label htmlFor="category" className={style.selectLabel}>
              Category
            </label>
            <input
              type="text"
              name="category"
              id="category"
              value={productData.category}
              placeholder="Select or type category"
              onChange={handleInputChange}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={style.selectInput}
            />
            {isDropdownOpen && (
              <div className={style.selectDropdown}>
                {categories?.map((category) => (
                  <li
                    key={category}
                    onClick={() => {
                      setProductData((prev) => ({ ...prev, category }));
                      setIsDropdownOpen(false);
                    }}
                  >
                    {category}
                  </li>
                ))}
              </div>
            )}
          </div>

          <Input
            type="text"
            id="cost"
            required={true}
            label={"Cost"}
            placeholder="Enter Product Cost"
            value={productData.cost}
            onChange={handleInputChange}
          />
          <Input
            type="text"
            id="marketPrice"
            required={true}
            label={"Price"}
            placeholder="Enter price"
            value={productData.marketPrice}
            onChange={handleInputChange}
          />

          <Input
            type="text"
            id="quantity"
            required={true}
            label={"Quantity"}
            placeholder="Enter product quantity"
            value={productData.quantity}
            onChange={handleInputChange}
          />

          <Input
            type="text"
            id="unit"
            label={"Unit"}
            required={true}
            value={productData.unit}
            onChange={handleInputChange}
            placeholder="Enter product unit"
          />

          <Input
            type="date"
            id="expiryDate"
            label={"Expiry Date"}
            required={true}
            placeholder="Enter expiry date"
            value={productData.expiryDate}
            onChange={handleInputChange}
          />

          <Input
            type="text"
            id="threshold"
            label={"Threshold Value"}
            required={true}
            placeholder="Enter threshold value"
            value={productData.threshold}
            onChange={handleInputChange}
          />

          <div className={style.formActions}>
            <Button className={style.discardBtn} onClick={onClose}>
              Discard
            </Button>
            <Button className={style.addBtn} type="submit">
              {isLoading ? "Adding..." : "Add Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SingleProduct;
