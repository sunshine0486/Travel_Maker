import { Card, CardContent, Typography, CardMedia, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Props {
  id: number;
  title: string;
  content?: string;
}

export default function PostCard({ id, title, content }: Props) {
  const navigate = useNavigate();

  // 본문 일정 길이만 표시 (태그 제거 후 텍스트만)
  const truncateText = (html: string | undefined, length = 100) => {
    if (!html) return "";
    const plainText = html.replace(/<[^>]+>/g, ""); // 태그 제거
    return plainText.length > length
      ? plainText.substring(0, length) + "..."
      : plainText;
  };

  // 본문에서 첫 번째 <img> src 추출
  const findImageFromContent = (html?: string) => {
    if (!html) return null;
    const match = html.match(/<img[^>]+src="([^">]+)"/i);
    return match ? match[1] : null;
  };

  const imageUrl = findImageFromContent(content);

  return (
    <Card
      sx={{
        display: "flex",
        mb: 2,
        cursor: "pointer",
        p: 2, // 👉 카드 전체 내부 패딩
        borderRadius: 2,
      }}
      onClick={() => navigate(`/board/show/dtl/${id}`)}
    >
      {/* 왼쪽: 본문에 포함된 첫 번째 이미지 */}
      {imageUrl && (
        <CardMedia
          component="img"
          sx={{
            width: 150,
            height: 120,
            objectFit: "cover",
            borderRadius: 1,
            mr: 2, // 👉 이미지와 텍스트 사이 간격
          }}
          image={imageUrl}
          alt={title}
        />
      )}

      {/* 오른쪽: 제목 + 본문 */}
      <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <CardContent sx={{ p: 0 }}>
          {" "}
          {/* 👉 기본 패딩 제거 */}
          <Typography variant="h6" gutterBottom noWrap>
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              mt: 0.5, // 👉 본문과 제목 사이 간격
            }}
          >
            {truncateText(content, 120)}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
}
