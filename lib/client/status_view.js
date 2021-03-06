define(['icanhaz', 'lib/constants'], function(ICanHaz, C) {
  var StatusView = function() {
    var $status;
    var pluralize = function(value, noun) {
      if (value === 1) {
        return value + " " + noun;
      }
      return value + " " + noun + "s"; // TODO support other noun forms
    };
    var displayStatusText = function(data) {
      $status.text('');
      var $message = ich.status(data);
      $status.append($message);
    };
    var displayKilledInsurgents = function(count) {
      $("#killed_insurgents").show();
      $("#killed_insurgents #count").text(count);
    };
    var displayReserveInsurgents = function(count) {
      $("#reserve_insurgents").show();
      $("#reserve_insurgents #count").text(count);
    };
    var hideReserveInsurgents = function() {
      $("#reserve_insurgents").css('display', 'none');
    };
    var displayMovesLeft = function(count) {
      $('#moves_left').show();
      $('#moves_left #count').text(count);
    };
    var hideMovesLeft = function() {
      $('#moves_left').hide();
    }
    return {
      init: function($container) {
        $status = $container;
        displayStatusText({msg:"Connecting to server..."});
      },
      render: function(currentPhase, currentTurn, currentRole, killedInsurgents, reserveInsurgents, isPlayback) {
        var _class;
        var msg;
        if (currentPhase === C.SETUP) {
          if (currentRole === C.STATE) {
            _class = "opponents_move";
          } else {
            _class = "setup";
            //display how many more insurgents need to get placed during setup
            var numRemToPlace = reserveInsurgents - (C.MAX_INSURGENTS-C.INITIAL_INSURGENTS);
            msg = "SETUP: PLACE " + pluralize(numRemToPlace, 'more INSURGENT').toUpperCase();
          }
        } else if (currentPhase === C.PLAYING) {
          _class = currentTurn === currentRole ? "your_move" : "opponents_move";
        } else if (currentPhase === C.GAMEOVER) {
          _class = "gameover";
        } else {
          throw "Invalid phase: " + currentPhase;
        }

        displayStatusText({_class:_class, msg:msg});
        displayKilledInsurgents(killedInsurgents);
        if (isPlayback || currentRole === C.INSURGENT) {
          displayReserveInsurgents(reserveInsurgents);
        } else {
          hideReserveInsurgents();
        }
      },
      displayMovesLeft: function(count) {
        displayMovesLeft(count);
      },
      hideMovesLeft: function() {
        hideMovesLeft();
      }
    };
  };

  return StatusView;
});
