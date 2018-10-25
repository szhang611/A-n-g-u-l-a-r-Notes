import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, WebView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Spinner from 'react-native-spinkit'



class FacebookView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uri: 'https://www.facebook.com/'
        }
    }

    componentWillMount() {

    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidMount() {

    }

    render1() {
        return(
            <View style={{flex:1}}>
                <ScrollView>
                    {/* <WebView
                        source={{uri : this.state.uri}}
                    /> */}


                    <Image  style={{flex:1,width: '98%',marginLeft:'1%',}} source={require('../../../../../assets/poster/Friends-Facebook-screenshot.png')} resizeMode='contain'/>
                </ScrollView>
            </View>
        )
    }

     render() {
        
     return (
      <WebView
        ref={(ref) => { this.webview = ref; }}
        source={{ uri: this.state.uri }}
        onNavigationStateChange={(event) => {
          if (event.url !== this.state.uri) {
            this.webview.stopLoading();
            Linking.openURL(event.url);
          }
        }}
      />
    );
  }

  

}


const styles = StyleSheet.create({

});



//---------- container ----------

const mapStateToProps = state => ({
    init: state.init,
    nav: state.nav,
});
const mapDispatchToProps = dispatch => (
    bindActionCreators({

    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(FacebookView);