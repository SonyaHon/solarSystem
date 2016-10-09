var RENDER;
var EARTH_SIZE = 1;
var ASTRO_ONE = 100; // Коэфицент перехода к нормальной астрономической единице = 1498е+6
var EARTH_YEAR = 0.00001;

var currentScene = null;
var scenes = [];

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


// GUI
var settings = {
	time_speed: 1,
    help: function () {
        $("#info").html("Controls:<br> Use wasd for movement.<br> Use mouse and qe for rotation. <br> Hold " +
            "ctrl to move mouse without camera rotation. <br><br>" +
            "Press HELP again to close this window.");
        $("#info").toggle();
    },
    camera_speed: 0.5,
	GoToSun: function () {
		currentScene = scenes['sun'];
		currentScene.camera.position.x = 0;
		currentScene.camera.position.y = 0;
		currentScene.camera.position.z = currentScene.cameraZ;
		$("#info").hide();
	}
};




function init() {
	var container = document.createElement('div');
	document.body.appendChild(container);

	var earthScene = new createScene([
		new spaceObj({texture: "imgs/texture_earth.jpg", size: EARTH_SIZE,
			orbitRotationSpeed: EARTH_YEAR, orbitCoef: 1, info: infos.earth, name: "earth"}),
		new spaceObj({texture: "imgs/texture_moon.jpg", size: 0.2 * EARTH_SIZE, info: infos.moon,
			orbitRotationSpeed: EARTH_YEAR, orbitCoef: 1, name: "moon", x: EARTH_SIZE * 2})
		],
		"earth",
		6,
		false
	);

	scenes['earth'] = earthScene;

	var mainScene = new createScene([
			new spaceObj({texture: "imgs/texture_sun.jpg", size: 109 * EARTH_SIZE / 3, isLightSource: true,
				info: infos.sun, name: "sun"}),
			new spaceObj({texture: "imgs/texture_mercury.jpg", size: EARTH_SIZE / 3, x: 0.5*ASTRO_ONE,
				orbitRotationSpeed: EARTH_YEAR * 4, orbitCoef: 4, info: infos.mercury, name: "mercury"}),
			new spaceObj({texture: "imgs/texture_venus.jpg", size: EARTH_SIZE * 0.95, x: ASTRO_ONE*0.75,
				orbitRotationSpeed: EARTH_YEAR * 1.05, orbitCoef: 1.05, info: infos.venus, name: "venus"}),
			new spaceObj({texture: "imgs/texture_earth.jpg", size: EARTH_SIZE, x: ASTRO_ONE,
				orbitRotationSpeed: EARTH_YEAR, orbitCoef: 1, info: infos.earth, name: "earth"}),
			new spaceObj({texture: "imgs/texture_mars.jpg", size: EARTH_SIZE * 0.5, x: ASTRO_ONE*1.4,
				orbitRotationSpeed: EARTH_YEAR * 0.55, orbitCoef: 0.55, info: infos.mars, name: "mars"}),
			new spaceObj({texture: "imgs/texture_jupiter.jpg", size: EARTH_SIZE * 12.5, x: ASTRO_ONE*2,
				orbitRotationSpeed: EARTH_YEAR * 0.08, orbitCoef: 0.08, info: infos.jupiter, name: "jupiter"}),
			new spaceObj({texture: "imgs/texture_saturn.jpg", size: EARTH_SIZE * 10, x: ASTRO_ONE*3,
				orbitRotationSpeed: EARTH_YEAR * 0.03, orbitCoef: 0.03, info: infos.saturn, name: "saturn"}),
			new spaceObj({texture: "imgs/texture_urane.jpg", size: EARTH_SIZE * 4, x: ASTRO_ONE*4,
				orbitRotationSpeed: EARTH_YEAR * 0.001, orbitCoef: 0.001, info: infos.uranus, name: "uranus"}),
			new spaceObj({texture: "imgs/texture_neptune.jpg", size: EARTH_SIZE * 4, x: ASTRO_ONE*4.5,
				orbitRotationSpeed: EARTH_YEAR * 0.0007, orbitCoef: 0.0007, info: infos.neptune, name: "neptune"})
		],
		"sun",
		200,
		true
	);
	scenes['sun'] = mainScene;

	currentScene = mainScene;

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

	container.addEventListener('mousedown', function () {
        mousePressed = true;
    });

	container.addEventListener('mouseup', function () {
        mousePressed = false;
    });


	loop(); // main programm loop

	var gui = new dat.GUI();
    gui.add(settings, 'help');
    gui.add(settings, 'time_speed', 1, 10000);
    gui.add(settings, 'camera_speed', 0.00, 10);
	gui.add(settings, 'GoToSun');
};

function loop() {
	requestAnimationFrame(loop);

    //update some globals
    for(var key in currentScene.sceneObjects) {
        currentScene.sceneObjects[key].orbitRotationSpeed = EARTH_YEAR * currentScene.sceneObjects[key].orbitCoef * settings.time_speed;
    }
    CAMERA_SPEED = settings.camera_speed;

	//Scene update
	currentScene.loopFunction();

	//camera movement
	currentScene.camera.translateZ(CAMERA_SPEED*CAMERA_VERT_AXIS);
	currentScene.camera.translateX(CAMERA_SPEED*CAMERA_HOR_AXIS);

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

		currentScene.camera.rotateY(-cameraXAngle);
		currentScene.camera.rotateX(-cameraYAngle);
		currentScene.camera.rotateZ(-cameraZAngle*0.007);
	}

	raycaster.setFromCamera( mouse, currentScene.camera );
	var intersects = raycaster.intersectObjects( currentScene.scene.children );
	if(intersects.length > 0) {
	    if(INTERSECTED != intersects[0].object) {
	    	if(INTERSECTED != null) {
	    		if(INTERSECTED.material.emissive != null) {
	    			INTERSECTED.material.emissive.set(0x000000);
				}
				else {
					INTERSECTED.material.color.set(0xffffff);
				}
			}
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
        for(var key in currentScene.sceneObjects) {
            if(currentScene.sceneObjects[key].mesh === INTERSECTED) {
				$("#info").html("Name: " +currentScene.sceneObjects[key].name + "<br>" +
					currentScene.sceneObjects[key].info + "<br>");
				var index = currentScene.sceneObjects[key];
				if(currentScene == scenes['sun']) {
					var button = document.createElement('button');
					button.onclick = function () {
						asd(index);
					}
					document.getElementById("info").appendChild(button);
					$("#info button").html("Go to");
				}
                $("#info").show();
            }
        }
        mousePressed = false;
    }
    else if(INTERSECTED == null && mousePressed) {
        $("#info").html("");
        $("#info").hide();
    }


	RENDER.render(currentScene.scene, currentScene.camera);
};

function asd(obj) {
	currentScene = scenes[obj.name];
	currentScene.camera.position.x = 0;
	currentScene.camera.position.y = 0;
	currentScene.camera.position.z = currentScene.cameraZ;
	$("#info").hide();
}
