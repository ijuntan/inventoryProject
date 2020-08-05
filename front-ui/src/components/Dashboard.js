import React from 'react';
import { Grid, Card , Button} from '@material-ui/core'
import { Link } from 'react-router-dom'
import './style.css'

const Options = [
    {name: 'Users',link:'/users'},
    {name: 'Product',link:'/inventory'},
    {name: 'Organizations',link:'/organization'}
]

const Dashboard = () => {
    return(
        <div>
            <Grid container justify='center' alignItems='center'>
                {
                    Options.map((item)=>(
                        <Grid container item xs={4} justify='center' alignItems='center' style={{minHeight:'50vh'}}>
                            <Button component={Link} to={item.link}>
                                <Card className='cardComponent'>
                                    {item.name}
                                </Card>
                            </Button>
                        </Grid>
                    ))
                }
                
            </Grid>
            
        </div>
    )
}

export default Dashboard;