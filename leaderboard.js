    PlayersList = new Mongo.Collection('players');
    var si = "";

console.log("Hello World");

if(Meteor.isClient){
    // this code only runs on the client
    Template.leaderboard.helpers({
        'player': function(){
            var currentUserId = Meteor.userId();
            return PlayersList.find({createdBy: currentUserId}, {sort: {score: -1, name: 1} })
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
        'mouseover .increment': function(){
                si = setInterval(function(){
                var selectedPlayer = Session.get('selectedPlayer');
                PlayersList.update(selectedPlayer, {$inc: {score: 5}})}, 100);
                console.log("your mouse is now over the increment button:)")
        },
        'mouseleave .increment': function(){
            console.log("left increment");
            clearInterval(si);
        //        si = "";

        /*        'blur .increment': function(){
                    console.log("not over increment");
                    clearInterval(si);
        */
        },
        'click .decrement': function(){
            var selectedPlayer = Session.get('selectedPlayer');
            PlayersList.update(selectedPlayer, {$inc: {score: -500}});
            console.log(selectedPlayer);
        },
        'click .remove': function(){
            var selectedPlayer = Session.get('selectedPlayer');
            var confirmPlayer = PlayersList.findOne(selectedPlayer).name;
            console.log(confirmPlayer);
            if(confirm("Are you positive you want to remove "+confirmPlayer+"?"))
            PlayersList.remove(selectedPlayer);
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
            var currentUserId = Meteor.userId();
            PlayersList.insert({
                name: playerNameVar,
                score: parsedScore, createdBy: currentUserId
            });
            event.target.playerName.value = null;
            event.target.quantity.value = null;
        }
    });
}

if(Meteor.isServer){
    // this code only runs on the server
}
