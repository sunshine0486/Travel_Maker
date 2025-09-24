import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Box, Tabs, Tab } from "@mui/material";

const BASE_URL = import.meta.env.VITE_API_URL;

type VisitorStat = { label: string; count: number };

export default function VisitorsAdmin() {
  const [tab, setTab] = useState<"daily" | "monthly">("daily");
  const [dailyData, setDailyData] = useState<VisitorStat[]>([]);
  const [monthlyData, setMonthlyData] = useState<VisitorStat[]>([]);

  useEffect(() => {
    if (tab === "daily") {
      fetch(`${BASE_URL}/visitors/daily?days=7`)
        .then((res) => res.json())
        .then((json: VisitorStat[]) => setDailyData(json))
        .catch(() => setDailyData([]));
    } else {
      fetch(`${BASE_URL}/visitors/monthly?months=6`)
        .then((res) => res.json())
        .then((json: VisitorStat[]) => setMonthlyData(json))
        .catch(() => setMonthlyData([]));
    }
  }, [tab]);

  const chartData = tab === "daily" ? dailyData : monthlyData;

  return (
    <Box p={2}>
      {/* ✅ Tabs로 변경 */}
      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        aria-label="visitor stats tabs"
      >
        <Tab value="daily" label="일" />
        <Tab value="monthly" label="월" />
      </Tabs>

      {/* ✅ 그래프 */}
      <Box mt={3}>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} barCategoryGap={45}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              label={{ value: "날짜", position: "insideBottom" }}
              height={55}
            />
            <YAxis
              label={{
                value: "방문자수 (명)",
                angle: -90,
                position: "insideLeft",
              }}
              width={70}
            />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
