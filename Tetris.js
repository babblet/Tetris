// Ljud
var audio_file = "Tetris.mp3";
// Brädan
var board_width  = 9;
var board_height = 15;
var board_color = "grey";

// Hur snabbt blocket rör sig ner i milisekunder 
var speed = 1000;

// Interval som rör blocket neråt. Får sitt värde i auto_move().
var interval_auto_move;

// Former som man ger till nuvarande block (c_block) och rotationer till alla block
var blocks = [	
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

// Färger för blocks.
var blocks_color = ["blue", "red", "green", "purple", "yellow", "orange", "white"];	// Färger för blocks.

// Nuvarande block, blocket som blir manipulerat. Får sinna nycklar (rotation, coords, id, m.m) och värden i new_block().
var c_block = new Object();

function play_audio(){
	if(audio_file != undefined){
		var audio = new Audio(audio_file);
		audio.addEventListener('ended', function() {
    			this.currentTime = 0;
    			this.play();
		}, false);
		audio.play();
	}
}

// Skapar bräda.
function create_board(){ 
	// Iterera igenom y-led.
	for(let y = 1; y <= board_height; y++){
		// Skapa början på en rad i en tabel.
		document.write("<tr>");
		// Iterera igenom x-led.							
		for(let x = 1; x <= board_width; x++){
			// Skriv ut en plats i tabelen, id är kordinaterna t.ex. id="3,6".
			document.write( "<td id=" + x + "," + y + " style=\"background-color:" + board_color + "\">");
		}
		// Stäng raden i tabelen.
		document.write("</tr>");
	}
}

//Skapar ett nytt block / Ger nya värden till nuvarande block.
function new_block(){
	// Skriver ut nuvarande blocket.
	function draw_block_on_board(){
		// Itererar igenom alla arrayer som inehåller kordinater i nuvarande block.
		for(let i in c_block.coords){
			// Ändra färg på spelplan på de kordinaterna som nuvarande blocket har.
			change_color(c_block.coords[i][0], c_block.coords[i][1], c_block.color);
		}
	}

	// Ge id för formen så att man kan hitta rotationer för block i blocks[].
	c_block.id = Math.floor(Math.random() * blocks[0].length);;

	// Ge blocket första rotation.
	c_block.rotation = 0;

	// Ge ny form av block till nuvarande block med första rotation.								
	c_block.coords = blocks[c_block.rotation][c_block.id];

	// Ge färg till block.
	c_block.color = blocks_color[c_block.id];

	// Hitta de indexen med de understa blocken.
	c_block.indexes_lower_coords = find_indexes("bottom");

	// Hitta de indexen med de högra blocken.
	c_block.indexes_right_coords = find_indexes("right");

	// Hitta de indexen med de vänstra blocken.
	c_block.indexes_left_coords = find_indexes("left");

	// Skriv sedan ut blocket.
	draw_block_on_board();
}

// Ändrar till angiven färg på angivna kordinater i spelplanen
function change_color(x,y,color){
	if(x > 0 && y > 0){
		document.getElementById(x+","+y).style.backgroundColor = color;
	}
}

// Rör blocket neråt i ett interval
// Använd bara om interval_auto_move inte är definerat.
function auto_move(){
	if(interval_auto_move == undefined){
		// Skapar ett interval. Intervalet returnar en id som man sedan kan avända för att stoppa intervalet. 
		interval_auto_move = setInterval(function(){
			// För temporära kordinater
			let t_coords = [];

			// Kolla under blocket först
			if(check_under() == false){
				// Ge alla kordinater från nuvarande block men y+1 till temporära kordinater
				for(let i in c_block.coords){
					t_coords.push([c_block.coords[i][0], c_block.coords[i][1] + 1]);
				}
				// Ta bort nuvarande block.
				for(let i in c_block.coords){
					change_color(c_block.coords[i][0], c_block.coords[i][1], board_color);
				}
				// Skriv ut nytt block med tämporära kordinater
				for(let i in t_coords){
					change_color(t_coords[i][0], t_coords[i][1], c_block.color);
				}
				// Ge kordinater från tämporära kordinater till nuvarande block
				c_block.coords = t_coords;
			} else {
				//Om nuvarande block har något under sig. Gör ett nytt block.
				new_block();
			}
		// speed = Antal milisekunder innan functionen körs igen.
		}, speed);
	}
}

// Hittar index för blocket, 
// Används varje gång man det skapas ett nytt
// block eller när man roterar blocket.
// Find = "left", "right", "bottom".
function find_indexes(find){
	// Håller indexen för c_block.coords[] om det finns fler av samma kordinat.
	let indexes_duplicate_coords = [];

	// Håller kordinater som redan har används.
	let coords_checked = [];

	// Array som håller de lägsta kordinaterna som hittats.
	let indexes_coords = [];
	
	// Första och andra kordinaten att kolla igenom.
	let first_coord;
	let second_coord;

	// Kolla vad find har fått för värde.
	if(find == undefined){
		console.log("find_indexes: no argument");
		return false;
	} else if(find == "bottom"){
		first_coord = 0;
		second_coord = 1;
	} else if(find == "left" || find == "right"){
		first_coord = 1;
		second_coord = 0;
	}

	// Ser om man redan lettat efter given x kordinat
	function already_checked(coord){
		for(let i in coords_checked){
			if(coords_checked[i] == coord){
				return true;
			}
		}
		return false;
	}

	// Hitta de lägsta kordinaterna i blocket med hjälp av x. Fungerar...
	function check_coords_with_x(indexes_of_x_coords){
		// Ge index_of_lower_y_coord ett start värde i arrayen
		let index_of_lowest_y_coord = indexes_of_x_coords[0];

		// Itererar igenom x kordinaterna och sedan hittar de y kordinater
		// som är längst ned.
		for(let i in indexes_of_x_coords){ 
			if(c_block.coords[indexes_of_x_coords[i]][second_coord] > c_block.coords[index_of_lowest_y_coord][second_coord]){
				index_of_lowest_y_coord = indexes_of_x_coords[i];
			}
		}
		// Ge hittade indexet.
		indexes_coords.push(index_of_lowest_y_coord);
	}

	function check_coords_with_y(indexes_of_y_coords){
		let index_of_direction_x_coord = indexes_of_y_coords[0];
		for(let i in indexes_of_y_coords){
			if(find == "left"){
				if(c_block.coords[indexes_of_y_coords[i]][second_coord] < c_block.coords[index_of_direction_x_coord][second_coord]){
					index_of_direction_x_coord = indexes_of_y_coords[i];
				}
			} else if(find == "right"){
				if(c_block.coords[indexes_of_y_coords[i]][second_coord] > c_block.coords[index_of_direction_x_coord][second_coord]){
					index_of_direction_x_coord = indexes_of_y_coords[i];
				}
			}
		}
		indexes_coords.push(index_of_direction_x_coord);
	}

	// Kollar efter kordinaterna för x/y led, berodende på vilken om 
	// det vi ska hitta är horizontelt eller vertikalt.
	function check_coords(){
		for(let i in c_block.coords){
			if(already_checked(c_block.coords[i][first_coord]) == false){
				coords_checked.push(c_block.coords[i][first_coord]);

				for(let j in c_block.coords){
					if(i != j){
						if(c_block.coords[i][first_coord] == c_block.coords[j][first_coord]){
							if(indexes_duplicate_coords.length == 0){
								indexes_duplicate_coords.push(i);
							}
							indexes_duplicate_coords.push(j);
						}
					}
				}

				if(indexes_duplicate_coords.length > 0){
					if(find == "bottom"){
						check_coords_with_x(indexes_duplicate_coords);
					} else {
						check_coords_with_y(indexes_duplicate_coords);
					}
					indexes_duplicate_coords = [];
				} else {
					indexes_coords.push(i);
				}
			}
		}
	}

	check_coords();
	return indexes_coords;
}

// Kollar om nuvarande block har någonting under sig
function check_under(){
	let x_coord;
	let y_coord;
	for(let i = 0; i < c_block.indexes_lower_coords.length; i++){
		x_coord = c_block.coords[c_block.indexes_lower_coords[i]][0];
		y_coord = c_block.coords[c_block.indexes_lower_coords[i]][1] + 1;
		if(y_coord > board_height || (document.getElementById(x_coord + "," + y_coord).style.backgroundColor != board_color)){
			return true;
		} else if(i == c_block.indexes_lower_coords.length - 1){
			return false;
		}
	}
}

function check_row_full(){
	function check_tetris(){

	}

	function remove_line(){

	}

	function move_blocks_down(){

	}
}

// Rör block åt vänster
function move_left(){
	// Använder sig utav c_block.indexes_left_coords för att hitta om de finns något ivägen för vänster av nuvarande blocket
	function check_left(){

	}

}

// Rör block åt höger
function move_right(){
	// Använder sig utav c_block.indexes_rigth_coords för att hitta om de finns något ivägen för höger av nuvarande blocket
	function check_right(){

	}

}
// Roterar nuvarande block
function rotate(){
		
}
