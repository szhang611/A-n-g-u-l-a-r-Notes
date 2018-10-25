import React from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet, View, Text
} from 'react-native';

const EeHeadingOne = ({style, children}) => (
    <Text style={[styles.headingOne, style]}>{children}</Text>
);

EeHeadingOne.propTypes = {

};

const styles = StyleSheet.create({
    headingOne:{
        fontSize: 18,
        color: 'white',
        paddingTop: 4,
        paddingBottom: 10,
        fontWeight: 'bold'
    }
});

export default EeHeadingOne;