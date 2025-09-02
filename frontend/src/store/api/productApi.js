import api from "./index";

const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    searchProducts: builder.query({
      query: (search) => ({
        url: `/products/search`,
        method: "GET",
        params: search,
      }),
      providesTags: ["Product"],
    }),
    fetchProducts: builder.query({
      query: (page) => ({ url: `/products`, method: "GET", params: page }),
      providesTags: ["Product"],
    }),
    addProduct: builder.mutation({
      query: (product) => ({
        url: "/products/single",
        method: "POST",
        body: product,
      }),
      invalidatesTags: ["Product"],
    }),
    addMultipleProducts: builder.mutation({
      query: (products) => ({
        url: "/products/multi",
        method: "POST",
        body: products,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation({
      query: (productId, updateFields) => ({
        url: `/products/${productId}`,
        method: "PATCH",
        body: updateFields,
      }),
      invalidatesTags: ["Product"],
    }),
    createInvoice: builder.mutation({
      query: (products) => ({
        url: "/user/create-invoice",
        method: "POST",
        body: products,
      }),
      invalidatesTags: ["Product", "Invoice"],
    }),
  }),
});

export const {
  useLazySearchProductsQuery,
  useFetchProductsQuery,
  useAddProductMutation,
  useAddMultipleProductsMutation,
  useUpdateProductMutation,
  useCreateInvoiceMutation
} = productApi;
