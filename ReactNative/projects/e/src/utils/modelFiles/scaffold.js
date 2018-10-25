import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Spinner from 'react-native-spinkit'



class Scaffold extends Component {
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
            <View>

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
export default connect(mapStateToProps, mapDispatchToProps)(Scaffold);