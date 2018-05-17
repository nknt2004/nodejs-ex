import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import moment from 'moment';

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

function OrderDetails(props) {
    const { classes } = props;

    let orders = props.orders || [];

    let calculateChange = function(price, coinRate) {
        let percent = (coinRate - price) * 100 / price;
        return percent.toFixed(1);
    }
    
    return (
        <Paper className={classes.root}>
            <Typography type="subheading" style={{textAlign: 'left', margin: '10px'}}>{props.coinName} - {props.coinRate}</Typography>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow className={classes.head}>
                        <TableCell className={classes.paddingDefault}>Date</TableCell>
                        <TableCell className={classes.paddingDefault}>Type</TableCell>
                        <TableCell numeric className={classes.paddingDefault}>Quantity</TableCell>
                        <TableCell numeric className={classes.paddingDefault}>Rate</TableCell>
                        <TableCell numeric className={classes.paddingDefault}>Change</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map(n => {
                        return (
                            <TableRow key={n.TimeStamp} className={classes.head} hover={true}>
                                <TableCell className={classes.paddingDefault}>{moment(n.TimeStamp).format("MM-DD-YYYY")}</TableCell>
                                <TableCell className={classes.paddingDefault}>{n.OrderType === 'LIMIT_BUY' ? 'Buy' : 'Sell'}</TableCell>
                                <TableCell numeric className={classes.paddingDefault}>{n.Quantity}</TableCell>
                                <TableCell numeric className={classes.paddingDefault}>{n.PricePerUnit.toFixed(8)}</TableCell>
                                <TableCell numeric className={classes.paddingDefault}>{calculateChange(n.PricePerUnit, props.coinRate)}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </Paper>
    );
}

OrderDetails.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrderDetails);