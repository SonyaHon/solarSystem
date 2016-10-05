function spaceObj(props) {
    this.texture = props['texture'];
    this.size = props['size'];
    var geom = new THREE.SphereGeometry(this.size, 15, 15);
    var mat = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(this.texture)});
    this.mesh = new THREE.Mesh(geom, mat);

    this.mesh.position.x = props['x'] || 0;
    this.mesh.position.y = props['y'] || 0;
    this.mesh.position.z = props['z'] || 0;
};

spaceObj.prototype.getMesh = function() {
    return this.mesh;
};

spaceObj.prototype.getTexture = function () {
    return this.texture;
}

spaceObj.prototype.animate = function () {
    this.mesh.position.x = this.mesh.position.x * Math.cos((180/Math.PI)*10) -
        this.mesh.position.y * Math.sin((180/Math.PI)*10);
    this.mesh.position.y = this.mesh.position.y * Math.cos((180/Math.PI)*10) +
        this.mesh.position.y * Math.sin((180/Math.PI)*10);
}