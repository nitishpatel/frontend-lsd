import React from 'react';
import Box from '@mui/material/Box';
// import FirstPageIcon from '@mui/icons-material/FirstPage';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
// import LastPageIcon from '@mui/icons-material/LastPage';
import { useTheme } from '@mui/material/styles';
import { TablePaginationActionsProps } from '@mui/material/TablePagination/TablePaginationActions';
import { Typography } from '@mui/material';

const TableActions = (props: TablePaginationActionsProps) => {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  // keeping the commented code for future ref

  // const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //   onPageChange(event, 0);
  // };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onPageChange(event, page + 1);
  };

  // const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //   onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  // };

  const handlePageNumberClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    pageNumber: number
  ) => {
    onPageChange(event, pageNumber);
  };

  const totalPages = Math.ceil(count / rowsPerPage);
  // const pageNumbers = [...Array(totalPages).keys()].map((num) => num + 1);
  console.log(totalPages);

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5, display: 'flex', alignItems: 'center' }}>
      {/* <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? (
          <LastPageIcon sx={{ color: '#ffffff' }} />
        ) : (
          <FirstPageIcon sx={{ color: '#ffffff' }} />
        )}
      </IconButton> */}
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
        size="small"
        sx={{
          backgroundColor: '#000000',
          borderRadius: 1,
          ':disabled': {
            backgroundColor: '#000000',
            borderRadius: 1
          },
          mr: 2
        }}
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight sx={{ color: '#ffffff' }} />
        ) : (
          <KeyboardArrowLeft sx={{ color: '#ffffff' }} />
        )}
      </IconButton>
      {/* keeping for safe side if the down code breaks */}
      {/* {pageNumbers.splice(page, page + 2).map((pageNumber) => (
        <IconButton
          key={pageNumber}
           size="small"
          onClick={(event) => handlePageNumberClick(event, pageNumber - 1)}
          disabled={pageNumber - 1 === page}
          aria-label={`page ${pageNumber}`}
          sx={{
            color: pageNumber - 1 === page ? '#ffffff' : '#ffffff',
            backgroundColor: '#0D6FF0',
            borderRadius: 1,
            px: 1.5,
            mr: 2,
            ':disabled': {
              backgroundColor: '#000000',
              color: '#ffffff'
            }
          }}
        >
          {pageNumber}
        </IconButton>
      ))} */}
      {page >= 1 && (
        <>
          <IconButton
            onClick={(event) => handlePageNumberClick(event, 0)}
            aria-label={`page ${page}`}
            size="small"
            sx={{
              color: '#ffffff',
              backgroundColor: '#000000',
              borderRadius: 1,

              px: 1.5,
              mr: 2
            }}
          >
            {1}
          </IconButton>
          {totalPages > 2 && (
            <Typography
              sx={{
                mr: 1
              }}
              variant="h6"
            >
              . . .
            </Typography>
          )}
        </>
      )}
      <IconButton
        onClick={(event) => handlePageNumberClick(event, page)}
        disabled
        aria-label={`page ${page + 1}`}
        size="small"
        sx={{
          color: '#ffffff',
          backgroundColor: '#000000',
          borderRadius: 1,
          px: 1.5,
          mr: 2,
          ':disabled': {
            color: '#ffffff',
            backgroundColor: '#0D6FF0'
          }
        }}
      >
        {page + 1}
      </IconButton>
      {page < totalPages - 2 && (
        <IconButton
          onClick={(event) => handlePageNumberClick(event, page + 1)}
          aria-label={`page ${page + 2}`}
          size="small"
          sx={{
            color: '#ffffff',
            backgroundColor: '#000000',
            borderRadius: 1,
            px: 1.5,
            mr: 2
          }}
        >
          {page + 2}
        </IconButton>
      )}
      {page < totalPages - 1 && (
        <>
          {page < totalPages - 3 && (
            <Typography
              sx={{
                mr: 1
              }}
              variant="h6"
            >
              . . .
            </Typography>
          )}
          <IconButton
            onClick={(event) => handlePageNumberClick(event, totalPages - 1)}
            aria-label={`page ${totalPages}`}
            size="small"
            sx={{
              color: '#ffffff',
              backgroundColor: '#000000',
              borderRadius: 1,
              px: 1.5,
              mr: 2
            }}
          >
            {totalPages}
          </IconButton>
        </>
      )}
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= totalPages - 1}
        aria-label="next page"
        size="small"
        sx={{
          backgroundColor: '#000000',
          borderRadius: 1,
          ':disabled': {
            backgroundColor: '#000000',
            borderRadius: 1
          }
        }}
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft sx={{ color: '#ffffff' }} />
        ) : (
          <KeyboardArrowRight sx={{ color: '#ffffff' }} />
        )}
      </IconButton>
      {/* <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= totalPages - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? (
          <FirstPageIcon sx={{ color: '#ffffff' }} />
        ) : (
          <LastPageIcon sx={{ color: '#ffffff' }} />
        )}
      </IconButton> */}
    </Box>
  );
};

export default TableActions;
