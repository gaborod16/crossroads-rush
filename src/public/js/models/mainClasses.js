const GameLevel = {
    LEVEL_1: {
        code: 'LEVEL_1',
        carSpace: 6 // Number of cells before appearing another car
    },
    LEVEL_2: {
        code: 'LEVEL_2',
        carSpace: 5
    },
    LEVEL_3: {
        code: 'LEVEL_3',
        carSpace: 4
    },
    LEVEL_4: {
        code: 'LEVEL_4',
        carSpace: 3
    },
    LEVEL_5: {
        code: 'LEVEL_5',
        carSpace: 2
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
    constructor(x,y) {
        this._x = x;
        this._y = y;
    }
    getX() {
        return this._x;
    }
    getY() {
        return this._y;
    }
}

class VisualEntityModel {
    constructor (code, resource) {
        this._resource = resource;
        this._code = code;
    }
    getResource() {
        return this._resource;
    }
    getCode() {
        return this._code;
    }
}
VisualEntityModel.DEFAULT = new VisualEntityModel('??', '/assets/no_image.png');

class VisualEntity {
    constructor (id, position) {
        this._id = id;
        this._code = VisualEntityModel.DEFAULT.getCode();
        this._resource = VisualEntityModel.DEFAULT.getResource();
        this._layer = IndexLayer.NO_LEVEL;
        this._position = position;
    }
    getId () {
        return this._id;
    }
    getCode () {
        return this._code;
    }
    getResource () {
        return this._resource;
    }
    getLayer () {
        return this._layer;
    }
    getPosition () {
        return this._position;
    }
}

class MobileEntity extends VisualEntity {
    constructor(id, position) {
        super(id, position);
        this._moveCommand = undefined;
    }
    consumeMove () {
        this._moveCommand.apply();
        this._moveCommand = undefined;
    }
    addMoveCommand (command) {
        this._moveCommand = command;
    }
}

class MapableEntityModel extends VisualEntityModel {
    constructor (code, resource, onTopOf) {
        super(code, resource);
        this._onTopOf = onTopOf;
    }
    canBeOnTopOf(zoneType) {
        return this._onTopOf.includes(zoneType);
    }
}