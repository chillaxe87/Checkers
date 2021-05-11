const checkers = [];
let selectedPiece;
let destinationPiece;
let thisClass;
let isWhiteTurn;
let isJumpAvailable;
let history = [];
function createCheckersBoardUI()
{
    let blackSquare = true;
    isWhiteTurn = true;
    let idNumber = 11;
    for (let i = 0 ; i < 8 ; i++)
    {
        const row = document.createElement("tr");
        row.id = i;
        document.getElementById("board").appendChild(row);
        for (let y = 0; y < 8; y++)
        {
            const square = document.createElement("td");
            const button = document.createElement("button");
            if(blackSquare)
            {
                square.className = "emptySpace";
                square.addEventListener("click", function () {resetAvailableMove()})       
                document.getElementById(i).appendChild(square);
            }
            else
            {
                document.getElementById(i).appendChild(square);
                if(i < 3)
                {
                    button.className = "blackPiece";  
                }
                else if(i > 4)
                {
                    button.className = "whitePiece";
                }
                else
                {
                    button.className = "empty";
                }
                button.id = idNumber;
                button.addEventListener("click", function(){startMove(this.id)})
                square.appendChild(button);
                idNumber +=2;
                let str = idNumber + "";
                if (str.charAt(1) == "9")
                {
                    idNumber += 1;
                }
                if (str.charAt(1) == "8")
                {
                    idNumber += 3;
                }
            }
            blackSquare = !blackSquare;
        }
        blackSquare = !blackSquare;
    }
    createCheckers();
} 
function createCheckers()
{
    let location = 11;
    for (i = 0; i < 32 ; i++)
    {
        if (i < 12)
        {
            checkers.push(new Checker(false,true,false,location, false));
        }
        else if (i > 19)
        {
            checkers.push(new Checker(true,true,false,location, true));
        }
        else
        {
            checkers.push(new Checker(false,false,false,location, false));
        }
        location +=2;
        let str = location + "";
        if (str.charAt(1) == "9")
        {
            location += 1;
        }
        if (str.charAt(1) == "8")
        {
            location += 3;
        }
    }

}
function Checker (isWhite, isAlive, isKing, location, isAvailable) 
{
    this.isWhite = isWhite;
    this.isAlive = isAlive;
    this.isKing = isKing;
    this.location = location;
    this.isAvailable = isAvailable;
}
function startMove(id)
{
    let unitToPlay = 0;
    while (unitToPlay < 32)
    {
        if(checkers[unitToPlay].location == id)
        {
            break;
        }
        unitToPlay++;
    }
    if (isJumpAvailable)
    {
        makeJump(unitToPlay)
    }
    else
    {
        if(checkers[unitToPlay].isAlive && checkers[unitToPlay].isWhite == isWhiteTurn)
        {
            resetAvailableMove();
            selectedPiece = unitToPlay;
            thisClass = document.getElementById(checkers[selectedPiece].location).className;    
            markAvailableMove();
        }
        if (!checkers[unitToPlay].isAlive && selectedPiece != null)
        {
            destinationPiece = unitToPlay;
            makeMove();
            isGameEnded()
        }
    }
    makeKing()
}
function makeJump(unitToPlay)
{
    destinationPiece = selectedPiece !=null && checkers[unitToPlay].isAvailable ? unitToPlay : null;
    selectedPiece = checkers[unitToPlay].isAlive && checkers[unitToPlay].isWhite == isWhiteTurn ? unitToPlay : selectedPiece;
    if (selectedPiece != null  && destinationPiece != null)
    {
        fromLocation = checkers[selectedPiece].location;
        toLocation = checkers[destinationPiece].location;
        middleLocation = fromLocation - toLocation;
        if( middleLocation == 22 || middleLocation == -22 || middleLocation == 18 || middleLocation == - 18)
        {
            middleLocation = (fromLocation - toLocation)/2 + toLocation;
            for (i = 0 ; i < checkers.length; i++)
            {
                if(checkers[i].location == middleLocation)
                {
                    document.getElementById(middleLocation).className = "empty";
                    checkers[i].isAlive = false;
                    middleLocation = i;
                    break;
                }
            }
            thisClass = document.getElementById(checkers[selectedPiece].location).className;
            isJumpAvailable = false;
            switchCheckers(); 
            resetAvailableJump();
            resetAvailableMove();
            markAvailableJump(destinationPiece);
            isWhiteTurn = isJumpAvailable? isWhiteTurn : !isWhiteTurn;
            document.getElementById("turn").innerHTML = isWhiteTurn ? "White's Turn" : "Black's Turn"; 
            if (!isJumpAvailable){
                markAvailableJump(100);
            }
            isGameEnded()
        }
    }
}
function markAvailableMove()
{
    let moveRight = 9;
    let moveLeft = 11;
    if (checkers[selectedPiece].isWhite)
    {
        moveRight *= -1;
        moveLeft *= -1;
    }
    for(let y = 0 ; y < 2; y++)
    {
        for (let i = 0 ; i < checkers.length; i++)
        {
            if(checkers[i].location == checkers[selectedPiece].location + moveRight)
            {
                let checkBox = document.getElementById(checkers[i].location);
                checkBox.className = !checkers[i].isAlive ? "available" : checkBox.className;
                checkers[i].isAvailable = true;    
            }
            if(checkers[i].location == checkers[selectedPiece].location + moveLeft)
            {
                let checkBox = document.getElementById(checkers[i].location);
                checkBox.className = !checkers[i].isAlive ? "available" : checkBox.className;   
                checkers[i].isAvailable = true;  
            }
        }
        if(checkers[selectedPiece].isKing)
        {
            moveRight *= -1;
            moveLeft *= -1;
        }
        else
        {
            y++;
        }
    }   
}
function resetAvailableMove()
{
    var resetAvailable = document.getElementsByClassName("available");
    for (i = 0; i < resetAvailable.length ;)
    {
       
        resetAvailable[i].className = "empty";
    }
    for (i = 0 ; i < checkers.length && !isJumpAvailable; i++)
    {
        checkers[i].isAvailable = false;
    }
}
function makeMove()
{
    if(!checkers[destinationPiece].isAvailable)
    {
        resetAvailableMove();
        selectedPiece = null;
        destinationPiece = null;
    }
    if(checkers[destinationPiece].isAvailable && selectedPiece != null)
    {
        switchCheckers()
        resetAvailableMove();  
        selectedPiece = null;    
        isWhiteTurn = !isWhiteTurn;      
        document.getElementById("turn").innerHTML = isWhiteTurn ? "White's Turn" : "Black's Turn"; 
        markAvailableJump(100);
    }
}
function switchCheckers()
{
    document.getElementById(checkers[destinationPiece].location).className = thisClass;
    document.getElementById(checkers[selectedPiece].location).className = "empty";
    let isWhite = checkers[selectedPiece].isWhite;
    let isKing = checkers[selectedPiece].isKing;
    checkers[selectedPiece].isWhite = false;
    checkers[selectedPiece].isKing = false;
    checkers[selectedPiece].isAlive = false;
    checkers[destinationPiece].isWhite = isWhite;
    checkers[destinationPiece].isKing = isKing;
    checkers[destinationPiece].isAlive = true;
}
function freezeBoard()
{
    let board = document.getElementsByTagName("button");
    for (i = 0 ; i < board.length; i ++)
    {
        board[i].disabled = true;
    }
}
function markAvailableJump(num)
{
    isJumpAvailable = false;
    if (num == 100)
    {
        for (i = 0 ; i < checkers.length; i++)
        {
            if (checkers[i].isAlive && checkers[i].isWhite == isWhiteTurn)
            {
                if (i  > 7)
                {
                    upperRightJump(i);
                    upperLeftJump(i);
                }
                if (i < 25)
                {
                    bottomRightJump(i);
                    bottomLeftJump(i);
                }
            }
        }
    }
    else
    {
        if (num  > 7)
        {
            upperRightJump(num);
            upperLeftJump(num);          
        }
        if (num < 25)
        {
            bottomRightJump(num);
            bottomLeftJump(num);
        }
        selectedPiece = isJumpAvailable? num : null;
    }

}
function upperRightJump(idNum)
{
    var distanceFromCurrent = checkers[idNum].location % 2 == 0 ? 4 : 3;
    if (checkers[idNum - distanceFromCurrent].isAlive && checkers[idNum - distanceFromCurrent].isWhite != checkers[idNum].isWhite)
    {
        distanceFromCurrent = idNum > 6 ? 7 : distanceFromCurrent;
        if(!checkers[idNum - distanceFromCurrent].isAlive && (checkers[idNum].location - checkers[idNum - distanceFromCurrent].location == 18))
        {
            checkers[idNum - distanceFromCurrent].isAvailable = true;
            document.getElementById(checkers[idNum - distanceFromCurrent].location).className = "availableKill";
            isJumpAvailable = true;
        }
    }
}
function upperLeftJump(idNum)
{
    var distanceFromCurrent = checkers[idNum].location % 2 == 0 ? 5 : 4;
    if (checkers[idNum - distanceFromCurrent].isAlive && checkers[idNum - distanceFromCurrent].isWhite != checkers[idNum].isWhite)
    {
        distanceFromCurrent = idNum > 8 ? 9 : distanceFromCurrent;
        if(!checkers[idNum - distanceFromCurrent].isAlive && (checkers[idNum].location - checkers[idNum - distanceFromCurrent].location == 22))
        {
            checkers[idNum - distanceFromCurrent].isAvailable = true;
            document.getElementById(checkers[idNum - distanceFromCurrent].location).className = "availableKill";
            isJumpAvailable = true;
        }
    }
}
function bottomRightJump(idNum)
{
    var distanceFromCurrent = checkers[idNum].location % 2 == 0 ? 4 : 5;
    if (checkers[idNum + distanceFromCurrent].isAlive && checkers[idNum + distanceFromCurrent].isWhite != checkers[idNum].isWhite)
    {
        distanceFromCurrent = idNum <= 22 ? 9 : distanceFromCurrent;
        if(!checkers[idNum + distanceFromCurrent].isAlive && (checkers[idNum].location - checkers[idNum + distanceFromCurrent].location == -22))
        {
            checkers[idNum + distanceFromCurrent].isAvailable = true;
            document.getElementById(checkers[idNum + distanceFromCurrent].location).className = "availableKill";
            isJumpAvailable = true;
        }
    }
}
function bottomLeftJump(idNum)
{
    var distanceFromCurrent = checkers[idNum].location % 2 == 0 ? 3 : 4;
    if (checkers[idNum + distanceFromCurrent].isAlive && checkers[idNum + distanceFromCurrent].isWhite != checkers[idNum].isWhite)
    {
        distanceFromCurrent = idNum <= 24 ? 7 : distanceFromCurrent;
        if(!checkers[idNum + distanceFromCurrent].isAlive && (checkers[idNum].location - checkers[idNum + distanceFromCurrent].location == -18))
        {
            checkers[idNum + distanceFromCurrent].isAvailable = true;
            document.getElementById(checkers[idNum + distanceFromCurrent].location).className = "availableKill";
            isJumpAvailable = true;
        }
    }
}
function resetAvailableJump()
{
    var availableJump = document.getElementsByClassName("availableKill");
    for (i = 0; i < availableJump.length ;)
    {
        availableJump[i].className = "empty";
    }
}
function makeKing()
{
    for(i = 0 ; i < 4 ; i++)
    {
        checkers[i].isKing = checkers[i].isWhite == true && checkers[i].isAlive ? true : false;
        checkers[i + 28].isKing = checkers[i + 28].isWhite == false && checkers[i + 28].isAlive? true : false;
        document.getElementById(checkers[i].location).className = checkers[i].isKing ? "whiteKing" : document.getElementById(checkers[i].location).className;
        document.getElementById(checkers[i + 28].location).className = checkers[i + 28].isKing ? "blackKing" : document.getElementById(checkers[i + 28].location).className;
    }
    for(i = 0 ; i < checkers.length; i++)
    {
        document.getElementById(checkers[i].location).innerHTML = checkers[i].isKing && checkers[i].isAlive? "&#9812" : "";
    }
}
function isGameEnded()
{
    let whitePiece = 0;
    let blackPiece = 0;
    for (i = 0 ; i < checkers.length; i++)
    {
        whitePiece = checkers[i].isAlive && checkers[i].isWhite ? 1 : whitePiece;
        blackPiece = checkers[i].isAlive && !checkers[i].isWhite ? 1 : blackPiece;
    }
    if(whitePiece == 0 || blackPiece == 0)
    {
        document.getElementById("turn").innerHTML = whitePiece == 0 ? "Black Won!" : "White Won!";
        freezeBoard();
    }
    if(isTie())
    {
        document.getElementById("turn").innerHTML = "It's a Tie!";
        freezeBoard();
    }
}
function isTie()
{
    let currentBoard = "";
    for(i = 0; i < checkers.length; i++)
    {
        currentBoard += checkers[i].isAlive && !checkers[i].isKing ? i : "0";
    }
    history.push(currentBoard);
    let nonePawnMoveCount = 0;
    for (i = 1 ; i < history.length && nonePawnMoveCount < 15; i ++)
    {
        if( history[i] == history[i-1])
        {
            nonePawnMoveCount++;
        }
        else
        {
            history = [];
        }
    }
    if(nonePawnMoveCount == 15)
    {
        return true;
    }
    return false;
}