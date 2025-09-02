import { useState } from "react";
import style from "./Pro&Inv.module.css";
import { useFetchLast7DaysInvoiceQuery } from "../../store/api/statsApi";
import InvoiceDetails from "../../components/InvoiceDetails";
import InvoiceTable from "../../components/InvoiceTable";

const Invoice = () => {
  const [page, setPage] = useState(1);
  const [popup, setPopup] = useState(null);
  const [detailPopup, setDetailPopup] = useState(null);

  const { data: invoiceData } = useFetchLast7DaysInvoiceQuery();

  const handleViewInvoice = (invoiceData) => {
    setDetailPopup(invoiceData);
  };

  return (
    <>
      <div
        className={style.container}
        onClick={() => {
          setDetailPopup(null);
          setPopup(null);
        }}
      >
        <div className={style.panel}>
          <h3>Overall Invoice</h3>
          <div className={style.inventoryRow}>
            <div className={style.statsCard}>
              <h3>Recent Transections</h3>
              <div className={style.statsContent}>
                <div>
                  <p>{invoiceData?.transactions}</p>
                  <span>Last 7 days</span>
                </div>
              </div>
            </div>
            <hr />
            <div className={style.statsCard}>
              <h3>Total Invoices</h3>
              <div className={style.statsContent}>
                <div>
                  <p>{invoiceData?.invoicesCount}</p>
                  <span>Last 7 days</span>
                </div>
                <div>
                  <p>{invoiceData?.processCount}</p>
                  <span>Processed</span>
                </div>
              </div>
            </div>
            <hr />
            <div className={style.statsCard}>
              <h3>Paid Amount</h3>
              <div className={style.statsContent}>
                <div>
                  <p>₹{Math.round(invoiceData?.sold)}</p>
                  <span>Last 7 days</span>
                </div>
                <div title="static value">
                  <p>563</p>
                  <span>Customers</span>
                </div>
              </div>
            </div>
            <hr />
            <div className={style.statsCard}>
              <h3>Unpaid Amount</h3>
              <div className={style.statsContent}>
                <div>
                  <p>{invoiceData?.totalInvoicesCount}</p>
                  <span>Ordered</span>
                </div>
                <div>
                  <p>{invoiceData?.pendingOrders}</p>
                  <span>Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.panel} style={{ position: "relative" }}>
          <h3>Invoice List</h3>
          <InvoiceTable
            page={page}
            popup={popup}
            setPopup={setPopup}
            setPage={setPage}
            onViewInvoice={handleViewInvoice}
          />
        </div>

        {detailPopup && (
          <InvoiceDetails data={detailPopup} setDetailPopup={setDetailPopup} />
        )}
      </div>
    </>
  );
};

export default Invoice;
