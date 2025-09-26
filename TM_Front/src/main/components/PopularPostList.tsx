// src/components/PopularPostList.tsx
import { List, Box } from "@mui/material";
import PopularPostItem from "./PopularPostItem";

interface Post {
  rank: number;
  title: string;
  id: number;
}

interface Props {
  posts: Post[];
}

export default function PopularPostList({ posts }: Props) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <List dense sx={{ flex: 1, height: "100%", overflowY: "auto" }}>
        {posts.map((post) => (
          <PopularPostItem
            key={post.id}
            rank={post.rank}
            title={post.title}
            id={post.id}
          />
        ))}
      </List>
    </Box>
  );
}
