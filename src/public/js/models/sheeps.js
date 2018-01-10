VisualEntityModel.SHEEP = new VisualEntityModel('sh', '/assets/sheep.png');

class Sheep extends MobileEntity {
    constructor (id, position) {
        super(id, position);
        this._resource = VisualEntityModel.SHEEP.getResource();
        this._code = VisualEntityModel.SHEEP.getCode();
        this._layer = IndexLayer.LEVEL_2;
        this._alive = true;
        this._currentState = 'sheepState';
        this._currentPower = undefined;
    }
}

class SheepState {
    constructor (sheep) {
        this._sheep = sheep;
    }
}
class SheepMoving extends SheepState {
    constructor (sheep) {
        super(sheep);
    }
}
class SheepStanding extends SheepState {
    constructor (sheep) {
        super(sheep);
    }
}