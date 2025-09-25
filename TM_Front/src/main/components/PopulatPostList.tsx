import { List } from "@mui/material";
import PopularPostItem from "./PopularPostItem";

export interface PopularPost {
  rank: number;
  title: string;
}

interface Props {
  posts: PopularPost[];
}

export default function PopularPostList({ posts }: Props) {
  return (
    <List>
      {posts.map((post) => (
        <PopularPostItem key={post.rank} rank={post.rank} title={post.title} />
      ))}
    </List>
  );
}
