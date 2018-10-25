import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert, Button, Image, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import urls from '../../../../services/APIUrl';

function CastItem(props) {
    return (
        <View style={styles.castContent}>
            <View style={styles.castPhotoContainer}>
                <Image source={props.info.Image} resizeMode='stretch' style={styles.castPhoto} />
            </View>
            <View style={styles.castInfo}>
                <Text style={[styles.title]}>{props.info.Name}</Text>
                <Text style={[styles.role]}>{props.info.Role}</Text>
                <Text style={styles.desp}>{props.info.Description}
                </Text>
            </View>
        </View>
    )
}

class MCast extends Component {
    constructor(props) {
        super(props);
        this.state = {
            castItems: []
        }
    }

    componentWillMount() {
        let data = this.props.init.globalMD;
        let content = this.props.init.contentid;
        let cast = this.props.init.cast;
        let cdn = urls.CDN_old;
        let castArray = [];
        let actors = [];
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
        this.setState({
            castItems: castArray.map((item, i) => {
                return <CastItem key={i} info={item} />
            })
        })
    }

    componentWillReceiveProps(nextProps) {
        let data = nextProps.init.globalMD;
        let content = nextProps.init.contentid;
        let cast = nextProps.init.cast;
        let cdn = urls.CDN_old;
        let castArray = [];
        let actors = [];
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
        }
        this.setState({
            castItems: castArray.map((item, i) => {
                return <CastItem key={i} info={item} />
            })
        })
    }

    render() {
        return (
            <ScrollView style={{ flex: 1 }}>
                {this.state.castItems}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    castContent: {
        flex: 1,
        marginTop: 30,
        height: '90%',
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    castPhotoContainer: {
        flex: 1,
        marginRight: 30,
        marginLeft: 20
    },
    castPhoto: {
        width: 80,
        height: 120
    },
    castInfo: {
        flex: 5
    },
    title: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    role: {
        color: '#fff',
        fontSize: 13
    },
    desp: {
        color: '#fff',
        fontSize: 13
    }
})



//---------------    container    -----------------
const mapStateToProps = state => {
    return ({
        init: state.init
    })
};
const mapDispatchToProps = dispatch => (
    bindActionCreators({
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(MCast);