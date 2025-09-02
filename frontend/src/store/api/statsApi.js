import api from "./index";

const chartApi = api.injectEndpoints({
  endpoints: (builder) => ({
    fetchChartData: builder.query({
      query: () => "/stats",
      providesTags: ["ChartStats"],
    }),
    fetchOverview: builder.query({
      query: () => "/stats/overview",
      providesTags: ["OverviewStats"],
    }),
    fetchLast7DaysProduct: builder.query({
      query: () => "/stats/last7days/product",
      providesTags: ["ProductsStats"],
    }),
    fetchLast7DaysInvoice: builder.query({
      query: () => "/stats/last7days/invoice",
      providesTags: ["InvoiceStats"],
    }),
    fetchCompareMonthData: builder.query({
      query: () => "/stats/compare",
      providesTags: ["Stats"],
    }),
    fetchTop5Products: builder.query({
      query: () => "/stats/top5products",
      providesTags: ["TopProducts"],
    }),
  }),
});

export const {
  useFetchChartDataQuery,
  useFetchOverviewQuery,
  useFetchLast7DaysProductQuery,
  useFetchLast7DaysInvoiceQuery,
  useFetchCompareMonthDataQuery,
  useFetchTop5ProductsQuery
} = chartApi;
