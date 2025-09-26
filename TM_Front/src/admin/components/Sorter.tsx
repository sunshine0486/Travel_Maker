import { useState } from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemText,
  Divider,
} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";

/** 정렬 기준 정의 */
export interface SortOption<T> {
  key: keyof T;
  label: string;
  sortFn: (a: T, b: T) => number;
}

interface Props<T> {
  items: T[];
  sortOptions: SortOption<T>[];
  onSorted: (sorted: T[]) => void;
}

export default function Sorter<T>({ items, sortOptions, onSorted }: Props<T>) {
  const [filtered, setFiltered] = useState<T[] | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOption, setSelectedOption] = useState<SortOption<T> | null>(
    null
  );

  const open = Boolean(anchorEl);
  const isSingleSort = sortOptions.length === 1;

  /** 단일 정렬 버튼 */
  const handleSingleSort = () => {
    setSortAsc((prev) => !prev);
    const target = filtered ?? items;
    const sorted = [...target].sort((a, b) =>
      sortAsc ? sortOptions[0].sortFn(a, b) : sortOptions[0].sortFn(b, a)
    );
    setFiltered(sorted);
    onSorted(sorted);
  };

  /** 드롭다운 열기/닫기 */
  const handleOpenMenu = (e: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedOption(null);
  };

  /** 정렬 기준 선택 */
  const handleSelectOption = (option: SortOption<T>) => {
    setSelectedOption(option);
  };

  /** ASC/DESC 적용 */
  const handleApplySort = (asc: boolean) => {
    if (!selectedOption) return;
    setSortAsc(asc);
    const target = filtered ?? items;
    const sorted = [...target].sort((a, b) =>
      asc ? selectedOption.sortFn(a, b) : selectedOption.sortFn(b, a)
    );
    setFiltered(sorted);
    onSorted(sorted);
    handleCloseMenu();
  };

  return (
    <Box>
      <Tooltip
        title={isSingleSort ? `${sortOptions[0].label} 정렬` : "정렬 기준 선택"}
      >
        <IconButton
          onClick={isSingleSort ? handleSingleSort : handleOpenMenu}
        >
          <SortIcon />
        </IconButton>
      </Tooltip>

      {/* 다중 정렬 드롭다운 */}
      {!isSingleSort && (
        <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
          {!selectedOption ? (
            // 1단계: 정렬 기준 선택
            sortOptions.map((option) => (
              <MenuItem
                key={String(option.key)}
                onClick={() => handleSelectOption(option)}
              >
                <ListItemText primary={option.label} />
              </MenuItem>
            ))
          ) : (
            // 2단계: ASC/DESC 선택
            <>
              <MenuItem onClick={() => handleApplySort(true)}>
                <ListItemText primary={`${selectedOption.label} (ASC)`} />
              </MenuItem>
              <MenuItem onClick={() => handleApplySort(false)}>
                <ListItemText primary={`${selectedOption.label} (DESC)`} />
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => setSelectedOption(null)}>
                <ListItemText primary="← 다른 기준 선택" />
              </MenuItem>
            </>
          )}
        </Menu>
      )}
    </Box>
  );
}
