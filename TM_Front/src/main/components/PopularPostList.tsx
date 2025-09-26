import { List } from "@mui/material";
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
    <List dense>
      {posts.map((post) => (
        <PopularPostItem
          key={post.id}
          rank={post.rank}
          title={post.title}
          id={post.id}
        />
      ))}
    </List>
  );
}
