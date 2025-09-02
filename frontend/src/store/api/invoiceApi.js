import api from "./index";

const invoiceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    fetchInvoices: builder.query({
      query: (page) => ({ url: `/invoices`, method: "GET", params: page }),
      providesTags: ["Invoice"],
    }),
    processInvoice: builder.mutation({
      query: (id) => `/invoices/process/${id}`,
      invalidatesTags: ["Invoice", "InvoiceStats"],
    }),
    updateInvoiceStatus: builder.mutation({
      query: (id) => `/invoices/update/${id}`,
      invalidatesTags: ["Invoice"],
    }),
    deleteInvoice: builder.mutation({
      query: (id) => ({
        url: `/invoices/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Invoice"],
    }),
  }),
});

export const {
  useFetchInvoicesQuery,
  useProcessInvoiceMutation,
  useUpdateInvoiceStatusMutation,
  useDeleteInvoiceMutation,
} = invoiceApi;
