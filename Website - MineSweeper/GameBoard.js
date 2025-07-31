const allRows = 15;
const allCols = 15;
const numMines = 17;

const gameBoard = document.getElementById("gameBoard");
const restartButton = document.getElementById("restartbutton");
let board = [];
let gameOver = false;
let flagsPlaced = 0;
let firstClick = true;
let fCR, fCC;

function initializeBoard()
{
	gameOver = false;
	firstClick = true;
	flagsPlaced = 0;

	board = [];

	for (let r = 0; r < allRows; r++) {
		board[r] = [];

		for (let c = 0; c < allCols; c++)
		{
			board[r][c] =
			{
				isMine: false,
				isFlag: false,
				revealed: false,
				count: 0,
			};
		}
	}

	let minesPlaced = 0;
	while (minesPlaced < numMines)
	{
		const row = Math.floor(Math.random() * allRows);
		const col = Math.floor(Math.random() * allCols);
		if (!board[row][col].isMine && !(firstClick && fCR === row && fCC === col))
		{
			board[row][col].isMine = true;
			minesPlaced++;
		}
	}

	for (let r = 0; r < allRows; r++)
	{
		for (let c = 0;c < allCols; c++)
		{
			if (!board[r][c].isMine)
			{
				let count = 0;
				for (let d1 = -1; d1 <= 1; d1++)
				{
					for (let d2 = -1; d2 <= 1; d2++)
					{
						const ar = r + d1;
						const ac = c + d2;
						if (ar >= 0 && ar < allRows && ac >= 0 && ac < allCols && board[ar][ac].isMine)
						{
							count++;
						}
					}
				}
				board[r][c].count = count;
			}
		}
	}
	renderBoard();
}

function revealCell(row, col)
{
	if (gameOver || row < 0 || row >= allRows || col < 0 || col >= allCols || board[row][col].revealed)
	{
		return;
	}

	if (firstClick)
	{
		fCR = row;
		fCC = col;
		firstClick = false;
	}

	board[row][col].revealed = true;

	if (board[row][col].isMine)
	{
		gameOver = true;
		revealAllMines();
		alert("BOOM! Sorry, you've lost. To try again click the restart button.");
	} else if (board[row][col].count === 0)
	{
		for (let d1 = -1; d1 <= 1; d1++)
		{
			for (let d2 = -1; d2 <= 1; d2++)
			{
				revealCell(row + d1, col + d2);
			}
		}
	}
	checkWinCondition();
	renderBoard();
}

function revealAllMines()
{
	for (let r = 0; r < allRows; r++)
	{
		for (let c = 0; c < allCols; c++)
		{
			if (board[r][c].isMine)
			{
				board[r][c].revealed = true;
			}
		}
	}
}

function toggleFlag(row, col)
{
	if (gameOver || board[row][col].revealed)
	{
		return;
	}

	if (board[row][col].isFlag) {
		board[row][col].isFlag = false;
		flagsPlaced--;
	} else
	{
		if (flagsPlaced < numMines) {
			board[row][col].isFlag = true;
			flagsPlaced++;
		} else
		{
			alert("You have placed all your flags. Pick one up before placing another one.");
			return;
		}
	}


	checkWinCondition();
	renderBoard();
}

function checkWinCondition()
{
	let allMinesFlagged = true;
	for (let r = 0; r < allRows; r++)
	{
		for (let c = 0; c < allCols; c++)
		{
			if (board[r][c].isMine && !board[r][c].isFlag)
			{
				allMinesFlagged = false;
				break;
			}
		}
	}
	if (allMinesFlagged)
	{
		//The spelling and typos are intentional, as it's a refference to the victory screen of the original "Ghosts 'n Goblins" game for the NES.
		alert("CONGRATURATION, THIS STORY IS HAPPY END.THANK YOU.BEING THE WISE AND COURAGEOUR KNIGHT THAT YOU ARE YOU FEEL STRONGTH WELLING IN YOUR BODY. RETURN TO STARTING POINT. CHALLENGE AGAIN!");
		gameOver = true;
	}
}

function renderBoard()
{
	const gameBoard = document.getElementById("gameBoard")
	gameBoard.innerHTML = "";

	for (let r = 0; r < allRows; r++)
	{
		for (let c = 0; c < allCols; c++)
		{
			const cell = document.createElement("div");
			cell.className = "cell";
			if (board[r][c].revealed)
			{
				cell.classList.add("revealed");
				if (board[r][c].isMine)
				{
					cell.classList.add("mine");
					if (board[r][c].isFlag)
					{
						cell.classList.add("safe")
						cell.imageContent = "Safe.png";
					} else
					{
						cell.imageContent = "Bomb-mine.png";
					}
				} else if (board[r][c].count > 0)
				{
					cell.textContent = board[r][c].count;
				}
			} else if (board[r][c].isFlag)
			{
				cell.classList.add("flag");
				cell.imageContent = "MineFlag.png";
			}
			
			cell.addEventListener("click", () => revealCell(r, c));
			cell.addEventListener("contextmenu", (event) =>
			{
				event.preventDefault();
				toggleFlag(r, c);
			});
			gameBoard.appendChild(cell);
		}
		gameBoard.appendChild(document.createElement("br"));
	}
}

document.addEventListener("DOMContentLoaded", () =>
{
	const restartButton = document.getElementById("restartButton");
	restartButton.addEventListener("click", initializeBoard,);

	initializeBoard();
	renderBoard()
});

