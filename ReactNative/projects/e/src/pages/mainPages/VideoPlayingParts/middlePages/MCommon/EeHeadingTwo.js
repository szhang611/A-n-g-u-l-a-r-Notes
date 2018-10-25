import React from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet, View, Text
} from 'react-native';

const EeHeadingTwo = ({style, children}) => (
    <Text style={[styles.headingOne, style]}>{children}</Text>
);

EeHeadingTwo.propTypes = {
   
};

const styles = StyleSheet.create({
    headingTwo:{
        fontSize: 16,
        color: 'white',
        paddingTop: 3,
        paddingBottom: 8,
        fontWeight: 'bold'
    }
});

export default EeHeadingTwo;