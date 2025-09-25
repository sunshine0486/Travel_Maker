import { List, ListItem, ListItemText } from "@mui/material";

interface Post {
  rank: number;
  title: string;
}

interface Props {
  posts: Post[];
}

export default function PopularPostList({ posts }: Props) {
  return (
    <List dense>
      {posts.map((post) => (
        <ListItem key={post.rank} divider>
          <ListItemText primary={`${post.rank}. ${post.title}`} />
        </ListItem>
      ))}
    </List>
  );
}
