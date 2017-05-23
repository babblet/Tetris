var board_width  = 9;
var board_height = 15;
var board_color = "grey";
var speed = 1000; 	// Hur snabbt blocket rör sig ner i milisekunder 
var interval_id; 	// Får sitt värde i auto_move()
var blocks = [	// Former som man ger till nuvarande block (c_block) och rotationer till alla block
	[ 						//Första rotation [0]
		[[1,1],[2,1],[3,1],[4,1]], // Linje
		[[1,1],[2,1],[2,2],[3,1]], // T
		[[1,1],[2,1],[1,2],[2,2]], // Kub
		[[1,1],[2,1],[2,2],[3,2]], // Z
		[[2,1],[3,1],[1,2],[2,2]], // Motsatt Z
		[[1,1],[2,1],[3,1],[1,2]], // L
		[[1,1],[2,1],[3,1],[3,2]]  // Motsatt L
	],
	[						// Andra rotation [1]
		[[2,3],[2,2],[2,1],[2,0]], // Linje
		[[2,0],[2,1],[1,1],[2,2]], // T
		[[1,1],[2,1],[1,2],[2,2]], // Kub
		[[1,1],[2,1],[1,2],[2,0]], // Z
		[[1,0],[1,1],[2,1],[2,2]], // Motsatt Z
		[[1,0],[2,0],[2,1],[2,2]], // L
		[[2,0],[2,1],[2,2],[1,2]]  // Motsatt L
	],
	[						// Tredje rotation [2]
		[[1,1],[2,1],[3,1],[4,1]], // Linje
		[[1,1],[2,1],[2,0],[3,1]], // T
		[[1,1],[2,1],[1,2],[2,2]], // Kub
		[[1,1],[2,1],[2,2],[3,2]], // Z
		[[2,1],[3,1],[1,2],[2,2]], // Motsatt Z
		[[3,0],[3,1],[2,1],[1,1]], // L
		[[1,0],[1,1],[2,1],[3,1]]  // Motsatt L
	],
	[						// Fjärde rotation [3]
		[[2,3],[2,2],[2,1],[2,0]], // Linje
		[[2,0],[2,1],[2,2],[3,1]], // T
		[[1,1],[2,1],[1,2],[2,2]], // Kub
		[[1,1],[2,1],[1,2],[2,0]], // Z
		[[1,0],[1,1],[2,1],[2,2]], // Motsatt Z
		[[2,0],[2,1],[2,2],[3,2]], // L
		[[2,0],[3,0],[2,1],[2,2]]  // Motsatt L
	]
];
var blocks_color = ["blue", "red", "green", "purple", "yellow", "orange", "white"];	// Färger för blocks

var c_block = new Object();		// Får sinna nycklar (rotation, coords, id) och värden i new_block()

function create_board(){ 						// Skapar bräda
	for(let y = 1; y <= board_height; y++){						// Iterera igenom y-led
		document.write("<tr>");							// Skapa början på en rad i en tabel
		for(let x = 1; x <= board_width; x++){					// Iterera igenom x-led
			document.write( "<td id=" + x + "," + y + " style=\"background-color:" + board_color + "\">"); // Skriver ut en plats i tabelen, id är kordinaterna t.ex. id="3,6"
		}
		document.write("</tr>");						// Stäng raden i tabelen.
	}
}

function new_block(){ 							//Skapar ett nytt block med en form från blocks[]
	let r_number = Math.floor(Math.random() * blocks[0].length);
	c_block.rotation = 0; 								// Ge blocket första rotation
	c_block.coords = blocks[c_block.rotation][r_number]; 				// Ge ny form av block till nuvarande block med första rotation
	c_block.id = r_number;								// Ge id för formen så att man kan hitta rotationer för block i blocks[]
	c_block.color = blocks_color[r_number];						// Ge färg till block
	c_block.indexes_lower_coords = find_lower_coords();					// Ge kordinaterna för de understa blocken, används med check_under();
	draw_block_on_board(); 								// Skriv sedan ut blocket
};

function draw_block_on_board(){ 							// Skriver ut nuvarande blocket
	for(let i in c_block.coords){							// Itererar igenom alla arrayer som inehåller kordinater i nuvarande block
		change_color(c_block.coords[i][0], c_block.coords[i][1], c_block.color); 	// Ändrar färg på spelplan på de kordinaterna som nuvarande blocket har
	}
}

function change_color(x,y,color){ 					// Ändrar till angiven färg på angivna kordinater i spelplanen
	if(x > 0 && y > 0){
		document.getElementById(x+","+y).style.backgroundColor = color;
	}
}

function auto_move(){ 							// Rör blocket neråt i ett interval
	interval_id = setInterval(function(){ 						// Skapar ett interval som en function körs i. Intervalet returnar en id som man sedan kan avända för att stoppa intervalet. 
		let t_coords = []; 							// För temporära kordinater
		if(check_under() == false){							// Kolla under blocket först
			for(let i in c_block.coords){						// Ge alla kordinater från nuvarande block men y+1 till temporära kordinater 
				t_coords.push([c_block.coords[i][0], c_block.coords[i][1] + 1]);
			}
			for(let i in c_block.coords){						// Ta bort nuvarande block.
				change_color(c_block.coords[i][0], c_block.coords[i][1], board_color);
			}
			for(let i in t_coords){							// Skriv ut nytt block med tämporära kordinater
				change_color(t_coords[i][0], t_coords[i][1], c_block.color);
			}
			c_block.coords = t_coords; 						// Ge kordinater från tämporära kordinater till nuvarande block
		} else {
			new_block();
		}
	}, speed); 									// speed = Antal milisekunder innan functionen körs igen
}


function find_lower_coords(){						// Hittar de lägsta kordinaterna för blocket, används varje gång man det skapas ett nytt block eller när man roterar blocket.
	let indexes_duplicate_x_coords = [];						// Håller indexen för c_block.coords[] om det finns fler av sanna x kordinat 
	let x_coords_checked = [];							// Håller x kordinater som redan har används
	let indexes_lower_coords = [];							// Array som håller de lägsta kordinaterna som hittats

	function already_checked(coord){						// Ser om man redan lettat efter given x kordinat
		for(let i in x_coords_checked){
			if(x_coords_checked[i] == coord){
				return true;
			}
		}
		return false;
	}

	function check_y_coords_with_x(indexes_of_x_coords){		// Fungerar...
		let index_of_lowest_y_coord = indexes_of_x_coords[0];

		for(let i in indexes_of_x_coords){
			if(c_block.coords[indexes_of_x_coords[i]][1] > c_block.coords[index_of_lowest_y_coord][1]){
				index_of_lowest_y_coord = indexes_of_x_coords[i];
			}
		}
		indexes_lower_coords.push(index_of_lowest_y_coord);
	}

	function check_x_coords(){					// Fungerar...
		for(let i in c_block.coords){
			if(already_checked(c_block.coords[i][0]) == false){
				x_coords_checked.push(c_block.coords[i][0]);

				for(let j in c_block.coords){
					if(i != j){
						if(c_block.coords[i][0] == c_block.coords[j][0]){
							if(indexes_duplicate_x_coords.length == 0){
								indexes_duplicate_x_coords.push(i);
							}
							indexes_duplicate_x_coords.push(j);
						}
					}
				}

				if(indexes_duplicate_x_coords.length > 0){
					check_y_coords_with_x(indexes_duplicate_x_coords);
					indexes_duplicate_x_coords = [];
				} else {
					indexes_lower_coords.push(i);
				}
			}
		}
	}

	check_x_coords();
	return indexes_lower_coords;
}

function find_left_coords(){						// Hitta kordinater längst till vänster

}

function find_right_coords(){						// Hitta kordianter längst till höger

}

function check_under(){ 						// Kollar om nuvarande block har någonting under sig
	let x_coord;
	let y_coord;
	for(let i = 0; i < c_block.indexes_lower_coords.length; i++){
		console.log(c_block.indexes_lower_coords[i]);
		x_coord = c_block.coords[c_block.indexes_lower_coords[i]][0];
		y_coord = c_block.coords[c_block.indexes_lower_coords[i]][1] + 1;
		if(y_coord > board_height || (document.getElementById(x_coord + "," + y_coord).style.backgroundColor != board_color)){
			return true;
		} else if(i == c_block.indexes_lower_coords.length - 1){
			return false;
		}
	}
}

function move_left(){ 							// Rör block åt vänster
	function check_left(){

	}

}

function move_right(){ 							// Rör block åt höger
	function check_right(){

	}

}

function rotate(){ 							// Roterar nuvarande block
		
}