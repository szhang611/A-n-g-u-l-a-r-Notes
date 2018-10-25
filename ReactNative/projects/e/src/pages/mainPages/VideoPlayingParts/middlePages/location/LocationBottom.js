import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ScrollView, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MapView from 'react-native-maps';
import EeText from './../MCommon/EeText';
import Spinner from 'react-native-spinkit';
import Icons from 'react-native-vector-icons/MaterialIcons';

import {FoodList} from '../location/mockData/food.js'
import {TravelList} from '../location/mockData/travel.js'
import {EntertainmentList}  from '../location/mockData/entertainment.js'


import urls from '../../../../../services/APIUrl';
import { starsUtil } from '../../../../../utils/yelpStars';
import { ThirdPartyAPI } from '../../../../../services/ThirdPartyAPIService';
import { callbackWebViewUrl } from '../../../../../actions/SceneContentsAction';


export class LocationBottom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coordinate: {
                latitude: 100,
                longitude: 100
            },

            foodList: [],
            eventList: [],

            isLoadingMore: false,
            isLoadingMoreEvent: false,

            foodSearchingIcon: false,
            foodFilterPressed: false,
            foodFilter: {},
            selectedFoodPrice: {
                price1: false,
                price2: false,
                price3: false,
                price4: false
            },
            selectedFoodSort: true,
            selectedFoodFilterOthers1: false,
            selectedFoodFilterOthers2: false,
            selectedFoodFilterOthers3: false,

            entertainmentFiltersItems : [
                'Arts & Theater',
                'Music',
                'Sports',
                'Miscellaneous',
                'Film'
            ],
            entertainmentFilter:{
                segments : []
            },
            entertainmentFilterPressed: false,
            entertainmentSearchingIcon: false,
            selectedEntertainmentFilter: [false, false, false, false, false],
            tempSelectedEntertainmentFilter: [false, false, false, false, false],

            stopLoadingMoreFood: false,
            stopLoadingMoreEntertainment: false,

            foodSearchText: '',
            displaySearchFilterCategoriesView: false,
            searchResultsList: [],
            searchInputText: '',
            showSearchBarLoadingIcon: false,

        };
    }

    componentWillMount() {
        if (this.props.location && this.props.location[0]) {
            this.setState({
                coordinate: {
                    latitude: this.props.location[0].position.lat,
                    longitude: this.props.location[0].position.lng
                },
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
            return;
        }
        if (nextProps.location && nextProps.location[0]) {
            this.setState({
                coordinate: {
                    latitude: nextProps.location[0].position.lat,
                    longitude: nextProps.location[0].position.lng
                },
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

    renderFoodListFooterComponent() {
        if(this.state.isLoadingMore) {
            return (
                <View style={{flex: 1, justifyContent:'center', alignItems:'center', marginTop: 20, marginBottom: 25,}}>
                    <Spinner type={'Circle'} color={'#f1f1f1'} size={30}/>
                </View>
            )
        }
    }
    renderEntertainmentListFooterComponent() {
        if(this.state.isLoadingMoreEvent) {
            return (
                <View style={{flex: 1, justifyContent:'center', alignItems:'center', marginTop: 20, marginBottom: 25,}}>
                    <Spinner type={'Circle'} color={'#f1f1f1'} size={30}/>
                </View>
            )
        }
    }

    fetchMoreFood = async() =>{
        // The fetchMore method is used to load new data and add it
        // to the original query we used to populate the list
        if(!this.state.isLoadingMore && !this.state.stopLoadingMoreFood) {
            console.log('Food FlatList onEndReached...');
            this.setState({isLoadingMore: true}, async()=>{
                let res = await ThirdPartyAPI.yelp.searchFood(this.state.coordinate.latitude, this.state.coordinate.longitude, 10, this.state.foodList.length + 1,
                    this.state.foodFilter.price, this.state.foodFilter.open_now, this.state.foodFilter.sort_by, this.state.foodFilter.attribuites, this.state.searchInputText);

                this.setState({isLoadingMore: false});
                if(res && res.length>0) {
                    this.setState({foodList: [...this.state.foodList, ...res]});
                } else {
                    this.setState({stopLoadingMoreFood: true});
                }
            });
        }
    };

    fetchMoreEvent = async() =>{
        // The fetchMore method is used to load new data and add it
        // to the original query we used to populate the list
        if(!this.state.isLoadingMoreEvent && !this.state.stopLoadingMoreEntertainment) {
            console.log('Event List onEndReached...');
            this.setState({isLoadingMoreEvent: true}, async() => {
                let res = await ThirdPartyAPI.ticketMaster.searchEvent(this.state.coordinate.latitude, this.state.coordinate.longitude, 10, this.state.foodList.length/10,  this.state.entertainmentFilter.segments );
                this.setState({isLoadingMoreEvent: false});
                if(res && res.length > 0) {
                    this.setState({eventList: [...this.state.eventList, ...res]});
                } else {
                    this.setState({stopLoadingMoreEntertainment: true});
                }

            })
        }
    };

    renderFoodFilterResults() {
        if( !this.isEmpty(this.state.foodFilter)) {
            return (
                <View style={styles.filterResults}>
                    <Text style={styles.filterResultsText} numberOfLines={2}>{this.buildFoodFilterBar()}</Text>
                </View>
            )
        }
    }

    isEmpty(obj) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    buildFoodFilterBar(){
        res = []
        if (!this.isEmpty(this.state.foodFilter) ){
            if(this.state.foodFilter.price)
            {
                res = this.state.foodFilter.price.split(',').map( (item,idx) => {
                    switch( item ){
                        case '1': return '$'
                        case '2': return '$$'
                        case '3': return '$$$'
                        case '4': return '$$$$'
                        default: return ''
                    }
                })
            }
            res.push(this.state.foodFilter.open_now? 'Open Now':'')
            if(this.state.foodFilter.attribuites){
                this.state.foodFilter.attribuites.split(',').forEach((item)=>{
                    if (item === 'hot_and_new'){
                        res.push('Hot and new')
                    }
                    if (item === 'deals'){
                        res.push('Offering a Deal')
                    }
                })
            }

        }
        return res.join(' ')

    }

    passFoodValue(val){
        this.props.callbackWebViewUrl(val);
    }
    renderFoodFlatList() {
        if(this.state.foodList && this.state.foodList.length > 0) {
            return (
                <FlatList
                    data={this.state.foodList}
                    keyExtractor={(item, index) => index}
                    onEndReachedThreshold={0.01}
                    onEndReached={() => {this.fetchMoreFood()}}
                    ListFooterComponent={this.renderFoodListFooterComponent()}
                    renderItem={({ item }) => {
                        if (!item.name) {
                            return;
                        }
                        return   (
                            <View style={styles.sectionInnerScrollView}>
                                <TouchableOpacity style={styles.sectionLeftImage} onPress={()=>{this.passFoodValue(item.url)}}>
                                    <Image style={styles.sectionImage} resizeMode='cover' source={ {uri: item.image_url }} defaultSource={require( '../../../../../assets/logo/pwc_logo_2.png')}/>
                                </TouchableOpacity>
                                <View style={styles.sectionRightText}>
                                    <Text style={styles.subTitle} numberOfLines={2}>{item.name}</Text>
                                    <Text style={styles.subDescription} numberOfLines={2}>{item.location && item.location.display_address.join()}</Text>
                                    <Image style = { {marginLeft: 10, width : 120, height : 20} } resizeMode='cover'  source={ starsUtil.getStars(item.rating)} />
                                    <Text style={styles.subDescription} numberOfLines={2}>{this.buildFoodTags(item.categories)}</Text>
                                    <View style={{flex:1, flexDirection: 'row'}}>
                                        <Text style={[styles.subDescription, {flex: 1}]} numberOfLines={1}>{ starsUtil.getDistance(item.distance) }</Text>
                                        <Text style={[styles.subDescription, {flex: 1, textAlign: 'right', paddingRight: 5}]} numberOfLines={1}>{ item.price }</Text>
                                    </View>
                                </View>
                            </View>
                        )
                    }}
                />
            );
        } else {
            return (
                <Text style={{color: '#FFF', fontSize: 14, padding: 20,}}>Sorry, no search results were found for Food.</Text>
            )
        }
    }

    buildFoodTags(categories){
        let res = []
        if(categories && categories.length> 0){
            categories.forEach((item) =>{
                if (res.length < 3){
                    res.push(item.title)
                }

            })
        }
        return res.join(' | ')
    }

    buildEventTags(categories){
        let res = []
        if(categories && categories.length> 0){
            categories.forEach((item) =>{
                if (res.length < 3 && item.segment && item.genre){
                    res.push(item.segment.name + ' | ' + item.genre.name)
                }

            })
        }
        return res.join(' | ')
    }

    renderFoodFilters() {
        return(
            <View style={styles.filtersView}>
                <View style={styles.filterViewTitleBar}>
                    <EeText style={[styles.filterViewTitle, {marginTop: 5}]}>Sort by</EeText>
                </View>
                <View style={styles.filterTypesBox}>
                    <View style={styles.filterPriceBar}>
                        <Text
                            style={[styles.filterSortText, this.state.selectedFoodSort?styles.priceSelectedBackground:'']}
                            onPress={()=>{this.selectFoodSort(1)}}>
                            Best Match
                        </Text>
                        <Text
                            style={[styles.filterSortText, !this.state.selectedFoodSort?styles.priceSelectedBackground:'']}
                            onPress={()=>{this.selectFoodSort(2)}}>
                            Highest Rated
                        </Text>
                    </View>
                </View>
                <View style={styles.filterViewTitleBar}>
                    <EeText style={[styles.filterViewTitle, {marginTop: 5}]}>Filter by</EeText>
                </View>
                <View style={styles.filterTypesBox}>
                    <View style={styles.filterPriceBar}>
                        <Text
                            style={[styles.filterPriceText, this.state.selectedFoodPrice.price1?styles.priceSelectedBackground:'']}
                            onPress={()=>{this.selectFoodFilterPrice(1)}}>
                            $
                        </Text>
                        <Text
                            style={[styles.filterPriceText, this.state.selectedFoodPrice.price2?styles.priceSelectedBackground:'']}
                            onPress={()=>{this.selectFoodFilterPrice(2)}}>
                            $$
                        </Text>
                        <Text
                            style={[styles.filterPriceText, this.state.selectedFoodPrice.price3?styles.priceSelectedBackground:'']}
                            onPress={()=>{this.selectFoodFilterPrice(3)}}>
                            $$$
                        </Text>
                        <Text
                            style={[styles.filterPriceText, this.state.selectedFoodPrice.price4?styles.priceSelectedBackground:'']}
                            onPress={()=>{this.selectFoodFilterPrice(4)}}>
                            $$$$
                        </Text>
                    </View>
                </View>

                <View style={styles.filterTypesBox}>
                    <View style={styles.filterPriceBar}>
                        <Text
                            style={[styles.filterPriceOtherText, this.state.selectedFoodFilterOthers1?styles.priceSelectedBackground:'']}
                            onPress={()=>{this.selectFoodFilterOthers(1)}}>
                            Open Now
                        </Text>
                    </View>
                </View>
                <View style={styles.filterTypesBox}>
                    <View style={styles.filterPriceBar}>
                        <Text
                            style={[styles.filterPriceOtherText, this.state.selectedFoodFilterOthers2?styles.priceSelectedBackground:'']}
                            onPress={()=>{this.selectFoodFilterOthers(2)}}>
                            Offering a Deal
                        </Text>
                    </View>
                </View>
                <View style={styles.filterTypesBox}>
                    <View style={styles.filterPriceBar}>
                        <Text
                            style={[styles.filterPriceOtherText, this.state.selectedFoodFilterOthers3?styles.priceSelectedBackground:'']}
                            onPress={()=>{this.selectFoodFilterOthers(3)}}>
                            Hot and new
                        </Text>
                    </View>
                </View>


                <TouchableOpacity style={styles.bottomSearch} onPress={()=>{this.searchFoodFilters()}}>
                    <View style={styles.searchButtonWrapper}>
                        <EeText style={styles.bottomSearchText}>Search</EeText>
                        {
                            this.state.foodSearchingIcon &&
                            <View style={styles.searchLoadingIcon}>
                                <Spinner type={'Circle'} color={'#f1f1f1'} size={14}/>
                            </View>
                        }
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    pressFoodFilter() {
        this.setState({foodFilterPressed: !this.state.foodFilterPressed})
    }
    selectFoodSort(idx){
        if(idx === 1) {
            !this.state.selectedFoodSort ? this.setState({selectedFoodSort: true}) : '';
        } else {
            this.state.selectedFoodSort ? this.setState({selectedFoodSort: false}) : '';
        }
    }
    selectFoodFilterPrice(idx) {
        console.log(this.state.selectedFoodPrice.price1);
        switch (idx) {
            case 1:
                this.setState(prevState => ({
                    selectedFoodPrice: {
                        ...prevState.selectedFoodPrice,
                        price1: !this.state.selectedFoodPrice.price1
                    }
                }));
                break;
            case 2:
                this.setState(prevState => ({
                    selectedFoodPrice: {
                        ...prevState.selectedFoodPrice,
                        price2: !this.state.selectedFoodPrice.price2
                    }
                }));
                break;
            case 3:
                this.setState(prevState => ({
                    selectedFoodPrice: {
                        ...prevState.selectedFoodPrice,
                        price3: !this.state.selectedFoodPrice.price3
                    }
                }));
                break;
            case 4:
                this.setState(prevState => ({
                    selectedFoodPrice: {
                        ...prevState.selectedFoodPrice,
                        price4: !this.state.selectedFoodPrice.price4
                    }
                }));
                break;
            default:
                break;
        }
    }
    selectFoodFilterOthers(idx) {
        if(idx === 1) {
            this.setState({selectedFoodFilterOthers1: !this.state.selectedFoodFilterOthers1});
        } else if(idx === 2){
            this.setState({selectedFoodFilterOthers2: !this.state.selectedFoodFilterOthers2});
        }else if(idx === 3){
            this.setState({selectedFoodFilterOthers3: !this.state.selectedFoodFilterOthers3});
        }
    }

    searchFoodFilters = async () => {
        console.log('search food filters ... ');
        this.setState({foodSearchingIcon: true, foodFilter: this.buildFoodFilter() } ,async ()=>{

            let res = await ThirdPartyAPI.yelp.searchFood(this.state.coordinate.latitude, this.state.coordinate.longitude, 10, 0,
                this.state.foodFilter.price, this.state.foodFilter.open_now, this.state.foodFilter.sort_by, this.state.foodFilter.attribuites, this.state.searchInputText);

            // price = '1,2,3,4',open_now = false, sort_by= 'best_match' , attributes =''

            if(res && res.length > 0) { // reset loading more state
                this.setState({stopLoadingMoreFood: false});
            } else if(res.length < 10){
                this.setState({stopLoadingMoreFood: true});
            }
            this.setState({foodList: res});
            this.setState({foodFilterPressed: !this.state.foodFilterPressed});
            this.setState({foodSearchingIcon: false});

        });
    };

    buildFoodFilter(){
        return {
            price : this.buildPriceFilter(),
            open_now : this.state.selectedFoodFilterOthers1,
            attribuites: this.buildAttributesFilters(),
            sort_by: this.buildSortedbyFilter()
        }
    }

    buildAttributesFilters(){
        let attribuites = [];
        if(this.state.selectedFoodFilterOthers3){
            attribuites.push('hot_and_new')
        }
        if(this.state.selectedFoodFilterOthers2){
            attribuites.push('deals')
        }
        return attribuites.join(',')
    }

    buildSortedbyFilter(){
        return this.state.selectedFoodSort ? 'best_match' : 'rating'
    }

    buildPriceFilter(){
        let prices = []
        if (this.state.selectedFoodPrice.price1) {
            prices.push(1)
        }
        if (this.state.selectedFoodPrice.price2) {
            prices.push(2)
        }
        if (this.state.selectedFoodPrice.price3) {
            prices.push(3)
        }
        if (this.state.selectedFoodPrice.price4) {
            prices.push(4)
        }
        return prices.join(',')
    }

    renderTravelList(){
        return TravelList.map((item, idx)=>{
            return (
                <View  key={idx} style={styles.sectionInnerScrollView}>
                    <TouchableOpacity style={styles.sectionLeftImage} onPress={()=>{  }}>
                        <Image style={styles.sectionImage} resizeMode='cover' source={ {uri: item.img }} defaultSource={require( '../../../../../assets/logo/pwc_logo_2.png')}/>
                    </TouchableOpacity>
                    <View style={styles.sectionRightText}>
                        <Text style={styles.subTitle} numberOfLines={2}>{item.title}</Text>
                        <Text style={styles.subDescription} numberOfLines={4}>{item.description}</Text>
                        <Image style = { {width : 100, height : 20} } resizeMode='cover'  source={ starsUtil.getStars(item.rating)}> </Image>
                    </View>
                </View>
            )
        });
    }


    passEntertainmentValue(val){
        this.props.callbackWebViewUrl(val);
    }
    renderEntertainmentFlatList() {
        if(this.state.eventList && this.state.eventList.length > 0) {
            return (
                <FlatList
                    data={this.state.eventList}
                    keyExtractor={(item, index) => index}
                    onEndReachedThreshold={0.1}
                    onEndReached={() => {this.fetchMoreEvent()}}
                    ListFooterComponent={this.renderEntertainmentListFooterComponent()}
                    renderItem={({ item }) => {
                        if (!item.name) {
                            return;
                        }
                        return   (
                            <View  style={styles.sectionInnerScrollView}>
                                <TouchableOpacity style={styles.sectionLeftImage} onPress={()=>{this.passEntertainmentValue(item.url)}}>
                                    <Image style={styles.sectionImage} resizeMode='cover' source={ {uri: item.images[starsUtil.getRandomN(item.images.length - 1 )].url }} defaultSource={require( '../../../../../assets/logo/pwc_logo_2.png')}/>
                                </TouchableOpacity>
                                <View style={styles.sectionRightText}>
                                    <Text style={styles.subTitle} numberOfLines={2}>{item.name}</Text>
                                    <Text style={styles.subDescription} numberOfLines={2}>{item._embedded.venues[0].address && item._embedded.venues[0].address.line1} {item._embedded.venues[0].city && item._embedded.venues[0].city.name} {item._embedded.venues[0].state && item._embedded.venues[0].state.name}</Text>
                                    <Text style={[styles.subDescription, { height : 20}]} numberOfLines={2}>{item.dates.start.localDate} {item.dates.start.localTime}   </Text>
                                    <Text style={styles.subDescription} numberOfLines={2}>{this.buildEventTags(item.classifications)}</Text>
                                    <View style={{flex:1, flexDirection: 'row'}}>
                                        <Text style={[styles.subDescription, {flex: 1}]} numberOfLines={1}>{item.distance + ' mi'}</Text>
                                        <Text style={[styles.subDescription, {flex: 1, textAlign: 'right', paddingRight: 5}]} numberOfLines={1}>{ item.priceRanges && ('$'+ item.priceRanges[0].min + ' - $' + item.priceRanges[0].max)} </Text>
                                    </View>
                                </View>
                            </View>
                        )
                    }}
                />
            );
        } else {
            return (
                <Text style={{color: '#FFF', fontSize: 14, padding: 20,}}>Sorry, no search results were found for Entertainment.</Text>
            )
        }
    }

    pressEntertainmentFilter() {
        this.setState({entertainmentFilterPressed: !this.state.entertainmentFilterPressed})
    }
    renderEntertainmentFiltersComponents(){
        return this.state.entertainmentFiltersItems.map((item,idx)=>{
            return (
                <View style={styles.filterTypesBox} key={idx}>
                    <View style={styles.filterPriceBar}>
                        <Text
                            style={[styles.filterPriceOtherText, this.renderEntertainmentFiltersSelectStyle(idx)]}
                            onPress={()=>{this.selectEntertainmentFilter(idx)}}>
                            {item}
                        </Text>
                    </View>
                </View>
            )
        })
    }
    renderEntertainmentFiltersSelectStyle(idx) {
        if(this.state.selectedEntertainmentFilter[idx]) {
            return styles.priceSelectedBackground
        }
    }
    renderEntertainmentFilters() {
        return(
            <View style={styles.filtersView}>
                <View style={styles.filterViewTitleBar}>
                    <EeText style={[styles.filterViewTitle, {marginTop: 5}]}>Filter by</EeText>
                </View>
                {
                    this.renderEntertainmentFiltersComponents()
                }
                <TouchableOpacity style={styles.bottomSearch} onPress={()=>{this.searchEntertainmentFilters()}}>
                    <View style={styles.searchButtonWrapper}>
                        <EeText style={styles.bottomSearchText}>Search</EeText>
                        {
                            this.state.entertainmentSearchingIcon &&
                            <View style={styles.searchLoadingIcon}>
                                <Spinner type={'Circle'} color={'#f1f1f1'} size={14}/>
                            </View>
                        }
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    selectEntertainmentFilter(idx) {
        let temp = this.state.selectedEntertainmentFilter;
        temp[idx] = !temp[idx];
        this.setState({selectedEntertainmentFilter: temp});
    }
    searchEntertainmentFilters() {
        console.log('search entertainment filters ... ');
        this.setState({entertainmentSearchingIcon: true, entertainmentFilter: this.buildEntertainmentFilterList()},async ()=>{
            let res = await ThirdPartyAPI.ticketMaster.searchEvent(this.state.coordinate.latitude, this.state.coordinate.longitude, 10, 0, this.state.entertainmentFilter.segments );
            this.setState({eventList: res});

            if(res && res.length > 0) { // reset loading more state
                this.setState({stopLoadingMoreEntertainment: false});
            } else if(res.length < 10){
                this.setState({stopLoadingMoreEntertainment: true});
            }

            this.setState({entertainmentFilterPressed: !this.state.entertainmentFilterPressed});
            this.setState({entertainmentSearchingIcon: false});

        });
    }

    buildEntertainmentFilterList(){


        let segments = []

        this.state.selectedEntertainmentFilter.forEach((item, idx) =>{

            if(item){
                segments.push(this.state.entertainmentFiltersItems[idx])
            }

        })

        return {
            segments
        }

    }

    renderEntertainmentFilterResults() {
        let res = [];
        this.state.entertainmentFilter.segments.forEach((item)=>{
            res.push(' ' + item);
        });
        if(res && res.length > 0) {
            return (
                <View style={styles.filterResults}>
                    <Text style={styles.filterResultsText} numberOfLines={3}>{res.toString()}</Text>
                </View>
            )
        }
    }

    searchFoodInputOnFocus() {
        console.log('focus');
        // this.setState({displaySearchFilterCategoriesView: true});
    }

    searchFoodInputOnBlur() {
        console.log('blur');
        // this.setState({displaySearchFilterCategoriesView: false});
    }

    async searchTextChange(text) {
        this.setState({searchInputText: text});
        if(text) {
            this.setState({displaySearchFilterCategoriesView: true});
            let res = await ThirdPartyAPI.yelp.searchFoodFromInput(text, this.state.coordinate.latitude, this.state.coordinate.longitude);
            console.log(res);
            let arr = [];
            res.categories.map((item)=>{
                arr.push(item.title);
            })
            res.terms.map((item)=>{
                arr.push(item.text)
            })
            this.setState({searchResultsList: arr});
        }else {
            this.setState({displaySearchFilterCategoriesView: false});
        }
    }

    renderSearchResults() {
        if(this.state.searchResultsList.length > 0) {
            return this.state.searchResultsList.map((item)=>{
                console.log(item);
                return (
                    <TouchableOpacity style={styles.searchResultsItem} key={item} onPress={()=>{this.chooseFilteredResult(item)}}>
                        <Text style={styles.searchResultText}>{item}</Text>
                    </TouchableOpacity>
                )
            });
        }
    }

    chooseFilteredResult(item) {
        this.setState({searchInputText: item});
    }

    async searchFoodFromInput() {
        this.setState({showSearchBarLoadingIcon: true} , async() => {
            let res = await ThirdPartyAPI.yelp.searchFood(this.state.coordinate.latitude, this.state.coordinate.longitude, 10, this.state.foodList.length + 1,
                this.state.foodFilter.price, this.state.foodFilter.open_now, this.state.foodFilter.sort_by, this.state.foodFilter.attribuites, this.state.searchInputText);

            this.setState({foodList: []}, ()=>{
                this.setState({foodList: [...res]})
            });

            this.setState({displaySearchFilterCategoriesView: false});
            this.setState({showSearchBarLoadingIcon: false});
        })


    }

    render() {
        return (
            <View style = {styles.locationBottom}>
                { this.props.displayFoodPicker &&
                <View style={{ flex: 1 }} >
                    <View style={styles.sectionHeaderBar}>
                        <EeText style={styles.title}> FOOD </EeText>
                        {
                            !this.state.displaySearchFilterCategoriesView &&
                            <TouchableOpacity style={styles.filter} onPress={()=>{this.pressFoodFilter()}}>
                                {!this.state.foodFilterPressed && <EeText style={styles.filterText}>Filters</EeText>}
                                {this.state.foodFilterPressed && <EeText style={styles.filterText}>Cancel</EeText>}
                            </TouchableOpacity>
                        }
                        {
                            this.state.displaySearchFilterCategoriesView &&
                            <View style={styles.filter}>
                                <TouchableOpacity style={styles.searchButtonWrapper} onPress={()=>{this.searchFoodFromInput()}}>
                                    <EeText style={styles.bottomSearchText}>Search</EeText>
                                        {
                                            this.state.showSearchBarLoadingIcon &&
                                            <View style={styles.searchLoadingIcon}>
                                                <Spinner type={'Circle'} color={'#f1f1f1'} size={14}/>
                                            </View>
                                        }
                                </TouchableOpacity>
                            </View>

                        }
                    </View>
                    <View style={styles.sectionHeaderBar}>
                        <View style={styles.searchBarWrapper}>
                            <View style={styles.searchIconBox}>
                                <Icons
                                    style={{padding: 2}}
                                    name={'search'}
                                    color={'#666'}
                                    size={20}
                                />
                            </View>
                            <View style={styles.searchInputBox}>
                                <TextInput
                                    multiline={false}
                                    onChangeText={(text) => {this.searchTextChange(text)}}
                                    style={styles.searchTextInput}
                                    value={this.state.searchInputText}
                                    placeholder={''}
                                    onFocus={() => this.searchFoodInputOnFocus()}
                                    onBlur={() => this.searchFoodInputOnBlur()}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={styles.section}>
                        {this.renderFoodFilterResults()}
                        {this.renderFoodFlatList()}
                        {this.state.foodFilterPressed && this.renderFoodFilters()}
                        {this.state.displaySearchFilterCategoriesView &&
                            <View style={styles.searchResultsWrapper}>
                                {
                                    this.renderSearchResults()
                                }
                            </View>
                        }
                    </View>
                </View>
                }

                {/* <View  style = {{ flex: 1 }}>
                        <EeText style={[styles.title]}> TRAVEL </EeText>
                        <View style={styles.section}>
                            <ScrollView>
                                {this.renderTravelList()}
                            </ScrollView>
                        </View>
                    </View> */}

                { this.props.displayEntertainmentPicker &&
                <View style={{ flex: 1 }}>
                    <View style={styles.sectionHeaderBar}>
                        <EeText style={styles.title}> ENTERTAINMENT </EeText>
                        <TouchableOpacity style={styles.filter} onPress={()=>{this.pressEntertainmentFilter()}}>
                            {!this.state.entertainmentFilterPressed && <EeText style={styles.filterText}>Filters</EeText>}
                            {this.state.entertainmentFilterPressed && <EeText style={styles.filterText}>Cancel</EeText>}
                        </TouchableOpacity>
                    </View>
                    <View style={styles.section}>
                        {this.renderEntertainmentFilterResults()}
                        {this.renderEntertainmentFlatList()}
                        {this.state.entertainmentFilterPressed && this.renderEntertainmentFilters()}
                    </View>
                </View>
                }
            </View>
        )
    }

}

const styles = StyleSheet.create({
    locationBottom: {
        flex: 4,
        flexDirection : 'row',
        paddingTop: 15,
    },
    sectionHeaderBar:{
        flexDirection: 'row',
        height: 30,
        width: '100%',
    },
    searchBarWrapper: {
        marginTop: 3,
        marginBottom: 3,
        marginLeft: 10,
        paddingRight: 20,
        flexDirection: 'row',
        width: '100%',
    },
    searchIconBox: {
        backgroundColor: '#FFF',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchInputBox: {
        backgroundColor: '#FFF',
        flex: 10,
    },
    searchTextInput: {
        height: '100%',
        width: '100%',
        backgroundColor: '#FFF',
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
    filter:{
        flex:1,
        marginRight: 10,
        alignItems: 'flex-end',
        marginTop: 2,
        marginBottom: 2,
    },
    filterText: {
        fontSize: 14,
        textAlign: 'right',
        lineHeight: 26,
        height: 26,
        borderWidth: 1,
        borderColor: '#666666',
        paddingLeft: 10,
        paddingRight: 10,
    },
    section: {
        height: '100%',
        marginLeft: 5,
        marginRight: 5,
        paddingBottom: 30,
        position: 'relative',
    },
    sectionInnerScrollView: {
        flex: 1,
        flexDirection : 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#666666',
        paddingBottom: 3,
        paddingTop: 3
    },
    sectionLeftImage: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionImage: {
        width:60,
        height:60,
        borderRadius: 5,
    },
    sectionRightText: {
        flex: 3,
    },
    subTitle: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
        marginLeft: 10,
    },
    subDescription: {
        color: '#FFFFFF',
        fontSize: 12,
        paddingTop: 2,
        paddingBottom: 2,
        marginLeft: 10,
    },
    imageBox: {
        flex: 1,
        marginRight: 10,
    },
    thumbnailImage:{
        flex:5,
        width: '100%',
    },
    topRight: {
        flex: 3,
        justifyContent: 'space-between',
        paddingHorizontal: 8
    },
    topLeft: {
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    imageWrap: {
        margin: 4,
        flex: 1
    },
    mapWrap: {
        flex: 1
    },
    bottom: {
        flex: 1
    },
    top: {
        flex: 3
    },
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    map: {
        height: '100%',
        marginVertical: 0,
        marginLeft: 5,
        marginRight: 5
    },
    filtersView: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
        zIndex: 51,
        width: '100%',
        // backgroundColor: 'transparent',
        backgroundColor:'#000',
    },
    filterViewTitleBar: {
        height: 24,
        width: '100%',
        borderTopWidth: 1,
        marginTop: 4,
        marginLeft: 10,
    },
    filterViewTitle: {
        height: 24,
        lineHeight: 24,
        fontSize: 14,
    },
    filterTypesBox: {
        width: '94%',
        marginLeft: '3%',
    },
    filterPriceBar: {
        marginTop: 10,
        width: '100%',
        height: 32,
        borderWidth: 1,
        borderColor: '#999',
        flexDirection: 'row',
        overflow: 'hidden',
    },
    filterSortText: {
        lineHeight: 32,
        textAlign: 'center',
        width: '50%',
        color: '#FFF',
    },
    filterPriceText: {
        lineHeight: 32,
        textAlign: 'center',
        width: '25%',
        color: '#FFF',
    },
    filterPriceOtherText: {
        lineHeight: 32,
        textAlign: 'center',
        width: '100%',
        color: '#FFF',
    },
    border_right: {
        borderRightWidth: 1,
        borderRightColor: '#999',
    },
    priceSelectedBackground: {
        backgroundColor: '#0097ec',
    },
    bottomSearch:{
        flex:1,
        marginRight: 10,
        alignItems: 'flex-end',
        marginTop: 12,
    },
    searchButtonWrapper: {
        borderWidth: 1,
        borderColor: '#666666',
        flexDirection: 'row',
    },
    bottomSearchText: {
        fontSize: 14,
        textAlign: 'right',
        lineHeight: 26,
        height: 26,
        paddingLeft: 10,
        paddingRight: 10,
    },
    searchLoadingIcon: {
        // flex: 1,
        height: 26,
        width: 26,
        padding: 4,
    },
    filterResults: {
        width: '100%',
        flexDirection: 'row',
        minHeight: 24,
        marginTop: 5,
        borderBottomColor: '#666',
        borderBottomWidth: 1,
        paddingLeft: '2%',
    },
    filterResultsText:{
        color: '#FFF',
        fontSize: 12,
        lineHeight: 16,
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
    searchResultsWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        flex: 1,
        backgroundColor: '#FFF',
    },
    searchResultsItem: {
        width: '100%',
        height: 32,
        borderBottomWidth: 1,
        borderBottomColor: '#666',
    },
    searchResultText: {
        lineHeight: 31,
        marginLeft: 20,
    }
});

//---------------    container    -----------------
const mapStateToProps = state => ({
    location: state.init.location,
    content: state.init.contentid,
    foodList: state.init.foodList,
    eventList: state.init.eventList,
    init: state.init
});
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        callbackWebViewUrl
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(LocationBottom);


