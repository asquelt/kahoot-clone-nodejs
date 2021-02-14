var socket = io();

var params = jQuery.deparam(window.location.search); //Gets the id from url

var timer;

var time = 60;

//When host connects to server
socket.on('connect', function() {
    
    //Tell server that it is host connection from game view
    socket.emit('host-join-game', params);
});

socket.on('noGameFound', function(){
   window.location.href = '../../';//Redirect user to 'join game' page
});

socket.on('gameQuestions', function(data){
    document.getElementById('question').style.display = "block";
    document.getElementById('answer1').style.display = "block";
    document.getElementById('answer2').style.display = "block";
    document.getElementById('answer3').style.display = "block";
    document.getElementById('answer4').style.display = "block";
    document.getElementById('playersAnswered').style.display = "block";
    document.getElementById('timerText').style.display = "block";
    document.getElementById('secondsLeft').style.display = "inline";
    document.getElementById('secondsLeft').style.color = "black";

    document.getElementById('question').innerHTML = data.q1;
    document.getElementById('answer1').innerHTML = data.a1;
    document.getElementById('answer2').innerHTML = data.a2;
    document.getElementById('answer3').innerHTML = data.a3;
    document.getElementById('answer4').innerHTML = data.a4;
    var correctAnswer = data.correct;
    document.getElementById('questionNum').innerHTML = "Pytanie: " + data.qn + " / " + data.qt;
    document.getElementById('playersAnswered').innerHTML = "Odpowiedziało: 0 / " + data.playersInGame;
    updateTimer();
});

socket.on('updatePlayersAnswered', function(data){
   document.getElementById('playersAnswered').innerHTML = "Odpowiedziało: " + data.playersAnswered + " / " + data.playersInGame; 
});

socket.on('questionOver', function(playerData, correct){
    clearInterval(timer);
    var answer1 = 0;
    var answer2 = 0;
    var answer3 = 0;
    var answer4 = 0;
    var total = 0;
    //Hide elements on page
    document.getElementById('playersAnswered').style.display = "none";
    document.getElementById('timerText').style.display = "none";
    
    //Shows user correct answer with effects on elements
    if(correct == 1){
        document.getElementById('answer2').style.filter = "grayscale(75%)";
        document.getElementById('answer3').style.filter = "grayscale(75%)";
        document.getElementById('answer4').style.filter = "grayscale(75%)";
        var current = document.getElementById('answer1').innerHTML;
        document.getElementById('answer1').innerHTML = "&#10004" + " " + current;
    }else if(correct == 2){
        document.getElementById('answer1').style.filter = "grayscale(75%)";
        document.getElementById('answer3').style.filter = "grayscale(75%)";
        document.getElementById('answer4').style.filter = "grayscale(75%)";
        var current = document.getElementById('answer2').innerHTML;
        document.getElementById('answer2').innerHTML = "&#10004" + " " + current;
    }else if(correct == 3){
        document.getElementById('answer1').style.filter = "grayscale(75%)";
        document.getElementById('answer2').style.filter = "grayscale(75%)";
        document.getElementById('answer4').style.filter = "grayscale(75%)";
        var current = document.getElementById('answer3').innerHTML;
        document.getElementById('answer3').innerHTML = "&#10004" + " " + current;
    }else if(correct == 4){
        document.getElementById('answer1').style.filter = "grayscale(75%)";
        document.getElementById('answer2').style.filter = "grayscale(75%)";
        document.getElementById('answer3').style.filter = "grayscale(75%)";
        var current = document.getElementById('answer4').innerHTML;
        document.getElementById('answer4').innerHTML = "&#10004" + " " + current;
    }
    
    for(var i = 0; i < playerData.length; i++){
        if(playerData[i].gameData.answer == 1){
            answer1 += 1;
        }else if(playerData[i].gameData.answer == 2){
            answer2 += 1;
        }else if(playerData[i].gameData.answer == 3){
            answer3 += 1;
        }else if(playerData[i].gameData.answer == 4){
            answer4 += 1;
        }
        total += 1;
    }

    document.getElementById('square1').innerHTML = answer1;
    document.getElementById('square2').innerHTML = answer2;
    document.getElementById('square3').innerHTML = answer3;
    document.getElementById('square4').innerHTML = answer4;
    
    //Gets values for graph
    answer1 = answer1 / total * 100+ 10;
    answer2 = answer2 / total * 100 + 10;
    answer3 = answer3 / total * 100 + 10;
    answer4 = answer4 / total * 100 + 10;
    
    document.getElementById('square1').style.display = "table-cell";
    document.getElementById('square2').style.display = "table-cell";
    document.getElementById('square3').style.display = "table-cell";
    document.getElementById('square4').style.display = "table-cell";
    
    document.getElementById('square1').style.height = answer1 + "px";
    document.getElementById('square2').style.height = answer2 + "px";
    document.getElementById('square3').style.height = answer3 + "px";
    document.getElementById('square4').style.height = answer4 + "px";
    
    document.getElementById('nextQButton').style.display = "block";
    document.getElementById('getStatsButton').style.display = "block";
    
});

function getStats(){
    socket.emit('GetStats'); //Tell server to get stats
}

function nextQuestion(){
    document.getElementById('nextQButton').style.display = "none";
    document.getElementById('getStatsButton').style.display = "none";
    document.getElementById('square1').style.display = "none";
    document.getElementById('square2').style.display = "none";
    document.getElementById('square3').style.display = "none";
    document.getElementById('square4').style.display = "none";
    
    document.getElementById('answer1').style.filter = "none";
    document.getElementById('answer2').style.filter = "none";
    document.getElementById('answer3').style.filter = "none";
    document.getElementById('answer4').style.filter = "none";
    
    document.getElementById('winnerTitle').style.display = "none";
    document.getElementById('winner1').style.display = "none";
    document.getElementById('winner2').style.display = "none";
    document.getElementById('winner3').style.display = "none";
    document.getElementById('winner4').style.display = "none";
    document.getElementById('winner5').style.display = "none";

    document.getElementById('playersAnswered').style.display = "block";
    document.getElementById('timerText').style.display = "block";
    document.getElementById('secondsLeft').style.display = "inline";
    document.getElementById('secondsLeft').style.color = "black";
    document.getElementById('secondsLeft').innerHTML = " 60";
    socket.emit('nextQuestion'); //Tell server to start new question
}

function updateTimer(){
    time = 60;
    timer = setInterval(function(){
        time -= 1;
        if (time<0) {
            time = 0
        }
        document.getElementById('secondsLeft').textContent = " " + time;
        if (time<=5) {
            document.getElementById('secondsLeft').style.color = "red";
        }
        if(time == 0){
            socket.emit('timeUp');
        }
    }, 1000);
}
socket.on('GameOver', function(data){
    if (data.final) {
    document.getElementById('nextQButton').style.display = "none";
    document.getElementById('getStatsButton').style.display = "none";
    document.getElementById('winnerTitle').style.display = "block";
    document.getElementById('winnerTitle').innerHTML = "Zwycięzcy!";
    } else {
    document.getElementById('nextQButton').style.display = "block";
    document.getElementById('getStatsButton').style.display = "none";
    document.getElementById('winnerTitle').style.display = "block";
    document.getElementById('winnerTitle').innerHTML = "Jak Wam idzie?";
    }

    document.getElementById('square1').style.display = "none";
    document.getElementById('square2').style.display = "none";
    document.getElementById('square3').style.display = "none";
    document.getElementById('square4').style.display = "none";
    
    document.getElementById('answer1').style.display = "none";
    document.getElementById('answer2').style.display = "none";
    document.getElementById('answer3').style.display = "none";
    document.getElementById('answer4').style.display = "none";
    document.getElementById('timerText').style.display = "none";
    document.getElementById('question').innerHTML = "DOBRA ROBOTA!";
    document.getElementById('playersAnswered').innerHTML = "";
    
    
    
    if (data.num1.score > 0) {
    document.getElementById('winner1').style.display = "block";
    }
    if (data.num2.score > 0) {
    document.getElementById('winner2').style.display = "block";
    }
    if (data.num3.score > 0) {
    document.getElementById('winner3').style.display = "block";
    }
    if (data.num4.score > 0) {
    document.getElementById('winner4').style.display = "block";
    }
    if (data.num5.score > 0) {
    document.getElementById('winner5').style.display = "block";
    }

    //Gets values for graph
    len1 = 100;
    len2 = data.num2.score / data.num1.score * 100;
    len3 = data.num3.score / data.num1.score * 100;
    len4 = data.num4.score / data.num1.score * 100;
    len5 = data.num5.score / data.num1.score * 100;
    
    document.getElementById('winner1').style.width = len1*5 + "px";
    document.getElementById('winner2').style.width = len2*5 + "px";
    document.getElementById('winner3').style.width = len3*5 + "px";
    document.getElementById('winner4').style.width = len4*5 + "px";
    document.getElementById('winner5').style.width = len5*5 + "px";
    
    document.getElementById('winner1').innerHTML = "1. " + data.num1.name + " (" + data.num1.score + ")";
    document.getElementById('winner2').innerHTML = "2. " + data.num2.name + " (" + data.num2.score + ")";
    document.getElementById('winner3').innerHTML = "3. " + data.num3.name + " (" + data.num3.score + ")";
    document.getElementById('winner4').innerHTML = "4. " + data.num4.name + " (" + data.num4.score + ")";
    document.getElementById('winner5').innerHTML = "5. " + data.num5.name + " (" + data.num5.score + ")";
});



socket.on('getTime', function(player){
    socket.emit('time', {
        player: player,
        time: time
    });
});




















