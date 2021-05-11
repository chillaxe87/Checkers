var whitePiece;
var blackPiece;
var availableKill;
var whiteTurn = true;
var rightPieceChosen = false;
var currentPosition;
var destination;
var message;
var thisClass;
var otherClass;
var troopToMove = [];
var troopToKill;
var isMoveMade;
var isBorder; 
var history = [];
var turnCount = 0;

function startMove(idNumber)
{
    var selectedPiece = document.getElementById(idNumber);
    availableKill = document.getElementsByClassName("availableKill");
    isMoveMade = false;
    if(!rightPieceChosen)
    {
        thisClass = whiteTurn? "whitePiece" : "blackPiece";
        otherClass = whiteTurn? "blackPiece": "whitePiece";
        thisClass = selectedPiece.className == "whiteKing" && whiteTurn? "whiteKing" : thisClass;
        thisClass = selectedPiece.className == "blackKing" && !whiteTurn? "blackKing" : thisClass;
    }
    if(selectedPiece.className != "available")
    {
        resetAvailableMove();
    }
    message = whiteTurn? "Blacks Turn!" : "White Turn!";
    currentPosition = selectedPiece.className == thisClass? idNumber : currentPosition;
    destination = selectedPiece.className != thisClass? idNumber: destination;
    thisClass = document.getElementById(currentPosition).className;
    play(selectedPiece);
    postMoveKingPlacement();
}
function postMoveKingPlacement()
{
    var currentType = "whitePiece";
    var upgradeType = "whiteKing";
    for(i = 0 ; i < 70 ; i = i + 69)
    {
        for(y = 11 ; y < 18 ; y = y + 2)
        {
           if(document.getElementById(i + y).className == currentType) 
           {
                document.getElementById(i + y).className = upgradeType;    
           }
        }
        currentType = "blackPiece";
        upgradeType = "blackKing";
    }
    var board = document.getElementsByTagName("button");
    for (i = 0; i <board.length; i++)
    {
        (board[i].className == "whiteKing" || board[i].className == "blackKing") ? board[i].innerHTML = "&#9812" : board[i].innerHTML ="";
    }
}
function isGameEnded()
{
    var gameEnded = false;
    whitePiece = document.getElementsByClassName("whitePiece").length + document.getElementsByClassName("whiteKing").length;
    blackPiece = document.getElementsByClassName("blackPiece").length + document.getElementsByClassName("blackKing").length;
    message = whitePiece == 0 ? "Black Won!" : message;
    message = blackPiece == 0 ? "White Won!" : message;
    if (document.getElementsByClassName("available").length == 0 && document.getElementsByClassName("availableKill").length == 0)
    {
        gameEnded = true;
        selectedPiece = whiteTurn? document.getElementsByClassName("whitePiece") : document.getElementsByClassName("blackPiece");
        for (y = 0 ; y < 2 && gameEnded ; y++)
        {
            for (var i = 0; i < selectedPiece.length && gameEnded; i++)
            {
                currentPosition = selectedPiece[i].id;
                markAvailableMove(selectedPiece[i]);
                gameEnded = document.getElementsByClassName("available").length == 0 ? true : false;
                resetAvailableMove();
            }
            selectedPiece = whiteTurn? document.getElementsByClassName("whiteKing") : document.getElementsByClassName("blackKing");
        }
        if (gameEnded)
        {
            message = whiteTurn ? "Black Won!" : "White Won!";
            freezeBoard();
        }
    }
    message = isDraw() ? "Tie! " : message;
}
function isDraw()
{
    var record = "";
    var pieces = document.getElementsByClassName("whitePiece");
    for (y = 0; y < 2; y ++)
    {
        for (i = 0; i < pieces.length; i ++)
        {
            record += pieces[i].id;
        }
        pieces = document.getElementsByClassName("blackPiece");
    }
    history[turnCount] = record;
    record = 0;
    turnCount++;
    for (i = 1 ; i <= turnCount; i++)
    {
        if (history[i-1] == history[i])
        {
            record++
        }
        else
        {
            record = 0;
        }
        if (record == 15)
        {
            freezeBoard()
            return true;
        }
    }
    return false;
}
function freezeBoard()
{
    var board = document.getElementsByTagName("button");
    for (i = 0 ; i < board.length; i ++)
    {
        board[i].disabled = true;
    }
}
function play(selectedPiece)
{
    if (selectedPiece.className == thisClass)
    {
        rightPieceChosen = true;
        if(availableKill.length == 0)
        {
            markAvailableMove(selectedPiece);
        }
    }
    if(selectedPiece.className == "available")
    {
        document.getElementById(currentPosition).className = "empty";
        document.getElementById(destination).className = thisClass;
        resetAvailableMove();
        whiteTurn = !whiteTurn;
        markAvailableKill(0);
        isGameEnded();
        rightPieceChosen = false;
        document.getElementById("turn").innerHTML = message;
    }
    if(selectedPiece.className == "availableKill")
    {
        for (i = 0 ; i < troopToMove.length; i++)
        {
            if ((currentPosition - destination == 22 || currentPosition - destination == -22 || currentPosition - destination == 18 || currentPosition - destination == -18) && !isMoveMade)
            {
                troopToKill = (currentPosition - destination)/2 + destination;
                
                document.getElementById(currentPosition).className = "empty";
                document.getElementById(troopToKill).className = "empty";
                document.getElementById(destination).className = thisClass;
                isMoveMade = true;
            }
        }
        if(isMoveMade)       
        {
            troopToMove = [];
            troopToKill = null;       
            resetAvailableKill();
            markAvailableKill(destination);
            whiteTurn = troopToMove.length == 0? !whiteTurn : whiteTurn;
            message = whiteTurn? "White Turn!" : "Blacks Turn!";
            troopToMove.length == 0? markAvailableKill(0): null;
            isGameEnded();
            rightPieceChosen = false;
            document.getElementById("turn").innerHTML = message;
        } 
    }   
}
function markAvailableMove(selectedPiece)
{
    var thisLocation = parseInt(currentPosition).toString()
    var first = thisLocation[0];
    var second = thisLocation[1];
    whiteTurn? first--: first++;
    for (i = 0; i < 2 ; i ++)
    {
        second--;
        var destination = first + "" + second;
        if (first <= 8 && first >= 1)
        {
            if (second >= 0 && document.getElementById(destination).className == "empty")
            {
                document.getElementById(destination).className ="available";
            }
            second += 2;
            var destination = first + "" + second;
            if(second <= 7 && document.getElementById(destination).className == "empty")
            {
                document.getElementById(destination).className = "available";
            }
        }
        if(selectedPiece.className == "whitePiece" || selectedPiece.className == "blackPiece")
        {
            i++;
        }
        else
        {
            second = thisLocation[1];
            first = whiteTurn?  first + 2: first - 2;
        }
    }

    
}
function resetAvailableMove()
{
    var resetAvailable = document.getElementsByClassName("available");
    for (i = 0; i < resetAvailable.length ;)
    {
        document.getElementsByClassName("available").className = "empty";
        resetAvailable[i].className = "empty";
    }
    rightPieceChosen = false;
}
function resetAvailableKill()
{
    var resetAvailableKill = document.getElementsByClassName("availableKill");
    for (i = 0; i < resetAvailableKill.length ;)
    {
        resetAvailableKill[i].className = "empty";
    }
    rightPieceChosen = false;
}
function markAvailableKill(thisLocation)
{
    thisClass = whiteTurn? "whitePiece" : "blackPiece";
    otherClass = whiteTurn? "blackPiece": "whitePiece";
    var other;
    if(thisLocation == 0)
    {
        for(y = 0; y < 2 ; y++)
        {
            other = document.getElementsByClassName(thisClass);
            for (i = 0 ; i < other.length; i ++)
            {
                currentPosition = document.getElementsByClassName(thisClass)[i].id;
                upperRightKill();
                upperLeftKill();
                bottomRightKill();
                bottomLeftKill();      
            }
            thisClass = thisClass == "whitePiece"? "whiteKing": "blackKing";
        }
        currentPosition = 0;
    }
    else
    {
        currentPosition = thisLocation;
        upperRightKill();
        upperLeftKill();
        bottomRightKill();
        bottomLeftKill(); 
    }
}
function upperRightKill()
{
    var upperRight = currentPosition == 17 || currentPosition == 37 || currentPosition == 57 || currentPosition == 77? currentPosition: Number(currentPosition) - 9;
    isBorder = currentPosition < 20 ? true : false;
    if(!isBorder && (document.getElementById(upperRight).className == otherClass || document.getElementById(upperRight).className == (otherClass == "whitePiece" ? "whiteKing" : "blackKing")))
    {
        upperRight = upperRight == 17 || upperRight == 37 || upperRight == 57 || upperRight == 77? upperRight: upperRight - 9;
        isBorder = upperRight < 10 ? true : false;
        if(!isBorder && document.getElementById(upperRight).className == "empty")
        {
            document.getElementById(upperRight).className = "availableKill";
            troopToMove.push(currentPosition);
            troopToKill = upperRight + 9;
        }
    }
}
function upperLeftKill()
{
    var upperLeft = currentPosition == 20 || currentPosition == 40 || currentPosition == 60 || currentPosition == 80? currentPosition: Number(currentPosition) - 11;
    isBorder = currentPosition < 20 ? true : false;
    if(!isBorder && (document.getElementById(upperLeft).className == otherClass || document.getElementById(upperLeft).className == (otherClass == "whitePiece" ? "whiteKing" : "blackKing")))
    {
        upperLeft = upperLeft == 20 || upperLeft == 40 || upperLeft == 60 || upperLeft == 80? upperLeft: upperLeft - 11;
        isBorder = upperLeft < 10 ? true : false;
        if(!isBorder && document.getElementById(upperLeft).className == "empty")
        {
            document.getElementById(upperLeft).className = "availableKill";
            troopToMove.push(currentPosition);
            troopToKill = upperLeft + 11;
        }
    }
}
function bottomRightKill()
{
    var bottomRight = currentPosition == 17 || currentPosition == 37 || currentPosition == 57 || currentPosition == 77? currentPosition: Number(currentPosition) + 11;
    isBorder = currentPosition >=80 ? true : false;
    if(!isBorder && (document.getElementById(bottomRight).className == otherClass || document.getElementById(bottomRight).className == (otherClass == "whitePiece" ? "whiteKing" : "blackKing")))
    {
        bottomRight = bottomRight == 17 || bottomRight == 37 || bottomRight == 57 || bottomRight == 77? bottomRight: bottomRight + 11;
        isBorder = bottomRight >=90 ? true : false;
        if(!isBorder && document.getElementById(bottomRight).className == "empty")
        {
            document.getElementById(bottomRight).className = "availableKill";
            troopToMove.push(currentPosition);
            troopToKill = bottomRight - 11;
        }
    }
}
function bottomLeftKill()
{
    var bottomLeft = currentPosition == 20 || currentPosition == 40 || currentPosition == 60 || currentPosition == 80? currentPosition: Number(currentPosition) + 9;
    isBorder = currentPosition >= 80 ? true : false;
    if(!isBorder && (document.getElementById(bottomLeft).className == otherClass || document.getElementById(bottomLeft).className == (otherClass == "whitePiece" ? "whiteKing" : "blackKing")))
    {
        bottomLeft = bottomLeft == 20 || bottomLeft == 40 || bottomLeft == 60 || bottomLeft == 80? bottomLeft: Number(bottomLeft) + 9;
        isBorder = bottomLeft >= 90 ? true : false;
        if(!isBorder && document.getElementById(bottomLeft).className == "empty")
        {
            document.getElementById(bottomLeft).className = "availableKill";
            troopToMove.push(currentPosition);
            troopToKill = bottomLeft - 9;
        }
    }
}





