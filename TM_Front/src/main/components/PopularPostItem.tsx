import { ListItem, ListItemText } from "@mui/material";

interface Props {
  rank: number;
  title: string;
}

export default function PopularPostItem({ rank, title }: Props) {
  return (
    <ListItem>
      <ListItemText
        primary={`${rank}. ${title}`}
      />
    </ListItem>
  );
}
