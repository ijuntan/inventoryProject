import React,{ useState, useEffect } from 'react';
import {
  Table,TableCell,TablePagination,TableRow,Collapse,Dialog,DialogActions,DialogTitle,DialogContent,DialogContentText,
  Toolbar,Typography,Paper,IconButton,Tooltip,TextField,Grid,Button,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import Axios from 'axios';

const headCell = ["Name","Email","Organization","Actions"]

const HiddenData = (props) => {
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const {row} = props;

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return(
    <>
      <TableRow key={row.name}>
        <TableCell align="center">{row.name} </TableCell>
        <TableCell align="center">{row.email} </TableCell>
        <TableCell align="center">{row.organization.name} </TableCell>
        <TableCell align="center">
          <Tooltip title='view'>
            <IconButton aria-label="Edit" onClick={()=>setOpen(!open)}>
              <EditIcon/>
            </IconButton>
          </Tooltip>
          <Tooltip title='delete'>
            <IconButton aria-label="Delete" onClick={()=>setOpenDialog(!openDialog)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      { /* Hidden Data*/ }
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 , backgroundColor:'#D6D6D6'}} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Grid container justify='center' spacing={4} style={{margin:'5vh 0'}}> 
              <Grid item xs={4} container justify='center' >
              <TextField id="standard-basic" label="Name" value={row.name}/>
              </Grid>
              <Grid item xs={4} container justify='center'>
              <TextField id="standard-basic" label="First Name" value={row.firstName}/>
              </Grid>
              <Grid item xs={4} container justify='center'>
              <TextField id="standard-basic" label="Last Name" value={row.lastName}/>
              </Grid>
              <Grid item xs={4} container justify='center'>
              <TextField id="standard-basic" label="Email" value={row.email}/>
              </Grid>
              <Grid item xs={4} container justify='center'>
              <TextField id="standard-basic" label="Organization" value={row.organization.name}/>
              </Grid>
              <Grid item xs={4} container justify='flex-end' style={{padding:'5vh'}}>
                <Button variant='contained' color='primary' style={{marginRight:'2vw'}}>
                  Save
                </Button>
                <Button variant='contained' color='secondary' style={{marginRight:'2vw'}} onClick={()=>setOpen(!open)}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Collapse>
        </TableCell>
      </TableRow>

      {/* Delete Dialog */}
      <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
        >
          <DialogTitle>Deleting {row.name}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this user?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleCloseDialog} color="primary" autoFocus>
              I'm perfectly sure
            </Button>
          </DialogActions>
        </Dialog>
    </>
  )
}

const UserPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [users,setUsers] = useState([])
  const [search,setSearch] = useState('');
  const [searchResult,setSearchResult] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(()=>{
    getUsers();
  },[])
  
  const getUsers = () => {
    Axios({
      method: "GET",
      url: "http://localhost:8080/user/list",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(res => {
      setUsers(res.data.data)
    })
    .catch(err => {
      console.log(err)
    });
  }

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const addUser = () => {
    Axios({
      method: "POST",
      url: "http://localhost:8080/user/add",
      headers: {
        "Content-Type": "application/json"
      },
      data:{
        name:name,
        email:email,
        organization:organization,
        firstName:firstName,
        lastName:lastName,
        password:password
      }
    })
    getUsers();
    setOpenAddDialog(false);
  }

  const searchFunction = (text) => {
    console.log(text)
    
    setSearch(text);
    if(text !== ""){
      let searchResult = users.filter((item) => {
        let tempName = item.name.toLowerCase().indexOf(text.toLowerCase())
        if(tempName!==-1)
         {
          return item.name.toLowerCase()
         }
      });

      if (!searchResult || searchResult.length === 0){
        setSearchResult([]);
      }
      else{
        setSearchResult(searchResult)
      }
    }

    else{
      setSearchResult([]);
    }
  }

  const onChangeSearch = (event) => {
    searchFunction(event.target.value);
  }

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, users.length - page * rowsPerPage);

  let showUser = (search!==''?searchResult:users)
  return (
    <div style={{padding:'5vh 5vw'}}>
      <Paper>

        <Toolbar>
          <Typography variant='h4' style={{padding:'5vh 2vw',fontFamily:'maxImpact'}}>
            Users
          </Typography>
          <Grid container justify='flex-end' alignItems='center'>
            <SearchIcon style={{marginRight:'1vw'}}/>
            <TextField
              value={search}
              placeholder="Search…"
              onChange={onChangeSearch}
            />
            <Tooltip title='add user'>
              <IconButton style={{marginLeft:'2vw', backgroundColor:'#99aab5'}} onClick={()=>setOpenAddDialog(!openAddDialog)}>
                <AddIcon/>
              </IconButton>
            </Tooltip>
          </Grid>
        </Toolbar>
        
        <Table size='small'>
          <TableRow>
            {headCell.map((cell)=>(
              <TableCell align='center' style={{padding:'0 0 3vh'}}>
                <Typography variant='h5' style={{fontWeight:'bolder'}}>
                  {cell}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
            {
              showUser
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <HiddenData row={row} />
              ))
            }

            {emptyRows > 0 && (
              <TableRow style={{ height: 61 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
        </Table>

        
        
        {/* Add Dialog */}
        <Dialog
          open={openAddDialog}
          onClose={handleCloseAddDialog}
        >
          <DialogTitle>Add User</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Grid item xs={12} container justify='center' style={{marginBottom:'2vh'}}>
                <TextField id="standard-basic" label="Name" value={name} onChange={e=>setName(e.target.value)}/>
              </Grid>
              <Grid item xs={12} container justify='center' style={{marginBottom:'2vh'}}>
                <TextField id="standard-basic" label="First Name" value={firstName} onChange={e=>setFirstName(e.target.value)}/>
              </Grid>
              <Grid item xs={12} container justify='center' style={{marginBottom:'2vh'}}>
                <TextField id="standard-basic" label="Last Name" value={lastName} onChange={e=>setLastName(e.target.value)}/>
              </Grid>
              <Grid item xs={12} container justify='center' style={{marginBottom:'2vh'}}>
                <TextField id="standard-basic" label="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
              </Grid>
              <Grid item xs={12} container justify='center' style={{marginBottom:'2vh'}}>
                <TextField id="standard-basic" label="Password" value={password} onChange={e=>setPassword(e.target.value)}/>
              </Grid>
              <Grid item xs={12} container justify='center' style={{marginBottom:'2vh'}}>
                <TextField id="standard-basic" label="Organization" value={organization} onChange={e=>setOrganization(e.target.value)}/>
              </Grid>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddDialog} color="secondary">
              Cancel
            </Button>
            <Button onClick={addUser} color="primary" autoFocus>
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <TablePagination
          rowsPerPageOptions={[5]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

export default UserPage;