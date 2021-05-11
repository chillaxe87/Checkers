class CheckersGame
{
    constructor()
    {
        this.checkers = function()
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
        this.selectedPiece = null;
        this.destinationPiece = null;
        this.thisClass = "";
        this.isWhiteTurn = true;
        this.isJumpAvailable = false;
        this.history = "";
    }
    createBoardUI()
    {
        let blackSquare = true;
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
    }
}
class Checkers
{
    constructor(isWhite, isAlive, isKing, location, isAvailable)
    {
        this.isWhite = isWhite;
        this.isAlive = isAlive
        this.isKing = isKing;
        this.location = location;
        this.isAvailable = isAvailable;
    }
}
let checkersGame = new CheckersGame()
checkersGame.createBoardUI();