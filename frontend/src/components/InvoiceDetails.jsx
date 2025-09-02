import dateFormatter from "../utils/dateFormatter";
import style from "./InvoiceDetails.module.css";
import { X, Download, Printer } from "lucide-react";

const InvoiceDetails = ({ data, setPopup, setDetailPopup }) => {
  console.log(data);
  return (
    <div
      className={style.invoiceBackdrop}
      onClick={() => {
        setPopup(null);
        setDetailPopup(null);
      }}
    >
      <div className={style.invoiceWrapper}>
        <div className={style.invoiceActions}>
          <button
            className={`${style.actionBtn} ${style.closeBtn}`}
            onClick={(e) => {
              e.stopPropagation();
              setDetailPopup(null);
            }}
          >
            <X size={18} />
          </button>
          <button
            className={`${style.actionBtn} ${style.downloadBtn}`}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Download size={18} />
          </button>
          <button
            className={`${style.actionBtn} ${style.printBtn}`}
            onClick={(e) => {
              e.stopPropagation();
              window.print();
            }}
          >
            <Printer size={18} />
          </button>
        </div>
        <div
          className={style.invoiceContainer}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={style.invoiceHeader}>
            <h1>INVOICE</h1>
            <h3>Billed to</h3>
            <div className={style.invoiceBilling}>
              <div className={style.billedTo}>
                <h3>{data.user.name}</h3>
                <p>{data.user.address}</p>
                <p>{data.user.contact}</p>
              </div>
              <div className={style.businessInfo}>
                <h3>Business address</h3>
                <p>City, State, IN - 000 000</p>
                <p>TNX-{data._id}</p>
              </div>
            </div>
          </div>

          <div className={style.invoiceContent}>
            <div className={style.invoiceDetails}>
              <div className={style.detailRow}>
                <div className={style.detailLabel}>Invoice #</div>
                <div className={style.detailValue}>{data.invoiceId}</div>
              </div>
              <div className={style.detailRow}>
                <div className={style.detailLabel}>Invoice date</div>
                <div className={style.detailValue}>
                  {dateFormatter(data.createdAt)}
                </div>
              </div>
              <div className={style.detailRow}>
                <div className={style.detailLabel}>Reference</div>
                <div className={style.detailValue}>{data.referenceId}</div>
              </div>
              <div className={style.detailRow}>
                <div className={style.detailLabel}>Due date</div>
                <div className={style.detailValue}>{data.status || ""}</div>
              </div>
            </div>
            <div className={style.invoiceTable}>
              <table>
                <thead>
                  <tr>
                    <th>Products</th>
                    <th>Qty</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {data.products.map((p) => 
                    <tr key={p.productId}>
                      <td>{p.name}</td>
                      <td>{p.quantity}</td>
                      <td>{p.productTotal}</td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={2}>Subtotal</td>
                    <td>₹{data.subtotal}</td>
                  </tr>
                  <tr>
                    <td colSpan={2}>Tax ({data.tax}%)</td>
                    <td>{(data.subtotal * data.tax)/100}</td>
                  </tr>
                  <tr>
                    <td colSpan={2}>Total due</td>
                    <td>₹{data.total}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <p className={style.note}>
            Please pay within 15 days of receiving this invoice.
          </p>
          <div className={style.invoiceFooter}>
            <div className={style.footerLeft}>
              <a href="https://www.recehtol.inc">www.recehtol.inc</a>
            </div>
            <div className={style.footerCenter}>
              <p>+91 00000 00000</p>
            </div>
            <div className={style.footerRight}>
              <p>hello@email.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
