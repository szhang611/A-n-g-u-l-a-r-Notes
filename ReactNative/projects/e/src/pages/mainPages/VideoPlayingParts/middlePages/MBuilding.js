import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert, Button, ListView, Image, TouchableOpacity } from 'react-native';




function List(props) {
    return (
        <View style={styles.item}>
            <View style={[{ height: '90%', width: '80%' }, props.style]}>
                <View style={{ height: '10%' }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>{props.title}</Text>
                </View>
                <ListView
                    dataSource={props.dataSource}
                    renderRow={(rowData) => <Text style={{ color: '#fff' }}>{rowData}</Text>}
                />
            </View>
        </View>
    )
}




export default class MBuilding extends Component {
    constructor(props) {
        super(props)
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource1: ds.cloneWithRows(['Work Gloves', 'Tape Measure', 'Adjustable Wrench', 'Hummer']),
            dataSource2: ds.cloneWithRows(['4 2x2 at 40in (side molding)"', '4 2x6 at 50in (top)"', '4 2x4 at 17in (width)"', '4 2x4 at 18in (height)"', '1 1x10 at 40in (bottom shelf)"']),
        };
    }

    render() {
        return (
            <View style={styles.buildingContainer}>
                <View style={styles.top}>
                    <View style={styles.topLeft}>
                        <List dataSource={this.state.dataSource1} title='Tools' style={{ marginTop: '50%' }} />
                        <List dataSource={this.state.dataSource2} title='Cut List' />
                        <View style={styles.item} ></View>
                    </View>
                    <View style={styles.topRight}>
                        <View style={styles.title}><Text style={{ color: '#fff' }}>Build Cabinet</Text></View>
                        <View style={styles.poster}>
                            <Image source={require('../../../../assets/images/building_poster.png')} resizeMode='stretch' style={{ width: '90%', height: '90%' }} />
                        </View>
                        <View style={styles.action}>
                            {/* <Button title="Buy Box" color="#fff" />
                            <Button title="Buy Tools" color="#fff" backgroundColor='#2196F3' /> */}
                            {/* <Touchable
                                accessibilityComponentType="button">
                                <View style={{backgroundColor: '#2f90b5'}}>
                                    <Text style={{color: '#fff'}}>Buy Box</Text>
                                </View>
                            </Touchable> */}
                            {/* <Touchable> </Touchable> */}
                            <TouchableOpacity style={styles.button1}>
                                <View >
                                    <Text style={{ color: '#fff', textAlign: 'center' }}>Buy Box</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button2}>
                                <View style={{ backgroundColor: '#2f90b5' }}>
                                    <Text style={{ color: '#fff', textAlign: 'center' }}>Buy Tools</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.service}>
                            <Image source={require('../../../../assets/images/building_service1.png')} resizeMode='stretch' style={{ width: '10%', height: '80%', marginRight: '5%' }} />
                            <Image source={require('../../../../assets/images/building_service2.png')} resizeMode='stretch' style={{ width: '10%', height: '80%' }} />
                        </View>
                    </View>
                </View>
                <View style={styles.bottom}>
                    <Image source={require('../../../../assets/images/building_gallery.png')} resizeMode='stretch' style={{ width: '60%', height: '100%', marginRight: '5%' }} />
                </View>
            </View >
        )
    }
}





const styles = StyleSheet.create({
    buildingContainer: {
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
        backgroundColor: 'black'
    },
    item: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
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
        width: '30%',
        height: '30%',
        backgroundColor: '#2f90b5',
        justifyContent: 'center',
        marginRight: '2%',
        marginTop: '5%',
        borderRadius: 2
    },
    button2: {
        width: '30%',
        height: '30%',
        backgroundColor: '#2f90b5',
        justifyContent: 'center',
        marginTop: '5%',
        borderRadius: 2
    },
    service: {
        height: '7%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottom: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})