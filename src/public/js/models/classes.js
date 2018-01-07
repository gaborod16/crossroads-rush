const EntityType = {
    none: {code: 'none', graphic: 'none'},
    transitZone: {code: 'tz', graphic: ''},
    safeZone: {code: 'sz', graphic: ''},
    bush: {code: 'b', graphic: ''},
    tree: {code: 'ot', graphic: ''},
    rock: {code: 'or', graphic: ''},
    car: {code: 'vc', graphic: ''},
    sportCar: {code: 'vsc', graphic: ''},
    motorcycle: {code: 'vm', graphic: ''},
    bus: {code: 'vb', graphic: ''},
    animalControl: {code: 'vac', graphic: ''},
    randomPower: {code: 'pwr', graphic: ''},
    parkourPower: {code: 'pwp', graphic: ''},
    ironPower: {code: 'pwi', graphic: ''},
    flashPower: {code: 'pwf', graphic: ''},
    bullyPower: {code: 'pwb', graphic: ''}
};

const IndexLayer = {
    noLevel: 0,
    level1: 1,  // First to be drawn, therefore, on bottom.
    level2: 2,
    level3: 3,
    level4: 4,
    level5: 5   // Last to be drawn, therefore, on top.
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

class VisualEntity {
    constructor (id, position) {
        this._id = id;
        this._type = EntityType.none.code;
        this._resource = '';
        this._layer = IndexLayer.noLevel;
        this._position = position;
    }
    getId () {
        return this._id;
    }
    getType () {
        return this._type;
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

class Zone extends VisualEntity {
    constructor (id, position) {
        super(id, position);
        this._layer = IndexLayer.level1;
    }
}

class TransitZone extends Zone {
    constructor (id, position) {
        super(id, position);
        this._resource = 'road.png';
        this._type = EntityType.transitZone.code;
    }
}

class SafeZone extends Zone {
    constructor (id, position) {
        super(id, position);
        this._resource = 'meadow.jpg';
        this._type = EntityType.safeZone.code;
    }
}

class InanimateObject extends VisualEntity {
    constructor (id, position) {
        super(id, position);
        this._layer = IndexLayer.level2;
    }
}

class Bush extends InanimateObject {
    constructor (id, position) {
        super(id, position);
        this._layer = IndexLayer.level4;
        this._resource = 'bush.png';
        this._type = EntityType.bush.code;
        this._sheeps = [];
    }
}

class Obstacle extends InanimateObject {
    constructor (id, position) {
        super(id, position);
        // if (this.constructor === Obstacle) {
        //     throw new Error("Can't instantiate abstract class!");
        // }
    }
}
class Tree extends Obstacle {
    constructor (id, position) {
        super(id, position);
        this._resource = 'tree.png';
        this._type = EntityType.tree.code;
    }
}
class Rock extends Obstacle {
    constructor (id, position) {
        super(id, position);
        this._resource = 'rock.png';
        this._type = EntityType.rock.code;
    }
}
class PowerUp extends InanimateObject {
    constructor (id, position) {
        super(id, position);
        this._taken = false;
        // if (this.constructor === Obstacle) {
        //     throw new Error("Can't instantiate abstract class!");
        // }
    }
    pickUp () {
        this._taken = true;
    }
    wasTaken () {
        return this._taken;
    }
}

class RandomPower extends PowerUp {
    constructor (id, position) {
        super(id, position);
        this._resource = 'randomPower.png';
        this._type = EntityType.randomPower.code;
        this._power = new ParkourPower(id, position);
    }
}
class NoPower extends PowerUp {
    constructor (id, position) {
        super(id, position);
    }
}
class ParkourPower extends PowerUp {
    constructor (id, position) {
        super(id, position);
        this._resource = 'parkourPower.png';
        this._type = EntityType.parkourPower.code;
    }
}
class IronPower extends PowerUp {
    constructor (id, position) {
        super(id, position);
        this._resource = 'ironPower.png';
        this._type = EntityType.ironPower.code;
    }
}
class FlashPower extends PowerUp {
    constructor (id, position) {
        super(id, position);
        this._resource = 'flashPower.png';
        this._type = EntityType.flashPower.code;
    }
}
class BullyPower extends PowerUp {
    constructor (id, position) {
        super(id, position);
        this._resource = 'bullyPower.png';
        this._type = EntityType.bullyPower.code;
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

class Sheep extends MobileEntity {
    constructor (id, position) {
        super(id, position);
        this._layer = IndexLayer.level2;
        this._alive = true;
        this._currentState = 'sheepState';
        this._currentPower = new NoPower(id, position);
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

var VehicleState = {
    MOVING: 'MOVING',
    HIDDEN: 'HIDDEN',
    STOPPED: 'STOPPED',
    CRASHED: 'CRASHED'
}

class Vehicle extends MobileEntity {
    constructor () {
        this._layer = IndexLayer.level3;
        this._speed = 0;
        this._state = VehicleState.HIDDEN;
    }
}
class Car extends Vehicle {
    constructor () {
        super();
        this._speed = 5; // px/sec
        this._resource = 'car.png';
        this._type = EntityType.car.code;
    }
}
class SportCar extends Vehicle {
    constructor () {
        super();
        this._speed = 8; // px/sec
        this._resource = 'sportcar.png';
        this._type = EntityType.sportCar.code;
    }
}
class Bus extends Vehicle {
    constructor () {
        super();
        this._speed = 4; // px/sec
        this._resource = 'bus.png';
        this._type = EntityType.bus.code;
    }
}
class Motorcyle extends Vehicle {
    constructor () {
        super();
        this._speed = 7; // px/sec
        this._resource = 'motorcycle.png';
        this._type = EntityType.motorcycle.code;
    }
}
class AnimalControl extends Vehicle {
    constructor () {
        super();
        this._speed = 4; // px/sec
        this._resource = 'animalControl.png';
        this._type = EntityType.animalControl.code;
    }
}