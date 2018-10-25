import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text } from 'react-native';

import EeLink from './EeLink';
import EeText from './EeText';
import * as globalStyles from '../../../../../styles/global';

const EeNames = ({ label, persons }) => {
    renderPerson = (persons) => {
        if (typeof (persons) == 'string') {
            return (
                <Text style={{color: 'lightblue', fontSize:12,}} key={0}>{persons}</Text>
            )
        } else if (typeof (persons) == 'object') {
            // console.log(persons);
            return (
                persons.map(
                    (person, i) => (
                        <Text style={{color: 'lightblue', fontSize:12,}} key={i}>
                            {person + ', '}
                        </Text>
                    )
                ))
        }
    }

    renderLabel = (label, persons) => {
        if (persons == '' || persons.length < 1) {
            return (
                <View style={[styles.container]}>
                    <View style={[styles.linkArea]}>
                        {this.renderPerson(persons)}
                    </View>
                </View>
            )
        } else {
            return (
                <View style={[styles.container]}>
                    <EeText>{label}</EeText>
                    <View style={[styles.linkArea]}>
                        {this.renderPerson(persons)}
                    </View>
                </View>
            )

        }
    }

    return (
        <View style={[styles.container]}>
            {this.renderLabel(label, persons)}
        </View>)
};

const styles = StyleSheet.create({
    linkArea: {
        flexDirection: 'row',
        paddingTop: 3,
        flexWrap: 'wrap'
    },
    container: {
        paddingVertical: 8,
        // backgroundColor: 'red'
    }
});

export default EeNames;