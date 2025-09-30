import React, { useState } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import MemberAdmin from "./MemberAdmin";
import BoardAdmin from "./BoardAdmin";
import CommentAdmin from "./CommentAdmin";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={2}>{children}</Box>}
    </div>
  );
}

export default function AdminTabs() {
  const [value, setValue] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        <h4>전체 데이터 조회</h4>
      </Typography>
      <Tabs value={value} onChange={handleChange} aria-label="admin tabs">
        <Tab
          label="회원 관리"
          id="admin-tab-0"
          aria-controls="admin-tabpanel-0"
        />
        <Tab
          label="게시글 관리"
          id="admin-tab-1"
          aria-controls="admin-tabpanel-1"
        />
        <Tab
          label="댓글 관리"
          id="admin-tab-2"
          aria-controls="admin-tabpanel-2"
        />
      </Tabs>

      <TabPanel value={value} index={0}>
        <MemberAdmin />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <BoardAdmin />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <CommentAdmin />
      </TabPanel>
    </Box>
  );
}
