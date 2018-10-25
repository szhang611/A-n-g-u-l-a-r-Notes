import React from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet, View, Text
} from 'react-native';

import EeLink from './EeLink';
import EeText from './EeText';
import * as globalStyles from '../../../../../styles/global';

const EeList = ({ label, list }) => {
    let elabel = label ? label + ":" : '';
    return (<View style={[styles.txtArea]}>
        <EeText style={{ fontWeight: 'normal', marginRight: 5 }}>{elabel}</EeText>
        {
            typeof list === 'string'
                ? <EeText>{list}</EeText>
                : list.map(
                    (item, i) => (
                        <EeText key={i}>
                            {
                                i != 0
                                    ? ('|' + item)
                                    : item
                            }
                        </EeText>
                    )
                )
        }
    </View>)
};

const styles = StyleSheet.create({
    txtArea: {
        flexDirection: 'row',
        paddingVertical: 3,
        width: 240
    },
    container: {
        paddingVertical: 3
    }
});

export default EeList;