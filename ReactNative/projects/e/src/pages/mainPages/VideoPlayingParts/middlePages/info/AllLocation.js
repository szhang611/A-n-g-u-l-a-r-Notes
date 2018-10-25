import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, Image, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {navigateTo} from '../../../../../actions/NavigationAction'
import Icons from 'react-native-vector-icons/MaterialIcons'
import {getAllLocation} from "../../../../../actions/SceneActions";
import EeText from '../MCommon/EeText';

class AllCast extends Component {

    constructor(props) {
        super(props);
    }

    state = {
        allLocation : null
    };

    componentWillMount() {
        if(!this.props.init.allLocation) {
            this.props.getAllLocation(this.props.app, this.props.init, this.props.init.contentid);
        }
    }

    componentWillReceiveProps(nextProps) {

    }

    render() {
        return (
            <View style = {styles.allCastView}>
                <View style = {styles.showNavBar}>
                    <TouchableOpacity style = {styles.backIcon} onPress = { () => {this.props.navigateTo('Info','allLocation','Info','home')}}>
                        <Icons
                            style={{padding: 3}}
                            name={'navigate-before'}
                            color={'#FFFFFF'}
                            size={36}
                        />
                    </TouchableOpacity>
                    <View style={styles.NavBarTitle}>
                        <Text style = {styles.centerTitle}>All locations</Text>
                    </View>
                    <TouchableOpacity style = {styles.homeIcon} onPress = { () => {this.props.navigateTo('Info','allLocation','Info','home')}} >
                        <Icons
                            style={{padding: 3}}
                            name={'home'}
                            color={'#FFFFFF'}
                            size={36}
                        />
                    </TouchableOpacity>
                </View>

                <ScrollView>
                    <View style={styles.locationScrollInteriorView}>
                        {this.renderAllLocations()}
                    </View>
                </ScrollView>

            </View>
        )
    }


    renderAllLocations() {
        if(this.props.init.allLocation) {
            return ( this.props.init.allLocation.map((item, idx)=>{
                return (
                    <View style={styles.locationImageWrap} key={idx} onPress={()=>{ console.log('Pressing location poster!') }}>
                        <View style={{ flex:1, width: '90%', marginLeft: '5%',}}>
                            <Image style={styles.locationImages} resizeMode='contain' source={{uri: item.Image}} defaultSource={require( '../../../../../assets/logo/pwc_logo_2.png')} />
                            <View style={styles.locationTextGroup}>
                                <Text style={styles.imageBox_text} numberOfLines={2}>{ item.title }</Text>
                                <Text style={styles.imageBox_text_Address} numberOfLines={2}>Address: {item.contact.address}</Text>
                            </View>
                        </View>
                    </View>
                )
            }))
        }
    }


    // ------ component end ------
}



const styles = StyleSheet.create({
    allCastView: {
        flex: 1,
        backgroundColor : '#000'
    },
    showNavBar: {
        flexDirection : 'row',
        padding: 10,
        backgroundColor: '#000',
    },
    backIcon: {
        flex: 1,
        alignItems: 'flex-start',
    },
    NavBarTitle: {
        flex: 1,
        justifyContent: 'center',
    },
    centerTitle: {
        textAlign: 'center',
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    homeIcon: {
        flex: 1,
        alignItems: 'flex-end',
    },
    locationWrapper: {
        flex: 9,
        width: '100%',
        justifyContent:'center',
        alignItems:'center',
        alignContent:'center',
    },
    locationScrollInteriorView: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignContent: 'flex-start',
        justifyContent: 'flex-start',
        marginTop: 10
    },
    locationImageWrap: {
        width: '45%',
        marginLeft: '3%',
        marginBottom: 10,
    },
    locationImages: {
        width:  '100%',
        height: 180,
    },
    locationTextGroup: {
        // flex: 2,
    },
    imageBox_text:{
        color: '#FFFFFF',
        fontSize: 12,
        lineHeight: 16,
        textAlign:'left',
    },
    imageBox_text_Address:{
        color: '#FFFFFF',
        fontSize: 10,
        lineHeight: 16,
        textAlign:'left',
    },
});


//---------------    container    -----------------
const mapStateToProps = state => {
    return ({
        global: state.init.globalMD,
        content: state.init.contentid,
        init: state.init,
        app: state.app,
    })
};
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        navigateTo
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(AllCast);