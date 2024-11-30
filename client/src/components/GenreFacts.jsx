import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { TableHead } from '@mui/material';
import '../styles/HomePageCharts.css'


function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const GenreFacts = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [genres, setGenres] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Fetch books from the top-authors route
    const fetchBooks = async () => {
      try {
        console.log("Attempting to fetch genre facts...")
        const response = await fetch("http://localhost:8080/genre-stats");
        const data = await response.json();
        console.log(`Fetched ${data.length} genres.`);
        setGenres(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - genres.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  
  console.log("Genre Stats component is rendering");

  if (loading) return <div>Loading...</div>;

  return (
    <>
    <div className='genre-facts' style={{width:'100%', border: '2px solid black'}}>
        <h1 className='header'>Genre Stats</h1>
        <TableContainer component={Paper}>
        <Table sx={{maxWidth: '100%', bgcolor: 'paper', tableLayout:'auto'}} aria-label="custom pagination table">
            <TableHead sx={{bgcolor: 'gray'}}>
                <TableRow>
                    <TableCell>Genre</TableCell>
                    <TableCell align="right">Number of Reviews</TableCell>
                    <TableCell align="right">Average Rating</TableCell>
                    <TableCell align="right">Average Price</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
            {(rowsPerPage > 0
                ? genres.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : genres
            ).map((genre) => (
                <TableRow key={genre.genre}>
                <TableCell component="th" scope="row" style={{width: 100}}>
                    {genre.genre}
                </TableCell>
                <TableCell style={{ width: 100 }} align="right">
                    {genre.num_reviews}
                </TableCell>
                <TableCell style={{ width: 100}} align="right">
                    {genre.avg_rating.toFixed(2)}
                </TableCell>
                <TableCell style={{ width: 100 }} align = 'right'>
                    ${genre.avg_price.toFixed(2)}
                </TableCell>
                </TableRow>
            ))}
            {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
                </TableRow>
            )}
            </TableBody>
            <TableFooter>
            <TableRow>
                <TablePagination
                rowsPerPageOptions={[5, 10, { label: 'All', value: -1 }]}
                colSpan={3}
                count={genres.length}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                    select: {
                    inputProps: {
                        'aria-label': 'rows per page',
                    },
                    native: true,
                    },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
                />
            </TableRow>
            </TableFooter>
        </Table>
        </TableContainer>
    </div>
    </>
  );
}

export default GenreFacts;