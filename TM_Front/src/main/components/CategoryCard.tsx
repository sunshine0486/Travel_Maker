import { Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Props {
  title: string;
  path: string;
}

export default function CategoryCard({ title, path }: Props) {
  const navigate = useNavigate();

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        textAlign: "center",
        borderRadius: 3,
        cursor: "pointer",
        "&:hover": { bgcolor: "grey.100" },
      }}
      onClick={() => navigate(path)}
    >
      <Typography variant="subtitle1" fontWeight="bold">
        {title}
      </Typography>
    </Paper>
  );
}
