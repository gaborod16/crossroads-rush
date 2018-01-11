VisualEntityModel.SHEEP = new VisualEntityModel('sh', '/assets/sheep.png');

class Sheep extends MobileEntity {
    constructor (id, position) {
        super(id, position, VisualEntityModel.SHEEP);
        this._layer = IndexLayer.LEVEL_2;
        this._alive = true;
        this._currentState = 'sheepState';
        this._currentPower = undefined;
    }
}
VisualEntityModel.SHEEP.setEntity(Sheep);

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