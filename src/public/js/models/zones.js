// Models
VisualEntityModel.TRANSIT_ZONE = new VisualEntityModel('tz', '/assets/road.png');
VisualEntityModel.SAFE_ZONE = new VisualEntityModel('sz', '/assets/grass.png');

// Super class
class Zone extends VisualEntity {
    constructor (id, position) {
        super(id, position);
        this._layer = IndexLayer.LEVEL_1;
    }
}

// Sub classes
class TransitZone extends Zone {
    constructor (id, position) {
        super(id, position);
        this._resource = VisualEntityModel.TRANSIT_ZONE.getResource();
        this._code = VisualEntityModel.TRANSIT_ZONE.getCode();
    }
}

class SafeZone extends Zone {
    constructor (id, position) {
        super(id, position);
        this._resource = VisualEntityModel.SAFE_ZONE.getResource();
        this._code = VisualEntityModel.SAFE_ZONE.getCode();
    }
}