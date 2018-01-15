//Models
VisualEntityModel.CAR = new VisualEntityModel('vc', '/assets/car.png');
VisualEntityModel.SPORT_CAR = new VisualEntityModel('vsc', '/assets/no_image.png');
VisualEntityModel.BUS = new VisualEntityModel('vb', '/assets/bus.png');
VisualEntityModel.MOTORCYCLE = new VisualEntityModel('vm', '/assets/motorcycle.png');
VisualEntityModel.ANIMAL_CONTROL_CAR = new VisualEntityModel('vac', '/assets/no_image.png');

// Super class
class Vehicle extends SheepInteractEntity {
    constructor (id, position, model=VisualEntityModel.DEFAULT) {
        super(id, position, model);
        this._layer = IndexLayer.LEVEL_3;
        this._speed = 0;
        this._state = VehicleState.MOVING;
        this._onTopOf = undefined;
        this._moveThreshold = 10;
        this._counter = 0;
    }
    getMappedEntity() {
        return {code: this._model.getCode(), f: Math.floor(Math.random()*10) + 1, x: this._position.getX()};
    }
    interact(sheep) {
        if (this._state == VehicleState.MOVING) {
            // If ironsheep, then crash the car
            sheep.setState(SheepState.DEAD);
        }
        else if (this._state == VehicleState.CRASHED) {
            // if parkour, then go up the car
            sheep.setState(SheepState.BADLY_MOVED);
        }
    }
    move() {
        if (this._counter % this._moveThreshold == 0) {
            this._position.updateReal(0, -this._speed);
        }
    }
}

var VehicleState = {
    MOVING: 'MOVING',
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
        super(id, position, VisualEntityModel.MOTORCYCLE);
        this._speed = 7; // px/sec
    }
}
VisualEntityModel.MOTORCYCLE.setEntity(Motorcyle);

class AnimalControlCar extends Vehicle {
    constructor (id, position) {
        super(id, position, VisualEntityModel.ANIMAL_CONTROL_CAR);
        this._speed = 4; // px/sec
    }
    interact(sheep) {
        sheep.setState(SheepState.DEAD);
    }
}
VisualEntityModel.ANIMAL_CONTROL_CAR.setEntity(AnimalControlCar);