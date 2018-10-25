import React, { Component } from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { navigateTo } from '../../../actions/NavigationAction';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class Right extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={this.props.style}>
                <View style={styles.tabItem}>
                    <TouchableOpacity style={styles.imageWrapper} onPress={() => { this.props.navigateTo('','','Info','home') }}>
                        <Image style={styles.imageIcon} source={this.props.nav.to == 'Info' ? require('../../../assets/images2/buttons_RightIcons/menu01_white.png') : require('../../../assets/images2/buttons_RightIcons/menu01_black.png')} resizeMode='stretch' />
                    </TouchableOpacity>
                </View>
                {
                    this.props.init.products &&
                    <View style={styles.tabItem}>
                        <TouchableOpacity style={styles.imageWrapper} onPress={() => { this.props.navigateTo('','','Shop','home') }}>
                            <Image style={styles.imageIcon} source={this.props.nav.to == 'Shop' ? require('../../../assets/images2/buttons_RightIcons/menu04_white.png') : require('../../../assets/images2/buttons_RightIcons/menu04_black.png')} resizeMode='stretch' />
                        </TouchableOpacity>
                    </View>
                }

                {
                    this.props.init.location &&
                    <View style={styles.tabItem}>
                        <TouchableOpacity style={styles.imageWrapper} onPress={() => { this.props.navigateTo('','','Location','home') }}>
                            <Image style={styles.imageIcon} source={this.props.nav.to == 'Location' ? require('../../../assets/images2/buttons_RightIcons/menu03_white.png') : require('../../../assets/images2/buttons_RightIcons/menu03_black.png')} resizeMode='stretch' />
                        </TouchableOpacity>
                    </View>
                }

                {
                    this.props.init.location &&
                    <View style={styles.tabItem}>
                        <TouchableOpacity style={styles.imageWrapper} onPress={() => { this.props.navigateTo('','','Travel','home') }}>
                            <Image style={styles.imageIcon} source={this.props.nav.to == 'Travel' ? require('../../../assets/images2/buttons_RightIcons/menu08_white.png') : require('../../../assets/images2/buttons_RightIcons/menu08_black.png')} resizeMode='stretch' />
                        </TouchableOpacity>
                    </View>
                }

                <View style={styles.tabItem}>
                    <TouchableOpacity style={styles.imageWrapper} onPress={() => { this.props.navigateTo('','','Social','home') }}>
                        <Image style={styles.imageIcon} source={this.props.nav.to == 'Social' ? require('../../../assets/images2/buttons_RightIcons/menu02_white.png') : require('../../../assets/images2/buttons_RightIcons/menu02_black.png')} resizeMode='stretch' />
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    tabItem: {
        flex: 1,
        backgroundColor: '#282828',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageWrapper: {
        width: 50,
        height: 50,
    },
    imageIcon: {
        width: '100%',
        height: '100%',
    }
})

//---------- container ---------------
const mapStateToProps = state => ({
    selectedTab: state.selectedTab,
    nav: state.nav,
    init: state.init,
});
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        navigateTo
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(Right);
