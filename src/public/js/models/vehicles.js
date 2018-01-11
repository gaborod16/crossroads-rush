//Models
MapableEntityModel.CAR = new MapableEntityModel('vc', '/assets/car.png', [VisualEntityModel.TRANSIT_ZONE]);
MapableEntityModel.SPORT_CAR = new MapableEntityModel('vsc', '/assets/no_image.png', [VisualEntityModel.TRANSIT_ZONE]);
MapableEntityModel.BUS = new MapableEntityModel('vb', '/assets/bus.png', [VisualEntityModel.TRANSIT_ZONE]);
MapableEntityModel.MOTERCYCLE = new MapableEntityModel('vm', '/assets/motorcycle.png', [VisualEntityModel.TRANSIT_ZONE]);
MapableEntityModel.ANIMAL_CONTROL_CAR = new MapableEntityModel('vac', '/assets/no_image.png', [VisualEntityModel.TRANSIT_ZONE]);

// Super class
class Vehicle extends VisualEntity {
    constructor (id, position) {
        super(id, position);
        this._layer = IndexLayer.LEVEL_3;
        this._speed = 0;
        this._state = VehicleState.HIDDEN;
        this._onTopOf = undefined;
    }
    getCodeFormatted() {
        return {code: this._code, f: Math.floor(Math.random()*10) + 1, x: this._position.getX()};
    }
}

var VehicleState = {
    MOVING: 'MOVING',
    HIDDEN: 'HIDDEN',
    STOPPED: 'STOPPED',
    CRASHED: 'CRASHED'
}

class Car extends Vehicle {
    constructor (id, position) {
        super(id, position);
        this._speed = 5; // px/sec
        this._resource = MapableEntityModel.CAR.getResource();
        this._code = MapableEntityModel.CAR.getCode();
        this._onTopOf = MapableEntityModel.CAR.getCode();
    }
}
MapableEntityModel.CAR.setEntity(Car);

class SportCar extends Vehicle {
    constructor (id, position) {
        super(id, position);
        this._speed = 8; // px/sec
        this._resource = MapableEntityModel.SPORT_CAR.getResource();
        this._code = MapableEntityModel.SPORT_CAR.getCode();
        this._onTopOf = MapableEntityModel.SPORT_CAR.getCode();
    }
}
MapableEntityModel.SPORT_CAR.setEntity(SportCar);

class Bus extends Vehicle {
    constructor (id, position) {
        super(id, position);
        this._speed = 4; // px/sec
        this._resource = MapableEntityModel.BUS.getResource();
        this._code = MapableEntityModel.BUS.getCode();
        this._onTopOf = MapableEntityModel.SPORT_CAR.getCode();
    }
}
MapableEntityModel.BUS.setEntity(Bus);

class Motorcyle extends Vehicle {
    constructor (id, position) {
        super(id, position);
        this._speed = 7; // px/sec
        this._resource = MapableEntityModel.MOTERCYCLE.getResource();
        this._code = MapableEntityModel.MOTERCYCLE.getCode();
        this._onTopOf = MapableEntityModel.MOTERCYCLE.getCode();
    }
}
MapableEntityModel.MOTERCYCLE.setEntity(Motorcyle);

class AnimalControlCar extends Vehicle {
    constructor (id, position) {
        super(id, position);
        this._speed = 4; // px/sec
        this._resource = MapableEntityModel.ANIMAL_CONTROL_CAR.getResource();
        this._code = MapableEntityModel.ANIMAL_CONTROL_CAR.getCode();
        this._onTopOf = MapableEntityModel.ANIMAL_CONTROL_CAR.getCode();
    }
}
MapableEntityModel.ANIMAL_CONTROL_CAR.setEntity(AnimalControlCar);