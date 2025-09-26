import { Card, CardContent, Typography, CardMedia, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Props {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
}

export default function PostCard({ id, title, content, imageUrl }: Props) {
  const navigate = useNavigate();

  // 본문을 일정 길이 이상이면 잘라내기
  const truncate = (text: string, length = 10) => {
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  return (
    <Card
      sx={{ display: "flex", mb: 2, cursor: "pointer" }}
      onClick={() => navigate(`/board/${id}`)}
    >
      {imageUrl && (
        <CardMedia
          component="img"
          sx={{ width: 150, objectFit: "cover" }}
          image={imageUrl}
          alt={title}
        />
      )}
      <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <CardContent>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {truncate(content, 120)}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
}