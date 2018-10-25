import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Spinner from 'react-native-spinkit'

import  Webbrowser from '../../../../utils/react-native-webbrowser-with-back/index';


class MBrowser extends Component {
    constructor() {
        super();

        this.state = {

        }
    }

    componentWillMount() {

    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidMount() {

    }

    render() {
        return(
            <View style={{paddingTop:20, flex:1}}>

                <Webbrowser
                    url="https://www.google.com"
                    hideHomeButton={false}
                    hideToolbar={false}
                    hideAddressBar={false}
                    hideStatusBar={false}
                    foregroundColor={'#000'}
                    backgroundColor={'#222'}
                />

            </View>
        )
    }

}


const styles = StyleSheet.create({

});



//---------- container ----------

const mapStateToProps = state => ({
    init: state.init,
    nav: state.nav,
});
const mapDispatchToProps = dispatch => (
    bindActionCreators({

    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(MBrowser);