function spaceObj(props) {
    this.texture = props['texture'];
    this.size = props['size'];
    this.distanceFromSun = props['dist'];
    var geom = new THREE.SphereGeometry(this.size, 15, 15);
    var mat = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(this.texture)});
    this.mesh = new THREE.Mesh(geom, mat);

    this.mesh.position.x = props['pos']['x'] || 0;
    this.mesh.position.y = props['pos']['y'] || 0;
    this.mesh.position.z = props['pos']['z'] || 0;
};

spaceObj.prototype.getMesh = function() {
    return this.mesh;
};

spaceObj.prototype.getTexture = function () {
    return this.texture;
}