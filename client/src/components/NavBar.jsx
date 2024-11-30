    import React, { useState } from 'react';
    import AppBar from '@mui/material/AppBar';
    import Box from '@mui/material/Box';
    import Toolbar from '@mui/material/Toolbar';
    import IconButton from '@mui/material/IconButton';
    import Typography from '@mui/material/Typography';
    import Menu from '@mui/material/Menu';
    import MenuIcon from '@mui/icons-material/Menu';
    import Container from '@mui/material/Container';
    import Avatar from '@mui/material/Avatar';
    import Button from '@mui/material/Button';
    import Tooltip from '@mui/material/Tooltip';
    import MenuItem from '@mui/material/MenuItem';
    import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
    import InputBase from '@mui/material/InputBase';
    import SearchIcon from '@mui/icons-material/Search';
    import { styled, alpha } from '@mui/material/styles';
    import { Link, useNavigate } from 'react-router-dom';
    import Select from '@mui/material/Select';
    import FormControl from '@mui/material/FormControl';
    import InputLabel from '@mui/material/InputLabel';

    const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

    // Styled Search Components (boilerplate code from MUI website on navBar w/search)
    const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    justifyContent: 'center',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: theme.spacing(2),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
    width: 'auto',
    },
    alignItems: 'center'
    }));

    const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    }));

    const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    alignItems: "center",
    display: 'flex',
    transition: theme.transitions.create('width'),
    width: '100%',
    height: '100%',
    [theme.breakpoints.up('md')]: {
        width: '20ch',
    },
    },
    }));
    // end boilerplate

    function NavBar() {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('title');
    const navigate = useNavigate();

    const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
    setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
    setAnchorElUser(null);
    };

    const handleSearchKeyPress = (event) => {
    if (event.key === 'Enter' && searchQuery.trim()) {
        navigate(`/search?field=${searchType}&query=${encodeURIComponent(searchQuery)}`);
    }
    };


    return (
    <AppBar position="relative" sx={{ width: '100%', backgroundColor: 'wheat', color: '#333' }}>
        <Container maxWidth="xl">
        <Toolbar disableGutters>
            {/* Logo */}
            <BookOutlinedIcon sx={{ display: { xs: 'flex', md: 'flex' }, mr: 1 }} />
            <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
                mr: 2,
                fontFamily: 'lato',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
            }}
            >
            BookBase
            </Typography>

            {/* Navigation Menu for Small Screens */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
            >
                <MenuIcon />
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
            >
                <MenuItem onClick={handleCloseNavMenu}>
                <Typography component={Link} to="/books" sx={{ textDecoration: 'none', color: '#333' }}>
                    Books
                </Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseNavMenu}>
                <Typography component={Link} to="/search" sx={{ textDecoration: 'none', color: '#333' }}>
                    Search
                </Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseNavMenu}>
                <Typography component={Link} to="/insights" sx={{ textDecoration: 'none', color: '#333' }}>
                    Interesting Insights
                </Typography>
                </MenuItem>
            </Menu>
            </Box>

            {/* Desktop Navigation Buttons */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
                component={Link}
                to="/books"
                sx={{
                my: 2,
                color: '#333333',
                backgroundColor: 'wheat',
                '&:hover': {
                    backgroundColor: 'white',
                    color: '#000',
                },
                textTransform: 'uppercase',
                fontWeight: 'bold',
                }}
            >
                Books
            </Button>
            <Button
                component={Link}
                to="/search"
                sx={{
                my: 2,
                color: '#333333',
                backgroundColor: 'wheat',
                '&:hover': {
                    backgroundColor: 'white',
                    color: '#000',
                },
                textTransform: 'uppercase',
                fontWeight: 'bold',
                }}
            >
                Search
            </Button>
            <Button
                component={Link}
                to="/insights"
                sx={{
                my: 2,
                color: '#333333',
                backgroundColor: 'wheat',
                '&:hover': {
                    backgroundColor: 'white',
                    color: '#000',
                },
                textTransform: 'uppercase',
                fontWeight: 'bold',
                }}
            >
                Interesting Insights
            </Button>
            </Box>

            {/* Search Bar */}
            <Box sx={{display:'flex', alignItems: 'center'}}>
                <Search>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ 'lato': 'search' }}
                    value={searchQuery}
                    onChange={(e)=> setSearchQuery(e.target.value)}
                    onKeyDown={(e)=>{
                        if (e.key === 'Enter'){
                           handleSearchKeyPress(e); 
                        }
                    }   
                    }
                    sx={{justifyContent: 'center'}}       
                />
                </Search>
                <FormControl  sx={{paddingRight: '5px', m:1}} size="small">
                    <InputLabel id='search-type-label'>By</InputLabel>
                    <Select
                        labelId='search-type-label'
                        value={searchType}
                        onChange={(e)=>setSearchType(e.target.value)}
                        label='Search By'    
                    >
                        <MenuItem value='title'>Title</MenuItem>
                        <MenuItem value='author'>Author</MenuItem>
                        <MenuItem value='isbn'>ISBN</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            {/* Account Button */}
            <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
            </Tooltip>
            <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
                ))}
            </Menu>
            </Box>
        </Toolbar>
        </Container>
    </AppBar>
    );
    }

    export default NavBar;
