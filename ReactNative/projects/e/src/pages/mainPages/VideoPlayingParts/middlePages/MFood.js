import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert, Button, ListView, Image, TouchableOpacity } from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as globalStyles from '../../../../styles/global';

import EeList from './MCommon/EeList';
import EeButton from './MCommon/EeButton';
import EeHeadingOne from './MCommon/EeHeadingOne';
import EeHeadingTwo from './MCommon/EeHeadingTwo';
import EeBreak from './MCommon/EeBreak';
import EeParagraph from './MCommon/EeParagraph';



function List(props) {
    return (
        <View>
            <View style={[{ height: '100%', width: '80%' }, props.style]}>
                <View style={props.titleHeight}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>{props.title}</Text>
                </View>
                <ListView
                    dataSource={props.dataSource}
                    renderRow={(rowData) => <Text style={{ color: '#fff', fontSize: 11 }}>{rowData}</Text>}
                />
            </View>
        </View>
    )
}



class MFood extends Component {

    constructor(props) {
        super(props)
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource1: ds.cloneWithRows([
                'Chicken Nuggets',
                '8 chicken thighs, skinned and deboned',
                '1 cup buttermilk',
                '1 egg',
                '1/4 cup finely chopped fresh chives',
                '1/4 cup grated Parmesan cheese',
                '3 tablespoons soy sauce',
                '1/2 teaspoon garlic­flavored hot pepper sauce (recommended: garlic­flavored Tabasco)',
                'Juice of 1 lemon',
                '1 teaspoon salt',
                '1 teaspoon freshly ground black pepper',
                'Vegetable oil, for frying',
                '1 cup flour, for dredging',
                '3 eggs, beaten',
                '2 cups panko (Japanese) bread crumbs',
                'Honey­Mustard Dipping Sauce',
                '1/4 cup mild yellow mustard',
                '1/4 cup honey',
                'Salt and freshly ground black pepper'
            ]),
            dataSource2: ds.cloneWithRows([
                'Total:12 hr 35 min',
                'Active: 30 min',
                'Yield: 8 servings',
                'Level: Easy',
                'Price: $7.80'
            ])
        };
    }

    render() {
        return (
            <View style={styles.foodContainer}>
                <View style={styles.top}>
                    <View style={styles.topLeft}>
                        <Image source={require('../../../../assets/images/food_poster.png')} resizeMode='stretch' style={{ width: '90%', height: '20%', marginRight: '5%', marginBottom: '5%' }} />
                        <List dataSource={this.state.dataSource1} title='Ingredients:' />
                    </View>
                    <View style={styles.topRight}>
                        <View style={{ flex: 2 }}>
                            <List dataSource={this.state.dataSource2} title='Chicken Nuggets' titleHeight={{ height: '10%' }} style={{ marginTop: '5%' }} />
                        </View>
                        <View style={{ flex: 5 }}>
                            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', marginBottom: '2%' }}>Directions:</Text>
                            <Text style={{ color: '#fff', fontSize: 12, marginRight: '2%' }}>
                                In a large bowl, marinate the pieces of chicken in buttermilk. Cover with plastic wrap
                                and leave in the refrigerator overnight. This will tenderize the chicken. Heat oil in a
                                deep fryer. Drain and discard the buttermilk. In a food processor, combine the
                                marinated chicken, egg, chiv#e6s6, P6a6r6m6esan, soy sauce, garlic­flavored hot sauce,
                                lemon juice, salt, and pepper. Blend until a smooth paste is formed, about 1 minute. Make about 2­inch by 1­inch nuggets, lining them up on a baking tray. In a shallow bowl, add the flour and in a second bowl the beaten eggs, and in a third bowl the panko bread crumbs. Coat the nuggets in flour, then egg, and then the panko crumbs and place the nuggets back on the tray. Deep fry in small batches until golden brown, about 5 minutes. Alternately, heat 2 tablespoons of vegetable oil in a large skillet and fry, turning every
                                2 minutes, for about 10 minutes.
                                For the dipping sauce: Combine the mustard, honey, salt, and pepper in a bowl and mix well.
                                Cook's Note: Can be made up to 1 day in advance.
                                Cook's Note: Soaking the chicken in Buttermilk will result in tender and juicy
                                chicken. You can buy buttermilk in the dairy product section of a supermarket, but mixing 1 cup of milk with 1 tablespoon of lemon juice or vinegar achieves the same result.Recipe courtesy of Chuck Hughes.
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.bottom}>
                    <View style={styles.gallery}>
                        <Image source={require('../../../../assets/images/food_gallery.png')} resizeMode='stretch' style={{ width: '90%', height: '100%', marginRight: '5%' }} />
                    </View>
                    <View style={styles.action}>
                        <TouchableOpacity style={styles.button1}>
                            <View >
                                <Text style={{ color: '#fff', textAlign: 'center' }}>Buy Box</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.service}>
                            <Image source={require('../../../../assets/images/food_service1.png')} resizeMode='stretch' style={{ width: '30%', height: '100%',marginRight: '1%' }} />
                            <Image source={require('../../../../assets/images/food_service2.png')} resizeMode='stretch' style={{ width: '30%', height: '100%' }} />
                        </View>
                    </View>
                </View>
            </View >
        )
    }

    componentWillMount() {
        if (this.props.loadFood) {
            this.props.loadFood();
        }
    }
}

const styles = StyleSheet.create({
    foodContainer: {
        flex: 1,
        backgroundColor: 'black'
    },
    top: {
        flex: 4,
        backgroundColor: 'black',
        flexDirection: 'row'
    },
    topLeft: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        marginTop: '2%'
    },
    item: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red'
    },
    topRight: {
        flex: 2
    },
    title: {
        height: '10%'
    },
    poster: {
        flex: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    action: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    button1: {
        width: '60%',
        height: '30%',
        backgroundColor: '#2f90b5',
        justifyContent: 'center',
        marginRight: '2%',
        marginTop: '5%',
        borderRadius: 2
    },
    service: {
        height: '30%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '5%'
    },
    bottom: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    gallery: {
        flex: 5
    },
    action: {
        flex: 2,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

//---------------    container    -----------------
const mapStateToProps = state => ({
    // some app states
    food: state.food
});
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        // action creators
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(MFood);
