import React from 'react';
import {Switch,Route,withRouter} from 'react-router-dom';
import {createBrowserHistory} from 'history';
import UserPage from './UserPage';
import Dashboard from './Dashboard';
import InventoryPage from './InventoryPage';

const history = createBrowserHistory();

const Navigation = () => {
    return(
        <Switch history={history}>
            <Route path='/' exact component={Dashboard}/>
            <Route path='/dashboard' component={Dashboard}/>
            <Route path='/users' component={UserPage}/>
            <Route path='/inventory' component={InventoryPage}/>
        </Switch>
    )
}

export default withRouter(props => <Navigation {...props}/>);