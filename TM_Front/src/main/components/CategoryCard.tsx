import { Paper, Typography } from "@mui/material";

interface Props {
  title: string;
}

export default function CategoryCard({ title }: Props) {
  return (
    <Paper elevation={2} sx={{ p: 2, textAlign: "center", borderRadius: 3 }}>
      <Typography variant="subtitle1" fontWeight="bold">{title}</Typography>
    </Paper>
  );
}
