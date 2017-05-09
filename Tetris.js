var board_width  = 9; //number of columns
var board_height = 15; //number of rows
var white 	 = "background-color:white"

var t_form = [1,1]

var blocks = [
	[[1,1],[2,1],[3,1],[4,1]], // Linje
	[[1,1],[2,1],[2,2],[3,1]], // T
	[[1,1],[2,1],[1,2],[2,2]], // Kub
	[[1,1],[2,1],[2,2],[3,2]], // Z
	[[2,1],[3,1],[1,2],[2,2]], // Motsatt Z
	[[1,1],[2,1],[3,1],[1,2]], // L
	[[1,1],[2,1],[3,1],[3,2]]  // Motsatt L
]

var c_block = blocks[0];

function create_board(){				//Skapar bräda
	for(let y = 1; y <= board_height; y++){		//iterera igenom y-led
		document.write("<tr>");
		for(let x = 1; x <= board_width; x++){
			document.write("<td id=" + x + "," + y + " style=" + white + ">"); // id är kordinaterna t.ex. id="3,6"
		}
		document.write("</tr>");
	}
}

function draw_block_on_board(){
	for(var i in c_block){
		change_color(c_block[i][0], c_block[i][1], "blue");
	}
}

function change_color(x,y,color){
	document.getElementById(x+","+y).style.background = color;
}

function check_under(){

}

function auto_move(){
	
}

function rotate(){

}