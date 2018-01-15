// Models
VisualEntityModel.TRANSIT_ZONE = new VisualEntityModel('tz', '/assets/road.png');
VisualEntityModel.SAFE_ZONE = new VisualEntityModel('sz', '/assets/grass.png');

// Super class
class Zone extends VisualEntity {
    constructor (id, position, model=VisualEntityModel.DEFAULT) {
        super(id, position, model);
        this._layer = IndexLayer.LEVEL_1;
        this._child = undefined;
        this._allowedChilds = undefined;
    }
    hasChild () {
        return this._child != undefined;
    }
    getChild () {
        return this._child;
    }
    allowsChildModel(childModel) {
        for (var allowedClass of this._allowedChilds) {
            if (childModel.getEntity() == allowedClass ||                   //checks if the entity of the childModel is the same as...
                childModel.getEntity().prototype instanceof allowedClass) { //checks if the entity of the childModel is subclass of...
                return true;
            }
        }
        return false;
    }
    setChild(child) {
        if (this.allowsChildModel(child.getModel())) {
            this._child = child;
        }
    }
    removeChild() {
        this._child = undefined;
    }
    getMappedEntity() {
        return {zone: this._model.getCode(), entities: {}};
    }
}

// Sub classes
class TransitZone extends Zone {
    constructor (id, position) {
        super(id, position, VisualEntityModel.TRANSIT_ZONE);
        this._allowedChilds = [Vehicle, PowerUp];
    }
}
VisualEntityModel.TRANSIT_ZONE.setEntity(TransitZone);

class SafeZone extends Zone {
    constructor (id, position) {
        super(id, position, VisualEntityModel.SAFE_ZONE);
        this._allowedChilds = [InanimateObject];
    }
}
VisualEntityModel.SAFE_ZONE.setEntity(SafeZone);