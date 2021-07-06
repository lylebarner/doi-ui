import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import {makeStyles} from "@material-ui/core/styles";
import rootActions from "../actions/rootActions";
import {Alert} from "@material-ui/lab";
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
	alert: {
		'& .MuiAlert-message':{
			marginLeft: "auto",
			marginRight: "auto"
		},
		// width: 250,
		marginLeft: "auto",
		marginRight: "auto"
	},
	tableContainer: {
		maxHeight: 'calc(100vh - 375px)',
	},
	tableHeader: {
		'& th': {
			fontWeight: 'bold',
		},
	},
	tablePagination: {
		backgroundColor: '#fafafa',
		width: '100%'
	},
	columnDoi: {
		minWidth: 125
	},
	columnLidvid: {
		minWidth: 325
	},
	columnStatus: {
		width: 100
	},
	buttonLink: {
		textTransform: 'initial',
		padding: 0
	}
}));

const SearchResults = () => {
	const classes = useStyles();
	const dispatch = useDispatch();

	const data = useSelector(state => {
		return state.appReducer.searchResponse;
	});
	
	const handleReleaseClick = (event, lidvid) => {
		dispatch(rootActions.appAction.resetSearch());
		dispatch(rootActions.appAction.setIsReleasing({"page": true, "identifier": lidvid}));
	};

	const massageStatus = (string) => {
		if (string === "review") {
			return "In " + capitalizeWord(string);
		} else {
			return capitalizeWord(string);
		}
	};

	const capitalizeWord = (string) => {
		return string.charAt(0).toUpperCase() + string.slice(1);
	};

	// const formatDate = (string) => { // i.e. 2021-02-24T17:32:55.977736+08:00
	// 	const idx = string.indexOf('T');
	// 	const date = string.substr(0, idx);
	// 	const time = string.substr(idx + 1, 'hh:mm:ss'.length);
	// 	return date + ' ' + time;
	// };

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(20);
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	// useEffect(() => {
	// 	setData(props.data);
	// 	setTableType(props.table);
	// 	setPage(0);
	// }, [props.data, props.table]);

	return (
			<>
			{data ?
				data.errors ?
						<Alert icon={false} severity="error" className={`${classes.alert} ${classes.center}`}>
							{data.errors[0].message}
						</Alert>
						:
						<>
							{data.length === 1 ?
									<Typography className="align-left">1 result found</Typography>
									:
									<Typography className="align-left">{data.length} results found</Typography>
							}
							<TableContainer className={classes.tableContainer}>
								<Table size="small" aria-label="a dense, sticky, paginated table" stickyHeader>
									<TableHead className={classes.tableHeader}>
											<TableRow>
												<TableCell>DOI</TableCell>
												<TableCell>Identifier</TableCell>
												<TableCell>Title</TableCell>
												<TableCell>Status</TableCell>
												<TableCell>Action</TableCell>
												{/*<TableCell>Last Updated</TableCell>*/}
											</TableRow>
										</TableHead>
									<TableBody>
										{
											(rowsPerPage > 0 ?
												data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
												:
												data
											).map((dataItem) => {
												return (
													<TableRow hover key={dataItem.lidvid}>
														<TableCell className={classes.columnDoi}>
															{
																dataItem.doi ?
																	dataItem.status.toLowerCase() === 'registered' ?
																		<a href="https://doi.org/" target="_blank">{dataItem.doi}</a>
																		:
																		dataItem.doi
																:
																'-'
															}
														</TableCell>
														<TableCell className={classes.columnLidvid}>{dataItem.lidvid}</TableCell>
														<TableCell>{dataItem.title}</TableCell>
														<TableCell className={classes.columnStatus}>{massageStatus(dataItem.status.toLowerCase())}</TableCell>
														<TableCell>{(() => {
															switch (dataItem.status.toLowerCase()) {
																case 'draft':
																case 'reserved':
																	return (
																			<Button color="primary"
																							variant="contained"
																							onClick={(event) => handleReleaseClick(event, dataItem.lidvid)}
																			>
																				Release
																			</Button>
																	);
																case 'registered':
																	return (
																			<Button color="primary"
																							variant="contained"
																							onClick={(event) => handleReleaseClick(event, dataItem.lidvid)}
																			>
																				Update
																			</Button>
																	);
																case 'review':
																	return (
																			<Button disabled
																							variant="contained"
																			>
																				Pending
																			</Button>
																	);
																default:
																	return '-';
															}
														})()}</TableCell>
														{/*<TableCell>{formatDate(dataItem.update_date)}</TableCell>*/}
													</TableRow>
												);
											})
										}
									</TableBody>
								</Table>
							</TableContainer>
							{data.length > rowsPerPage && (
									<TablePagination className={classes.tablePagination}
																	 rowsPerPageOptions={[10, 20, 50, {label: 'All', value: -1}]}
																	 component="div"
																	 count={data.length}
																	 rowsPerPage={rowsPerPage}
																	 page={page}
																	 onChangePage={handleChangePage}
																	 onChangeRowsPerPage={handleChangeRowsPerPage}
									/>
							)}
						</>
					:
					""
			}
		</>
	)
};

export default SearchResults;