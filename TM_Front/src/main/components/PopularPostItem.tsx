import { ListItem, ListItemText, ListItemButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Props {
  rank: number;
  title: string;
  id: number;
}

export default function PopularPostItem({ rank, title, id }: Props) {
  const navigate = useNavigate();

  return (
    <ListItem divider disablePadding>
      <ListItemButton onClick={() => navigate(`/board/show/dtl${id}`)}>
        <ListItemText primary={`${rank}. ${title}`} />
      </ListItemButton>
    </ListItem>
  );
}
