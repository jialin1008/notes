

var board = new Array();
var hasConflicted = new Array();
var score = 0,
    scoreAdd = 0;
var deviceWidth = window.screen.availWidth,
  cellWrap = deviceWidth * 0.92,
  borderRadius = deviceWidth * 0.02,
  cellSideLength = 0.18 * deviceWidth,
  cellSpace = 0.04 * deviceWidth;
var startX=0,startY=0,endX=0,endY=0;

$(document).ready(function(){
  prepareForMobile();
  newGame();
});
function prepareForMobile(){

  if(deviceWidth>640){
    cellWrap = 500 ;
    cellSideLength = 100 ;
    borderRadius = 6;
    cellSpace = 20;

  }
  $(".cell-wrap").css({"width":cellWrap,"height":cellWrap,"border-radius":borderRadius});
  $(".grid-cell").css({"width":cellSideLength,"height":cellSideLength,"border-radius":borderRadius})
  $("header").css({"width":cellWrap});



}
function newGame(){
  //初始化棋盘格
  init();
  //在随机两个格子生成数字
  generateRandom();
  generateRandom();
}

function init(){
  for( var i = 0 ; i < 4 ; i ++ )
    for( var j = 0 ; j < 4 ; j ++ ){

      var gridCell = $('#grid-cell-'+i+"-"+j);

      gridCell.css('top', getPosTop( i , j )  );
      gridCell.css('left', getPosLeft( i , j )  );
    }

  for( var i = 0 ; i < 4 ; i ++ ){
    board[i] = new Array();
    hasConflicted[i] = new Array();

    for( var j = 0 ; j < 4 ; j ++ ){
      board[i][j] = 0;
      hasConflicted[i][j] = false;
    }
  }

  updateBoardView();
}

function updateBoardView(){
  $(".number-cell").remove();
  for( var i = 0 ; i < 4 ; i ++ )
    for( var j = 0 ; j < 4 ; j ++ ){
      hasConflicted[i][j] = false;
      $(".cell-wrap").append( '<div class="number-cell"  id="number-cell-'+i+'-'+j+'"></div>' );
      var theNumberCell = $('#number-cell-'+i+'-'+j);

      if( board[i][j] == 0 ){
        theNumberCell.css('width','0px');
        theNumberCell.css('height','0px');
        theNumberCell.css('top',getPosTop(i,j) + 50 );
        theNumberCell.css('left',getPosLeft(i,j) + 50 );
      }
      else{
        theNumberCell.css('width',cellSideLength);
        theNumberCell.css('height',cellSideLength);
        theNumberCell.css( 'lineHeight',cellSideLength+"px")
        theNumberCell.css('top',getPosTop(i,j));
        theNumberCell.css('left',getPosLeft(i,j));
        theNumberCell.css('background-color',getNumberBackgroundColor( board[i][j] ) );
        theNumberCell.css('color',getNumberColor( board[i][j] ) );
        theNumberCell.text( board[i][j] );
      }
    }
  $("#score").text(score);
  if(scoreAdd != 0){
      $(".scoreAdd").remove();
      $("<p class='scoreAdd'></p>").text("+"+scoreAdd).appendTo(".score")
      scoreAdd = 0;
  }

}
function generateRandom(){
  //随机生成一个位置
  var randomX = parseInt(Math.random()*4);
  var randomY = parseInt(Math.random()*4);

  while(true){
    if(board[randomX][randomY] == 0){
      break;
    }
    randomX = parseInt(Math.random()*4);
    randomY = parseInt(Math.random()*4);
  }
  var randomNum = Math.random()<0.5?2:4;
  board[randomX][randomY] = randomNum;
  showNumAnimation(randomX,randomY,randomNum);

}
$(document).keydown(function(event){
  switch (event.keyCode){
    case 37://left
      if(moveLeft()){
        setTimeout("generateRandom()",210)
        setTimeout("isGameOver()",300)
      }
      break;
    case 38://up
      if(moveUp()){
        setTimeout("generateRandom()",210)
        setTimeout("isGameOver()",300)
      }
      break;
    case 39://right
      if(moveRight()){
        setTimeout("generateRandom()",210)
        setTimeout("isGameOver()",300)
      }
      break;
    case 40://down
      if(moveDown()){
        setTimeout("generateRandom()",210)
        setTimeout("isGameOver()",300)
      }
      break;
    default :
      break

  }
})
document.addEventListener("touchstart",function(event){
  startX = event.touches[0].pageX;
  startY = event.touches[0].pageY;
})
document.addEventListener("touchend",function(event){
  endX = event.changedTouches[0].pageX;
  endY = event.changedTouches[0].pageY;
  var deltaX = endX - startX;
  var deltaY = endY - startY;
  if( Math.abs(deltaX) < 0.1 * deviceWidth  && Math.abs(deltaY) <0.1 * deviceWidth )
    return ;

  if(Math.abs(deltaX) > Math.abs(deltaY)){
    if(deltaX<0){
      if(moveLeft()){
        setTimeout("generateRandom()",210)
        setTimeout("isGameOver()",300)
      }
    }else{
      if(moveRight()){
        setTimeout("generateRandom()",210)
        setTimeout("isGameOver()",300)
      }
    }
  }else{
    if(deltaY<0){
      if(moveUp()){
        setTimeout("generateRandom()",210)
        setTimeout("isGameOver()",300)
      }
    }else{
      if(moveDown()){
        setTimeout("generateRandom()",210)
        setTimeout("isGameOver()",300)
      }
    }
  }
})
function moveLeft(){
  if(!canMoveLeft(board))
    return false;
  for(var i = 0;i<4;i++){
    for(var j =1;j<4;j++){
      if(board[i][j]!=0){
        for(var k = 0 ;k<j;k++){
          if(board[i][k]==0 && noBlockHorizontal(i,k,j,board) ){
            //move
            showMoveAnimation(i,j,i,k);
            board[i][k] = board[i][j];
            board[i][j] = 0;

            continue;
          }else if(board[i][k] == board[i][j] && noBlockHorizontal(i,k,j,board) && !hasConflicted[i][k]){
            //move
            //add
            showMoveAnimation(i,j,i,k);
            board[i][k] += board[i][j] ;
            score+=board[i][k];
            scoreAdd = board[i][k];
            board[i][j] = 0;
            hasConflicted[i][k] = true;
            continue;
          }
        }
      }

    }
  }
  setTimeout("updateBoardView()",200);
  return true;

}

function canMoveLeft(board){
  for (var i = 0; i<4 ; i++){
    for(var j =1;j<4 ;j++ ){
      if(board[i][j] != 0 ){
        if(board[i][j-1]==0 || board[i][j] == board[i][j-1])
          return true;
      }
    }
  }
  return false
}


function moveRight(){
  if(!canMoveRight(board))
    return false;
  for(var i = 0;i<4;i++){
    for(var j =2;j>=0;j--){
      if(board[i][j]!=0){
        for(var k = 3 ;k>j;k--){
          if(board[i][k]==0 && noBlockHorizontal(i,j,k,board)){
            //move
            showMoveAnimation(i,j,i,k);
            board[i][k] = board[i][j];
            board[i][j] = 0;
            continue;
          }else if(board[i][k] == board[i][j] && noBlockHorizontal(i,j,k,board) && !hasConflicted[i][k] ){
            //move
            //add
            showMoveAnimation(i,j,i,k);
            board[i][k] += board[i][j] ;
            board[i][j] = 0;
            score+=board[i][k];
            scoreAdd = board[i][k];
            hasConflicted[i][k] = true;
            continue;
          }
        }
      }
    }
  }
  setTimeout("updateBoardView()",200);
  return true;
}

function canMoveRight(board){
  for (var i = 0; i<4 ; i++){
    for(var j =2;j>=0 ;j-- ){
      if(board[i][j] != 0 ){
        if(board[i][j+1]==0 || board[i][j] == board[i][j+1])
          return true;
      }
    }
  }
  return false;
}


function moveUp(){
  if(!canMoveUp(board))
    return false;
  for(var i = 1;i<4;i++){
    for(var j =0;j<4;j++){
      if(board[i][j]!=0){
        for(var k = 0 ;k<i;k++){
          if(board[k][j]==0 && noBlockVertical(k,i,j,board)){
            //move
            showMoveAnimation(i,j,k,j);
            board[k][j] = board[i][j];
            board[i][j] = 0;
            continue;
          }else if(board[k][j] == board[i][j] &&  noBlockVertical(k,i,j,board) && !hasConflicted[k][j]){
            //move
            //add
            showMoveAnimation(i,j,k,j);
            board[k][j] += board[i][j] ;
            board[i][j] = 0;
            score+=board[k][j];
            scoreAdd = board[k][j];
            hasConflicted[k][j] = true;
            continue;
          }
        }
      }
    }
  }
  setTimeout("updateBoardView()",200);
  return true;

}

function canMoveUp(board){
  for (var i = 1; i<4 ;i++){
    for(var j =0;j<4 ;j++ ){
      if(board[i][j] != 0 ){
        if(board[i-1][j]==0 || board[i][j] == board[i-1][j])
          return true;
      }
    }
  }
  return false;
}



function moveDown(){
  if(!canMoveDown(board))
    return false;
  for(var i = 2;i>=0;i--){
    for(var j =0;j<4;j++){
      if(board[i][j]!=0){
        for(var k = 3 ;k>i;k--){
          if(board[k][j]==0 && noBlockVertical(i,k,j,board)){
            //move
            showMoveAnimation(i,j,k,j);
            board[k][j] = board[i][j];
            board[i][j] = 0;
            continue;
          }else if(board[k][j] == board[i][j] &&  noBlockVertical(i,k,j,board) && !hasConflicted[k][j]){
            //move
            //add
            showMoveAnimation(i,j,k,j);
            board[k][j] += board[i][j] ;
            board[i][j] = 0;
            score+=board[k][j];
            scoreAdd = board[k][j];
            hasConflicted[k][j] = true;
            continue;
          }
        }
      }
    }
  }
  setTimeout("updateBoardView()",200);
  return true;

}

function canMoveDown(board){
  for (var i = 2; i>=0 ;i--){
    for(var j =0;j<4 ;j++ ){
      if(board[i][j] != 0 ){
        if(board[i+1][j]==0 || board[i][j] == board[i+1][j])
          return true;
      }

    }
  }
  return false;
}


function isGameOver(){
  if(nospace(board) && !canMoveDown(board) && !canMoveUp(board) && !canMoveLeft(board) && !canMoveRight(board) ){
    alert("game over")
  }

}



