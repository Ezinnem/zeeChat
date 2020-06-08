//For the video chat
//connection for video

// get local video and display it with permission
function getLocalVideo(callbacks) {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    var constraints ={
        audio:true,
        video:true
    }
    navigator.getUserMedia(constraints, callbacks.success, callbacks.error)
    
    }
    
    function recStream(stream, elemid) {
        var video = document.getElementById(elemid)
    
        video.srcObject = stream;
    
        window.peer_stream = stream;
    }
    getLocalVideo({
        success: function(stream){
            window.localstream = stream;
            recStream(stream, 'lVideo')
        },
        error: function(err) {
            alert("Cannot access your camera");
            console.log(err)
    }
    });
    
    var conn;
    var peer_id;
  
    
    //create a peer connection with peer obj
    var peer = new Peer();
    
    //display peer id on the DOM
    peer.on('open', function() {
        document.getElementById("displayId").innerHTML = peer.id
        console.log('My peer ID is: ' + peer.id);
      });
    
      peer.on('conection', function(connection){
          conn = connection;
          peer_id = connection.peer
    
          document.getElementById('connId').value = peer_id;
      });
      peer.on("error", function(err){
          alert("An error has occured: "+ err);
          console.log(err);
      })
    //onClick with the connection button/ expose ice infomation to each other
    document.getElementById("conn_button").addEventListener("click", function(){
        console.log('connecting')
        peer_id = document.getElementById("connId").value;
    
        if(peer_id){
            console.log('connected')
            conn = peer.connect(peer_id)
        }else {
            alert('Enter an Id');
            return false;
        }
    })
    //call onClick (offer amd answer is exchanged)
    peer.on("call", function(call){
        var acceptCall = confirm('Do you want to answer this call?');
    
        if(acceptCall) {
            call.answer(window.localstream);
    
            call.on("stream", function(stream){
    
                window.peer_stream = stream;
    
                recStream(stream, 'rVideo')
            });
            call.on("close", function(){
                alert("The call has ended");
            })
        }else {
            console.log("call denied")
        }
    });
    //ask to call
    document.getElementById('call_button').addEventListener("click", function (){
        console.log("Calling " + peer_id)
        console.log(peer);
        var call = peer.call(peer_id, window.localstream);
    
        call.on('stream', function(stream){
            window.peer_stream = stream;
    
            recStream(stream, 'rVideo');
        })
    })
  