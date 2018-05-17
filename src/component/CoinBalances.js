import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow, TableFooter, TablePagination } from 'material-ui/Table';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
    table: {
        minWidth: 200
    },
    head: {
        height: '40px'
    },
    paddingDefault: {
        padding: '10px 10px 10px 10px'
    }
});

class CoinBalances extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            rowsPerPage: 12,
            page: 0
        }
    }

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    render() {
        let data = this.props.data || [];
        let paddingDefault = this.state.classes.paddingDefault;
        const { rowsPerPage, page } = this.state;
        return (
            <Paper className={this.state.classes.root}>
                <Typography type="subheading" style={{textAlign: 'left', margin: '10px'}}>Coins</Typography>
                <Table className={this.state.classes.table}>
                    <TableHead>
                        <TableRow className={this.state.classes.head}>
                            <TableCell className={paddingDefault}>Coin</TableCell>
                            <TableCell numeric className={paddingDefault}>Total</TableCell>
                            <TableCell numeric className={paddingDefault}>Rate</TableCell>
                            <TableCell numeric className={paddingDefault}>BTC Value</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
                            return (
                                <TableRow key={n.Currency} className={[this.state.classes.head, 'clickable'].join(' ')} hover={true} onClick={() => this.props.onRowClick(n.Currency, n.Rate)}>
                                    <TableCell className={paddingDefault}>{n.Currency}</TableCell>
                                    <TableCell numeric className={paddingDefault}>{n.Balance}</TableCell>
                                    <TableCell numeric className={paddingDefault}>{n.Rate.toFixed(8)}</TableCell>
                                    <TableCell numeric className={paddingDefault}>{n.BalanceBTC.toFixed(8)}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                    <TableFooter>
                        <TableRow className={this.state.classes.head}>
                            <TablePagination
                                count={data.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </Paper>
        )
    }
}

CoinBalances.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CoinBalances);