import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { init } from '../../actions/InitActions';
import { endLoading } from '../../actions/LoadingActions';
import { logout } from '../../actions/LogoutActions';


/**
 * App loading page, invoke 'Synch' api to get init data, like contentid, sceneid, globalMD...
 */
class Loading extends Component {
    constructor(props) {
        super(props);
        this.state = { animating: true }
    }

    componentWillReceiveProps(nextProps) {
        // if get init data failure, redirct to login page
        if (nextProps.Init.failReason == '') {
            this.props.logout();
        }
        // if get init data success, end loading
        if (nextProps.Init.globalMD && nextProps.Init.globalMD.Number && nextProps.Init.globalMD.ebuCoreMain) {
            this.setState({
                animating: false
            });
            this.props.endLoading();
        }
    }

    componentWillMount = () => {
        // init action, invoke 'Synch' api
        this.props.init(this.props.app.sid, this.props.app.homeid);
    }

    render() {
        let animating = this.state.animating;
        return (
            <View style={styles.container}>
                <ActivityIndicator
                    animating={animating}
                    color='black'
                    size="large"
                    style={styles.activityIndicator} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 80
    }
})


//---------------    container    -----------------
const mapStateToProps = state => ({
    Init: state.init,
    app: state.app
});
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        endLoading, logout
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(Loading);
