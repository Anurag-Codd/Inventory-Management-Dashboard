import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import style from "./MyChart.module.css";
import { useState } from "react";
import { useFetchChartDataQuery } from "../store/api/statsApi";
import Button from "./Button";

const CustomLegend = ({ payload }) => {
  return (
    <ul
      style={{
        display: "flex",
        gap: "20px",
        listStyle: "none",
        padding: "10px",
        marginLeft: "40px",
        justifyContent: "flex-start",
      }}
    >
      {payload.map((entry, index) => (
        <li
          key={`item-${index}`}
          style={{ display: "flex", alignItems: "center", gap: "5px" }}
        >
          <svg width="14" height="14">
            <circle cx="7" cy="7" r="7" fill={entry.color} />
          </svg>
          {entry.value}
        </li>
      ))}
    </ul>
  );
};

const MyChart = () => {
  const { data } = useFetchChartDataQuery();
   const [view, setView] = useState(0);
  const views = ["Week", "Month", "Year"];
  const keys = ["weekly", "monthly", "yearly"];
  const dataKeys = ["day", "date", "month"];

    const handleSwap = () => setView((view + 1) % 3);

  return (
    <>
       <div className={style.swap}>
        <Button onClick={handleSwap} className={style.swapBtn}>
          {views[view]}
        </Button>
      </div>
      <h3 className={style.title}>Sales & Purchase</h3>
      <ResponsiveContainer height="100%" width="100%" className={style.container}>
        <BarChart
          width={500}
          height={300}
          data={data?.[keys[view]]}
          margin={{
            top: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="2 4" />
          <XAxis dataKey={dataKeys[view]} style={{ fontSize: "14px" }} />
          <YAxis  style={{ fontSize: "14px" }}/>
          <Legend content={<CustomLegend />} />
          <Bar dataKey="purchase" fill="#82ca9d" barSize={10} />
          <Bar dataKey="sales" fill="#8884d8" barSize={10} />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default MyChart;
