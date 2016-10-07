var SCENE, CAMERA, RENDER; // for render and cam
var OBJECTS = []; // all scene objects;
var EARTH_SIZE = 1;
var ASTRO_ONE = 100; // Коэфицент перехода к нормальной астрономической единице = 1498е+6
var EARTH_YEAR = 0.00001;

// WASD camera movement
var CAMERA_SPEED = 0.5;
var CAMERA_HOR_AXIS = 0;
var CAMERA_VERT_AXIS = 0;

// Camera rotation
var CAMERA_ROT_SPEED = 0.009;
var MOUSEX_OFFSET = 0;
var MOUSEY_OFFSET = 0;
var cameraXAngle;
var cameraYAngle;
var cameraZAngle = 0;
var canCamRotate = false;

var backgroundStarsAmount = 3000;

// planet infos
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var INTERSECTED;
var mousePressed = false;

var settings = {
	time_speed: 1,
    help: function () {
        $("#info").html("Controls:<br> Use wasd for movement.<br> Use mouse and qe for rotation. <br> Hold " +
            "ctrl to move mouse without camera rotation. <br><br>" +
            "Press HELP again to close this window.");
        $("#info").toggle();
    },
    camera_speed: 0.5
};




function init() {
	var container = document.createElement('div');
	document.body.appendChild(container);

	CAMERA = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.1, 10000);
	
	CAMERA.position.y = 0;
	CAMERA.position.z = 400;

	SCENE = new THREE.Scene();

	RENDER = new THREE.WebGLRenderer();
	RENDER.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(RENDER.domElement);

	document.addEventListener('mousemove', function (event) {
		MOUSEX_OFFSET = event.clientX - window.innerWidth / 2;
		MOUSEY_OFFSET = event.clientY - window.innerHeight / 2;

		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	});

	document.addEventListener('keydown', function(event){
		console.log(event.key);
		if(event.key == "w") {
			//CAMERA.translateZ(-CAMERA_SPEED);
			CAMERA_VERT_AXIS = -1;
		}
		else if (event.key == "s") {
			//CAMERA.translateZ(CAMERA_SPEED);
			CAMERA_VERT_AXIS = 1;
		}

		if(event.key == "a") {
			//CAMERA.translateX(-CAMERA_SPEED);
			CAMERA_HOR_AXIS = -1;
		}
		else if (event.key == "d") {
			//CAMERA.translateX(CAMERA_SPEED);
			CAMERA_HOR_AXIS = 1;
		}

		if(event.key == "Control") {
			canCamRotate = true;
		}
		if(event.key == "q") {
			cameraZAngle = -1;
		}
		else if (event.key == "e") {
			cameraZAngle = 1;
		}
	});

	document.addEventListener('keyup', function (event) {
		if(event.key == "w" || event.key == "s") {
			CAMERA_VERT_AXIS = 0;
		}
		if(event.key == "a" || event.key == "d") {
			CAMERA_HOR_AXIS = 0;
		}
		if(event.key == "Control") {
			canCamRotate = false;
		}

		if(event.key == "q") {
			cameraZAngle = 0;
		}

		if(event.key == "e") {
			cameraZAngle = 0;
		}
	});

    document.addEventListener('mousedown', function () {
        mousePressed = true;
    });

    document.addEventListener('mouseup', function () {
        mousePressed = false;
    });

	initObjs(); // init all objects and add them to scene
	loop(); // main programm loop

    var gui = new dat.GUI();
    gui.add(settings, 'help');
    gui.add(settings, 'time_speed', 1, 10000);
    gui.add(settings, 'camera_speed', 0.00, 10);

};

function initObjs() {

	// Stars in the  background
	var starsSystem;
	var stGeom = new THREE.Geometry();
	var stMat = new THREE.ParticleBasicMaterial({size: 1, sizeAttenuation: false});
	for(var i = 0; i < backgroundStarsAmount; i++) {
		var vert = new THREE.Vector3();
		vert.x = Math.random()*2-1;
		vert.y = Math.random()*2-1;
		vert.z = Math.random()*2-1;

		vert.multiplyScalar(5000);

		stGeom.vertices.push(vert);
	}

	starsSystem = new THREE.ParticleSystem(stGeom, stMat);
	OBJECTS['starSystem'] = starsSystem;
	SCENE.add(starsSystem);

	var sun = new spaceObj({texture: "imgs/texture_sun.jpg", size: 109 * EARTH_SIZE / 3, isLightSource: true});
	OBJECTS['sun'] = sun;
	SCENE.add(OBJECTS['sun'].getMesh());

	//adding light from the sun
	var light = new THREE.PointLight(0xf2f2dc, 2, ASTRO_ONE * 5);
	light.position.set(0, 0, 0);
	light.castShadow = true;
	light.ShadowMapWidth = 2048;
	light.ShadowMapHeight = 2048;
	OBJECTS['light'] = light;
	SCENE.add(light);

	// adding ambient occlusion
	var ambLight = new THREE.AmbientLight(0xf2f2dc, 0.2);
	SCENE.add(ambLight);


	var mercury = new spaceObj({texture: "imgs/texture_mercury.jpg", size: EARTH_SIZE / 3, x: 0.5*ASTRO_ONE,
	orbitRotationSpeed: EARTH_YEAR * 4, orbitCoef: 4, info: "Its a mercury, closest planet to sun."});
	OBJECTS['mercury'] = mercury;
	SCENE.add(OBJECTS['mercury'].getMesh());

	var venus = new spaceObj({texture: "imgs/texture_venus.jpg", size: EARTH_SIZE * 0.95, x: ASTRO_ONE*0.75,
	orbitRotationSpeed: EARTH_YEAR * 1.05, orbitCoef: 1.05});
	OBJECTS['venus'] = venus;
	SCENE.add(OBJECTS['venus'].getMesh());

	var earth = new spaceObj({texture: "imgs/texture_earth.jpg", size: EARTH_SIZE, x: ASTRO_ONE,
    orbitRotationSpeed: EARTH_YEAR, orbitCoef: 1});
	OBJECTS['earth'] = earth;
	SCENE.add(OBJECTS['earth'].getMesh());

	var mars = new spaceObj({texture: "imgs/texture_mars.jpg", size: EARTH_SIZE * 0.5, x: ASTRO_ONE*1.4,
		orbitRotationSpeed: EARTH_YEAR * 0.55, orbitCoef: 0.55});
	OBJECTS['mars'] = mars;
	SCENE.add(OBJECTS['mars'].getMesh());

	var jupiter = new spaceObj({texture: "imgs/texture_jupiter.jpg", size: EARTH_SIZE * 12.5, x: ASTRO_ONE*2,
		orbitRotationSpeed: EARTH_YEAR * 0.08, orbitCoef: 0.08});
	jupiter.getMesh().CastShadow = true;
	OBJECTS['jupiter'] = jupiter;
	SCENE.add(OBJECTS['jupiter'].getMesh());

	var saturn = new spaceObj({texture: "imgs/texture_saturn.jpg", size: EARTH_SIZE * 10, x: ASTRO_ONE*3,
		orbitRotationSpeed: EARTH_YEAR * 0.03, orbitCoef: 0.03});
	OBJECTS['saturn'] = saturn;
	SCENE.add(OBJECTS['saturn'].getMesh());

	var urane = new  spaceObj({texture: "imgs/texture_urane.jpg", size: EARTH_SIZE * 4, x: ASTRO_ONE*4,
		orbitRotationSpeed: EARTH_YEAR * 0.001, orbitCoef: 0.001});
	OBJECTS['urane'] = urane;
	SCENE.add(OBJECTS['urane'].getMesh());

	var neptune = new  spaceObj({texture: "imgs/texture_neptune.jpg", size: EARTH_SIZE * 4, x: ASTRO_ONE*4.5,
		orbitRotationSpeed: EARTH_YEAR * 0.0007, orbitCoef: 0.0007});
	OBJECTS['neptune'] = neptune;
	SCENE.add(OBJECTS['neptune'].getMesh());

};

function loop() {
	requestAnimationFrame(loop);

    //update some globals
    for(var key in OBJECTS) {
        OBJECTS[key].orbitRotationSpeed = EARTH_YEAR * OBJECTS[key].orbitCoef * settings.time_speed;
    }
    CAMERA_SPEED = settings.camera_speed;


	// solar system stuff
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

	OBJECTS['urane'].selfRotating();
	OBJECTS['urane'].orbitRotating();

	OBJECTS['neptune'].selfRotating();
	OBJECTS['neptune'].orbitRotating();

	//camera movement
	CAMERA.translateZ(CAMERA_SPEED*CAMERA_VERT_AXIS);
	CAMERA.translateX(CAMERA_SPEED*CAMERA_HOR_AXIS);

	// camera rotation
	if(!canCamRotate) {
		if (Math.abs(MOUSEX_OFFSET) > 50) {
			var multy1 = (Math.abs(MOUSEX_OFFSET*100)/(window.innerWidth/2))/90;
			cameraXAngle = CAMERA_ROT_SPEED * Math.sign(MOUSEX_OFFSET)*multy1;
		}
		else if (Math.abs(MOUSEX_OFFSET) <= 50) {
			cameraXAngle = 0;
		}

		if (Math.abs(MOUSEY_OFFSET) > 50) {
			var multy2 = (Math.abs(MOUSEY_OFFSET*100)/(window.innerHeight/2))/90;
			cameraYAngle = CAMERA_ROT_SPEED * Math.sign(MOUSEY_OFFSET) *multy2;
		}
		else if (Math.abs(MOUSEY_OFFSET) <= 50) {
			cameraYAngle = 0;
		}

		CAMERA.rotateY(-cameraXAngle);
		CAMERA.rotateX(-cameraYAngle);
		CAMERA.rotateZ(-cameraZAngle*0.007);
	}

	raycaster.setFromCamera( mouse, CAMERA );
	var intersects = raycaster.intersectObjects( SCENE.children );
	if(intersects.length > 0) {
	    if(INTERSECTED != intersects[0].object) {
                INTERSECTED = intersects[0].object;
            if(INTERSECTED.material.emissive != null) {
                INTERSECTED.material.emissive.set(0x660000);
            }
            else {
                INTERSECTED.material.color.set(0x660000);
            }
        }
    }
    else {
        if(INTERSECTED != null) {
            if(INTERSECTED.material.emissive != null) {
                INTERSECTED.material.emissive.set(0x000000);
            }
            else {
                INTERSECTED.material.color.set(0xffffff);
            }
            INTERSECTED = null;
        }
    }

    if(INTERSECTED != null && mousePressed) {
        for(var key in OBJECTS) {
            if(OBJECTS[key].mesh === INTERSECTED) {
                $("#info").html(OBJECTS[key].info);
                $("#info").show();
            }
        }
        mousePressed = false;
    }
    else if(INTERSECTED == null && mousePressed) {
        $("#info").html("");
        $("#info").hide();
    }

	RENDER.render(SCENE, CAMERA);
};

