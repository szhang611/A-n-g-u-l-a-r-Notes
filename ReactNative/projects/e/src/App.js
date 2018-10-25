import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import { connect } from 'react-redux';

import Main from './pages/Main';
import Loading from './pages/loginPages/Loading';
import Login from './pages/loginPages/Login';

/**
 * Main component of the app
 */
class AppComponent extends Component {

    constructor(props) {
        super(props);
        // set status bar 
        StatusBar.setBarStyle('light-content', true);
    }

    // Login => Loading => Main
    renderComponent(hasLogin, hasLoading) {
        if (hasLogin) {
            // if (hasLoading) {
                return <Main />
            // } else {
            //     return <Loading />
            // }
        } else {
            return <Login />
        }
    }

    render() {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {this.renderComponent(this.props.hasLogin, this.props.hasLoading)}
            </View>
        );
    }
}



//---------------    container    -----------------
const mapStateToProps = state => ({
    hasLogin: state.app.hasLogin, // default: false
    hasLoading: state.app.hasLoading // default: false
});
export default connect(mapStateToProps)(AppComponent);
