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
        this._size = 0;                     //1 tileSize width, x tileSizes length
        this._moveThreshold = 2;
        this._counter = 0;
    }
    setSprite(sprite) {
        super.setSprite(sprite);
        sprite.height = this._position.getTileSize() * this._size;
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
        this._counter += 1;
    }
    render() { 
        this._sprite.x = this._position.getRealX();
        this._sprite.y = this._position.getRealY();
    }
    resetTo(startLine) {
        this._position.setRealCoordinates(this._position.getRealX(), startLine);
    }
    hasCollidedWith(position, tileSize) {
        if (position.getRealY() > this._position.getRealY() - tileSize && position.getRealY() < this._position.getRealY() + (tileSize*this._size) - (tileSize/3) ) {
            return true;
        }
        return false;
    }
}

var VehicleState = {
    MOVING: 'MOVING',
    STOPPED: 'STOPPED',
    CRASHED: 'CRASHED'
}

class Car extends Vehicle {
    constructor (id, position) {
        super(id, position, VisualEntityModel.CAR);
        this._speed = 5; // px/sec
        this._size = 2;
    }
}
VisualEntityModel.CAR.setEntity(Car);

class SportCar extends Vehicle {
    constructor (id, position) {
        super(id, position, VisualEntityModel.SPORT_CAR);
        this._speed = 8; // px/sec
        this._size = 2;
    }
}
VisualEntityModel.SPORT_CAR.setEntity(SportCar);

class Bus extends Vehicle {
    constructor (id, position) {
        super(id, position, VisualEntityModel.BUS);
        this._speed = 4; // px/sec
        this._size = 3;
    }
}
VisualEntityModel.BUS.setEntity(Bus);

class Motorcyle extends Vehicle {
    constructor (id, position) {
        super(id, position, VisualEntityModel.MOTORCYCLE);
        this._speed = 7; // px/sec
        this._size = 1;
    }
}
VisualEntityModel.MOTORCYCLE.setEntity(Motorcyle);

class AnimalControlCar extends Vehicle {
    constructor (id, position) {
        super(id, position, VisualEntityModel.ANIMAL_CONTROL_CAR);
        this._speed = 4; // px/sec
        this._size = 2;
    }
    interact(sheep) {
        sheep.setState(SheepState.DEAD);
    }
}
VisualEntityModel.ANIMAL_CONTROL_CAR.setEntity(AnimalControlCar);