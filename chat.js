module.exports = function(server, session){
    
    // imports
    var sharedsession = require("express-socket.io-session");
    var io = require('socket.io')(server);
    
    // middlewares
    io.use( sharedsession(session) );


    // engine
    var wait_patients = [];
    var free_psychos = [];
    io.on("connection", function(socket){

        // Alocate user
        socket.psycho = (socket.handshake.session.uid) ? true : false;
        requeue( socket );

        // Get events
        socket.on("disconnect", function(){
            // Get out of queue
            if( socket.waiting ){
                if( socket.psycho )
                    free_psychos.splice( free_psychos.indexOf(socket), 1);
                else
                    wait_patients.splice( wait_patients.indexOf(socket), 1 );
            }
            else if( socket.other ) requeue(socket.other);
        });

        socket.on("message", function(msg){
            if( socket.other )
                socket.other.emit("message", msg);
        });

    });

    function requeue( socket ){
        socket.waiting = true;
        socket.emit("queued");
        if( socket.psycho ){
            if( wait_patients.length > 0 ){
                var patient = wait_patients.shift();
                create_room( socket, patient );
            }
            else free_psychos.push( socket );
        }
        else{
            if( free_psychos.length > 0 ){
                var psycho = free_psychos.shift();
                create_room( socket, psycho );
            }
            else wait_patients.push( socket );
        }
    }

    function create_room( psycho, patient){
        psycho.other = patient;
        patient.other = psycho;

        psycho.waiting = false;
        patient.waiting = false;

        patient.emit("paired", psycho.handshake.session.data);
        psycho.emit("paired", patient.handshake.session.data);
    }

    

};