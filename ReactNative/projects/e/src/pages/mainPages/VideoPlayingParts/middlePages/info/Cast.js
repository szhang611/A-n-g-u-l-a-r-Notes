import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, Image, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import EeText from '../MCommon/EeText'
import Icons from 'react-native-vector-icons/MaterialIcons'
import {navigateTo} from '../../../../../actions/NavigationAction'

class Cast extends Component {
    constructor(props) {
        super(props)

    }

    renderActing(){


    }


    renderProducers(){


    }


    RenderDirectors(){


    }

    render() {
        return ( 
        <View  style = {styles.castView} >
            <View style = {styles.showNavBar}>
            <TouchableOpacity style = {styles.backIcon}  onPress = { () => {
                if (this.props.nav.from === 'Info' && this.props.nav.from_subTab === 'allCast'){
                    this.props.navigateTo('Info','cast','Info','allCast',this.props.allCastList)
                }else{
                    this.props.navigateTo('Info','cast','Info','home')
                }
            }}>
                <Icons
                            style={{padding: 3}}
                            name={'navigate-before'}
                            color={'#FFFFFF'}
                            size={36}
                        />
            </TouchableOpacity>
            <TouchableOpacity style = {styles.homeIcon} onPress = { () => {
                this.props.navigateTo('Info','cast','Info','home')
            }} >
                  <Icons
                            style={{padding: 3 }}
                            name={'home'}
                            color={'#FFFFFF'}
                            size={36}
                        />
            </TouchableOpacity>
            </View>
            <View style={styles.castBox}>
                <View style = {styles.castPortrait}>
                    <Image style ={styles.castPortraitImage} source={this.props.castInfo.Image} resizeMode="contain" defaultSource={require( '../../../../../assets/logo/pwc_logo_2.png')} />
                </View>
                <View style = {styles.castDescription} >
                    <EeText style={[styles.title]}>{this.props.castInfo.Name}</EeText>
                    <ScrollView>
                        <EeText style={[styles.description]}>{this.props.castInfo.Description}</EeText>
                    </ScrollView>
                </View>
                
            </View>

                <View style={styles.category}>
                            <View style={styles.categoryTitleBar}>
                                <Text style={styles.categoryTitle}>Producer</Text>
                            </View>
                            <View style={styles.categoryScrollView}>
                            <ScrollView style = {{ marginTop : 10 }} horizontal={true}>
                               
                                </ScrollView>
                            </View>
                </View>
                <View style={styles.category}>
                            <View style={styles.categoryTitleBar}>
                                <Text style={styles.categoryTitle}>Acting</Text>
                            </View>
                            <View style={styles.categoryScrollView}>
                            <ScrollView style = {{ marginTop : 10 }} horizontal={true}>
                               
                                </ScrollView>
                            </View>
                </View>
                <View style={styles.category}>
                            <View style={styles.categoryTitleBar}>
                                <Text style={styles.categoryTitle}>Director</Text>
                            </View>
                            <View style={styles.categoryScrollView}>
                            <ScrollView style = {{ marginTop : 10 }} horizontal={true}>
                               
                                </ScrollView>
                            </View>
                </View>
        </View>
        )
    }

}


const styles = StyleSheet.create({
    castView: {
        flex: 2,
        backgroundColor : '#000'
    },
    showNavBar: {
        flexDirection : 'row',
        padding: 10,
        backgroundColor: '#000',
    },
    backIcon: {
        flexDirection : 'row',
        flex: 1,
        justifyContent: 'flex-start',
    },
    homeIcon: {
        flexDirection : 'row',
        flex: 1,
        justifyContent: 'flex-end',
    },
    castBox: {
        flex:1,
        flexDirection: 'row',
        marginBottom: 20,
    },
    castPortrait: {
        marginTop: 10,
        marginLeft : 20,
        flex : 1
    },
    castPortraitImage: {
        height : '100%',
        width : '80%'
    },
    castDescription:{
        marginTop: 10,
        marginLeft : 10,
        flex : 2
    },
    title: {
        fontWeight: 'bold',
        fontSize: 14
    },
    description: {
        paddingTop: 22
    },
    category: {
        flex:1,
        marginLeft: 20,
        marginRight: 20,
    },
    categoryTitleBar:{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: 28,
    },
    categoryTitle:{
        flex: 1,
        color: '#FFFFFF',
        fontSize: 14,
        textAlign: 'left',
    },
    categoryTitleViewAll:{
        flex: 1,
        color: '#FFFFFF',
        fontSize: 12,
        textAlign: 'right',
        opacity: 0.8,
    },
    categoryScrollView:{
        flex: 4,
    },
});


//---------------    container    -----------------
const mapStateToProps = state => {
    return ({
        global: state.init.globalMD,
        content: state.init.contentid,
        init: state.init,
        nav: state.nav
    })
};
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        navigateTo
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(Cast);