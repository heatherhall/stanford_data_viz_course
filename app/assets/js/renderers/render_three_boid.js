// Your job is to implement this file
console.log(" IMPLEMENT ME! (OPEN ME, I HAVE HINTS) ");


/*

HINT 1: Copy render_three_particle.js. Rename it to render_three_boid.js. Then look for this section and implement your Prototype methods.
That's all you need to do. The section where you implement your code looks like this:

// ---------------------------------------------------------
// Particle Render Prototype Methods



// ------------------------------------------------------------------------------------------------
// Light

*/

// ------------------------------------------------------------------------------------------------
// scene, camera, and renderer go here

var SCENE_WIDTH = SCENE_HEIGHT = 500;

// create a canvas and a renderer, then append to document

// this canvas must be in boids_threejs.html
var canvas = document.getElementById("three_boid");


var renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true}); // use webgl renderer (GPU!)
renderer.setSize(SCENE_WIDTH, SCENE_HEIGHT); // Resizes the output canvas to (width, height), and also sets the viewport to fit that size, starting in (0, 0).
document.body.appendChild(renderer.domElement); // attach renderer to canvas

// scene - where we put our models
var scene = new THREE.Scene();

// camera - how we look at our scene
var camera = new THREE.PerspectiveCamera( 45, SCENE_WIDTH / SCENE_HEIGHT, 1, 10000 );
camera.position.set( SCENE_WIDTH, SCENE_HEIGHT/2, 2000 );

// orbit controls - how we use our mouse to move the camera
var controls = new THREE.OrbitControls( camera );
controls.addEventListener( 'change', render );

// ------------------------------------------------------------------------------------------------

// parent object (like a sub-scene)
var parent = new THREE.Object3D();

// ------------------------------------------------------------------------------------------------
// add axes
// from: http://soledadpenades.com/articles/three-js-tutorials/drawing-the-coordinate-axes/

function buildAxes( length ) {
    var axes = new THREE.Object3D();
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z
    return axes;

}

function buildAxis( src, dst, colorHex, dashed ) {
    var geom = new THREE.Geometry(),
        mat; 

    if(dashed) {
            mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
    } else {
            mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
    }

    geom.vertices.push( src.clone() );
    geom.vertices.push( dst.clone() );
    geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

    var axis = new THREE.Line( geom, mat, THREE.LinePieces );

    return axis;

}

axes = buildAxes( SCENE_WIDTH );
parent.add( axes );



// ------------------------------------------------------------------------------------------------
// add Bounding box

// http://threejs.org/docs/#Reference/Extras.Helpers/BoundingBoxHelper
var bounding_box = new THREE.BoundingBoxHelper(parent); // can also be tied to scene
                                                        // but since our objects are in the parent we tie it here
bounding_box.update(); // render
parent.add(bounding_box);

// ---------------------------------------------------------
// BOID ** Render Prototype Methods
// dont have a particle class, so none of these are going to work


// add properties
Boid.prototype.set_color  = function(){ 

	// http://threejs.org/docs/#Reference/Math/Color
    this.color = new THREE.Color();
    this.color.setHSL( Math.random(), .85, .5 );
 
}
Boid.prototype.set_radius = function(){ this.radius = Math.random() * 40; }


// the following 3 were copied directly from particle (changed particle to boid)
// all just java 

Boid.prototype.create_geometry = function(){
    // enable this if you want spheres
    // http://threejs.org/docs/#Reference/Extras.Geometries/SphereGeometry
    // this.geometry = new THREE.SphereGeometry(
    //     this.radius, // radius — sphere radius. Default is 50.
    //     25,          // widthSegments — number of horizontal segments. Minimum value is 3, and the default is 8.
    //     25           // heightSegments — number of vertical segments. Minimum value is 2, and the default is 6.
    // );
    
    // http://threejs.org/docs/#Reference/Extras.Geometries/BoxGeometry
    this.geometry = new THREE.BoxGeometry( this.radius, this.radius, this.radius);
}

Boid.prototype.create_material = function(){

    // http://threejs.org/docs/#Reference/Materials/MeshPhongMaterial
    this.material = new THREE.MeshPhongMaterial({
        color: this.color,
        specular: 0x333333,
        shininess: .9
    });
    this.material.transparent = true;
    this.material.opacity = .75;
}

// bind material and geometry together into an object mesh
Boid.prototype.create_mesh = function(){
    // http://threejs.org/docs/#Reference/Objects/Mesh
    this.mesh = new THREE.Mesh(
        this.geometry,
        this.material
    );
    
    // must use this.position.x because this is how its defined in boids class
    //this.mesh.position.set(this.x, this.y, this.z);
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    console.log(this.mesh);
}


// initialize mesh, runs previous three function to give mesh to boid object
Boid.prototype.init_mesh_obj = function(){
    this.create_geometry();
    this.create_material();
    this.create_mesh(); // tapes material and geometry into a mesh
}

Boid.prototype.set_rotation = function(){ 
    this.rotation   = new THREE.Vector3();
    this.rotation.x = this.rotation.y = this.rotation.z = 0;

    this.rotation_v = new THREE.Vector3();
    this.rotation_v.x = Math.random()/10;
    this.rotation_v.y = Math.random()/10;
    this.rotation_v.z = Math.random()/10;
 }

// add boids
var n = 200, data = [];
for (var i = 0; i < n; i++){

    var b = new Boid();
    b.set_color();
    b.set_radius();
    b.init_mesh_obj();
    b.set_rotation();
    
    // dont have $p, but have something similar in particle three.js class
    b.setWorldSize(SCENE_WIDTH, SCENE_HEIGHT, SCENE_WIDTH * 1.5);

    data.push(b); 
    parent.add(b.mesh);

}



// Particle.prototype.update_mesh = function(){
//     // update rotation ( rotation is a vector of type Euler http://threejs.org/docs/#Reference/Math/Euler )
//     this.mesh.position.set(this.x, this.y, this.z);
//     this.mesh.rotation.setFromVector3(new THREE.Vector3(this.rx, this.ry, this.rz));

//     // calculate momentum and apply it to the color
//     var momentum = Math.sqrt( Math.pow(this.x_v,2) + Math.pow(this.y_v,2) + Math.pow(this.z_v,2) ) * this.radius;
//     var intensity = momentum/200;
//     if(intensity < 0) intensity = 0;
//     if(intensity > 1) intensity = 1;
//     this.mesh.material.color.setHSL( intensity, .1 + intensity * .85, .2 + intensity * .4);
// }



scene.add(parent);

// ------------------------------------------------------------------------------------------------
// Light

var ambientLight = new THREE.AmbientLight(0x444444);
scene.add(ambientLight);

var directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(10, 10, 10).normalize();
scene.add(directionalLight);

var directionalLight2 = new THREE.DirectionalLight(0xffffff);
directionalLight2.position.set(-10, -10, -10).normalize();
scene.add(directionalLight2);

// ------------------------------------------------------------------------------------------------
// add FPS using Stats.js

var stats = new Stats();
stats.setMode(0); // 0: fps, 1: ms
document.body.appendChild(stats.domElement);

// align top-left
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';

// ------------------------------------------------------------------------------------------------
// add controls and GUI

var controls = new function () {
    // add your params here
    this.x_rot_v = 0.02;
    this.y_rot_v = 0.02;
    this.z_rot_v = 0.02;
    this.p_x_rot_v = 0;
    this.p_y_rot_v = 0.01;
    this.p_z_rot_v = 0;
    this.ambient_light = true;
    this.direction_light = true;
    this.direction_light_2 = true;
}

var gui = new dat.GUI();
gui.add(controls, 'x_rot_v', 0, 0.5);
gui.add(controls, 'y_rot_v', 0, 0.5);
gui.add(controls, 'z_rot_v', 0, 0.5);
gui.add(controls, 'p_x_rot_v', 0, 0.5);
gui.add(controls, 'p_y_rot_v', 0, 0.5);
gui.add(controls, 'p_z_rot_v', 0, 0.5);


ambient_light = gui.add(controls, 'ambient_light');
ambient_light.onChange(function (value) {
    if (value) {
        scene.add(ambientLight);
    } else {
        scene.remove(ambientLight);
    }
});

direction_light = gui.add(controls, 'direction_light');
direction_light.onChange(function (value) {
    if (value) {
        scene.add(directionalLight);
    } else {
        scene.remove(directionalLight);
    }
});

direction_light_2 = gui.add(controls, 'direction_light_2');
direction_light_2.onChange(function (value) {
    if (value) {
        scene.add(directionalLight2);
    } else {
        scene.remove(directionalLight2);
    }
});


// ------------------------------------------------------------------------------------------------
// draw loop

function draw() {

    // start stats recording
    stats.begin();

    // only other place that boids is run
    // should name data boids
    for (var i = 0; i < data.length; i++) {
        data[i].run( data );

        // should create a seperate method that updates the positions together
        data[i].mesh.position.set(data[i].position.x,data[i].position.y,data[i].position.z)
    }

    parent.rotation.x += controls.p_x_rot_v;
    parent.rotation.y += controls.p_y_rot_v;
    parent.rotation.z += controls.p_z_rot_v;

    // render scene
    renderer.render(scene, camera);

    // end stats recording
    stats.end();

    // run again
    requestAnimationFrame(draw);
}

function render() {
  renderer.render( scene, camera );
}

// ------------------------------------------------------------------------------------------------
// start animation

requestAnimationFrame(draw);

// ------------------------------------------------------------------------------------------------



/*

HINT 2: Look for this section inside render_processing_boid.js for inspiration. The section where you implement your code looks like this:

// ---------------------------------------------------------
// boids

*** use this part as a reference ***

    // ---------------------------------------------------------
    // Boid Render Prototype Methods from processing

    // add properties
    Boid.prototype.set_hue  = function(){ this.hue = 180 * Math.random(); }
    Boid.prototype.set_radius = function(){ this.radius = Math.random() * 40; }
    Boid.prototype.set_rotation = function(){ 
        this.rotation   = new THREE.Vector3();
        this.rotation.x = this.rotation.y = this.rotation.z = 0;

        this.rotation_v = new THREE.Vector3();
        this.rotation_v.x = Math.random()/10;
        this.rotation_v.y = Math.random()/10;
        this.rotation_v.z = Math.random()/10;
     }

    // draw method
    Boid.prototype.draw = function(){
        // color
        // var velocity_length = Math.sqrt( Math.pow(this.velocity.x,2) + Math.pow(this.velocity.y,2) + Math.pow(this.velocity.z,2) );
        var momentum = this.velocity.length() * this.radius;
        var intensity = momentum/150 * 360;
        $p.fill(intensity, intensity, intensity, 270);

        // rotate
        this.rotation.add(this.rotation_v);
        
        // 3D shape
        $p.translate(this.position.x, this.position.y, this.position.z);
        $p.rotate(this.rotation.x, this.rotation.y, this.rotation.z);
        $p.box(this.radius);
        $p.rotate(-this.rotation.x, -this.rotation.y, -this.rotation.z);
        $p.translate(-this.position.x, -this.position.y, -this.position.z);
    }

    // add boids
    var n = 200, data = [];
    for (var i = 0; i < n; i++){
        data[i] = new Boid();
        data[i].set_hue();
        data[i].set_radius();
        data[i].set_rotation();
        data[i].setWorldSize($p.width, $p.height, $p.width * 1.5);

        /*can also do this
        var particle = new Boid();
        particle.set_hue();
        particle.set_radius();
        particle.set_rotation();
        particle.setWorldSize($p.width, $p.height, $p.width * 1.5);

        data.push(partcile) 

    }

// ---------------------------------------------------------
// setup

*/




/*

Finally, put the boids with three js renderer in your portfolio. This completes your training in introductory data visualization!

*/


