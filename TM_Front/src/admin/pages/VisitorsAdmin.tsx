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
import axios from "axios";
import type { AxiosResponse } from "axios";
import { getAxiosConfig } from "../../member/api/loginApi";

const BASE_URL = import.meta.env.VITE_API_URL;

type VisitorStat = { label: string; count: number };

export default function VisitorsAdmin() {
  const [tab, setTab] = useState<"daily" | "monthly">("daily");
  const [dailyData, setDailyData] = useState<VisitorStat[]>([]);
  const [monthlyData, setMonthlyData] = useState<VisitorStat[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url =
          tab === "daily"
            ? `${BASE_URL}/visitors/daily?days=7`
            : `${BASE_URL}/visitors/monthly?months=6`;

        const res: AxiosResponse<VisitorStat[]> = await axios.get(
          url,
          getAxiosConfig()
        );

        if (tab === "daily") {
          setDailyData(res.data);
        } else {
          setMonthlyData(res.data);
        }
      } catch {
        if (tab === "daily") {
          setDailyData([]);
        } else {
          setMonthlyData([]);
        }
      }
    };

    fetchData();
  }, [tab]);

  const chartData = tab === "daily" ? dailyData : monthlyData;

  return (
    <Box p={2}>
      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        aria-label="visitor stats tabs"
      >
        <Tab value="daily" label="일" />
        <Tab value="monthly" label="월" />
      </Tabs>

      <Box mt={3}>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} barCategoryGap="20%">
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
            <Bar dataKey="count" fill="#151B54" barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
