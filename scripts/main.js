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

function initObjs() {

	var earth = new spaceObj({texture: "imgs/texture_earth.jpg", size: 100});
	OBJECTS['earth'] = earth;
	SCENE.add(OBJECTS['earth'].getMesh());

	// var sun
};

function loop() {
	requestAnimationFrame(loop);
	RENDER.render(SCENE, CAMERA);
};
