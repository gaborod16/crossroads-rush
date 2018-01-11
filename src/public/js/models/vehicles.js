//Models
VisualEntityModel.CAR = new VisualEntityModel('vc', '/assets/car.png');
VisualEntityModel.SPORT_CAR = new VisualEntityModel('vsc', '/assets/no_image.png');
VisualEntityModel.BUS = new VisualEntityModel('vb', '/assets/bus.png');
VisualEntityModel.MOTERCYCLE = new VisualEntityModel('vm', '/assets/motorcycle.png');
VisualEntityModel.ANIMAL_CONTROL_CAR = new VisualEntityModel('vac', '/assets/no_image.png');

// Super class
class Vehicle extends VisualEntity {
    constructor (id, position, model=VisualEntityModel.DEFAULT) {
        super(id, position, model);
        this._layer = IndexLayer.LEVEL_3;
        this._speed = 0;
        this._state = VehicleState.HIDDEN;
        this._onTopOf = undefined;
    }
    getMappedEntity() {
        return {code: this._model.getCode(), f: Math.floor(Math.random()*10) + 1, x: this._position.getX()};
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
        super(id, position, VisualEntityModel.CAR);
        this._speed = 5; // px/sec
    }
}
VisualEntityModel.CAR.setEntity(Car);

class SportCar extends Vehicle {
    constructor (id, position) {
        super(id, position, VisualEntityModel.SPORT_CAR);
        this._speed = 8; // px/sec
    }
}
VisualEntityModel.SPORT_CAR.setEntity(SportCar);

class Bus extends Vehicle {
    constructor (id, position) {
        super(id, position, VisualEntityModel.BUS);
        this._speed = 4; // px/sec
    }
}
VisualEntityModel.BUS.setEntity(Bus);

class Motorcyle extends Vehicle {
    constructor (id, position) {
        super(id, position, VisualEntityModel.MOTERCYCLE);
        this._speed = 7; // px/sec
    }
}
VisualEntityModel.MOTERCYCLE.setEntity(Motorcyle);

class AnimalControlCar extends Vehicle {
    constructor (id, position) {
        super(id, position, VisualEntityModel.ANIMAL_CONTROL_CAR);
        this._speed = 4; // px/sec
    }
}
VisualEntityModel.ANIMAL_CONTROL_CAR.setEntity(AnimalControlCar);