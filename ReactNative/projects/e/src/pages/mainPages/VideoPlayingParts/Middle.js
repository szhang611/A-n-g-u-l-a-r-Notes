import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Spinner from 'react-native-spinkit'

import MGlobal from './middlePages/MGlobal';
import MCast from './middlePages/MCast';
import MLocation from './middlePages/MLocation';
import MRetail from './middlePages/shop/MRetail';
import MShopViewAll from './middlePages/shop/MShopViewAll';
import MShopTab from './middlePages/MShopTab';
import MFood from './middlePages/MFood';
import MBuilding from './middlePages/MBuilding';
import MTravel from './middlePages/MTravel';
import MSocial from './middlePages/MSocial';
import MViewing from './middlePages/MViewing';
import MBrowser from './middlePages/MBrowser';

import { AsyncStorage } from 'react-native';
import { globalEventEmitter, globalTabSwitchState } from '../../../utils/globalEventEmitter';
import SocialMessage from './middlePages/Social/SocialMessage';
import { APIService } from '../../../services/APIService';
import Icons from 'react-native-vector-icons/MaterialIcons';

import {jointChatRoom} from '../../../actions/SocialActions';
import { navigateTo } from '../../../actions/NavigationAction';



class Middle extends Component {
    constructor() {
        super();
        this.state = {
            tabSwitchStatus: null,
        };
    }

    componentWillMount() {
        this.setState({tabSwitchState: globalTabSwitchState});
        globalEventEmitter.addListener('tabSwitchStatus_MainEmit', (res)=>{
            this.judgeTabStatus(res);
        });
        globalEventEmitter.addListener('tabSwitchStatus_OtherEmit', (res)=>{
            this.judgeTabStatus(res);
        });
    }

    judgeTabStatus(res) {
        if(
            ((this.props.nav.to === 'Shop' || this.props.selectedTab === 'retail_details' || this.props.selectedTab === 'MShopViewAll') && res.shop === false)
            || (this.props.nav.to === 'Location' && res.location === false)
            || (this.props.nav.to === 'Travel' && res.travel === false)
            || (this.props.nav.to === 'Social' && res.social === false)
            || (this.props.nav.to === 'Viewing' && res.social === false)
            || (this.props.nav.to === 'Browser' && res.social === false)
        ) {
            this.props.navigateTo('','','Info','home');
        }

        this.setState({tabSwitchState: res});
        AsyncStorage.getItem('USER_ID').then((uid)=>{
            this.updateProfileTabSettings(uid, res);
        });
    }

    async updateProfileTabSettings(uid, body) {
        // console.log(body);
        let res = await APIService.updateProfileTabSettings(uid, body);
        // console.log(res);
    }

    closeTab(tabName) {
        globalTabSwitchState[tabName] = false;
        globalEventEmitter.emit('closeTab', globalTabSwitchState);
        this.judgeTabStatus(globalTabSwitchState);
    }


    renderTopNavIcon() {
        return (
            <View style={styles.MiddleTop}>
                <TouchableOpacity  style={  this.props.nav.to === 'Info' ?  styles.tabItemSelected : styles.tabItem } onPress={() => {
                    this.setState({
                        currentNav : 'Info'
                    })
                    AsyncStorage.getItem('WATCHING_NOW').then((res)=>{
                        watching_now =  JSON.parse(res)
                        watching_now.isFired = false
                        AsyncStorage.setItem('WATCHING_NOW', JSON.stringify(watching_now))
                        
                    });
                    globalEventEmitter.emit('clearSocialTab', true)
                    this.props.navigateTo('','','Info','home')}}>
                         <Text style = { styles.navTitle }> INFO </Text>
                </TouchableOpacity>

                {
                    this.props.init.products && this.state.tabSwitchState.shop &&
                    <TouchableOpacity  style={ this.props.nav.to === 'Shop' || this.props.selectedTab === 'retail_details' || this.props.selectedTab === 'MShopViewAll' ?  styles.tabItemSelected : styles.tabItem } onPress={() => { 
                        this.setState({
                            currentNav : 'Shop'
                        })
                        AsyncStorage.getItem('WATCHING_NOW').then((res)=>{
                            watching_now =  JSON.parse(res)
                            watching_now.isFired = false
                            AsyncStorage.setItem('WATCHING_NOW', JSON.stringify(watching_now))
                            
                        });
                        globalEventEmitter.emit('clearSocialTab', true)
                        this.props.navigateTo('','','Shop','home') }}>
                        <Text style = {styles.navTitle}> SHOP </Text>
                        <TouchableOpacity style={styles.closeTabIcon} onPress={()=>{this.closeTab('shop')}}>
                            <Icons name={'close'} size={20} color={'#FFF'} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                }

                {
                    this.props.init.location && this.state.tabSwitchState.location &&
                    <TouchableOpacity style={ this.props.nav.to === 'Location' ?  styles.tabItemSelected : styles.tabItem } onPress={() => { 
                        this.setState({
                            currentNav : 'Location'
                        })
                        AsyncStorage.getItem('WATCHING_NOW').then((res)=>{
                            watching_now =  JSON.parse(res)
                            watching_now.isFired = false
                            AsyncStorage.setItem('WATCHING_NOW', JSON.stringify(watching_now))
                            
                        });
                        globalEventEmitter.emit('clearSocialTab', true)
                        this.props.navigateTo('','','Location','home') }}>
                        <Text style = {styles.navTitle}> LOCATION </Text>
                        <TouchableOpacity style={styles.closeTabIcon} onPress={()=>{this.closeTab('location')}}>
                            <Icons name={'close'} size={20} color={'#FFF'} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                }

                {
                    this.props.init.location && this.state.tabSwitchState.travel &&
                    <TouchableOpacity style={ this.props.nav.to === 'Travel' ?  styles.tabItemSelected : styles.tabItem } onPress={() => { 
                        this.setState({
                            currentNav : 'Travel'
                        })
                        AsyncStorage.getItem('WATCHING_NOW').then((res)=>{
                            watching_now =  JSON.parse(res)
                            watching_now.isFired = false
                            AsyncStorage.setItem('WATCHING_NOW', JSON.stringify(watching_now))
                            
                        });
                        globalEventEmitter.emit('clearSocialTab', true)
                        this.props.navigateTo('','','Travel','home') }}>
                        <Text style = {styles.navTitle} > TRAVEL </Text>
                        <TouchableOpacity style={styles.closeTabIcon} onPress={()=>{this.closeTab('travel')}}>
                            <Icons name={'close'} size={20} color={'#FFF'} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                }

                {
                    this.state.tabSwitchState.social &&
                    <TouchableOpacity style={ this.props.nav.to === 'Social' ?  styles.tabItemSelected : styles.tabItem } onPress={() => {
                        globalEventEmitter.emit('NavigateToSocialChat', true);
                        this.props.navigateTo('','','Social','home')
                    }  }>
                        <Text style = {styles.navTitle}> SOCIAL </Text>
                        <TouchableOpacity style={styles.closeTabIcon} onPress={()=>{this.closeTab('social')}}>
                            <Icons name={'close'} size={20} color={'#FFF'} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                }

                 {
                     this.state.tabSwitchState.viewing &&
                    <TouchableOpacity style={ this.props.nav.to === 'Viewing' ?  styles.tabItemSelected : styles.tabItem } onPress={() => {
                        this.props.navigateTo('','','Viewing','home')
                    }  }>
                        <Text style = {styles.navTitle}> VIEWING </Text>
                        <TouchableOpacity style={styles.closeTabIcon} onPress={()=>{this.closeTab('viewing')}}>
                            <Icons name={'close'} size={20} color={'#FFF'} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                }

                 {
                     this.state.tabSwitchState.browser &&
                    <TouchableOpacity style={ this.props.nav.to === 'Browser' ?  styles.tabItemSelected : styles.tabItem } onPress={() => {
                        this.props.navigateTo('','','Browser','home')
                    }  }>
                        <Text style = {styles.navTitle}> INTERNET </Text>
                        <TouchableOpacity style={styles.closeTabIcon} onPress={()=>{this.closeTab('browser')}}>
                            <Icons name={'close'} size={20} color={'#FFF'} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                }

            </View>
        )
    }

    renderComponents () {
        switch (this.props.nav.to) {
            case 'Info':
                return <MGlobal />
            
            /* Shop Tab - start */
            case 'Shop':
                switch (this.props.nav.to_subTab){
                    case 'home':
                        return <MShopTab leftBottomVideoName={this.props.leftBottomVideoName} />;
                    case 'allProducts':
                        return <MShopViewAll leftBottomVideoName={this.props.leftBottomVideoName} />;
                    case 'productDetails':
                        return <MRetail  leftBottomVideoName={this.props.leftBottomVideoName} />;
                    default:
                        return <MShopTab />
                }
                
            /* Shop Tab - end */

            case 'Location':
                return <MLocation />

            case 'Travel':
                return <MTravel />

            case 'Social':
                return <MSocial socket = {this.props.socket}/>

            case 'Viewing': 
                return <MViewing />

            case 'Browser':
                return <MBrowser />

            default:
                return (
                    <View>
                        <Text style={styles.error}>ERROR</Text>
                    </View>
                )
        }
    }
    
    render() {
        // if(this.props.init.synchSceneSucceed) {
            return(
                <View style={styles.MiddleView}>
                    {this.renderTopNavIcon()}

                    <View style={styles.MiddleBottom}>
                        {  this.renderComponents()}
                    </View>
                </View>
            )
        // } else {
        //     return(
        //         <View style={{flex:1, backgroundColor: '#282828'}}>
        //             <View style={{flex: 1, justifyContent:'center', alignItems:'center', ...StyleSheet.absoluteFillObject, zIndex: 99}}>
        //                 <Spinner type={'Circle'} color={'#f1f1f1'} size={60}/>
        //             </View>
        //         </View>
        //     )
        // }
    }
}

const styles = StyleSheet.create({
    MiddleView:{
        flex:1,
    },
    navTitle: {
        color : '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    MiddleTop: {
        flex: 1,
        flexDirection: 'row',
        // paddingTop: 10,
        // paddingBottom: 10,
    },
    tabItem: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    topImageBox: { 
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabItemSelected: { 
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    closeTabIcon: {
        position: 'absolute',
        right: 0,
        top: 0,
        height: '100%',
        justifyContent: 'center',
        paddingRight: 8,
        paddingLeft: 8,
    },
    MiddleBottom: {
        flex: 14,
    },
    error: {
        color:'red',
        fontSize: 14
    }
});



//|\\---------- container ----------//|\\

const mapStateToProps = state => ({
    selectedTab: state.selectedTab,
    nav: state.nav,
    init: state.init,
});
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        navigateTo,
        jointChatRoom
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(Middle);