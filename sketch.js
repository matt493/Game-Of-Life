//#region BOARD SIZE params declarations
var BOARD_WIDTH;
var BOARD_HEIGHT;
const GRID_SIZE = 10;
const BACKGROUND = 240;
//#endregion

//#region UI elements declaration
var select;
var canvas;
var runBtn;
var resetButton;
//#endregion

//#region FLAGs and MARKERs declaration
var board;
var running;	//set to true to collapse recursion stacks when the reset button is clicked
//#endregion

class Board
{
	constructor(x, y)
	{
		this.x = x;
		this.y = y;

		this.alive_nearby = 0;

		this.alive = false;
	}

	drawCell()
	{
		if (this.alive) fill(30);
		else fill('white');

		rectMode(CORNERS);
		stroke('gray');
		strokeWeight(0);
		rect(this.x , this.y, this.x + GRID_SIZE, this.y + GRID_SIZE);
	}
}


function initStartParams()
{
	board = [];

	// init and construct grid matrix
	for (let x = 0; x < BOARD_WIDTH * GRID_SIZE; x += GRID_SIZE)
	{
		let row = [];
		for (let y = 0; y < BOARD_HEIGHT * GRID_SIZE; y += GRID_SIZE)
		{
			var cell = new Board(x,y);
			if(random([0,1,2,3,4,5,6,7,8]) == 0) cell.alive = true;	// init with random state
			row.push(cell);
		}
		board.push(row);
	}

	//init graph adjacency list
	// for (let x = 0; x < board.length; x++)
	// {
	// 	for (let y = 0; y < board[x].length; y++)
	// 	{
	// 		if(y-1 >= 0)				board[x][y].top = board[x][y-1];
	// 		if(y+1 <= BOARD_HEIGHT-1)	board[x][y].bottom = board[x][y+1];
	// 		if(x-1 >= 0)				board[x][y].left = board[x-1][y];
	// 		if(x+1 <= BOARD_WIDTH-1)	board[x][y].right = board[x+1][y];
	// 	}
	// }
}
function drawGrid()
{
	for (let x = 0; x < board.length; x++)
	{
		for (let y = 0; y < board[x].length; y++)
		{
			board[x][y].drawCell();
		}
	}
}

function countNeighbours(cell)
{
	let curr_x = cell.x / GRID_SIZE;
	let curr_y = cell.y / GRID_SIZE;
	let n_alive_nearby = 0;

	for (let x = -1; x <= 1; x++)
	{
		for(let y = -1; y <= 1; y++)
		{
			if(x == 0 && y == 0) continue;
			// print('checking:',x,y);
			try
			{
				if(board[curr_x + x][curr_y + y].alive) 
				{
					n_alive_nearby++;
					// print(curr_x + x,curr_y + y);
				}
			}
			catch (error)
			{
				// print(error)
			}
		}
	}

	cell.alive_nearby = n_alive_nearby;
}

function setup()
{
	frameRate(24);
	background(BACKGROUND);

	BOARD_WIDTH = Math.floor((windowWidth) / GRID_SIZE);
	BOARD_HEIGHT = Math.floor((windowHeight) / GRID_SIZE);

	canvas = createCanvas(BOARD_WIDTH * GRID_SIZE, BOARD_HEIGHT * GRID_SIZE);
	canvas.position(0,3);

	initStartParams();
	// drawGrid();
}

function draw()
{
	for (let x = 0; x < board.length; x++)
	{
		for (let y = 0; y < board[x].length; y++)
		{
			countNeighbours(board[x][y])
			// print(x, y, " : " , board[x][y].alive_nearby)
		}
	}

	for (let x = 0; x < board.length; x++)
	{
		for (let y = 0; y < board[x].length; y++)
		{
			let cell = board[x][y]

			// countNeighbours(cell)

			if (cell.alive && cell.alive_nearby < 2) 						
			{
				cell.alive = false;
				cell.drawCell();
				continue;
			}
			if (cell.alive && cell.alive_nearby >= 2 && cell.alive_nearby <= 3)
			{
				cell.alive = true; 	
				cell.drawCell();
				continue;
			}
			if (cell.alive && cell.alive_nearby > 3) 							
			{
				cell.alive = false; 	
				cell.drawCell();
				continue;
			}
			if (cell.alive == false && cell.alive_nearby == 3)					
			{
				cell.alive = true;
				cell.drawCell();
				continue;
			}
		}
	}

	// drawGrid();
}
