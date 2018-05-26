var multiPlayer=false;
var p1score=0;
var p2score=0;
var isPlayer1;
var isPlayer2;
var player1='';
var player2='';
var board=[1,2,3,4,5,6,7,8,9];//unique values to avoid win condition initially
var dupBoard=[0,0,0,0,0,0,0,0,0];//duplicate board for program logic
var selectedIndex;
//setBoard
board.forEach(function(box,idx){
$(".container").append('<div id='+idx+' class="box item">'+'</div>') 
});

beforeInit();//ask single player or two player

function beforeInit(){
  $('#ask').hide();
  $('#players').off('click').on('click',function(e){
  console.log(e);
  var numPlayers = e.target.outerText;
        if(numPlayers=='1 player'){
            multiPlayer=false;
            init();
        }else{
            multiPlayer=true;
            init();
        }
  });//end of click
}//end of beforeInit

function init(){
  $('#players').hide();
  $('#ask').show();
  $('#ask').off('click').on('click',function(event){
  // console.log(event);
  var icon=event.target.outerHTML;
  $('.askhooman').hide();
 
    if(icon=='<i class="fa fa-smile-o" aria-hidden="true"></i>'){//main player
    player2='<i class="fa fa-heart-o" aria-hidden="true"></i>';
    player1='<i class="fa fa-smile-o" aria-hidden="true"></i>';//player1 is main player
    whoStarts(player1.toString(),player2.toString());
    }else{
    player2='<i class="fa fa-smile-o" aria-hidden="true"></i>';
    player1='<i class="fa fa-heart-o" aria-hidden="true"></i>';
    whoStarts(player1.toString(),player2.toString());
    }  
  });//end of click
}// end of init
  
 //randomize starting turn
function whoStarts(player1,player2){
  var randomNum=Math.random(0,1);
  if(randomNum>0.5){//first turn is p1 if 2player game or human if 1player game when num>0.5
    hoomanPlays(player1,player2);//p1,p2
    isPlayer1=true;//p1
    isplayer2=false;//p2
  }else{//num<0.5
           if(!multiPlayer){
              computerPlays(player1,player2);//in 1player game,first turn to computer when num<0.5
           }else{//in 2player game, first turn to p2 when num<0.5
              hoomanPlays(player2,player1);
              isPlayer1=false;//p1
              isPlayer2=true;//p2
           }
  }
  }
//display current board indices and values
function showBoard(){
  console.log("-------board-------");
  for(var j=0; j<board.length ;j++){
  console.log('index '+j+" has value: "+board[j]);
  }  
}

//human's turn
function hoomanPlays(p1,p2){//pass p1,p2 when hoo=true,com=false otherwise interchange
  // console.log("in humanplays "+hooman);
  $('.turn').html("hooman's turn : "+p1);//present player
  $('.box').off('click').on("click",function(){
  var clickedIndex = parseInt(this.id); //grab id of box
  // console.log("clickedIndex by user: "+clickedIndex);
  if(!dupBoard.includes(clickedIndex+1)){//if the index is not present in duplicateboard,set that index to value
  dupBoard[clickedIndex] = clickedIndex+1;
  //to display icon on board
        if(!multiPlayer){
          board[clickedIndex]='o';//if not 2player display directly
          $('#'+parseInt(this.id)).html(p1);
        }else{
               if(isPlayer1){// if p1 is playing, set to o and change to p2
                     board[clickedIndex]='o';
                     $('#'+parseInt(this.id)).html(p1);
                     isPlayer1=false;
                     isPlayer2=true;
               }else{
                      board[clickedIndex]='x';//if p2 is playing,set to x and change to p1
                      $('#'+parseInt(this.id)).html(p1);
                      isPlayer1=true;
                      isPlayer2=false;
                     }
        }
         if(winCheck()){
           if(!multiPlayer){
              $(".turn").html('Congratulations,hooman you win'+p1);
               setp1Score(p1,p2);
             
           }else{
            if(p1=='<i class="fa fa-smile-o" aria-hidden="true"></i>'){
              p1score+=1;
              $('#score1').html('<i class="fa fa-smile-o" aria-hidden="true"></i>'+p1score);
              $('#score2').html('<i class="fa fa-heart-o" aria-hidden="true"></i>'+p2score)
            }else if(p1=='<i class="fa fa-heart-o" aria-hidden="true"></i>'){
              p2score+=1;
              $('#score1').html('<i class="fa fa-smile-o" aria-hidden="true"></i>'+p1score);
              $('#score2').html('<i class="fa fa-heart-o" aria-hidden="true"></i>'+p2score)
            }
         
           }
    //after setting score replay
                $('.box').off('click');
                // playAgain(hooman,computer);
           setTimeout(playAgain, 2000,p1,p2);
         }else if(dupBoard.includes(0)){
               if(!multiPlayer){
               computerPlays(p1,p2);//in 1player  game next turn to computer to get random index
               }else{
               hoomanPlays(p2,p1);//interchange p1,p2 for every new turn
               }
         }else{
         // console.log('board full');
               $('.turn').html("Well played! It's a draw");
               $('.box').off('click');
               // playAgain(hooman,computer);
              setTimeout(playAgain,2000,p1,p2);
         }
    
    
}else{
  hoomanPlays(p1,p2);//if clicked index is already in dupboard, ask to reselect until valid clickedindex is provided
}
});
}
//only in 1player game,a random index is to be selected by computer
//computer has to pick a random position on board
function selectIndex(computer){
var max=8;
var min=0;  
selectedIndex=Math.floor(Math.random() * (max - min + 1)) + min;
      if(!dupBoard.includes(selectedIndex+1)){
      dupBoard[selectedIndex]=selectedIndex+1;
      board[selectedIndex]='x';
      $('#'+selectedIndex).html(computer);
      // console.log("dupBoard: "+dupBoard);
      // showBoard(); 
    }
  else{
      selectIndex(computer);
}
}
//computer's turn onnly in 1player game
function computerPlays(hooman,computer){
  // $('.turn').html("computer's turn : "+computer);
  selectIndex(computer.toString());//pick a random position on board
  if(winCheck()){
    // console.log("computer wins");
    $('.turn').html('you lose hooman!'+hooman);
    p2score+=1;
    console.log(p2score);
    $('#score2').html(computer+p2score.toString());
    $('#score1').html(hooman+p1score.toString());
    $('.box').off('click');
    // playAgain(hooman,computer);
    setTimeout(playAgain,2000,hooman,computer);
  }
 else if(dupBoard.includes(0)){
    hoomanPlays(hooman,computer);   
  }else{
    // console.log('board full');
    $('.turn').html("Well played! It's a draw");
    $('.box').off('click');
    // playAgain(hooman,computer);
    setTimeout(playAgain,2000,hooman,computer);
  }
}
//reset
function reset(){
  resetBoard();
  beforeInit(); 
}
function resetBoard(){
   selectedIndex='';
   clickedIndex='';
   $('.box').remove();
   board=[1,2,3,4,5,6,7,8,9];
   dupBoard=[0,0,0,0,0,0,0,0,0];
   board.forEach(function(box,idx){
   $(".container").append('<div id='+idx+' class="box item">'+'</div>') 
});
}

$("#reset").on("click",function(){ //reset all variables and then set board and start over
   p1score=0;
   p2score=0;
   $('#players').show();
   $('.askhooman').show();
   $('.turn').html('');
   player1='';
   player2='';
   multiPlayer=false;
   $('#score2').html(player1+p1score.toString());
   $('#score1').html(player2+p2score.toString());
   reset();
})
function playAgain(p1,p2){//keep track of scores and icons
  resetBoard();//clear the board but persist icons and other variable values
  whoStarts(p1,p2);//continue the game again
}

function winCheck(){
  if(board[0]==board[1]&&board[1]==board[2]){
    $('#0').addClass('won');
    $('#1').addClass('won');
    $('#2').addClass('won');
    return true;
  }else if(board[3]==board[4]&&board[4]==board[5]){
    $('#3').addClass('won');
    $('#4').addClass('won');
    $('#5').addClass('won');
    return true;
  }else if(board[6]==board[7]&&board[7]==board[8]){
    $('#6').addClass('won');
    $('#7').addClass('won');
    $('#8').addClass('won');
    return true; 
  }else if(board[0]==board[3]&&board[3]==board[6]){
    $('#0').addClass('won');
    $('#3').addClass('won');
    $('#6').addClass('won');
    return true;
  }else if(board[1]==board[4]&&board[4]==board[7]){
    $('#7').addClass('won');
    $('#4').addClass('won');
    $('#1').addClass('won');
    return true; 
   }else if(board[2]==board[5]&&board[5]==board[8]){
    $('#8').addClass('won');
    $('#2').addClass('won');
    $('#5').addClass('won');
    return true;
  }else if(board[0]==board[4]&&board[4]==board[8]){
    $('#0').addClass('won');
    $('#8').addClass('won');
    $('#4').addClass('won');
    return true;
  }else if(board[2]==board[4]&&board[4]==board[6]){
    $('#4').addClass('won');
    $('#2').addClass('won');
    $('#6').addClass('won');
   return true; 
  }else{
   return false;
   }
}

function setp1Score(){
   // $('.turn').html('Congratulations, you won hooman!'+hooman);
                p1score+=1;
                console.log('in setp1score'+player1);
                console.log("score1: "+p1score+"    score2: "+p2score);
                $('#score1').html(player1+p1score.toString());
                $('#score2').html(player2+p2score.toString());
}

function setScores(hooman,computer){
              if(hooman=='<i class="fa fa-smile-o" aria-hidden="true"></i>'){
              p1score+=1;
              $('#score1').html('<i class="fa fa-smile-o" aria-hidden="true"></i>'+p1score)
            }else if(hooman=='<i class="fa fa-heart-o" aria-hidden="true"></i>'){
              p2score+=1;
              $('#score2').html('<i class="fa fa-heart-o" aria-hidden="true"></i>'+p2score)
            }
}