var SCENE, CAMERA, RENDER; // for render and cam
var OBJECTS = []; // all scene objects;

function init() {
	var container = document.createElement('div');
	document.body.appendChild(container);

	CAMERA = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.1, 1000);
	
	CAMERA.position.y = 0;
	CAMERA.position.z = 600;

	SCENE = new THREE.Scene();

	RENDER = new THREE.WebGLRenderer();
	RENDER.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(RENDER.domElement);

	initObjs(); // init all objects and add them to scene
	loop(); // main programm loop
};

function spaceObj(props) {
	this.texture = props['texture'];
	this.size = props['size'];
	this.distanceFromSun = props['dist'];
	var geom = new THREE.SphereGeometry(this.size, 15, 15);
	var mat = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(this.texture)});
	this.mesh = new THREE.Mesh(geom, mat);
};

spaceObj.prototype.getMesh = function() {
	return this.mesh;
};

function initObjs() {

	var earth = new spaceObj({texture: "imgs/texture_earth.jpg", size: 100});
	OBJECTS.push(earth);

	//TODO sun and planet position

	for(var obj = 0; obj < OBJECTS.length; obj++) {
		SCENE.add(OBJECTS[obj].getMesh());
	}
};

function loop() {
	requestAnimationFrame(loop);
	RENDER.render(SCENE, CAMERA);
};
