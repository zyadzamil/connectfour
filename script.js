(function () {
    let gameBoard = {};
    let currentPlayer = "red";
    let numRows = 6;
    let numCols = 7;
    let numTurns = 0;

    function _init() {
        let columns = document.querySelectorAll(".column");

        columns.forEach((col) => {
            col.addEventListener("click", function () {
                markNextFree(col.getAttribute("data-x"));
            });
        });

        document.getElementById("change-player").addEventListener("click", changePlayer);

        for (let x = 0; x < numCols; x++) {
            gameBoard[x] = {};
            for (let y = 0; y < numRows; y++) {
                gameBoard[x][y] = "free";
            }
        }
    }

    function markNextFree(x) {
        let nextY = false;

        for (let y = 0; y < numRows; y++) {
            if (gameBoard[x][y] === "free") {
                nextY = y;
                break;
            }
        }

        if (nextY === false) {
            alert("No free spaces in this column. Try another.");
            return;
        }

        gameBoard[x][nextY] = currentPlayer;

        document.querySelector(`#column-${x} .row-${nextY} circle`).setAttribute("class", currentPlayer);

        if (isWinner(parseInt(x), nextY)) {
            alert(`${currentPlayer} wins!`);
            clearBoard();
            return;
        }

        numTurns++;

        if (numTurns >= numRows * numCols) {
            alert("It's a tie!");
            clearBoard();
            return;
        }
    }

    function changePlayer() {
        currentPlayer = currentPlayer === "red" ? "yellow" : "red";
        document.getElementById("change-player").innerText = `Change Player (Current: ${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)})`;
    }

    function clearBoard() {
        document.querySelectorAll("circle").forEach((piece) => {
            piece.setAttribute("class", "free");
        });

        gameBoard = {};

        for (let x = 0; x < numCols; x++) {
            gameBoard[x] = {};
            for (let y = 0; y < numRows; y++) {
                gameBoard[x][y] = "free";
            }
        }

        numTurns = 0;
    }

    function isWinner(currentX, currentY) {
        return checkDirection(currentX, currentY, "vertical") ||
            checkDirection(currentX, currentY, "diagonal") ||
            checkDirection(currentX, currentY, "horizontal");
    }

    function isBounds(x, y) {
        return gameBoard.hasOwnProperty(x) && typeof gameBoard[x][y] !== "undefined";
    }

    function checkDirection(currentX, currentY, direction) {
        let chainLength = 1;
        let directions = {
            horizontal: [[0, -1], [0, 1]],
            vertical: [[-1, 0], [1, 0]],
            diagonal: [[-1, -1], [1, 1], [-1, 1], [1, -1]]
        };

        directions[direction].forEach(([dx, dy]) => {
            let i = 1;
            while (isBounds(currentX + dx * i, currentY + dy * i) &&
                gameBoard[currentX + dx * i][currentY + dy * i] === currentPlayer) {
                chainLength++;
                i++;
            }
        });

        return chainLength >= 4;
    }

    _init();
})();