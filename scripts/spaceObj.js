function spaceObj(props) {
    // Mesh geometry and textures
    this.texture = props['texture'];
    this.size = props['size'];
    this.isLightSource = props['isLightSource'] || false;
    var geom = new THREE.SphereGeometry(this.size, 32, 32);
    if(this.isLightSource)
        var mat = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(this.texture)});
    else
        var mat = new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load(this.texture)});
    this.mesh = new THREE.Mesh(geom, mat);

    // Beginning position
    this.mesh.position.x = props['x'] || 0;
    this.mesh.position.y = props['y'] || 0;
    this.mesh.position.z = props['z'] || 0;

    // Orbits and rotating
    this.speedOfSelfRotating = props['selfRotatingSpeed'] || 0.001;
    this.orbitAngle = 0;
    var dist = Math.sqrt(this.mesh.position.x*this.mesh.position.x
        + this.mesh.position.y*this.mesh.position.y
        + this.mesh.position.z + this.mesh.position.z);
    this.distanceFromSun = props['distanceFromSun'] || dist;
    this.orbitRotationSpeed = props['orbitRotationSpeed'] || 0.00001; // CHANGE CAREFULLY!!!
    this.orbitCoef = props['orbitCoef'] || 1;
    
};

spaceObj.prototype.getMesh = function() {
    return this.mesh;
};


spaceObj.prototype.selfRotating = function () {
    this.mesh.rotation.y += this.speedOfSelfRotating;
    this.mesh.rotation.z += this.speedOfSelfRotating;
};

spaceObj.prototype.orbitRotating = function () {
    this.mesh.position.z = -Math.sin(this.orbitAngle*0.1)*this.distanceFromSun;
    this.mesh.position.x = Math.cos(this.orbitAngle*0.1)*this.distanceFromSun;
    this.orbitAngle += 180/Math.PI*this.orbitRotationSpeed;
};