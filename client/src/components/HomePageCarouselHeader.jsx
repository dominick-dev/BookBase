import React from 'react'
import { Box, Typography } from '@mui/material'

const HomePageCarouselHeader = () => {
  return (
    <Box 
    sx={{
      bgcolor: 'wheat', 
      paddingTop: '20px',
      borderTopLeftRadius: '30px',
      borderTopRightRadius: '30px',
      textAlign: 'center', 
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
    }}
  >
    {/* Title */}
    <Typography 
      variant="h2" 
      sx={{
        fontFamily: "'Lato', sans-serif",
        fontWeight: '800',
        fontSize: '2.5rem',
        color: '#333',
        letterSpacing: '1px', 
        marginBottom: '10px',
        textTransform: 'uppercase',
        textDecoration: 'underline',
      }}
    >
      Discover Your Next Great Read
    </Typography>
    <Typography 
      variant="subtitle1" 
      sx={{
        fontFamily: "'Lato', sans-serif",
        fontSize: '1.2rem',
        fontWeight: '300',
        color: '#555',
        lineHeight: 1.8, 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '0 20px', 
      }}
    >
      Scroll and click on the book cards to learn more about the books and maybe discover a new favorite.
    </Typography>
  </Box>
  )
}

export default HomePageCarouselHeader