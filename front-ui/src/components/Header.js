import React from 'react';
import {AppBar,Toolbar,Button,Grid, CssBaseline} from '@material-ui/core';
import { Link } from 'react-router-dom';

const headerMenu = [
    {name: 'Home',link:'/dashboard'},
    {name: 'Users',link:'/users'},
    {name: 'Inventory',link:'/inventory'},
    {name: 'Organizations',link:'/organization'}
]

const Header = () => {
    return(
        <div>
            <AppBar position="static" style={{backgroundColor:'white'}}>
                <CssBaseline/>
                <Toolbar>
                    {   
                        headerMenu.map((item)=>(
                            <div style={{padding:'0 1vw'}}>
                                <Button component={Link} to={item.link} disableRipple className='buttonHeader'>
                                    {item.name}
                                </Button>
                            </div>
                        ))
                    } 
                    <Grid container justify='flex-end'>
                        <Button>
                            Login
                        </Button>
                    </Grid>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default Header;