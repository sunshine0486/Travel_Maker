import { ListItem, ListItemText, ListItemButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Props {
  rank: number;
  title: string;
  id: number;
  maxLength?: number; // ← 글자수 제한
}

export default function PopularPostItem({ rank, title, id, maxLength = 30 }: Props) {
  const navigate = useNavigate();

  // 글자수 제한 후 "..." 처리
  const truncatedTitle =
    title.length > maxLength ? title.slice(0, maxLength) + "..." : title;

  // ✅ id < 0 → 가짜 데이터 → 클릭 막기
  const isDisabled = id < 0;

  return (
    <ListItem sx={{ py: 1.05 }} divider disablePadding>
      {isDisabled ? (
        <ListItemText
          primary={`${rank}. ${truncatedTitle}`}
          sx={{ color: "text.secondary", pl: 2 }}
        />
      ) : (
        <ListItemButton onClick={() => navigate(`/board/show/dtl/${id}`)}>
          <ListItemText primary={`${rank}. ${truncatedTitle}`} />
        </ListItemButton>
      )}
    </ListItem>
  );
}
