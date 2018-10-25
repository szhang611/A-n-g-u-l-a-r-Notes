import React, { Component } from 'react';
import { StyleSheet, Text, Picker, View, FlatList, TouchableOpacity, Image, Alert,
    Dimensions, ScrollView, AlertIOS, WebView, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MapView from 'react-native-maps';
import EeText from './MCommon/EeText';
import * as globalStyles from '../../../../styles/global';
import Spinner from 'react-native-spinkit'
 
import urls from '../../../../services/APIUrl';

import storyMarker from '../../../../assets/logo/map/RedSpin.png'
import filmMarker from '../../../../assets/logo/map/BlueSpin.png'
import entertainmentMarker from '../../../../assets/logo/map/GreenSpin.png'
import defaultMarker from '../../../../assets/logo/map/DefaultGreySpin.png'

import LocationBottom from './location/LocationBottom';


class MLocation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            poster: '',
            region: {
                latitude: 100,
                longitude: 100,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
            },
            coordinate: {
                latitude: 100,
                longitude: 100
            },
            location: {},
            title: '',
            address: '',
            website: '',
            description: '',
            displayFilmPicker: false,
            displayFoodPicker: false,
            displayEntertainmentPicker: false,
            foodList: [],
            eventList: [],
            displayWebView: false,
            WebViewUrl: '',
        };
    }

    componentWillMount() {
        if (this.props.location && this.props.location[0]) {
            this.setState({
                poster: urls.CDN_old + this.props.content + '/static/' + this.props.location[0].poster,
                region: {
                    latitude: this.props.location[0].position.lat,
                    longitude: this.props.location[0].position.lng,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                },
                coordinate: {
                    latitude: this.props.location[0].position.lat,
                    longitude: this.props.location[0].position.lng
                },
                location: this.props.location[0],
                title: this.props.location[0].title,
                address: this.props.location[0].contact.address,
                website: this.props.location[0].contact.website,
                description: this.props.location[0].description
            });
        }
        if(this.props.foodList){
            this.setState({
                foodList : this.props.foodList
            })
        }

        if(this.props.eventList){
            this.setState({
                eventList : this.props.eventList
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.init.callbackWebViewUrl) {
            this.setDetailPage(nextProps.init.callbackWebViewUrl);
            return;
        }
        if (nextProps.location && nextProps.location[0]) {
            this.setState({
                poster: urls.CDN_old + nextProps.content + '/static/' + nextProps.location[0].poster,
                region: {
                    latitude: nextProps.location[0].position.lat,
                    longitude: nextProps.location[0].position.lng,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                },
                coordinate: {
                    latitude: nextProps.location[0].position.lat,
                    longitude: nextProps.location[0].position.lng
                },
                location: nextProps.location[0],
                title: nextProps.location[0].title,
                address: nextProps.location[0].contact.address,
                website: nextProps.location[0].contact.website,
                description: nextProps.location[0].description
            })
        }
        if(nextProps.foodList){
            this.setState({
                foodList : nextProps.foodList
            })
        }
        if(nextProps.eventList){
            this.setState({
                eventList : nextProps.eventList
            })
        }

    }

    componentDidMount() {
        // after render()
    }


    renderStoryMarkers() {
        return (
            <MapView.Marker coordinate={this.state.coordinate}>
                <Image source = {storyMarker} style={{ width: 40, height: 40 }} />
            </MapView.Marker>
        )
    }

    renderFoodMarkers(){
        return this.state.foodList.map( (item, idex) => {
            return  (
                <MapView.Marker key={idex}
                        coordinate={item.coordinates} > 
                        <Image source = {filmMarker} style={{ width: 40, height: 40 }} />
                    </MapView.Marker>
            )
        })
    }

    renderEntertainmentMarkers (){
        return this.state.eventList.map( (item, idex) => {
            return  (
                <MapView.Marker key={idex}
                        coordinate = {{ latitude: Number(item._embedded.venues[0].location.latitude),
                        longitude: Number(item._embedded.venues[0].location.longitude) }} > 
                        <Image source = {entertainmentMarker} style={{ width: 40, height: 40 }} />
                    </MapView.Marker>
            )
        })
    }

    selectPicker(pickerType) {
        if(pickerType === 'Film') {
            this.setState({displayFilmPicker: !this.state.displayFilmPicker});
        } else if(pickerType === 'Food') {
            this.setState({displayFoodPicker: !this.state.displayFoodPicker});
        } else if(pickerType === 'Entertainment') {
            this.setState({displayEntertainmentPicker: !this.state.displayEntertainmentPicker});
        }
    }

    renderMap(){
        console.log('renderMap ... ');
        return (
            <MapView
                style={styles.map}
                initialRegion={this.state.region}
                zoomEnabled={true}
                pitchEnabled={true}
                loadingEnabled={true}
            >
                {
                    this.state.displayFilmPicker && this.renderStoryMarkers()
                }
                {
                    this.state.displayFoodPicker && this.renderFoodMarkers()
                }
                {
                    this.state.displayEntertainmentPicker && this.renderEntertainmentMarkers()
                }
            </MapView>
        )
    }

    renderImageGallery() {
        let gallery_uri = '';
        return this.props.location[0].gallery.map((item, idx)=>{
            gallery_uri = urls.CDN_old + this.props.content + '/static/' + this.props.location[0].gallery[idx].file;
            return (
                <Image key={idx} source={{ uri: gallery_uri }} style={styles.galleryImages} resizeMode="cover"  defaultSource={require('../../../../assets/logo/pwc_logo_2.png')}/>
            )
        });
    }

    setDetailPage(url) {
        this.setState({displayWebView: true});
        this.setState({WebViewUrl: url});
    }

    goBack() {
        this.setState({displayWebView: false});
        this.setState({WebViewUrl: ''});
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.locationView} behavior="padding">
                    <View style={{flex: 3}}>
                        <View style={{flex: 11, flexDirection : 'row'}}>
                            <View style = {{flex: 3}} >
                                <View style={{ flex : 3 ,marginTop: 2, marginLeft:2}}>
                                    {this.renderMap()}
                                </View>
                            </View>
                            <View  style = {{flex: 2}}>
                                <View style={{ flex : 1,marginTop: 2, marginRight:5 }}>
                                    <ScrollView style ={ { alignContent : 'center'} }>
                                        {
                                            this.renderImageGallery()
                                        }
                                    </ScrollView>
                                </View>
                            </View>
                        </View>


                        <View style={styles.legendPart}>
                            <View style={styles.pickerTitleWrapper}>
                                <Text style={[styles.pickerTitle]}> LEGEND : </Text>
                                <Text style={[styles.pickerTitle, {fontSize: 10}]} numberOfLines={1}> (Press to select) </Text>
                            </View>
                            <View style={styles.pickerLegendsWrapper}>
                                <View style = {styles.pickersBar}>

                                    <TouchableOpacity style ={styles.pickerAndTextGroup} onPress={()=>{this.selectPicker('Film')}}>
                                        { this.state.displayFilmPicker &&
                                        <Image source = { storyMarker } style={styles.clickablePicker} />
                                        }
                                        { !this.state.displayFilmPicker &&
                                        <Image source = { defaultMarker } style={styles.defaultClickablePikcer} />
                                        }
                                        <Text style = {styles.textBesidePicker}> Story </Text>
                                    </TouchableOpacity>

                                    <View style ={styles.pickerAndTextGroup} onPress={()=>{this.selectPicker('Film')}}>
                                        <Image source = { defaultMarker } style={styles.defaultClickablePikcer} />
                                        <Text style = {styles.textBesidePicker}> Film </Text>
                                    </View>

                                    <TouchableOpacity style ={styles.pickerAndTextGroup} onPress={()=>{this.selectPicker('Food')}}>
                                        { this.state.displayFoodPicker &&
                                        <Image source = { filmMarker } style={styles.clickablePicker} />
                                        }
                                        { !this.state.displayFoodPicker &&
                                        <Image source = { defaultMarker } style={styles.defaultClickablePikcer} />
                                        }
                                        <Text style = {styles.textBesidePicker}> Food </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style ={styles.pickerAndTextGroup} onPress={()=>{this.selectPicker('Entertainment')}}>
                                        { this.state.displayEntertainmentPicker &&
                                        <Image source = { entertainmentMarker } style={styles.clickablePicker} />
                                        }
                                        { !this.state.displayEntertainmentPicker &&
                                        <Image source = { defaultMarker } style={styles.defaultClickablePikcer} />
                                        }
                                        <Text style = {styles.textBesidePicker}> Entertainment </Text>
                                    </TouchableOpacity>

                                </View>
                            </View>
                        </View>
                    </View>


                    <LocationBottom
                        displayFoodPicker={this.state.displayFoodPicker}
                        displayEntertainmentPicker={this.state.displayEntertainmentPicker}
                    />


                    {
                        this.state.displayWebView &&
                        <View style={styles.webViewPart}>
                            <View style={{ backgroundColor: '#f4f4f4', height: 40, justifyContent: 'center' }}>
                                <TouchableOpacity onPress={()=>{this.goBack()}}>
                                    <Image source={require('../../../../assets/logo/return.png')} style={{ width: 30, height: 30, marginLeft: 10 }} resizeMode='stretch' />
                                </TouchableOpacity>
                            </View>
                            <WebView
                                source={{ uri: this.state.WebViewUrl }}
                            />
                        </View>
                    }

                <View style={{height: 10}}/>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    locationView: {
        flex : 1,
        backgroundColor: '#000',
        position: 'relative'
    },
    title: {
        flex:1,
        fontWeight: 'bold',
        fontSize: 14,
        color: '#FFFFFF',
        lineHeight: 30,
        textAlign: 'left',
        marginLeft: 5,
    },
    map: {
        height: '100%',
        marginVertical: 0,
        marginLeft: 5,
        marginRight: 5
    },
    galleryImages: {
        width : '100%',
        height : 160,
        marginBottom: 10,
    },
    legendPart: {
        flex : 2,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor : '#FFFFFF',
        marginTop: 3,
        marginLeft: 5,
    },
    pickerTitleWrapper: {
        flex: 1,
        justifyContent: 'center',
    },
    pickerTitle: {
        textAlign: 'center',
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    pickersBar: {
        flex : 1,
        flexDirection: 'row',
        alignItems : 'center',
        marginTop: 2,
        paddingLeft :2,
        paddingRight:2,
        marginLeft : 20,
    },
    pickerLegendsWrapper:{
        flex: 5
    },
    pickerAndTextGroup: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    clickablePicker: {
        height: 20,
        width: 20,
    },
    defaultClickablePikcer: {
        height: 20,
        width: 20,
        opacity: 0.5,
    },
    textBesidePicker: {
        color : '#FFFFFF',
        fontSize: 12,
    },
    webViewPart: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        // backgroundColor: '#000',
    },
});



//---------------    container    -----------------
const mapStateToProps = state => ({
    location: state.init.location,
    content: state.init.contentid,
    foodList: state.init.foodList,
    eventList: state.init.eventList,
    init: state.init,
});
const mapDispatchToProps = dispatch => (
    bindActionCreators({

    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(MLocation);

