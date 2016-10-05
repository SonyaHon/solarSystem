var SCENE, CAMERA, RENDER; // for render and cam
var OBJECTS = []; // all scene objects;
var EARTH_SIZE = 1;
var ASTRO_ONE = 100; // Коэфицент перехода к нормальной астрономической единице = 1498е+6
var EARTH_YEAR = 0.0007;

function init() {
	var container = document.createElement('div');
	document.body.appendChild(container);

	CAMERA = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.1, 10000);
	
	CAMERA.position.y = 0;
	CAMERA.position.z = 200;

	SCENE = new THREE.Scene();

	RENDER = new THREE.WebGLRenderer();
	RENDER.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(RENDER.domElement);

	initObjs(); // init all objects and add them to scene
	loop(); // main programm loop
};

function initObjs() {

	var sun = new spaceObj({texture: "imgs/texture_sun.jpg", size: 109 * EARTH_SIZE / 3});
	OBJECTS['sun'] = sun;
	SCENE.add(OBJECTS['sun'].getMesh());

	var mercury = new spaceObj({texture: "imgs/texture_mercury.jpg", size: EARTH_SIZE / 3, x: 0.5*ASTRO_ONE,
	orbitRotationSpeed: EARTH_YEAR * 4});
	OBJECTS['mercury'] = mercury;
	SCENE.add(OBJECTS['mercury'].getMesh());

	var venus = new spaceObj({texture: "imgs/texture_venus.jpg", size: EARTH_SIZE * 0.95, x: ASTRO_ONE*0.75,
	orbitRotationSpeed: EARTH_YEAR * 1.05});
	OBJECTS['venus'] = venus;
	SCENE.add(OBJECTS['venus'].getMesh());

	var earth = new spaceObj({texture: "imgs/texture_earth.jpg", size: EARTH_SIZE, x: ASTRO_ONE});
	OBJECTS['earth'] = earth;
	SCENE.add(OBJECTS['earth'].getMesh());

	var mars = new spaceObj({texture: "imgs/texture_mars.jpg", size: EARTH_SIZE * 0.5, x: ASTRO_ONE*1.4,
		orbitRotationSpeed: EARTH_YEAR * 0.55});
	OBJECTS['mars'] = mars;
	SCENE.add(OBJECTS['mars'].getMesh());

	var jupiter = new spaceObj({texture: "imgs/texture_jupiter.jpg", size: EARTH_SIZE * 12.5, x: ASTRO_ONE*2,
		orbitRotationSpeed: EARTH_YEAR * 0.08});
	OBJECTS['jupiter'] = jupiter;
	SCENE.add(OBJECTS['jupiter'].getMesh());

	var saturn = new spaceObj({texture: "imgs/texture_saturn.jpg", size: EARTH_SIZE * 10, x: ASTRO_ONE*3,
		orbitRotationSpeed: EARTH_YEAR * 0.03});
	OBJECTS['saturn'] = saturn;
	SCENE.add(OBJECTS['saturn'].getMesh());
};

function loop() {
	requestAnimationFrame(loop);

	OBJECTS['sun'].selfRotating();

	OBJECTS['mercury'].selfRotating();
	OBJECTS['mercury'].orbitRotating();

	OBJECTS['venus'].selfRotating();
	OBJECTS['venus'].orbitRotating();

	OBJECTS['earth'].selfRotating();
	OBJECTS['earth'].orbitRotating();

	OBJECTS['mars'].selfRotating();
	OBJECTS['mars'].orbitRotating();

	OBJECTS['jupiter'].selfRotating();
	OBJECTS['jupiter'].orbitRotating();

	OBJECTS['saturn'].selfRotating();
	OBJECTS['saturn'].orbitRotating();

	RENDER.render(SCENE, CAMERA);
};
