    PlayersList = new Mongo.Collection('players');
    var si = "";

console.log("Hello World");

if(Meteor.isClient){
    // this code only runs on the client
    Template.leaderboard.helpers({
        'player': function(){
            var currentUserId = Meteor.userId();
            return PlayersList.find({}, {sort: {score: -1, name: 1}});
        },
        'selectedClass': function(){
            var playerId = this._id;
            var selectedPlayer = Session.get('selectedPlayer');
            if(playerId == selectedPlayer)
            return "selected"
        },
        /*'pointClass': function(){
            var selectedPlayer = Session.get('selectedPlayer');
            if(playerId == selectedPlayer)
                return "fivePoint"
        },*/
        'totalPlayers': function(){
            return PlayersList.find().count()
        },
        'showSelectedPlayer': function(){
            var selectedPlayer = Session.get('selectedPlayer');
            return PlayersList.findOne(selectedPlayer)
        },
    });
    Template.leaderboard.events({
        'click .player': function(){
            var playerId = this._id;
            Session.set('selectedPlayer', playerId);
        },
        'click .increment': function(){
            var give = 5;
            var selectedPlayer = Session.get('selectedPlayer');
            //****this code sets limit for score*****
            var score = PlayersList.findOne(selectedPlayer).score;
            score = parseInt(score);
            Session.set('playerCurScore', score);
            var playerCurScore = Session.get('playerCurScore')
            if ( playerCurScore >= 50 ) {
                give = 0;
            }
            else {
                give = 5;
            }
            Meteor.call('modifyPlayerScore', selectedPlayer, give, playerCurScore);
        },
        /*'mouseover .increment': function(){
                 mouseover experiment
                si = setInterval(function(){
                var selectedPlayer = Session.get('selectedPlayer');
                PlayersList.update(selectedPlayer, {$inc: {score: 5}})}, 100);
                console.log("your mouse is now over the increment button:)")
        },
        'mouseleave .increment': function(){
            console.log("left increment");
            clearInterval(si);
                */
        //        si = "";

        /*        'blur .increment': function(){
                    console.log("not over increment");
                    clearInterval(si);
        },
        */
        'click .decrement': function(){
            var selectedPlayer = Session.get('selectedPlayer');
            Meteor.call('modifyPlayerScore', selectedPlayer, -5);
        },
        'click .remove': function(){
            var selectedPlayer = Session.get('selectedPlayer');
            Meteor.call('removePlayerData', selectedPlayer);
            //var confirmPlayer = PlayersList.findOne(selectedPlayer).name;
            //console.log(confirmPlayer);
            //if(confirm("Are you positive you want to remove "+confirmPlayer+"?"))
            //PlayersList.remove(selectedPlayer);
        }

        //    newPlayer = prompt("what is your name?", "Rob");
         //  if(newPlayer != PlayersList.find())
            //alert(newPlayer + " is the the house!!!!");
        //PlayersList.insert({ name: newPlayer, score: 100});
        // event goes here

    })

    Template.addPlayerForm.events({
        'submit form': function(event){
            event.preventDefault();
            var playerNameVar = event.target.playerName.value;
            var playerScoreVar = event.target.quantity.value;
            var parsedScore = parseInt(playerScoreVar);
            Meteor.call('insertPlayerData', playerNameVar, parsedScore);
            // event.target.playerName.value = null;
            // event.target.quantity.value = null;
        }
    });
    Meteor.subscribe('thePlayers');
}

if(Meteor.isServer){
    // this code only runs on the server
    Meteor.publish('thePlayers', function(){
        var currentUserId = this.userId;
        return PlayersList.find({createdBy: currentUserId})
    });

    Meteor.methods({
        /* this gets the users IP Address
        'sendIpAddress': function(){
            clientIP = this.connection.clientAddress;
            console.log(clientIP);
        }
        */

        'insertPlayerData': function(playerNameVar, parsedScore){
            var currentUserId = Meteor.userId();
            PlayersList.insert({
                name: playerNameVar,
                score: parsedScore,
                createdBy: currentUserId
            });
        },

        'removePlayerData': function(selectedPlayer){
            var currentUserId = Meteor.userId();
            PlayersList.remove({_id: selectedPlayer, createdBy: currentUserId});

        },

        'modifyPlayerScore': function(selectedPlayer, scoreValue, playerCurScore){
            var currentUserId = Meteor.userId();
            PlayersList.update( {_id: selectedPlayer, createdBy: currentUserId},
                                {$inc: {score: scoreValue} });


        }
    });
}
