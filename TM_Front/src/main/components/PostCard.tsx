import { Card, CardContent, Typography, CardMedia } from "@mui/material";

interface Props {
  title: string;
  content: string;
  imageUrl?: string;
}

export default function PostCard({ title, content, imageUrl }: Props) {
  return (
    <Card sx={{ mb: 2 }}>
      {imageUrl && (
        <CardMedia component="img" height="160" image={imageUrl} alt={title} />
      )}
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold">{title}</Typography>
        <Typography variant="body2" color="text.secondary">{content}</Typography>
      </CardContent>
    </Card>
  );
}
