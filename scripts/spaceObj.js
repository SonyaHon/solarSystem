function spaceObj(props) {
    // Mesh geometry and textures
    this.texture = props['texture'];
    this.size = props['size'];
    var geom = new THREE.SphereGeometry(this.size, 32, 32);
    var mat = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(this.texture)});
    this.mesh = new THREE.Mesh(geom, mat);

    // Begining position
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
    this.orbitRotationSpeed = props['orbitRotationSpeed'] || 0.0007; // CHANGE CAREFULLY!!!
    
};

spaceObj.prototype.getMesh = function() {
    return this.mesh;
};

spaceObj.prototype.getTexture = function () {
    return this.texture;
}

spaceObj.prototype.selfRotating = function () {
    this.mesh.rotation.y += this.speedOfSelfRotating;
    this.mesh.rotation.z += this.speedOfSelfRotating;
}

spaceObj.prototype.orbitRotating = function () {
    this.mesh.position.z = -Math.sin(this.orbitAngle*0.1)*this.distanceFromSun; // TODO maybe change to real orbits x and y
    this.mesh.position.x = Math.cos(this.orbitAngle*0.1)*this.distanceFromSun;
    this.orbitAngle += 180/Math.PI*this.orbitRotationSpeed;
}