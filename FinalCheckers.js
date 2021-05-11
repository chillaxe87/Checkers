function CheckersGame ()
{
    this.checkers = [];
    this.selectedPiece = null;
    this.destinationPiece = null;
    this.thisClass = "";
    this.isWhiteTurn = true;
    this.isJumpAvailable = false;
    this.history = [];
}
function Checker (isWhite, isAlive, isKing, location, isAvailable) 
{
    this.isWhite = isWhite;
    this.isAlive = isAlive;
    this.isKing = isKing;
    this.location = location;
    this.isAvailable = isAvailable;
}
CheckersGame.prototype.createBoardUI = function()
{    
    let blackSquare = true;
    isWhiteTurn = true;
    let idNumber = 11;
    for (let i = 0 ; i < 8 ; i++)
    {
        let row = document.createElement("tr");
        row.id = i;
        document.getElementById("board").appendChild(row);
        for (let y = 0; y < 8; y++)
        {
            let square = document.createElement("td");
            let button = document.createElement("button");
            if(blackSquare)
            {
                square.className = "emptySpace";
                square.id = "blank";
                square.addEventListener("click", function () {play(this.id)});
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
                button.addEventListener("click", function(){play(this.id)})
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
}
CheckersGame.prototype.createCheckers = function()
{
    {
        let location = 11;
        for (i = 0; i < 32 ; i++)
        {
            if (i < 12)
            {
                this.checkers[i] =new Checker(false,true,false,location, false);
            }
            else if (i > 19)
            {
                this.checkers[i] = new Checker(true,true,false,location, true);
            }
            else
            {
                this.checkers[i] = new Checker(false,false,false,location, false);
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
    this.createBoardUI();
}
CheckersGame.prototype.startMove = function(id)
{
    let unitToPlay = 0;
    while (unitToPlay < 32)
    {
        if(this.checkers[unitToPlay].location == id)
        {
            break;
        }
        unitToPlay++;
    }
    if (this.isJumpAvailable)
    {
        this.makeJump(unitToPlay)
    }
    else
    {
        if(this.checkers[unitToPlay].isAlive && this.checkers[unitToPlay].isWhite == this.isWhiteTurn)
        {
            this.resetAvailableMove();
            this.selectedPiece = unitToPlay;
            this.thisClass = document.getElementById(this.checkers[this.selectedPiece].location).className;    
            this.markAvailableMove();
        }
        else if (!this.checkers[unitToPlay].isAlive && this.selectedPiece != null)
        {
            this.destinationPiece = unitToPlay;
            this.makeMove();
            this.isGameEnded();
        }
        else
        {
            this.resetAvailableMove();
        }
    }
    this.makeKing()
}
CheckersGame.prototype.makeJump = function(unitToPlay)
{
    this.destinationPiece = this.selectedPiece !=null && this.checkers[unitToPlay].isAvailable ? unitToPlay : null;
    this.selectedPiece = this.checkers[unitToPlay].isAlive && this.checkers[unitToPlay].isWhite == this.isWhiteTurn ? unitToPlay : this.selectedPiece;
    if (this.selectedPiece != null  && this.destinationPiece != null)
    {
        fromLocation = this.checkers[this.selectedPiece].location;
        toLocation = this.checkers[this.destinationPiece].location;
        middleLocation = fromLocation - toLocation;
        if( middleLocation == 22 || middleLocation == -22 || middleLocation == 18 || middleLocation == - 18)
        {
            middleLocation = (fromLocation - toLocation)/2 + toLocation;
            for (i = 0 ; i < this.checkers.length; i++)
            {
                if(this.checkers[i].location == middleLocation)
                {
                    document.getElementById(middleLocation).className = "empty";
                    this.checkers[i].isAlive = false;
                    middleLocation = i;
                    break;
                }
            }
            this.thisClass = document.getElementById(this.checkers[this.selectedPiece].location).className;
            this.isJumpAvailable = false;
            this.switchCheckers(); 
            this.resetAvailableJump();
            this.resetAvailableMove();
            this.markAvailableJump(this.destinationPiece);
            this.isWhiteTurn = this.isJumpAvailable? this.isWhiteTurn : !this.isWhiteTurn;
            document.getElementById("turn").innerHTML = this.isWhiteTurn ? "White's Turn" : "Black's Turn"; 
            if (!this.isJumpAvailable){
                this.markAvailableJump(100);
            }
            this.isGameEnded()
        }
    }
}
CheckersGame.prototype.markAvailableMove = function()
{
    let moveRight = 9;
    let moveLeft = 11;
    if (this.checkers[this.selectedPiece].isWhite)
    {
        moveRight *= -1;
        moveLeft *= -1;
    }
    for(let y = 0 ; y < 2; y++)
    {
        for (let i = 0 ; i < this.checkers.length; i++)
        {
            if(this.checkers[i].location == this.checkers[this.selectedPiece].location + moveRight)
            {
                let checkBox = document.getElementById(this.checkers[i].location);
                checkBox.className = !this.checkers[i].isAlive ? "available" : checkBox.className;
                this.checkers[i].isAvailable = true;    
            }
            if(this.checkers[i].location == this.checkers[this.selectedPiece].location + moveLeft)
            {
                let checkBox = document.getElementById(this.checkers[i].location);
                checkBox.className = !this.checkers[i].isAlive ? "available" : checkBox.className;   
                this.checkers[i].isAvailable = true;  
            }
        }
        if(this.checkers[this.selectedPiece].isKing)
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
CheckersGame.prototype.resetAvailableMove = function()
{
    var resetAvailable = document.getElementsByClassName("available");
    for (i = 0; i < resetAvailable.length ;)
    {
       
        resetAvailable[i].className = "empty";
    }
    for (i = 0 ; i < this.checkers.length && !this.isJumpAvailable; i++)
    {
        this.checkers[i].isAvailable = false;
    }
}
CheckersGame.prototype.makeMove = function()
{
    if(!this.checkers[this.destinationPiece].isAvailable)
    {
        this.resetAvailableMove();
        this.selectedPiece = null;
        this.destinationPiece = null;
    }
    if(this.checkers[this.destinationPiece].isAvailable && this.selectedPiece != null)
    {
        this.switchCheckers()
        this.resetAvailableMove();  
        this.selectedPiece = null;    
        this.isWhiteTurn = !this.isWhiteTurn;      
        document.getElementById("turn").innerHTML = this.isWhiteTurn ? "White's Turn" : "Black's Turn"; 
        this.markAvailableJump(100);
    }
}
CheckersGame.prototype.switchCheckers = function()
{
    document.getElementById(this.checkers[this.destinationPiece].location).className = this.thisClass;
    document.getElementById(this.checkers[this.selectedPiece].location).className = "empty";
    let isWhite = this.checkers[this.selectedPiece].isWhite;
    let isKing = this.checkers[this.selectedPiece].isKing;
    this.checkers[this.selectedPiece].isWhite = false;
    this.checkers[this.selectedPiece].isKing = false;
    this.checkers[this.selectedPiece].isAlive = false;
    this.checkers[this.destinationPiece].isWhite = isWhite;
    this.checkers[this.destinationPiece].isKing = isKing;
    this.checkers[this.destinationPiece].isAlive = true;
}
CheckersGame.prototype.freezeBoard = function()
{
    let board = document.getElementsByTagName("button");
    for (i = 0 ; i < board.length; i ++)
    {
        board[i].disabled = true;
    }
}
CheckersGame.prototype.markAvailableJump = function(num)
{
    this.isJumpAvailable = false;
    if (num == 100)
    {
        for (i = 0 ; i < this.checkers.length; i++)
        {
            if (this.checkers[i].isAlive && this.checkers[i].isWhite == this.isWhiteTurn)
            {
                if (i  > 7)
                {
                    this.upperRightJump(i);
                    this.upperLeftJump(i);
                }
                if (i < 25)
                {
                    this.bottomRightJump(i);
                    this.bottomLeftJump(i);
                }
            }
        }
    }
    else
    {
        if (num  > 7)
        {
            this.upperRightJump(num);
            this.upperLeftJump(num);          
        }
        if (num < 25)
        {
            this.bottomRightJump(num);
            this.bottomLeftJump(num);
        }
        this.selectedPiece = this.isJumpAvailable? num : null;
    }

}
CheckersGame.prototype.upperRightJump = function (idNum)
{
    var distanceFromCurrent = this.checkers[idNum].location % 2 == 0 ? 4 : 3;
    if (this.checkers[idNum - distanceFromCurrent].isAlive && this.checkers[idNum - distanceFromCurrent].isWhite != this.checkers[idNum].isWhite)
    {
        distanceFromCurrent = idNum > 6 ? 7 : distanceFromCurrent;
        if(!this.checkers[idNum - distanceFromCurrent].isAlive && (this.checkers[idNum].location - this.checkers[idNum - distanceFromCurrent].location == 18))
        {
            this.checkers[idNum - distanceFromCurrent].isAvailable = true;
            document.getElementById(this.checkers[idNum - distanceFromCurrent].location).className = "availableKill";
            this.isJumpAvailable = true;
        }
    }
}
CheckersGame.prototype.upperLeftJump = function(idNum)
{
    var distanceFromCurrent = this.checkers[idNum].location % 2 == 0 ? 5 : 4;
    if (this.checkers[idNum - distanceFromCurrent].isAlive && this.checkers[idNum - distanceFromCurrent].isWhite != this.checkers[idNum].isWhite)
    {
        distanceFromCurrent = idNum > 8 ? 9 : distanceFromCurrent;
        if(!this.checkers[idNum - distanceFromCurrent].isAlive && (this.checkers[idNum].location - this.checkers[idNum - distanceFromCurrent].location == 22))
        {
            this.checkers[idNum - distanceFromCurrent].isAvailable = true;
            document.getElementById(this.checkers[idNum - distanceFromCurrent].location).className = "availableKill";
            this.isJumpAvailable = true;
        }
    }
}
CheckersGame.prototype.bottomRightJump = function(idNum)
{
    var distanceFromCurrent = this.checkers[idNum].location % 2 == 0 ? 4 : 5;
    if (this.checkers[idNum + distanceFromCurrent].isAlive && this.checkers[idNum + distanceFromCurrent].isWhite != this.checkers[idNum].isWhite)
    {
        distanceFromCurrent = idNum <= 22 ? 9 : distanceFromCurrent;
        if(!this.checkers[idNum + distanceFromCurrent].isAlive && (this.checkers[idNum].location - this.checkers[idNum + distanceFromCurrent].location == -22))
        {
            this.checkers[idNum + distanceFromCurrent].isAvailable = true;
            document.getElementById(this.checkers[idNum + distanceFromCurrent].location).className = "availableKill";
            this.isJumpAvailable = true;
        }
    }
}
CheckersGame.prototype.bottomLeftJump = function(idNum)
{
    var distanceFromCurrent = this.checkers[idNum].location % 2 == 0 ? 3 : 4;
    if (this.checkers[idNum + distanceFromCurrent].isAlive && this.checkers[idNum + distanceFromCurrent].isWhite != this.checkers[idNum].isWhite)
    {
        distanceFromCurrent = idNum <= 24 ? 7 : distanceFromCurrent;
        if(!this.checkers[idNum + distanceFromCurrent].isAlive && (this.checkers[idNum].location - this.checkers[idNum + distanceFromCurrent].location == -18))
        {
            this.checkers[idNum + distanceFromCurrent].isAvailable = true;
            document.getElementById(this.checkers[idNum + distanceFromCurrent].location).className = "availableKill";
            this.isJumpAvailable = true;
        }
    }
}
CheckersGame.prototype.resetAvailableJump = function()
{
    var availableJump = document.getElementsByClassName("availableKill");
    for (i = 0; i < availableJump.length ;)
    {
        availableJump[i].className = "empty";
    }
}
CheckersGame.prototype.makeKing = function()
{
    for(i = 0 ; i < 4 ; i++)
    {
        this.checkers[i].isKing = this.checkers[i].isWhite == true && this.checkers[i].isAlive ? true : false;
        this.checkers[i + 28].isKing = this.checkers[i + 28].isWhite == false && this.checkers[i + 28].isAlive? true : false;
        document.getElementById(this.checkers[i].location).className = this.checkers[i].isKing ? "whiteKing" : document.getElementById(this.checkers[i].location).className;
        document.getElementById(this.checkers[i + 28].location).className = this.checkers[i + 28].isKing ? "blackKing" : document.getElementById(this.checkers[i + 28].location).className;
    }
    for(i = 0 ; i < this.checkers.length; i++)
    {
        document.getElementById(this.checkers[i].location).innerHTML = this.checkers[i].isKing && this.checkers[i].isAlive? "&#9812" : "";
    }
}
CheckersGame.prototype.isGameEnded = function()
{
    let whitePiece = 0;
    let blackPiece = 0;
    for (i = 0 ; i < this.checkers.length; i++)
    {
        whitePiece = this.checkers[i].isAlive && this.checkers[i].isWhite ? 1 : whitePiece;
        blackPiece = this.checkers[i].isAlive && !this.checkers[i].isWhite ? 1 : blackPiece;
    }
    if(whitePiece == 0 || blackPiece == 0)
    {
        document.getElementById("turn").innerHTML = whitePiece == 0 ? "Black Won!" : "White Won!";
        this.freezeBoard();
    }
    if(this.isTie())
    {
        document.getElementById("turn").innerHTML = "It's a Tie!";
        this.freezeBoard();
    }
}
CheckersGame.prototype.isTie = function()
{
    let currentBoard = "";
    for(i = 0; i < this.checkers.length; i++)
    {
        currentBoard += this.checkers[i].isAlive && !this.checkers[i].isKing ? i : "0";
    }
    this.history.push(currentBoard);
    let nonePawnMoveCount = 0;
    for (i = 1 ; i < this.history.length && nonePawnMoveCount < 15; i ++)
    {
        if(this.history[i] == this.history[i-1])
        {
            nonePawnMoveCount++;
        }
        else
        {
            this.history = [];
        }
    }
    if(nonePawnMoveCount == 15)
    {
        return true;
    }
    return false;
}
const checkersGame = new CheckersGame();
checkersGame.createCheckers();
function play(id)
{
    if(id == "blank")
    {
        checkersGame.resetAvailableMove();
    }
    else
    {
        checkersGame.startMove(id);
    }

}

