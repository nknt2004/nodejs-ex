import React from 'react';
import { withStyles } from 'material-ui/styles';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    menu: {
        width: 200,
    },
    settingBtn: {
        position: 'absolute',
        bottom: '10px',
        left: '5px'
    }
});

class SetupDialog extends React.Component {
    state = {
        open: true,
        bittrexKey: '',
        bittrexSecret: ''
    };

    openDialog = () => {
        this.setState({ open: true });
    };

    closeDialog = () => {
        this.setState({ open: false });
    };

    onKeyChange = (e) => {
        this.setState({bittrexKey: e.currentTarget.value});
    };

    onSecretChange = (e) => {
        this.setState({bittrexSecret: e.currentTarget.value});
    };

    saveToken = (e) => {
        this.props.onTokenChange({
            key: this.state.bittrexKey,
            secret: this.state.bittrexSecret
        });
        this.closeDialog();
    };

    render() {
        const { classes } = this.props;
        return (
            <div>
                <IconButton className={classes.settingBtn} onClick={this.openDialog}><Icon color="contrast">settings</Icon></IconButton>
                <Dialog open={this.state.open} 
                        onRequestClose={this.closeDialog}
                        ignoreBackdropClick={true}>
                    <DialogTitle>{"Setup Exchange"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <TextField
                                id="bittrexKey"
                                label="Bittrex Key"
                                className={classes.textField}
                                value={this.state.name}
                                onChange={this.onKeyChange}
                                margin="normal"
                            />
                            <TextField
                                id="bittrexSecret"
                                label="Bittrex Secret"
                                className={classes.textField}
                                value={this.state.name}
                                onChange={this.onSecretChange}
                                margin="normal"
                                type="password"
                            />
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeDialog} color="primary">
                            Close
                        </Button>
                        <Button onClick={this.saveToken} color="primary" autoFocus>
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(SetupDialog);