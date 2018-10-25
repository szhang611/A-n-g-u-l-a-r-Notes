import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, WebView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Spinner from 'react-native-spinkit'



class MTravel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedTab: 0,
            AIR_WebViewUrl: 'https://www.expedia.com/Flights',
            HOTEL_WebViewUrl: 'https://www.google.com/',
            VEHICLE_WebViewUrl: 'https://www.youtube.com/',
        }
    }

    componentWillMount() {

    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidMount() {

    }

    selectTravelTab(idx) {
        this.setState({selectedTab: idx})
    };

    injectJSAfterLoad() {
        console.log('document.body');
        console.log(document.querySelector('#flight-tabs'))
    }

    render() {
        return(
            <View style={styles.travelView}>
                {/*<View style={styles.travelBar}>*/}
                    {/*<TouchableOpacity style={[styles.travelBarTab, this.state.selectedTab === 0 ? styles.selectedTravelBarTab : {}]} onPress={()=>{this.selectTravelTab(0)}}>*/}
                        {/*<Text style={styles.travelBarTabText}>*/}
                            {/*AIR*/}
                        {/*</Text>*/}
                    {/*</TouchableOpacity>*/}
                    {/*<TouchableOpacity style={[styles.travelBarTab, this.state.selectedTab === 1 ? styles.selectedTravelBarTab : {}]} onPress={()=>{this.selectTravelTab(1)}}>*/}
                        {/*<Text style={styles.travelBarTabText}>*/}
                            {/*HOTEL*/}
                        {/*</Text>*/}
                    {/*</TouchableOpacity>*/}
                    {/*<TouchableOpacity style={[styles.travelBarTab, this.state.selectedTab === 2 ? styles.selectedTravelBarTab : {}]} onPress={()=>{this.selectTravelTab(2)}}>*/}
                        {/*<Text style={styles.travelBarTabText}>*/}
                            {/*VEHICLE*/}
                        {/*</Text>*/}
                    {/*</TouchableOpacity>*/}
                {/*</View>*/}

                <View style={styles.travelBottom}>

                    <View style={[styles.bottomWebView, this.state.selectedTab === 0 ? styles.showWebView : styles.hideWebView]}>
                        <WebView
                            source={{ uri: this.state.AIR_WebViewUrl }}
                            injectJavaScript={()=>{this.injectJSAfterLoad()}}
                        />
                    </View>

                    <View style={[styles.bottomWebView, this.state.selectedTab === 1 ? styles.showWebView : styles.hideWebView]}>
                        <WebView
                            source={{ uri: this.state.HOTEL_WebViewUrl }}
                        />
                    </View>

                    <View style={[styles.bottomWebView, this.state.selectedTab === 2 ? styles.showWebView : styles.hideWebView ]}>
                        <WebView
                            source={{ uri: this.state.VEHICLE_WebViewUrl }}
                        />
                    </View>


                </View>
            </View>
        )
    }

}


const styles = StyleSheet.create({
    travelView: {
        backgroundColor: '#000',
        flex: 1,
    },
    travelBar: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#111',
    },
    travelBarTab: {
        flex: 1,
        justifyContent: 'center',
        alignItems:'center',
    },
    selectedTravelBarTab: {
        backgroundColor: '#45E',
    },
    travelBarTabText: {
        color: '#FFF',
        fontSize: 14,
    },
    travelBottom: {
        flex: 12,
        backgroundColor: '#000',
        position: 'relative'
    },
    bottomWebView: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    showWebView: {
        top: 0,
        left: 0,
    },
    hideWebView: {
        display: 'none',
    },
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
export default connect(mapStateToProps, mapDispatchToProps)(MTravel);