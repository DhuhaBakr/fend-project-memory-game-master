let deck = [
  "fa fa-diamond",
  "fa fa-paper-plane-o",
  "fa fa-anchor",
  "fa fa-bolt",
  "fa fa-cube",
  "fa fa-anchor",
  "fa fa-leaf",
  "fa fa-bicycle",
  "fa fa-diamond",
  "fa fa-bomb",
  "fa fa-leaf",
  "fa fa-bomb",
  "fa fa-bolt",
  "fa fa-bicycle",
  "fa fa-paper-plane-o",
  "fa fa-cube"];

let open = [];
let matched = 0;
let moveCounter = 0;
let numOfStars = 3;
let strtTime = false;
let seconds = 0;

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// to calculate max number of moves for each star
function Move(){
  moveCounter++;
  $(".moves").html(moveCounter);
  if (moveCounter === 14 || moveCounter === 20){
    reduceStar();
  }
}

// to reduce number of star after some number of moves
function reduceStar(){
  $(".fa-star").last().attr("class", "fa fa-star-o");
  numOfStars--;
}


// to resets timer state and restarts timer
function resetTimer() {
  clearInterval(timer);
  seconds = 0;
  strtTime = false;
  $(".time").text("0:00");
}

// to randomizes cards on board and updates card HTML
function updateCards() {
  deck = shuffle(deck);
  let index = 0;
  $.each($(".card i"), function() {
    $(this).attr("class", "fa " + deck[index]);
    index++;
  });
}

// to restores star icons to 3 stars, updates modal HTML
function resetStars() {
  $(".fa-star-o").attr("class", "fa fa-star");
  numOfStars = 3;
}


// to checks if card is a valid move
function isValid(card) {
  return !(card.hasClass("open") || card.hasClass("match"));
}


// to sets currently open cards to the match state, checks win condition
let setMatch = function() {
  open.forEach(function(card) {
    card.addClass("match");
  });
  open = [];
  matched += 2;

  if (matched === 16) {
    clearInterval(timer);
    if (confirm('Congratulations! \n You end the game in '+strtTime+ ' \n With '+ numOfStars + ' stars \n And '+ moveCounter + ' moves.\n play again ?')) {
      resetGame();
    }
    else {}
  }
};

// to sets currently open cards back to default state
let resetOpen = function() {
  open.forEach(function(card) {
    card.toggleClass("open show");
  });
  open = [];
};

// to sets selected card to the open and shown state
function openCard(card) {
  if (!card.hasClass("open")) {
    card.addClass("open show");
    open.push(card);
  }
}

// to resets all game state variables and resets all required HTML to default state
let resetGame = function() {
  open = [];
  matched = 0;
  moveCounter = -1;
  resetTimer();
  Move();
  $(".card").attr("class", "card");
  updateCards();
  resetStars();
};

// to handles primary game logic of game
let onClick = function() {
  if (strtTime === false) {
    timer = setInterval(function() { // from http://logicalmoon.com/2015/05/using-javascript-to-create-a-timer/
      seconds ++;
      function zeros(seconds) { // from http://matthewbibby.com/countdown/
        if (seconds < 10) {
          seconds = "0" + seconds;
        }
        return seconds;
      }
      strtTime = parseInt(seconds / 60)+":"+ zeros(seconds % 60);
      $(".time").html(strtTime);
    },1000);

    strtTime = true;
  }
  if (isValid($(this))) {
    if (open.length === 0) {
      openCard($(this));
    } 
    else if (open.length === 1) {
      openCard($(this));
      Move();

      if (open[0].children().attr("class") === open[1].children().attr("class")) {
        setTimeout(setMatch, 300);
      }
      else {
        setTimeout(resetOpen, 700);
      }
    }
  }
};

$(".card").click(onClick);
$(".restart").click(resetGame);
$(updateCards);
