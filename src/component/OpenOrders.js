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

function renderCondition(order) {
    let cond = order.Condition === 'LESS_THAN' ? '<' : '>';
    return `${cond} ${order.ConditionTarget.toFixed(8)} | `;
}

function OpenOrders(props) {
    const { classes } = props;

    let orders = props.orders || [];
    
    return (
        <Paper className={classes.root}>
            <Typography type="subheading" style={{textAlign: 'left', margin: '10px'}}>Open Orders</Typography>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow className={classes.head}>
                        <TableCell className={classes.paddingDefault}>Coin</TableCell>
                        <TableCell className={classes.paddingDefault}>Date</TableCell>
                        <TableCell className={classes.paddingDefault}>Type</TableCell>
                        <TableCell className={classes.paddingDefault}>Quantity</TableCell>
                        <TableCell numeric className={classes.paddingDefault}>Ask</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map(n => {
                        return (
                            <TableRow key={n.Opened} className={classes.head} hover={true}>
                                <TableCell className={classes.paddingDefault}>{n.Exchange.substr(4)}</TableCell>
                                <TableCell className={classes.paddingDefault}>{moment(n.Opened).format("MM-DD-YYYY")}</TableCell>
                                <TableCell className={classes.paddingDefault}>{n.OrderType === 'LIMIT_BUY' ? 'Buy' : 'Sell'}</TableCell>
                                <TableCell className={classes.paddingDefault}>{n.QuantityRemaining} / {n.Quantity}</TableCell>
                                <TableCell numeric className={classes.paddingDefault}>
                                    {n.IsConditional ? renderCondition(n) : null} 
                                    {n.Limit.toFixed(8)}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </Paper>
    );
}

OpenOrders.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OpenOrders);