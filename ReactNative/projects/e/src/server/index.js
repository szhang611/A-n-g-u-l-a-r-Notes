
// Mapping objects to easily map sockets and users.
var clients = {};
var users = {};
var express = require('express');
var http = require('http')
var socketio = require('socket.io');
var mongojs = require('mongojs');
var request = require('request')
var bodyParser = require('body-parser')
var path = require('path')

// Mapping objects to easily map sockets and users.
var clients = {};
var socketIdMapUserID = {}
var users = {};
var onlineUsers = {}
var watching = {}
var unreadMessages = {}
var ObjectID = mongojs.ObjectID;
var db = mongojs(process.env.MONGO_URL || 'mongodb://localhost:27017/local');
var app = express();
var server = http.Server(app);
var websocket = socketio(server);
server.listen(8080, () => console.log('listening on *:8080'));

 // app.get('/', function(req, res){
   // res.sendFile(__dirname + '/chating.html');
// });
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.use('/static', express.static(path.join(__dirname, 'assets')))

var myLogger = function (req, res, next) {
  console.log('LOGGED')
  next()
}

app.use(myLogger)
// Set the headers

var headers = {
  'Content-Type':   'application/json'
}


app.post('/login', function(req, res) {
  console.log(req.body)
 
 

  var options = {
    url: 'http://114.31.83.54:15080/opturl/LoginV1',
    method: 'POST',
    headers: headers,
    body: req.body,
    json: true
  }
  request(options, function (error, response, body) {
    console.log(response.statusCode)

    console.log(error)
    if (!error && response.statusCode == 200) {
        // Print out the response body
        console.log(body)
        if ( req.body.user in onlineUsers ){
          res.send({
            errorMsg : 'The account has been logged into another device',
            errorCode: '1002',
            status: 'fail'
          })
          return
      }
  
      db.collection('users')
      .findOne({username: req.body.user}, (err, user) => {
		if(!user){
			res.send(body)

		}else{
			delete user.shareRequests
			delete user.friendList
			userProfile = {
			  socialResponse: user,
			  status: 'success'
			}
			userProfile.profile = user.profile ?  user.profile : {}
			body.userProfile = userProfile
			res.send(body)
		}
        
  
      })
      return
    } 
    res.send(body)
  })

})


app.get('/users/friendsAvatarList', (req, res) => {
  db.collection('users')
  .find({}, (err,rsp) => {
    
    res.send({
      rsp
     }) 

  })

})

app.get('/users/:id', function(req, res) {
  let userId = req.params.id
  console.log("get detail for the user",userId)
  db.collection('users')
  .findOne({username: userId}, (err, user) => {
    delete user.shareRequests
    delete user.friendList
    user.profile = user.profile ?  user.profile : {}
    res.send({
      socialResponse: user,
      status: 'success'
    })

  })
})

app.get('/healthCheck', function(req, res) {
  res.send('server is healthy')
})


app.get( '/users/:uid/getFriendsWatchingList' , (req, res) =>{
  console.log("watching object is ", watching)
  let userId = req.params.uid

  watchingList = []
  //1 . get friends list  from db
   db.collection('users')
        .findOne({username: userId}, (err, user) => {
          console.log(user)
          let friendList = user.friendList
          Object.keys(watching).forEach((key) =>{
              if (friendList.indexOf(key) > -1 ) {
                watchingList.push(watching[key])
              }
          })
          res.send(
            {
              socialResponse: watchingList|| [],
              status: 'success'
            }
          )
        })
}
)

app.get('/users/:uid/getFriendList', (req, res) => {
  let userId = req.params.uid

  //1 . get friends list  from db
   db.collection('users')
        .findOne({username: userId}, (err, user) => {
          console.log(user)
          let friendList = user.friendList
          return friendList.map( (item) => {
            let newItem = {
              id: item ,
              online :  item in Object.keys(onlineUsers), 
            }
            return newItem
          })
        })
})

app.post('/users/:uid/removeShareRequest/:id', (req, res) =>{
  let userId = req.params.uid
  let reqId = req.params.id
  console.log(" going to remove userid, and req id ", userId, reqId)
   db.collection('users')
  .findOne({username: userId}, (err, user) => {
    let shareRequests = user.shareRequests
	let newShareReq = []
    if (shareRequests && shareRequests.length > 0) {
		shareRequests.forEach( (item) =>{
			if (item.id && item.id.toString() != reqId){
				newShareReq.push(item)
			}
		})
	}
    db.collection('users')
    .update( {username: userId} , { $set: {shareRequests : newShareReq } } , () => {
      res.send({
        status: 'success'
      })
    });
  })

})

app.post('/users/:id/addShareRequest', (req, res) => {
  let userId = req.params.id
  let shareRequest = req.body
  shareRequest.id = ObjectID()
  db.collection('users')
  .findOne({username: userId}, (err, user) => {
    let shareRequests = user.shareRequests
    if (shareRequests && shareRequests.length > 0) {
      shareRequests.push(shareRequest)
    } else {
      shareRequests = []
	  shareRequests.push(shareRequest)

    }
    db.collection('users')
    .update( {username: userId} , { $set: {shareRequests } } , () => {
      res.send({
        status: 'success'
      })
    });
  })



})

app.get('/users/:id/shareRequests', (req, res)=> {
  let userId = req.params.id
  db.collection('users')
  .findOne({username: userId}, (err, user) => {
    res.send({
      socialResponse: user.shareRequests,
      status: 'success'
    })
  })

} )

app.get('/users/:uid/merchindise/favouriteList', (req, res ) =>{
  let userId = req.params.uid
  db.collection('users')
  .findOne({username: userId}, (err, user) => {
    res.send({
      socialResponse: user.favouriteList || [],
      status: 'success'
    })
  })
})


app.post('/users/:uid/merchindise/addFav', (req, res ) =>{
  let userId = req.params.uid
  let merchindise = req.body
  let exits = false
  merchindise.id = ObjectID()
  db.collection('users')
  .findOne({username: userId}, (err, user) => {
    let favouriteList = user.favouriteList
    
    if (favouriteList && favouriteList.length > 0) {
      favouriteList.forEach( (item) =>{
        if (item.title && item.title.toString() == merchindise.title){
          exits = true
        }
      })
	  if(!exits) {
		favouriteList.push(merchindise)
	  }
    } else {
      favouriteList = []
      favouriteList.push(merchindise)

    }
    if(!exits){
      db.collection('users')
      .update( {username: userId} , { $set: {favouriteList } } , () => {
        res.send({
          id: merchindise.id,
          status: 'success'
        })
      });
    } else{
      res.send({
        status: 'duplicate'
      })
    }
    
  })
})

app.get('/users/:uid/merchindise/cancelFav/:title', (req, res ) =>{
  let userId = req.params.uid
  let reqId = req.params.title
  console.log(" going to remove fav for merchindise, and req id ", userId, reqId)
   db.collection('users')
  .findOne({username: userId}, (err, user) => {
    let favouriteList = user.favouriteList
	  let newFavouriteList = []
    if (favouriteList && favouriteList.length > 0) {
      favouriteList.forEach( (item) =>{
			if (item.title && item.title.toString() != reqId){
				newFavouriteList.push(item)
			}
		})
	}
    db.collection('users')
    .update( {username: userId} , { $set: {favouriteList : newFavouriteList } } , () => {
      res.send({
        status: 'success'
      })
    });
  })
  
})


app.post('/users/:uid/profile/setting', (req, res) => {
  let userId = req.params.uid
  let settingObj = req.body
  settingObj.id = ObjectID()
  db.collection('users')
  .findOne({username: userId}, (err, user) => {
    let profile = user.profile ? user.profile : {}
    profile.setting  = settingObj
    db.collection('users')
    .update( {username: userId} , { $set: { profile}  } , () => {
      res.send({
        status: 'success'
      })
    });
  })

})



app.post('/metadata/GetTaxV1', (req, res) => {

  var options = {
    url: 'http://114.31.83.54:15080/opturl/GetTaxV1',
    method: 'POST',
    headers: headers,
    body: req.body,
    json: true
  }
  console.log('requesting getTaxV1... ')
  console.log(req.body)
  request(options, function (error, response, body) {
    console.log('response getTaxV1... ')

    console.log(response.statusCode)

    console.log("any error : " , error)
    if (!error && response.statusCode == 200) {
        // Print out the response body
        console.log(body)
    }
    res.send(body)
  })
  
})

app.post('/metadata/GetScenesV1', (req, res)=> {
  var options = {
    url: 'http://114.31.83.54:15080/opturl/GetScenesV1',
    method: 'POST',
    headers: headers,
    body: req.body,
    json: true
  }
  console.log('requesting GetScenesV1... ')
  console.log(req.body)
  request(options, function (error, response, body) {

    console.log('response GetScenesV1... ')

    console.log(response.statusCode)

    console.log("any error : " , error) 
    if (!error && response.statusCode == 200) {
        // Print out the response body
        console.log(body)
    } 
    res.send(body)
  })
})

app.post('/metadata/SynchSceneV1',(req, res)=> {
  var options = {
    url: 'http://114.31.83.54:15080/opturl/SynchSceneV1',
    method: 'POST',
    headers: headers,
    body: req.body,
    json: true
  }
  console.log('requesting SynchSceneV1... ')
  console.log(req.body)
  request(options, function (error, response, body) {
    console.log('response SynchSceneV1... ')

    console.log(response.statusCode)

    console.log("any error : " , error) 
    if (!error && response.statusCode == 200) {
        // Print out the response body
     //   console.log(body)
    } 
    res.send(body)
  })
})
app.post('/metadata/SynchVideoV1',(req, res)=> {
  var options = {
    url: 'http://114.31.83.54:15080/opturl/SynchVideoV1',
    method: 'POST',
    headers: headers,
    body: req.body,
    json: true
  }
  console.log('response SynchVideoV1... ')

  request(options, function (error, response, body) {
    console.log(response.statusCode)
	console.log("any error : " , error) 

    if (!error && response.statusCode == 200) {
        // Print out the response body
       // console.log(body)
    } 
    res.send(body)
  })
})
app.post('/metadata/GetContentV1', (req, res)=> {
  var options = {
    url: 'http://114.31.83.54:15080/opturl/GetContentV1',
    method: 'POST',
    headers: headers,
    body: req.body,
    json: true
  }
  console.log('requesting GetContentV1... ')
  console.log(req.body)
  request(options, function (error, response, body) {
    console.log('response GetContentV1... ')

    console.log(response.statusCode)

    console.log("any error : " , error) 
    if (!error && response.statusCode == 200) {
        // Print out the response body
        console.log(body)
    }
    res.send(body)
  })
})
app.post('/metadata/GetMethodsV1', (req, res)=> {
  var options = {
    url: 'http://114.31.83.54:15080/opturl/GetMethodsV1',
    method: 'POST',
    headers: headers,
    body: req.body,
    json: true
  }
  console.log('requesting GetMethodsV1... ')
  console.log(req.body)
  request(options, function (error, response, body) {
    console.log('response GetMethodsV1... ')

    console.log(response.statusCode)

    console.log("any error : " , error) 
    if (!error && response.statusCode == 200) {
        // Print out the response body
        console.log(body)
    }
    res.send(body)
  })
})
app.post('/metadata/SynchV1', (req, res)=> {
  var options = {
    url: 'http://114.31.83.54:15080/opturl/SynchV1',
    method: 'POST',
    headers: headers,
    body: req.body,
    json: true
  }
  console.log('requesting SynchV1... ')
  console.log(req.body)
  
  request(options, function (error, response, body) {
    console.log('response SynchV1... ')

    console.log(response.statusCode)

    console.log("any error : " , error) 
    if (!error && response.statusCode == 200) {
        // Print out the response body
       // console.log(body)
    }
    res.send(body)
  })
})

websocket.on('connection', (socket) => {
    console.log('connected, ',socket.id)
    clients[socket.id] = socket;
    socket.on('userJoined', (userId) => onUserJoined(userId, socket));
    socket.on('message', (message) => onMessageReceived(message, socket));
    socket.on('P2PMessage', (message, userId) => onP2PMessageReceived(message, userId, socket));
    socket.on('JoinP2PMessage', (receiver) => onP2PMessageJoined(receiver, socket));

    socket.on('joinChatRoom', (watching_now) => onJoinChatRoom( watching_now,socket))
    socket.on('disconnect', ()=> onUserLeft(socket));
    socket.on('rejectVideo', (userId) => rejectVideo(userId, socket) )
    socket.on('acceptVideo', (userId) => acceptVideo(userId, socket) )
    socket.on('shareVideoTo',(userId, content) => onShareVideoTo(userId, content,socket) )
    socket.on('watchingNow', (userId, content) => onWatchingNowChanged(userId, content) )
    console.log('current online sockets are ' ,  Object.keys(clients).length)
});
// Event listeners.
// When a user joins the chatroom.

function onWatchingNowChanged(userId, content){
  console.log('user watching now update ' + userId)
  //console.log('watching now content is ' , content)
  try{
    if(userId in onlineUsers) {
      // 1. update using wachting 
      content.user = userId
      watching[userId] = content
    
      db.collection('users')
        .findOne({username: userId}, (err, user) => {
          console.log(user) 
          let friendList = user.friendList
          Object.keys(onlineUsers).forEach((key) =>{
              if (friendList.indexOf(key) > -1) {
                console.log(' going to emit waching change to your friends')
                clients[onlineUsers[key]].emit('wachingNowNotify', userId, content)
              }
          })
        })

      // 2. can record share list here.
    } else{

      console.log('user can not find in the online list, but receive a video waching now change request ' + userId)
    }

  } catch(err) {
    console.error(err);
  }
}

function rejectVideo(userId, socket){
  console.log('friends reject request to ' + userId)
  try {
    if(userId in onlineUsers) {
      // 1. get the user socket 
      
      let socketId = onlineUsers[userId]
      let socketTo = clients[socketId]
    
      let fromUserId = socketIdMapUserID[socket.id]
      socketTo.emit('rejectVideoNotify', fromUserId)

      // 2. can record share list here.
    } else{

      console.log('user can not find in the online list, but receive a video share request ' + userId)
    }
  } catch(err) {
    console.error(err);
  }
}

function acceptVideo(userId, socket){
  try{
    console.log('friends accpet request to ' + userId)
    if(userId in onlineUsers) {
      // 1. get the user socket 
      
      let socketId = onlineUsers[userId]
      let socketTo = clients[socketId]
    
      let fromUserId = socketIdMapUserID[socket.id]
      socketTo.emit('acceptVideoNotify', fromUserId)

      // 2. can record share list here.
    } else{

      console.log('user can not find in the online list, but receive a video share request ' + userId)
    }
  } catch(err) {
    console.error(err);
  }
}

function onShareVideoTo(userId, content, socket){
  console.log('going to share: ' + userId)
  try{
    if(userId in onlineUsers) {
      // 1. get the user socket 
      
      let socketId = onlineUsers[userId]
      let socketTo = clients[socketId]
    
      let fromUserId = socketIdMapUserID[socket.id]
    console.log(' from user id is ' , fromUserId)
      socketTo.emit('shareFromFriends', fromUserId, content)

      // 2. can record share list here.
    } else{

      console.log('user can not find in the online list, but receive a video share request ' + userId)
    }
  } catch(err) {
    console.error(err);
  }
}

function onJoinChatRoom(watching_now, socket) { 
  console.log('currently the user is watching ', watching_now)
  try{
    userId = watching_now.userId
    if(userId in onlineUsers) {
      // 1. update watching now for the user
      watching[userId] = watching_now
      // 2. set chat id and send out the hisotry list to joined user
      _sendExistingMessages(socket, _getChatRoomId(watching_now))

      // 3. @todo broadcast to all room user that new user is joint
    } else{

      console.log('user can not find in the online list ' + userId)
    } 
  } catch(err) {
    console.error(err);
  }
}

function onUserJoined(userId, socket) {
	console.log('user login for userId' , userId)
  try {
      onlineUsers[userId] =  socket.id;
      socketIdMapUserID[socket.id] = userId
      db.collection('users')
      .findOne({username: userId}, (err, user) => {
		    console.log(user)
        console.log(user.name.displayName + ' has logined')
        let friendList = user.friendList
        let onlineList = []
        friendList.forEach((key) =>{
            if (Object.keys(onlineUsers).indexOf(key) > -1) {
              console.log(' going to emit online to your friends')
              if(onlineUsers[key] in clients){
                clients[onlineUsers[key]].emit('online', user)
                onlineList.push({ "userId" : key, "watchingNow": watching[user] ? watching[user] : {} , 'online': true  })
              }else{
                delete onlineUsers[key]
              }

            }else{
              onlineList.push({ "userId" : key, 'online': false  })
            }
        })
        socket.emit('onlineList', onlineList)
        // push unread messages 
        if(userId in unreadMessages){
          unreadMessages[userId].forEach(element => {
            socket.emit('P2PmessageNotify', element.sender, [element.message])
            
          });
          delete unreadMessages[userId]
        }


      })

  } catch(err) {
    console.error(err);
  }
}

function onUserLeft(socket){ 
  
  console.log('disconnected, ',socket.id)

  try{
        userId = socketIdMapUserID[socket.id]
        if( !userId ){
          delete socketIdMapUserID[socket.id]
          return
        }
        var user = db.collection('users')
        .findOne({username: userId}, (err, user) => {
          console.log(user)
          console.log(user.name.displayName + ' has offline')
          let friendList = user.friendList
          Object.keys(onlineUsers).forEach((key) =>{
              if (friendList.indexOf(key) > -1 && onlineUsers[key] in clients) {
                console.log(' going to emit online to your friends ')
                user.username = userId
                clients[onlineUsers[key]].emit('offline', {user})
              }
          })
          delete clients[socket.id]
          delete socketIdMapUserID[socket.id]
          delete onlineUsers[userId]
          delete watching[userId]      
        })
    }catch(err){
      console.error(err)
    }
}

// When a user sends a message in the chatroom.
function onMessageReceived(message, senderSocket) {	
 try{
    var userId = socketIdMapUserID[senderSocket.id];
    console.log('receive message from user ',userId)
    console.log(message)
    // Safety check.
    if (!userId) return;

    _sendAndSaveMessage(message, senderSocket);
  } catch(err) {
  console.error(err);
  }
}

function onP2PMessageJoined(receiverId, socket) { 
  console.log('currently the user is talking to ', receiverId)
  let userId = socketIdMapUserID[socket.id]
  try{
     if(userId in onlineUsers) {
      // 1. update watching now for the user
      // 2. set chat id and send out the hisotry list to joined user
      _sendExistingP2PMessages(userId,receiverId, socket)

      // 3. @todo broadcast to all room user that new user is joint
    } else{

      console.log('user can not find in the online list ' + userId)
    } 
  } catch(err) {
    console.error(err);
  }
}
// When a user sends a message in the chatroom.
function onP2PMessageReceived(message,receiverId,  senderSocket) {	
  try{
     var userId = socketIdMapUserID[senderSocket.id];
     console.log('receive message from user ',userId)
     console.log(message)
     console.log('going to send message to ', receiverId)
     // Safety check.
     if (!userId) return;

     var messageData = {
      text: message.text,
      user: message.user,
      messageType: message.messageType,
      receiver: receiverId,
      createdAt: new Date(message.createdAt),
    };
  
    db.collection('messages').insert(messageData, (err, message) => {
      // If the reviver id 
      if (receiverId in onlineUsers){
        var emitter = clients[onlineUsers[receiverId]]
        emitter && emitter.emit('P2PmessageNotify',userId,  [message]);
      } else {
        if (!(receiverId  in unreadMessages )){
          unreadMessages[receiverId] = []
        }
        unreadMessages[receiverId].push({
          sender: userId, 
          message
        })
      } 
    });

   } catch(err) {
   console.error(err);
   }
 }

 // Helper functions.
// Send the pre-existing messages to the user that just joined.
function _sendExistingP2PMessages( userId, receiverId, socket) {
  var messages = db.collection('messages')
    .find( { $or : [{ "user._id": userId , receiver: receiverId} , {"user._id": receiverId, receiver: userId}] })
    .sort({ createdAt: 1 })
    .toArray((err, messages) => {
      // If there aren't any messages, then return.
      //if (!messages.length) return;
      socket.emit('P2PmessageNotify', receiverId, messages.reverse());
  });
}

// Helper functions.
// Send the pre-existing messages to the user that just joined.
function _sendExistingMessages(socket, chatId) {
  var messages = db.collection('messages')
    .find({ chatId })
    .sort({ createdAt: 1 })
    .toArray((err, messages) => {
      // If there aren't any messages, then return.
      if (!messages.length) return;
      socket.emit('message', messages.reverse());
  });
}

// Save the message to the db and send all sockets but the sender.
function _sendAndSaveMessage(message, socket, fromServer) {
  var messageData = {
    text: message.text,
    user: message.user,
    createdAt: new Date(message.createdAt),
    chatId:  _getChatRoomId(watching[message.user._id])
  };

  db.collection('messages').insert(messageData, (err, message) => {
    // If the message is from the server, then send to everyone.
    var emitter = fromServer ? websocket : socket.broadcast;
    emitter.emit('message', [message]);
  });
}


function  _getChatRoomId (watching_now){
  if ( watching_now && watching_now.type&& watching_now.content ) {
    return [watching_now.type, watching_now.content ].join('_').toLocaleLowerCase()
  }else{
    return 'default_room'
  } 

} 

var fs = require('fs');
error_out = fs.createWriteStream(__dirname + '/error.log', {flags:'a'})
debug_out = fs.createWriteStream(__dirname + '/debug.log', {flags:'a'})
process.__defineGetter__('stderr', function() { 
  return error_out  })

process.__defineGetter__('stdout', function() { 
    return debug_out }) 