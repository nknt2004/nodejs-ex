import React from 'react';
import Bittrex from '../exchange/Bittrex';
import _ from 'lodash';
import OrderDetails from './OrderDetails';
import OrderHistory from './OrderHistory';
import CoinBalances from './CoinBalances';
import OpenOrders from './OpenOrders';
import Grid from 'material-ui/Grid';
import SetupDialog from './SetupDialog';
import { CircularProgress } from 'material-ui/Progress';

const styles = {
    root: {
      flexGrow: 1,
      marginTop: 30,
    }
}

let bittrex = new Bittrex();

export default class Page extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            details: [],
            coinOrders: {},
            currentCoinOrders: [],
            currentCoinRate: 0,
            totalBTC: 0,
            currentCoinName: 'Coin',
            status: {
                fetching: false,
                fetchTotal: 0,
                isSleeping: false
            }
        }
    }
    
    fetchData() {
        if(this.state.status.isSleeping) {
            return;
        }

        this.setState({
            status: {
                ...this.state.status,
                fetching: true
            }
        });
        bittrex.fetchBalance((coinBalances) => {
            //console.log("~~~~ CoinBalances ~~~~");
            //console.log(coinBalances);
            let totalBTC = 0;
            coinBalances.forEach(e => {
                totalBTC += e.BalanceBTC;
            });
            this.setState({totalBTC});

            this.setState({
                details: _.sortBy(coinBalances, 'Currency')
            });
            this.fetchStatus();
        });

        bittrex.fetchOrderHistory((coinOrders) => {
            this.setState({ coinOrders });
            this.fetchStatus();
        });

        bittrex.fetchOpenOrder((openOrders) => {
            this.setState({openOrders});
            this.fetchStatus();
        })
    }

    fetchStatus() {
        this.setState({
            status: {
                ...this.state.status,
                fetchTotal: this.state.status.fetchTotal + 1
            }
        });

        if(this.state.status.fetchTotal === 3) {
            this.setState({
                status: {
                    fetching: false,
                    fetchTotal: 0,
                    isSleeping: true
                }
            });

            setTimeout(() => { 
                this.setState({
                    status: {
                        ...this.state.status,
                        isSleeping: false
                    }
                });
            }, 30000);
        }
    }

    viewCoinOrders(currency, rate) {
        this.setState({
            currentCoinOrders: this.state.coinOrders[currency],
            currentCoinRate: rate,
            currentCoinName: currency
        });
    }

    updateToken(token) {
        bittrex.setToken(token);
        this.fetchData();
    }

    render() {
        let status = this.state.status;
        return (
            <div className="App">
                <div className="App-header">
                    <div className={`coin-circle clickable ${status.isSleeping ? "sleep" : ""}`} onClick={() => this.fetchData()}>
                        {this.state.totalBTC.toFixed(2)}
                        {this.state.status.fetching ? <CircularProgress size={60} color="accent" className="coin-loading"/> : null}
                    </div>
                    <SetupDialog onTokenChange={this.updateToken.bind(this)}/>
                </div>
                {this.state.details.length === 0 ? 
                    <div className="loading"><CircularProgress size={50} /></div>
                    : 
                    <div className={styles.root}>
                        <Grid container spacing={24}>
                            <Grid item xs={6}>
                                <CoinBalances data={this.state.details} onRowClick={this.viewCoinOrders.bind(this)}/>
                            </Grid>
                            <Grid item xs={6}>
                                <OpenOrders orders={this.state.openOrders}/>
                                <OrderDetails coinName={this.state.currentCoinName} orders={this.state.currentCoinOrders} coinRate={this.state.currentCoinRate}/>
                                <OrderHistory coinOrders={this.state.coinOrders} details={this.state.details}/>
                            </Grid>
                        </Grid>
                    </div>
                }
            </div>
        )
    }
}