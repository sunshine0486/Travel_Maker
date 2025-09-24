import { Box, Button } from "@mui/material";

interface Props {
  page: number;
  total: number;
  size: number;
  onChange: (newPage: number) => void;
}

export default function CustomPagination({ page, total, size, onChange }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / size));
  const groupIndex = Math.floor(page / 5);
  const start = groupIndex * 5;
  const end = Math.min(start + 5, totalPages);

  return (
    <Box display="flex" justifyContent="center" m={2}>
      <Button disabled={page === 0} onClick={() => onChange(0)}>{"<<"}</Button>
      <Button disabled={start === 0} onClick={() => onChange(start - 1)}>{"<"}</Button>

      {Array.from({ length: end - start }).map((_, i) => {
        const p = start + i;
        return (
          <Button
            key={p}
            variant={p === page ? "contained" : "text"}
            onClick={() => onChange(p)}
          >
            {p + 1}
          </Button>
        );
      })}

      <Button disabled={end >= totalPages} onClick={() => onChange(end)}>{">"}</Button>
      <Button disabled={page === totalPages - 1} onClick={() => onChange(totalPages - 1)}>{">>"}</Button>
    </Box>
  );
}
