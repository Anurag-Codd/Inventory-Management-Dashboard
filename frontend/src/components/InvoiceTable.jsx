import Button from "./Button";
import { toast } from "react-hot-toast";
import dateFormatter from "../utils/dateFormatter";
import { EllipsisVertical } from "lucide-react";
import style from "./InvoiceTable.module.css";
import {
  useDeleteInvoiceMutation,
  useProcessInvoiceMutation,
  useUpdateInvoiceStatusMutation,
  useFetchInvoicesQuery,
} from "../store/api/invoiceApi";

const InvoiceTable = ({ page, setPage, onViewInvoice, popup, setPopup }) => {
  const { data } = useFetchInvoicesQuery();
  const [deleteInvoice] = useDeleteInvoiceMutation();
  const [updateInvoiceStatus] = useUpdateInvoiceStatusMutation();
  const [processInvoice] = useProcessInvoiceMutation();

  const handleInvoiceStatus = async (id) => {
    try {
      await updateInvoiceStatus(id).unwrap();
      toast.success("Invoice updated");
      setPopup(null);
    } catch (error) {
      setPopup(null);
      console.log(error);
    }
  };

  const handleProgression = async (id) => {
    try {
      const respnse = await processInvoice(id).unwrap();
      onViewInvoice(respnse.invoice);
      toast.success("Invoice updated");
      setPopup(null);
    } catch (error) {
      setPopup(null);
      console.log(error);
    }
  };

  const handleInvoiceDelete = async (id) => {
    try {
      await deleteInvoice(id).unwrap();
      toast.success("Invoice Deleted");
      setPopup(null);
    } catch (error) {
      setPopup(null);
      console.log(error);
    }
  };

  return (
    <>
      <div className={style.tableWrapper}>
        <table>
          <thead>
            <tr>
              <th>Invoice Id</th>
              <th>Reference Id</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {data?.invoices.map((item, index) => (
              <tr key={index}>
                <td>{item.invoiceId}</td>
                <td>{item.referenceId || "---"}</td>
                <td>₹{item.total}</td>
                <td>{item.status}</td>
                <td className={style.specialTd}>
                  {dateFormatter(item.dueDate)}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setPopup(index);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <EllipsisVertical />

                    {popup === index && (
                      <div
                        className={style.rowMenu}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {item.status === "Unpaid" ? (
                          <div
                            className={style.popupOption}
                            onClick={() => handleInvoiceStatus(item._id)}
                          >
                            Paid
                          </div>
                        ) : (
                          <>
                            <div
                              className={style.popupOption}
                              onClick={() => {
                                handleProgression(item._id);
                              }}
                            >
                              View Invoice
                            </div>
                            <div
                              className={style.popupOption}
                              onClick={() => {
                                handleInvoiceDelete(item._id);
                              }}
                            >
                              Delete
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
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
          Page {page} of {data?.totalPages}
        </span>
        <Button
          className={style.footerBtn}
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page >= data?.totalPages}
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default InvoiceTable;
