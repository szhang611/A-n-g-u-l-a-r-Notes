import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, Image, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {navigateTo} from '../../../../../actions/NavigationAction'
import Icons from 'react-native-vector-icons/MaterialIcons'

class AllCast extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return ( 
        <View style = {styles.allCastView}>
              <View style = {styles.showNavBar}>
                <TouchableOpacity style = {styles.backIcon} onPress = { () => {
                    this.props.navigateTo('Info','cast','Info','home')
                }}>
                    <Icons
                                style={{padding: 3}}
                                name={'navigate-before'}
                                color={'#FFFFFF'}
                                size={36}
                            />
                </TouchableOpacity>
                  <View style={styles.NavBarTitle}>
                      <Text style = {styles.centerTitle}>Cast</Text>
                  </View>
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


            <ScrollView>
                <View style={styles.productScrollInteriorView}>
                    {this.renderAllCast()}
                </View>
            </ScrollView>
                    
        </View>
        )

    }
    renderAllCast() {
        return ( this.props.castList.map((item, idx)=>{
            return (
                <TouchableOpacity style={styles.productsImageWrap} key={idx} onPress={()=>{  this.props.navigateTo('Info','allCast','Info','cast', item) }}>
                    <View style={{width: '70%', marginLeft: '15%', flex:1,}}>
                        <Image style={styles.productImages} resizeMode='stretch' source={ item.Image }  defaultSource={require( '../../../../../assets/logo/pwc_logo_2.png')}  />
                        <Text style={styles.imageBox_text}>{ item.Name }</Text>
                    </View>
                </TouchableOpacity>
            )
        }))
    }
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
        flexDirection : 'row',
        flex: 1,
        justifyContent: 'flex-start',
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
        flexDirection : 'row',
        flex: 1,
        justifyContent: 'flex-end',
    },
    productsWrapper: {
        flex: 9,
        width: '100%',
        justifyContent:'center',
        alignItems:'center',
        alignContent:'center',
    },
    productsScrollView: {
        height : '60%',
        width: '100%',
    },
    productScrollInteriorView: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignContent: 'flex-start',
        justifyContent: 'flex-start',
        marginTop: 10
    },
    productsImageWrap: {
        width: '30%',
        height: 260,
        marginLeft: '2%',
        marginBottom: 10,
    },
    productImages: {
        width:  '100%',
        height: 220,
    },
    imageBox_text:{
        flex: 2,
        color: '#FFFFFF',
        fontSize: 14,
        paddingTop: 5,
        paddingBottom: 5,
        height: 28,
        lineHeight: 28,
        textAlign:'center',
    },
});


//---------------    container    -----------------
const mapStateToProps = state => {
    return ({
        global: state.init.globalMD,
        content: state.init.contentid,
        init: state.init
    })
};
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        navigateTo
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(AllCast);