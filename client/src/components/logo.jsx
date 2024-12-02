import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import { Link } from 'react-router-dom';

function Logo() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <BookOutlinedIcon sx={{ display: { xs: 'flex', md: 'flex' }, mr: 2 }} />
      <Typography
        variant="h6"
        noWrap
        component={Link}
        to="/"
        sx={{
          mr: 4,
          fontFamily: 'lato',
          fontWeight: 700,
          letterSpacing: '.3rem',
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        BookBase
      </Typography>
    </Box>
  );
}

export default Logo;