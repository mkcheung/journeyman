import axios from 'axios'
import React, { useState, useEffect } from 'react';
import swal from 'sweetalert';
import  NewTagModal  from './NewTagModal';
import { 
    Box,
    Collapse,
    Container,
    Grid,
    IconButton,
    Modal,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import { Link, useHistory } from 'react-router-dom';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

function useMergeState(initialState) {
    const [state, setState] = useState(initialState);
    const setMergedState = newState => 
        setState(prevState => Object.assign({}, prevState, newState)
    );
    return [state, setMergedState];
}

    const useRowStyles = makeStyles({
        root: {
            '& > *': {
                borderBottom: 'unset',
            },
        },
    });   

function Row(props) {
    const { tag } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    { tag.title }
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Associated Blogs</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tag.posts.map((post) => (
                                        <TableRow key={post.id}>
                                            <TableCell component="th" scope="row">
                                                    <Link
                                                        to={`/post/show/${post.id}`}
                                                        key={post.id}
                                                        style={{ textDecoration: 'none', color:'black' }}
                                                    >
                                                        {post.title}
                                                    </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
} 

export default function TagsList(props) {

    let user = {};
    let token = '';
    let state = localStorage["appState"];

    if (state) {
        let appState = JSON.parse(state);
        user = appState.user;
        token = user.access_token;
    }

    const history = useHistory();

    const [combined, setCombined] = useMergeState({
        loading: true,
        tags: [],
        columnDefs:[
            {field:'postTitle', sortable:true, filter:true},
        ],
        autoGroupColumnDef:{
            headerName:'Tag',
            field:'tagTitle',
            pinned: 'left',
            resizable: true,
        }
    });

    const [rowData, setRowData] = useState([
        { make: "Toyota", model: "Celica", price: 35000 },
        { make: "Ford", model: "Mondeo", price: 32000 },
        { make: "Porsche", model: "Boxter", price: 72000 }
    ]);

    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    const [newTag, setNewTag] = useState({
        title: '',
        description: '',
        slug: ''
    });
    const [errors, setErrors] = useState([]);

    useEffect( () => {
        async function loadData(){

            let tagObj = await axios.get('/api/tags/getTagsToPosts', 
            {
                headers: {
                    'Authorization': 'Bearer '+token,
                    'Accept': 'application/json'
                }
            });

            let postsToTags = [];
            const tagData = tagObj.data;
            await setCombined({
                loading: false,
                tags: tagData
            });
        }
        loadData();
    },[]);

    const handleFieldChange = async (event) => {
        newTag[event.target.id] = event.target.value
    }

    const handleOpen = async () => {
        setOpen(true);
    };

    const handleClose = async () => {
        setOpen(false);
    };

    const handleSubmit = async () => {

        axios.post('/api/tags', newTag)
            .then(response => {
                swal("Done!", "Tag Created!", "success");
                setLoading(true);
                handleClose();
            })
            .catch(error => {
                setErrors(error.response.data.errors);
            });
    };

    return (
        <Container maxWidth="lg">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <div className='card-header'>All Tags</div>
                    <NewTagModal open={open} handleFieldChange={handleFieldChange} handleSubmit={handleSubmit} handleClose={handleClose} />
                </Grid>
                <Grid item xs={6}>
                    <TableContainer component={Paper}>
                        <Table aria-label="collapsible table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tags</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {combined.tags.map((tag) => (
                                        <Row key={`tag-${tag.title}-${tag.id}`} tag={tag} />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={6}>
                    <button type="button" onClick={handleOpen}>
                        Create Tag
                    </button>
                </Grid>
            </Grid>
        </Container>
    );
}
