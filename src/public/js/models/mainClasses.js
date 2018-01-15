const MapLevel = {
    LEVEL_1: {
        code: 'LEVEL_1',
        vehicleSpace: 6 // Number of cells before appearing another car
    },
    LEVEL_2: {
        code: 'LEVEL_2',
        vehicleSpace: 5
    },
    LEVEL_3: {
        code: 'LEVEL_3',
        vehicleSpace: 4
    },
    LEVEL_4: {
        code: 'LEVEL_4',
        vehicleSpace: 3
    },
    LEVEL_5: {
        code: 'LEVEL_5',
        vehicleSpace: 2
    } 
}

const IndexLayer = {
    NO_LEVEL: 0,
    LEVEL_1: 1,  // First to be drawn, therefore, on bottom.
    LEVEL_2: 2,
    LEVEL_3: 3,
    LEVEL_4: 4,
    LEVEL_5: 5   // Last to be drawn, therefore, on top.
};

class Position {
    constructor(x,y,tileSize) {
        this._x = x;
        this._y = y;
        this._tileSize = tileSize;
    }
    getX() {
        return this._x;
    }
    getY() {
        return this._y;
    }
    getTileSize() {
        return this._tileSize;
    }
    getRealX() {
        return this._tileSize * this._x;
    }
    getRealY() {
        return this._tileSize * this._y;
    }
    update(x,y) {
        this._x = this._x + x;
        this._y = this._y + y;
    }
    setCoordinates(x,y) {
        this._x = x;
        this._y = y;
    }
    clone() {
        return new Position(this._x, this._y, this._tileSize);
    }
    isEquals(position) {
        return position.getX() == this._x && position.getY() == this._y;
    }
}

class RealPosition extends Position{
    constructor(x,y,tileSize,rx=undefined,ry=undefined) {
        super(x,y,tileSize);
        if (rx) {
            this._realX = rx;
        }
        else {
            this._realX = this._tileSize * this._x;
        }
        if (ry) {
            this._realY = ry;
        }
        else {
            this._realY = this._tileSize * this._y;
        }
    }
    getRealX() {
        return this._realX;
    }
    getRealY() {
        return this._realY;
    }
    update(x,y) {
        this._x = this._x + x;
        this._y = this._y + y;
        this._realX = this._tileSize * this._x;
        this._realY = this._tileSize * this._y;
    }
    updateReal(x,y) {
        this._realX = this._realX + x;
        this._realY = this._realY + y;
        this._x = Math.round(this._realX);
        this._y = Math.round(this._realY);
    }
    setCoordinates(x,y) {
        this._x = x;
        this._y = y;
        this._realX = this._tileSize * this._x;
        this._realY = this._tileSize * this._y;
    }
    clone() {
        return new RealPosition(this._x, this._y, this._tileSize, this._realX, this._realY);
    }
    isEquals(position) {
        return position.getRealX() == this._realX && position.getRealY() == this._realY;
    }
}

class VisualEntityModel {
    constructor (code, resource) {
        this._resource = resource;
        this._code = code;
        this._entity = undefined;
        VisualEntityModel.HASH[this._code] = this;
    }
    getResource() {
        return this._resource;
    }
    getCode() {
        return this._code;
    }
    getEntity() {
        return this._entity;
    }
    instantiateEntity(id, position) {
        return new this._entity(id, position);
    }
    setEntity(entity) {
        this._entity = entity;
    }
    static findByCode(code) {
        return VisualEntityModel.HASH[code];
    }
    static findSuperByCode(code) {
        var vehicleRegexp = RegExp('^v*');
        var obstacleRegexp = RegExp('^o*');
        var bushRegexp = RegExp('^b$');

        if (vehicleRegexp.test(code)) {
            return Vehicle;
        }
        else if (obstacleRegexp.test(code)) {
            return Obstacle;
        }
        else if (bushRegexp.test(code)) {
            return Bush;
        }
        return VisualEntity;
    }
    static instantiateEntityByCode(code, id, position) {
        return new VisualEntityModel.HASH[code].getEntity(id, position);
    }
}
VisualEntityModel.HASH = {};
VisualEntityModel.DEFAULT = new VisualEntityModel(undefined, '??', '/assets/no_image.png');

class VisualEntity {
    constructor (id, position, model=VisualEntityModel.DEFAULT) {
        this._id = id;
        this._model = model;
        this._layer = IndexLayer.NO_LEVEL;
        this._position = position;
        this._sprite = undefined;
        this._state = undefined;
    }
    getId() {
        return this._id;
    }
    getModel() {
        return this._model;
    }
    getCode() {
        return this._model.getCode();
    }
    getSprite() {
        return this._sprite;
    }
    getResource() {
        return this._model.getResource();
    }
    getLayer() {
        return this._layer;
    }
    getPosition() {
        return this._position;
    }
    getMappedEntity() {
        return ''
    }
    getState() {
        return this._state;
    }
    setState(state) {
        this._state = state;
    }
    setSprite(sprite) {
        this._sprite = sprite;
    }
    update() {}
    render() {
        this._sprite.x = this._position.getRealX();
        this._sprite.y = this._position.getRealY();
    }
}

class SheepInteractEntity extends VisualEntity {
    constructor(id, position, model=VisualEntityModel.DEFAULT) {
        super(id, position, model);
    }
    interact(sheep) {}
}