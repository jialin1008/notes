function showNumAnimation(i,j,Number){
    $("#number-cell-"+i+"-"+j)
        .text(Number)
        .css({
            background:getNumberBackgroundColor(Number),
            color: getNumberColor(Number)
        }).animate({
            width:"100px",
            height:"100px",
            top:getPosTop(i,j),
            left:getPosLeft(i,j)
        },50)
}