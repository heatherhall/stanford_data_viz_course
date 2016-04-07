// create a simple visualization
function display_glucose($p) {

    // canvas size
    var height = 400;
    var width = 600;
    $p.size(width, height);

    // graphical parameters
    $p.background(245);
    var margin = 50;
    $p.colorMode($p.HSB, 255); // put before loop

    
    // message
    var raw_CGM = "100 ,111 ,113 ,114 ,116 ,121 ,125 ,137 ,143 ,148 ,149 ,145 ,138 ,135 ,134 ,130 ,125 ,123 ,123 ,120 ,121 ,121 ,119 ,122 ,119 ,117 ,118 ,121 ,125 ,130 ,131 ,135 ,137 ,149 ,159 ,171 ,187 ,201 ,213 ,219 ,219 ,214 ,220 ,222 ,243 ,250 ,246 ,247 ,243 ,210 ,201 ,191 ,188 ,184 ,180 ,178 ,167 ,152 ,132 ,116 ,111 ,107 ,105 ,100 ,100 ,100 ,100 ,100 ,98 ,99 ,102 ,106 ,105 ,99 ,103 ,107 ,103 ,99 ,96 ,102 ,113 ,125 ,131 ,122 ,128 ,120 ,116 ,149 ,142 ,142 ,122 ,117 ,110 ,105 ,99 ,85 ,80 ,87 ,87 ,102";
    var txt_arr = raw_CGM.split(" ,");
    

    glucose_value = function(){
    	this.value = 0;
        this.time = "0:00"
        this.meal = "none";
    }
    
    
    // check if mouse press was within boxes
   inBounds = function(x, y){
       
        var arrow_length = 30;
        var arrow_height = 10;
        var arrow_margin = 20;
        
        // THE BOXES
    	//$p.rect(margin,height-arrow_margin,arrow_length,arrow_height);
        //$p.rect(width-margin,height-arrow_margin,arrow_length,arrow_height);
       
      // if y within the bounds
       if (y >= (height-arrow_margin) && y <= (height-arrow_margin+arrow_height)){

           if (x >= margin && x <= margin + arrow_length){
               return -1;
           }
       		else if (x >= (width-margin) && x <= (width - margin + arrow_length)){
               return 1;
           }
       
       }
    
       return 0;
    }
    
    // shift data to the right
    shiftDataRight = function(){
        start += 1;
        end += 1

        if( end > txt_arr.length){
            start = txt_arr.length - range;
            end = txt_arr.length;

        }
    }

    // shift data to the left
    shiftDataLeft = function(){
        start -= 1;
        end -= 1

        if( start < 0){
            start = 0;
            end = range;
        }
    }
    
    draw_controls = function(){
        
        $p.stroke(100,100,200);
        //$p.strokeWeight(1);
        $p.fill(100,100,200); // black  
        
        var arrow_length = 30;
        var arrow_height = 10;
        var arrow_margin = 20;
        
        // THE BOXES
    	$p.rect(margin,height-arrow_margin,arrow_length,arrow_height);
        $p.rect(width-margin,height -arrow_margin,arrow_length,arrow_height);
       
        $p.fill(0,0,0); // black  

        // THE TEXT
       $p.textSize(12);
       $p.text("<<<",margin+5, height-arrow_margin/2);
       $p.text(">>>",width-margin+5, height-arrow_margin/2);
    
    }
    
    draw_margins = function(){
    	// stroke color
        var h = 255, // opposite direction
            s = 255,
            v = 0;

        $p.stroke(h,s,v);
        $p.strokeWeight(1);

        $p.line(margin, height-margin, width-margin,height-margin);
        $p.line(margin, height-margin, margin,margin);

        $p.stroke(h,s,100);
        $p.strokeWeight(0.25);
        $p.line(margin, height-margin-100, width-margin,height-margin-100);
        
        $p.textSize(12);
        // draw y axis ticks
        for(var i = 50; i < 300; i = i + 50){
           $p.strokeWeight(0.5);
           $p.line(margin-5, height-margin-i, margin+5,height-margin-i);
        
            $p.fill(255,255,0); // black  
            
            var text_adjust = 25;
            if (i == 50){
                text_adjust = 20
            }
        	$p.text(i,margin-text_adjust ,height-margin-i+5);
        }
        
        var thirty_min =  (width-2*margin)/(range+1)*6
        
        var min = start+5;
        
    	// draw x axis ticks
        for(var i = thirty_min; i < width-2*margin; i = i + thirty_min){
           $p.strokeWeight(0.5);
           $p.line(margin+i, height-margin-5, margin+i,height-margin+5);
        
            $p.fill(255,255,0); // black  
            
            //$p.nfs(min, 1, 1)
        	$p.text(min*6,margin+i-8, height-margin+20);
            min += 5;
        }    
        
        // Label axes and chart
        $p.textSize(30);
        $p.text("Blood Sugar Levels",width/2-width/4, margin);
    }

    draw_glucose = function(){
        
        var graph_i = 0;
        // loop
        for(var i= start; i < end; i++){

            // fill color
            var h = 255 - (255 - (txt_arr[i])),
                s = 255,
                v = 255;
            $p.fill(h,s,v);

            // stroke color
            var h = 255, // opposite direction
                s = 255,
                v = 0;
            $p.stroke(h,s,v);
            $p.strokeWeight(0.25);

            // sin wave y-offset
            var y_offset = txt_arr[i]-50;
            var x_offset = (width-2*margin)/(range+1)

            // rect
            var l = 5, w = 5;
            $p.ellipse(graph_i*x_offset + margin+5, height-margin-y_offset, l, w);

            graph_i++;
        }
    }




    var start = 0;
    var range = 50;
    var end = start + range;

    // to do -- add functions
    // update data based on click right and click left
    // update baseline, max,
    // also plot food entries -- click to get details
    // axis ticks should change based on amount of data present
    // allow zoom in and out
    
    
    
    // draw system
    $p.draw = function () {
        
        // transparent bg
        $p.fill(245);
		$p.rect(0, 0, $p.width, $p.height);
        
        draw_margins();
    	draw_controls();
        draw_glucose();
        
    }
    
    // updates start and end if click appropriate buttons
    $p.mousePressed = function () {
        // if in right bound box        
        if (inBounds($p.mouseX, $p.mouseY) == 1){
        	shiftDataRight();
        }
        // if in left bound box
    	else if (inBounds($p.mouseX, $p.mouseY) -1){
        	shiftDataLeft();
        } 
    } 

}

// create a canvas
var canvas = document.getElementById("processing_glucose");

// bind basic_bar_chart to canvas
var p = new Processing(canvas, display_glucose);