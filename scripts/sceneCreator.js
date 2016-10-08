function createScene(props, centerName, cameraStartZPos, hasPointLight) {
    this.scene = new THREE.Scene();
    this.sceneObjects = [];
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10000);
    this.camera.position.z = cameraStartZPos || 200;

    //Lighting
    if (hasPointLight) {
        //adding light from the sun
        var light = new THREE.PointLight(0xf2f2dc, 2, ASTRO_ONE * 5);
        light.position.set(0, 0, 0);
        light.castShadow = true;
        light.ShadowMapWidth = 2048;
        light.ShadowMapHeight = 2048;
        this.sceneObjects.push(light);
        this.scene.add(light);

        var ambLight = new THREE.AmbientLight(0xf2f2dc, 0.2);
        this.scene.add(ambLight);
    }
    else {
        var ambLight = new THREE.AmbientLight(0xf2f2dc, 0.5);
        this.scene.add(ambLight);
    }

    //Adding stars
    var starsSystem;
    var stGeom = new THREE.Geometry();
    var stMat = new THREE.ParticleBasicMaterial({size: 1, sizeAttenuation: false});
    for (var i = 0; i < backgroundStarsAmount; i++) {
        var vert = new THREE.Vector3();
        vert.x = Math.random() * 2 - 1;
        vert.y = Math.random() * 2 - 1;
        vert.z = Math.random() * 2 - 1;

        vert.multiplyScalar(5000);

        stGeom.vertices.push(vert);
    }
    starsSystem = new THREE.ParticleSystem(stGeom, stMat);
    this.sceneObjects.push(starsSystem);
    this.scene.add(starsSystem);

    //Adding objects from the list
    for (var key = 0; key < props.length; key++) {
        this.sceneObjects.push(props[key]);
        this.scene.add(props[key].mesh);
    }

    this.loopFunction = function () {
        for(var i = 2; i < this.sceneObjects.length; i++) {
            this.sceneObjects[i].selfRotating();
            if(this.sceneObjects[i].name !== centerName) {
                this.sceneObjects[i].orbitRotating();
            }
        }
    }
}
