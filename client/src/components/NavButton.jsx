import React from 'react';
import { Button, MenuItem, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const NavButton = ({ to, label, isMobile, onClick }) => {
  const commonStyles = {
    textDecoration: 'none',
    color: '#333',
    fontWeight: 'bold',
    fontSize: '1.1rem',
  };

  if (isMobile) {
    return (
      <MenuItem onClick={onClick}>
        <Typography component={Link} to={to} sx={commonStyles}>
          {label}
        </Typography>
      </MenuItem>
    );
  }

  return (
    <Button
      component={Link}
      to={to}
      sx={{
        ...commonStyles,
        my: 2,
        backgroundColor: 'wheat',
        border: '2px solid #333',
        '&:hover': {
          backgroundColor: 'white',
          color: '#000',
        },
        textTransform: 'uppercase',
        mx: 2,
      }}
    >
      {label}
    </Button>
  );
};

export default NavButton;
