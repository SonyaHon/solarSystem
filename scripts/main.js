var SCENE, CAMERA, RENDER; // for render and cam
var OBJECTS = []; // all scene objects;
var EARTH_SIZE = 1;
var KILLOMETR = 0.0001;
var ASTRO_ONE = 100;



function init() {
	var container = document.createElement('div');
	document.body.appendChild(container);

	CAMERA = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.1, 10000);
	
	CAMERA.position.y = 0;
	CAMERA.position.z = 70;

	SCENE = new THREE.Scene();

	RENDER = new THREE.WebGLRenderer();
	RENDER.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(RENDER.domElement);

	initObjs(); // init all objects and add them to scene
	loop(); // main programm loop
};

function initObjs() {

	var earth = new spaceObj({texture: "imgs/texture_earth.jpg", size: EARTH_SIZE, x: ASTRO_ONE});
	OBJECTS['earth'] = earth;
	SCENE.add(OBJECTS['earth'].getMesh());

	var sun = new spaceObj({texture: "imgs/texture_sun.jpg", size: 109 * EARTH_SIZE / 3});
	OBJECTS['sun'] = sun;
	SCENE.add(OBJECTS['sun'].getMesh());
};

function loop() {
	requestAnimationFrame(loop);
	OBJECTS['sun'].animate();
	RENDER.render(SCENE, CAMERA);
};
