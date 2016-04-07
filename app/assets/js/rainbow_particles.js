// create a simple visualization
function hello_world($p) {

    // data
    var data = [];
    for (var i = 0; i < 500; i++) data.push({});

    // canvas size (based on data)
    $p.size(800, 600);

    // system parameters
    var gravity = .5;
    var drag = .995;
    
    // graphical parameters
    //$p.background(245);
    $p.noStroke(); // hide outline
    $p.colorMode($p.HSB, 255);

    // data loop
    // add and initialize variables to the data object
    init_particles = function () {
        for (var i = 0; i < data.length; i++) {
            data[i].radius = Math.random() * 20;
            data[i].y = 100;
            data[i].x = Math.random() * $p.width;
            data[i].x_v = Math.random() * 60 - 30;
            data[i].y_v = Math.random() * 30;
            data[i].hue = Math.random() * 245;
            data[i].y_max = $p.height - (data[i].radius / 2) - 10;
            data[i].x_max = $p.width - (data[i].radius / 2) - 10;
        }
    }

    init_particles();
    
    // initialize more particles based on mouse lick
    mouse_init_particles = function (initialY,initialX) {
        for (var i = 0; i < data.length; i++) {
            data[i].radius = Math.random() * 20;
            
            data[i].y = initialY;
            data[i].x = initialX;
            
            data[i].x_v = Math.random() * 60 - 30;
            data[i].y_v = Math.random() * 30;
            data[i].hue = Math.random() * 255;
            data[i].y_max = $p.height - (data[i].radius / 2) - 10;
            data[i].x_max = $p.width - (data[i].radius / 2) - 10;
        }
    }
    
    // change speed based on key press
    change_velocity = function (key) {
        
        // reduce if up
        if (key == $p.UP){
            for (var i = 0; i < data.length; i++) {
                data[i].x_v += .5 * Math.random() - .25;
                data[i].x_v *= 1.3;
                data[i].y_v +=  Math.random() * 2;
                data[i].y_v *= 1.3;
        	}
        }
        
        // decrease if down
        else if (key = $p.DOWN){
            for (var i = 0; i < data.length; i++) {
                data[i].x_v -= .5 * Math.random() - .25;
                data[i].x_v *= 0.7;
                data[i].y_v -=  Math.random() * 2;
                data[i].y_v *= 0.7;
        	}
        
        }
        

    }
    
    // draw_based on index
    draw_point = function (i) {
        // shape bg
        $p.fill(data[i].hue, 255, 255);

        // shape
        $p.ellipseMode($p.CENTER); // put outside loop
        $p.ellipse(data[i].x + 3, data[i].y - 3, data[i].radius, data[i].radius);
    }



    // draw system
    $p.draw = function () {
        $p.background(255, 255, 255, 0);
        
        
        for (var i = 0; i < data.length; i++) {
            draw_point(i);

            // y direction
            if ((Math.abs(data[i].y_v) > 0)) {

                data[i].y_v *= drag;
                data[i].y_v += gravity;
                data[i].y += data[i].y_v;

                if (data[i].y >= data[i].y_max) {
                    data[i].y = data[i].y_max;
                    data[i].y_v *= -1;
                }

                if (data[i].y <= 10) {
                    data[i].y = 10;
                    data[i].y_v *= -1;
                }
            }

            // x direction
            if ((Math.abs(data[i].x_v) > 0)) {

                data[i].x_v *= drag;
                data[i].x += data[i].x_v;

                if (data[i].x >= data[i].x_max) {
                    data[i].x = data[i].x_max;
                    data[i].x_v *= -1;
                }

                if (data[i].x <= 10) {
                    data[i].x = 10;
                    data[i].x_v *= -1;
                }
            }
        }


    }

    $p.mousePressed = function () {
        mouse_init_particles($p.mouseY,$p.mouseX);
    }
    
	$p.keyPressed = function(){
        change_velocity($p.keyCode);
	}


}

// create a canvas
var canvas = document.getElementById("viz_2_rainbow");

// bind basic_bar_chart to canvas
var p = new Processing(canvas, hello_world);