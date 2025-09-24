import { List, ListItem, ListItemText, Typography } from "@mui/material";

interface Post {
  title: string;
  views: string;
}

interface Props {
  posts: Post[];
}

export default function PopularPostList({ posts }: Props) {
  return (
    <List dense>
      {posts.map((post, idx) => (
        <ListItem key={idx} divider>
          <ListItemText 
            primary={post.title}
            secondary={<Typography variant="caption">{post.views} 조회</Typography>}
          />
        </ListItem>
      ))}
    </List>
  );
}
