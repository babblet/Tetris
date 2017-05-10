var board_width  = 9;
var board_height = 15;
var speed = 1000; 	// Hur snabbt blocket rör sig ner i milisekunder 
var blocks = [ 		// former som man ger till nuvarande block (c_block)
	[[1,1],[2,1],[3,1],[4,1]], // Linje
	[[1,1],[2,1],[2,2],[3,1]], // T
	[[1,1],[2,1],[1,2],[2,2]], // Kub
	[[1,1],[2,1],[2,2],[3,2]], // Z
	[[2,1],[3,1],[1,2],[2,2]], // Motsatt Z
	[[1,1],[2,1],[3,1],[1,2]], // L
	[[1,1],[2,1],[3,1],[3,2]]  // Motsatt L
]

var c_block; 		// Får sitt värde i new_block()
var interval_id; 	// Får sitt värde i auto_move()

function create_board(){ // Skapar bräda
	for(let y = 1; y <= board_height; y++){				// iterera igenom y-led
		document.write("<tr>");					// skapa början på en rad i en tabel
		for(let x = 1; x <= board_width; x++){			// iterera igenom x-led
			document.write("<td id=" + x + "," + y + " style=\"background-color:white\">"); // skriver ut en plats i tabelen, id är kordinaterna t.ex. id="3,6"
		}
		document.write("</tr>");				// stäng raden i tabelen.
	}
}

function new_block(){ //Skapar ett nytt block med en form från blocks[]
	c_block = blocks[Math.floor(Math.random() * blocks.length)]; 	// Ge ny form av block till nuvarande block
	draw_block_on_board(); 						// skriv sedan ut blocket
};

function draw_block_on_board(){ // skriver ut nuvarande blocket
	c_block = blocks[Math.floor(Math.random() * blocks.length)]; 	// Ge nuvarande blocket en form
	for(let i in c_block){						// itererar igenom alla arrayer som inehåller kordinater i nuvarande block
		change_color(c_block[i][0], c_block[i][1], "blue"); 	// ändrar färg på spelplan på de kordinaterna som nuvarande blocket har
	}
}

function change_color(x,y,color){ // ändrar till angiven färg på angivna kordinater i spelplanen
	document.getElementById(x+","+y).style.background = color;
}

function check_under(){ // Kollar om nuvarande block har någonting under sig

}

function auto_move(){ // Rör blocket neråt i ett interval
	interval_id = setInterval(function(){ 				// skapar ett interval som en function körs i. Intervalet returnar en id som man sedan kan avända för att stoppa intervalet. 
		let t_block = []; 					// nytt temporärt block
		for(let i in c_block){					// Ge nytt block alla kordinater från nuvarande block men y+1 
			t_block.push([c_block[i][0], c_block[i][1] + 1]);
		}
		for(let i in c_block){					// Ta bort nuvarande block.
			change_color(c_block[i][0], c_block[i][1], "white");
		}
		for(let i in t_block){					// Skriv ut nytt block.
			change_color(t_block[i][0], t_block[i][1], "blue");
		}
		c_block = t_block; 					// Ge kordinater från nytt block till nuvarande block
	}, speed); 							// speed = antal milisekunder innan functionen körs igen
}

function rotate(){ // Roterar nuvarande block

}