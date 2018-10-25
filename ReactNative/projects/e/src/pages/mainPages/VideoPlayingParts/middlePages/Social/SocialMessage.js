import React from 'react';
import { View,TouchableOpacity, StyleSheet, Text,Image,  AsyncStorage, ScrollView } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {filterUserAvatar} from '../../../../../utils/Util'
import _ from 'lodash'
import {emitSocialMessages, removeShareRequest, broadcastSocialMessages,jointChatRoom} from '../../../../../actions/SocialActions';
import {globalEventEmitter} from '../../../../../utils/globalEventEmitter'
import P2PMessage from './P2PMessage';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { toHHMMSS } from '../../../../../utils/Util';

class SocialMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [] ,
      currentPushId : -1,
      showQueue: false,
      queueListItems: [
      ],
      showP2P :true ,
      p2pUSer : {},
        userId:'',
    };

    AsyncStorage.getItem('USER_ID').then((_id)=>{
      this.setState({
        userId: _id
      })
   })

    this.onReceivedMessage = this.onReceivedMessage.bind(this);
    this.onSend = this.onSend.bind(this);
    this._storeMessages = this._storeMessages.bind(this);
  
  }

    componentWillMount(){

    

     

    }

    componentDidMount(){
      globalEventEmitter.addListener('contentSwitch', ()=>{
        this.setState({
          messages: []
        })
      });
      globalEventEmitter.addListener('broadCastSocialMessage', (messages, vId) => {
     
        this.onReceivedMessage(messages);

      })

      globalEventEmitter.addListener('P2PMessage', async (user) => {
         this.setState({
           showP2P :true ,
           p2pUSer : user
         })

      })
      
    }

  componentWillReceiveProps(nextProps) {

    if(nextProps.socialMsg.videoQueueItems && nextProps.socialMsg.videoQueueItems.length > 0){

      this.setState({
        showQueue: true,
        queueListItems : nextProps.socialMsg.videoQueueItems
      })
    } else {
      this.setState({
        showQueue: false
      })
    }
    
    
  }

  // Event listeners
  /**
   * When the server sends a message to this.
   */
  onReceivedMessage(messages) {
    this._storeMessages(messages);
  }

  /**
   * When a message is sent, send the message to the server
   * and store it in this component's state.
   */
  onSend(messages=[]) {
    // this.socket.emit('message', messages[0]);
    this.props.emitSocialMessages(this.props.socket, 'E3', messages[0]);
    this._storeMessages(messages);
  }
  renderQueueItems(){
      return ( this.state.queueListItems.map((item, idx)=>{
          return (
              <TouchableOpacity  key={idx} style={styles.queueListItem} onPress= { () => { this.handleVideoInQueue(item) } }>
                  <Image style={styles.productImages} resizeMode='cover' source={ {uri : item.poster} }  defaultSource={require(  '../../../../../assets/logo/pwc_logo_2.png')}  />
                  <Text style={styles.imageBox_text}>{ item.contentid }</Text>
                  {item.sharedBy !== this.state.userId && <Text style={styles.imageBox_text}>{ 'Shared by: '  + item.sharedBy }</Text>}
                  {item.sharedBy !== this.state.userId && <Text style={styles.imageBox_text}>{ item.sharedTime }</Text>}

                  {item.sharedBy === this.state.userId && <Text style={styles.imageBox_text}>Saved</Text>}
                  {item.sharedBy === this.state.userId && <Text style={styles.imageBox_text}>Offset: { toHHMMSS(item.offset) }</Text>}

                  <Icons name={'close'} color={'#FFF'} size={30} style={styles.closeButton} onPress={()=>{this.closeQueueItem(item)}}/>
              </TouchableOpacity>
          )
      }))

  }


  renderP2P(){
    return <P2PMessage user = { this.state.p2pUSer}/>
  }

    closeQueueItem(item) {
        this.props.removeShareRequest(item.id);
    }

  handleVideoInQueue(item) {
      globalEventEmitter.emit('replaceLeftTopVideoByQueueItem', item);
  }

  render() {

    let user = { _id: this.state.userId || -1 ,
      name: this.state.userId,
      avatar:  filterUserAvatar(this.state.userId)
    };


    return (
       <View style = {{ flex : 1}}>
          {
              this.state.showQueue &&
              <View style = {styles.queueListItemsWrapper}>

                  <ScrollView style ={ styles.scrolled} horizontal = {true} >
                    {
                      this.renderQueueItems()
                    }
                  </ScrollView>

              </View>
          }

          <View style = {{flex : 7}}>
            <GiftedChat
            messages={this.state.messages}
            showUserAvatar = {true}
            onSend={this.onSend}
            user={user}
          />
          </View>
      </View>
    );
  }

  // Helper functions
  _storeMessages(messages) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
  }
}


const styles = StyleSheet.create({
  scrolled: {
    marginTop: 5, 
    marginBottom : 5
  },
  productImages: {
    marginLeft: 5,
    paddingLeft: 5,
    paddingTop: 5, 
    width:  200,
    height: '70%',
    },
    imageBox_text:{
        flex: 1,
        color: '#FFFFFF',
        fontSize: 12,
        paddingTop: 2,
        lineHeight: 20,
        textAlign:'center',
    },
    queueListItemsWrapper: {
        flex : 3,
        borderBottomWidth: 1,
        borderColor: '#FFF'
    },
    queueListItem: {
      position: 'relative',
    },
    closeButton: {
      position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'transparent'
    },
})
const mapStateToProps = state => ({
    init: state.init,
    nav: state.nav,
    socialMsg: state.socialMsg,
});
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        emitSocialMessages, broadcastSocialMessages, jointChatRoom, removeShareRequest
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(SocialMessage);