import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, Image, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import EeText from './MCommon/EeText';
import EeNames from './MCommon/EeNames';
import EeList from './MCommon/EeList';
import urls from '../../../../services/APIUrl';
import AllCast from './info/AllCast';
import AllLocation from './info/AllLocation';
import Cast from './info/Cast';
import {navigateTo} from '../../../../actions/NavigationAction'
import {getAllLocation} from '../../../../actions/SceneActions'


class MGlobal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ranking: '',
            badges: '',
            awards: '',
            title: '',
            desp: '',
            director: [],
            writers: [],
            stars: [],
            country: '',
            language: '',
            date: '',
            known: '',
            location: '',
            office: '',
            budget: '',
            opening: '',
            gross: '',
            posterUrl: '',
            castItems:[],
            allActors:[],
            locations:[],
        }
    }

    getWriters(writers) {
        let starsGroup = [];
        let Writers = writers.map((item, i) => {
            return item = item.Name[0].value;
        });
        for (let i = 0; i < Writers.length; i++) {
            starsGroup.push(Writers[i]);
        }
        return starsGroup;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.global && nextProps.global.ebuCoreMain && nextProps.global.ebuCoreMain.length > 0) {
            let data = nextProps.global.ebuCoreMain[0].coreMetadata;
            this.setState({
                ranking: '',
                badges: '',
                awards: data.award[0],
                title: data.title[0].title[0].value,
                desp: data.description[0].description[0].value,
                director: data.director[0].Name[0].value,
                writers: this.getWriters(data.writer),
                stars: this.getWriters(data.actor),
                country: data.country[0].country[0].value,
                language: data.language[0].typeDefinition,
                // date: (data.date[0].released.date).substring(0, 10),
                known: '',
                location: '',
                office: '',
                budget: '',
                opening: '',
                gross: '',
                posterUrl: urls.CDN_old + nextProps.content + '/static/' + nextProps.content + '.jpg'
            })
        }
        if (nextProps.init){
            let data = nextProps.init.globalMD;
            let content = nextProps.init.contentid;
            let cast = nextProps.init.cast;
            let cdn = urls.CDN_old;
            let castArray = [];
            let actors = [];
            let allActors = [];
            let locations = [];
            if (data) {
                if(nextProps.init.cast) {
                    if (cast && cast.actors && content) {
                        cast.actors.forEach((castItem) => {
                            for (let item of data.ebuCoreMain[0].coreMetadata.actor) {
                                if (castItem.id == item.id) {
                                    actors.push(item);
                                }
                            }
                        });
                    }
                    castArray = actors.map((item, i) => {
                        let castItem = {};
                        let index = i + 1;
                        let castNo = item.id;
                        let castName = item.Name[0].value;
                        let castRole = 'Actor';
                        let castDesp = item.Description;
                        let imageUri = cdn + content + '/static/ImageCast/' + castNo + '.jpg';
                        castItem = {
                            Id: index,
                            Name: castName,
                            Role: castRole,
                            Description: castDesp,
                            Image: { uri: imageUri }
                        }
                        return castItem;
                    })
                    if(data.ebuCoreMain[0].coreMetadata.actor) {
                        allActors = data.ebuCoreMain[0].coreMetadata.actor.map((item, i) => {
                            let castItem = {};
                            let index = i + 1;
                            let castNo = item.id;
                            let castName = item.Name[0].value;
                            let castRole = 'Actor';
                            let castDesp = item.Description;
                            let imageUri = cdn + content + '/static/ImageCast/' + castNo + '.jpg';
                            castItem = {
                                Id: index,
                                Name: castName,
                                Role: castRole,
                                Description: castDesp,
                                Image: { uri: imageUri }
                            };
                            return castItem;
                        })
                    }
                }

                if(nextProps.init.location) {
                    locations = nextProps.init.location.map((item, i)=>{
                        item.Image = cdn + content + '/static/' + item.poster;
                        return item;
                    })
                }

            }
            this.setState({
                castItems: castArray,
                allCastItems: allActors,
                locations: locations,
            })

        }
    }

    componentWillMount() {
        let contentid = '';
        if(this.props.hamburgerActions.hamburgerMenuSelect === 'Recorded') {
            contentid = this.props.hamburgerActions.Recorded_CurrentVideoName;
        } else if(this.props.hamburgerActions.hamburgerMenuSelect === 'Live') {
            contentid = this.props.hamburgerActions.Live_CurrentVideoName;
        }
        this.props.getAllLocation(this.props.app, this.props.init, contentid);


        if (this.props.global) {
            if (this.props.global && this.props.global.ebuCoreMain && this.props.global.ebuCoreMain.length > 0) {
                let data = this.props.global.ebuCoreMain[0].coreMetadata;
                this.setState({
                    ranking: '',
                    badges: '',
                    awards: data.award[0],
                    title: data.title[0].title[0].value,
                    desp: data.description[0].description[0].value,
                    director: data.director[0].Name[0].value,
                    writers: this.getWriters(data.writer),
                    stars: this.getWriters(data.actor),
                    country: data.country[0].country[0].value,
                    language: data.language[0].typeDefinition,
                    // date: (data.date[0].released.date).substring(0, 10),
                    known: '',
                    location: '',
                    office: '',
                    budget: '',
                    opening: '',
                    gross: '',
                    posterUrl: urls.CDN_old + this.props.content + '/static/' + this.props.content + '.jpg'
                })
            }
        }

        if (this.props.init){
            let data = this.props.init.globalMD;
            let content = this.props.init.contentid;
            let cast = this.props.init.cast;
            let cdn = urls.CDN_old;
            let castArray = [];
            let actors = [];
            let allActors = [];
            let locations = [];
            if (data) {
                if (cast && cast.actors && content) {
                    cast.actors.forEach((castItem) => {
                        for (let item of data.ebuCoreMain[0].coreMetadata.actor) {
                            if (castItem.id == item.id) {
                                actors.push(item);
                            }
                        }
                    });
                }
                if(actors) {
                    castArray = actors.map((item, i) => {
                        let castItem = {};
                        let index = i + 1;
                        let castNo = item.id;
                        let castName = item.Name[0].value;
                        let castRole = 'Actor';
                        let castDesp = item.Description;
                        let imageUri = cdn + content + '/static/ImageCast/' + castNo + '.jpg';
                        castItem = {
                            Id: index,
                            Name: castName,
                            Role: castRole,
                            Description: castDesp,
                            Image: { uri: imageUri }
                        }
                        return castItem;
                    });
                }
                if(data.ebuCoreMain[0].coreMetadata.actor) {
                    allActors = data.ebuCoreMain[0].coreMetadata.actor.map((item, i) => {
                        let castItem = {};
                        let index = i + 1;
                        let castNo = item.id;
                        let castName = item.Name[0].value;
                        let castRole = 'Actor';
                        let castDesp = item.Description;
                        let imageUri = cdn + content + '/static/ImageCast/' + castNo + '.jpg';
                        castItem = {
                            Id: index,
                            Name: castName,
                            Role: castRole,
                            Description: castDesp,
                            Image: { uri: imageUri }
                        }
                        return castItem;
                    })
                }
                if(this.props.init.location) {
                    locations = this.props.init.location.map((item, i)=>{
                        item.Image = cdn + content + '/static/' + item.poster;
                        return item;
                    })
                }
            }
            this.setState({
                castItems: castArray,
                allCastItems: allActors,
                locations: locations,
            })
        }
    }


    renderCast(){
         console.log("inside the render cast")
        if(this.state.castItems) {
            return this.state.castItems.map((item, idx)=>{
                return (
                    <TouchableOpacity style={styles.imageBox} key={idx} onPress={()=>{  this.props.navigateTo('Info','home','Info','cast', item) }}>
                        <Image style={styles.thumbnailImage} resizeMode='contain' source={ item.Image } defaultSource={require( '../../../../assets/logo/pwc_logo_2.png')} />
                        <Text style={styles.imageBox_text} numberOfLines={2}>{ item.Name }</Text>
                    </TouchableOpacity>
                )
            });
        }
    }

    renderLocation(){
        if(this.state.locations) {
            return this.state.locations.map((item, idx)=>{
                return (
                    <TouchableOpacity style={[styles.imageBox, {width: 150}]} key={idx} onPress={()=>{ }}>
                        <Image style={styles.thumbnailImage} resizeMode='contain' source={{ uri: item.Image }} defaultSource={require( '../../../../assets/logo/pwc_logo_2.png')} />
                        <Text style={[styles.imageBox_text, {textAlign:'left'}]} numberOfLines={3}>{ item.title }</Text>
                    </TouchableOpacity>
                )
            });
        }
    }

    renderHome() {
        return (
            <View  style = {{ flex: 3, backgroundColor: '#000',}} >
                <View style={{  flex: 1 , flexDirection: 'row'}}>
                    <View style = {{marginTop: 20, marginLeft : 20 , flex:1}}>
                        <Image style ={ { height : '90%', width: '80%'} } source={{ uri: this.state.posterUrl }} resizeMode="contain" defaultSource={require( '../../../../assets/logo/pwc_logo_2.png')} />
                    </View>

                    <View style = {{marginTop: 30, marginLeft : 10, flex : 2}}>
                        <ScrollView>

                            <EeText style={[styles.title]}>{this.state.title}</EeText>
                            <EeText style={[styles.description]}>{this.state.desp}</EeText>
                            <EeNames   label="Director" persons={this.state.director} />
                            <EeNames   label="Writers" persons={this.state.writers} />
                            <EeNames   label="Stars" persons={this.state.stars} />

                        </ScrollView>
                    </View>

                </View>

            <ScrollView>
                {
                    this.props.init.cast &&
                        <View style={styles.category}>
                            <View style={styles.categoryTitleBar}>
                                <Text style={styles.categoryTitle}>CAST</Text>
                                <TouchableOpacity style= {styles.categoryTitleViewAllWrapper} onPress= { () => { this.props.navigateTo('Info','home','Info','allCast', this.state.allCastItems)} }>
                                    <Text style={styles.categoryTitleViewAll}>VIEW ALL</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.categoryScrollView}>
                                <ScrollView style = {{ marginTop : 10 }} horizontal={true}>
                                    {
                                        this.state.castItems && this.renderCast()
                                    }
                                </ScrollView>
                            </View>
                        </View>
                }


                {
                    this.props.init.location &&
                    <View style={styles.category}>
                        <View style={styles.categoryTitleBar}>
                            <Text style={styles.categoryTitle}>LOCATION(S)</Text>
                            <TouchableOpacity style= {styles.categoryTitleViewAllWrapper} onPress= {() => { this.props.navigateTo('Info','home','Info','allLocation')}}>
                                <Text style={styles.categoryTitleViewAll}>VIEW ALL</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.categoryScrollView}>
                            <ScrollView style = {{ marginTop : 10 }} horizontal={true}>
                                {
                                    this.state.locations.length>0 &&  this.renderLocation()
                                }
                            </ScrollView>
                        </View>
                    </View>
                }


                {
                    false &&
                    <View style={styles.category}>
                        <View style={styles.categoryTitleBar}>
                            <Text style={styles.categoryTitle}>CREDIT</Text>
                            <TouchableOpacity style= {styles.categoryTitleViewAllWrapper} onPress= { () => {  } }>
                                <Text style={styles.categoryTitleViewAll}>VIEW ALL</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.categoryScrollView}>
                            <ScrollView style = {{ marginTop : 10 }} horizontal={true}>

                            </ScrollView>
                        </View>
                    </View>
                }


                </ScrollView>
            </View>
        )
    }

    render(){
        if(this.props.nav.to === 'Info'){
            switch (this.props.nav.to_subTab) {
                case 'home':
                    return this.renderHome();
                    break;
                case 'allCast':
                    return this.renderAllCast(this.props.nav.params);
                    break;
                case 'cast':
                    return this.renderCastDetail(this.props.nav.params, this.props.nav.from);
                    break;
                case 'allLocation':
                    return this.renderAllLocations();
                    break;
                default:
                    return this.renderHome()
            }
        }
    }

    renderAllCast(itemList){
        return <AllCast castList = {itemList}/>
    }

    renderCastDetail(item,from){
        return <Cast castInfo = {item} castList = {this.state.castItems} allCastList = {this.state.allCastItems} from = {from} />
    }

    renderAllLocations() {
        return <AllLocation />
    }
}

const styles = StyleSheet.create({
    filmCover: {
        flex: 2,
        padding: 12
    },
    filmInfo: {
        flex: 3
    },
    title: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    description: {
        paddingTop: 22,
        fontSize: 12,
    },
    text: {
        color: 'white'
    },
    left: {
        flex: 1,
    },
    right: {
        flex: 2,
        paddingHorizontal: 3,
        justifyContent: 'space-around'
    },
    container: {
        flex: 1,
        flexDirection: 'row'
    },
    imageBox: {
        flex: 1,
        width: 100,
        height: 180,
        marginRight: 10,
    },
    thumbnailImage:{
        flex:3,
        width: '100%',
    },
    imageBox_text:{
        flex: 1,
        color: '#FFFFFF',
        fontSize: 12,
        paddingTop: 2,
        paddingBottom: 2,
        height: 28,
        textAlign: 'center',
    },
    category: {
        flex:1,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#666666',
    },
    categoryTitleBar:{ 
        flexDirection: 'row',
        height: 28,
    },
    categoryTitle:{
        color: '#FFFFFF',
        fontSize: 14,
    },
    categoryTitleViewAllWrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    categoryTitleViewAll:{
        color: '#FFFFFF',
        fontSize: 12,
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
        nav : state.nav,
        app: state.app,
        hamburgerActions: state.hamburgerActions
    })
};
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        navigateTo, getAllLocation
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(MGlobal);
