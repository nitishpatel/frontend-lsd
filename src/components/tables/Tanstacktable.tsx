import { useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  PaginationState
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  TablePagination,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import {
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon
} from '@mui/icons-material';
import DataNotAvailable from '../defaults/DataNotAvailable';
import TableActions from './TableActions';
import SyncIcon from '@mui/icons-material/Sync';

const Tanstacktable = ({
  data,
  columns,
  globalFilter,
  setGlobalFilter,
  rowSize,
  showSearchField = true,
  refreshFunction
}: {
  data: any;
  columns: any;
  globalFilter?: string;
  rowSize?: number;
  showSearchField?: boolean;
  setGlobalFilter?: (filterValue: string) => void;
  refreshFunction?: () => void;
}) => {
  const [sorting, setSorting] = useState<any>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: rowSize ?? 10
  });

  const paginatedData = data.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize
  );

  // Initialize the table using the useReactTable hook
  const table = useReactTable({
    data: paginatedData,
    columns,
    pageCount: Math.ceil(data.length / pagination.pageSize),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: sorting,
      globalFilter: globalFilter,
      pagination: pagination
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    manualPagination: true
  });

  return (
    <Box>
      <TableContainer component={Paper}>
        <Box
          display="flex"
          justifyContent={
            refreshFunction && showSearchField
              ? 'space-between' // Both are present
              : refreshFunction
              ? 'flex-start' // Only refreshFunction is present
              : showSearchField
              ? 'flex-end' // Only searchField is present
              : 'flex-end' // Default case
          }
          alignItems="center"
        >
          {refreshFunction && (
            <IconButton onClick={refreshFunction}>
              <SyncIcon />
            </IconButton>
          )}

          {/* search bar */}
          {showSearchField && (
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              value={globalFilter || ''}
              onChange={(e) => setGlobalFilter?.(e.target.value)}
              style={{ margin: '16px' }}
            />
          )}
        </Box>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    sx={{
                      cursor: 'pointer',
                      width: header.getSize(),
                      color: '#ffffff'
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {
                          {
                            asc: <ArrowDropUpIcon style={{ fontSize: '0.8rem' }} />,
                            desc: <ArrowDropDownIcon style={{ fontSize: '0.8rem' }} />
                          }[(header.column.getIsSorted() as string) ?? null]
                        }
                      </div>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          {data.length > 0 ? (
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row?.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} style={{ width: cell?.column?.getSize() }}>
                      {flexRender(cell?.column?.columnDef?.cell, cell?.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              <TableCell
                sx={{
                  p: 5
                }}
                colSpan={columns?.length}
              >
                <DataNotAvailable />
              </TableCell>
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: data.length > 0 ? 'space-between' : 'flex-end',
          p: 2
        }}
      >
        {data.length > 0 && (
          <Typography variant="body2">
            Showing {pagination.pageIndex * pagination.pageSize + 1} of {data.length} results
            {/* {Math.min((pagination.pageIndex + 1) * pagination.pageSize, data.length)} */}
          </Typography>
        )}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, { label: 'All', value: data.length }]}
          component="div"
          count={data.length}
          rowsPerPage={pagination.pageSize}
          page={pagination.pageIndex}
          // labelDisplayedRows={labelDisplayedRows}
          // slotProps={{
          //   select: {

          //     inputProps: { 'aria-label': 'rows per page' },
          //     sx: {
          //       color: '#ffffff',
          //       '& .MuiSelect-icon': {
          //         color: '#ffffff' // Change arrow icon color here
          //       }
          //     }
          //   }
          // }}
          onPageChange={(_, page) => {
            table.setPageIndex(page);
          }}
          onRowsPerPageChange={(e) => {
            const size = e.target.value ? Number(e.target.value) : 10;
            table.setPageSize(size);
          }}
          sx={{
            '& .MuiTablePagination-selectLabel': {
              display: 'none' // Hides the 'Rows per page' label
            },
            '& .MuiTablePagination-displayedRows': {
              display: 'none' // Hides the displayed rows label
            },
            '& .MuiTablePagination-select': {
              display: 'none' // Hides the select dropdown
            },
            '& .MuiSelect-icon': {
              display: 'none'
            }
          }}
          ActionsComponent={TableActions}
        />
      </Box>
    </Box>
  );
};

export default Tanstacktable;
