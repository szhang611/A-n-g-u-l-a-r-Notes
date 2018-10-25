import React from 'react'
import PropTypes from 'prop-types'
import Icons from 'react-native-vector-icons/MaterialIcons'
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity
} from 'react-native'

import LinearGradient from 'react-native-linear-gradient'
import { ToggleIcon } from './'
import { checkSource } from './utils'

const backgroundColor = 'transparent'

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        borderColor: 'transparent',
    },
    row: {
        height: 35,
        flexDirection: 'row',
        // alignSelf: 'flex-start',
        // alignItems: 'flex-start',
        width: '100%',
    },
    title: {
        flex: 1,
        backgroundColor,
        paddingLeft: 10,
        paddingRight: 35,
        fontSize: 16
    },
    logo: {
        marginLeft: 5,
        height: 25,
        width: 25
    }
})

const TopBar = (props) => {
    const {
        logo,
        more,
        title,
        theme,
        onMorePress,
        displayFullScreenIcon,
        displayEditIcon,
        pressEditIcon
    } = props
    return (
          <View style={[styles.row]}>
            {/*<TouchableOpacity style={{alignItems: 'flex-start'}} onPress={()=>{this.props.closeVideo()}}>*/}
                {/*{*/}
                    {/*!displayFullScreenIcon &&*/}
                    {/*<Icons*/}
                        {/*style={{padding: 3}}*/}
                        {/*name={'close'}*/}
                        {/*color={'#FFFFFF'}*/}
                        {/*size={24}*/}
                    {/*/>*/}
                {/*}*/}
            {/*</TouchableOpacity>*/}
              {
                  displayEditIcon &&
                  <TouchableOpacity style={{justifyContent: 'flex-end', alignItems: 'flex-end'}} onPress={()=>{pressEditIcon()}}>
                      <Icons
                          style={{padding: 3}}
                          name={'border-color'}
                          color={'#FFFFFF'}
                          size={16}
                      />
                  </TouchableOpacity>
              }


          </View>
    )
}

TopBar.propTypes = {
    title: PropTypes.string,
    logo: PropTypes.string,
    more: PropTypes.bool,
    onMorePress: PropTypes.func,
    theme: PropTypes.object,
    displayFullScreenIcon: PropTypes.bool,
    closeVideo: PropTypes.func,
    pressEditIcon: PropTypes.func,
};

export { TopBar }

