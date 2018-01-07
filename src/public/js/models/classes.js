const EntityType = {
    NONE: {code: 'none', resource: undefined},
    TRANSIT_ZONE: {code: 'tz', resource: '/assets/road.png'},
    SAFE_ZONE: {code: 'sz', resource: '/assets/meadow.jpg'},
    BUSH: {code: 'b', resource: ''},
    TREE: {code: 'ot', resource: ''},
    ROCK: {code: 'or', resource: '/assets/rock.png'},
    CAR: {code: 'vc', resource: ''},
    SPORT_CAR: {code: 'vsc', resource: ''},
    MOTORCYCLE: {code: 'vm', resource: ''},
    BUS: {code: 'vb', resource: ''},
    ANIMAL_CONTROL: {code: 'vac', resource: ''},
    RANDOM_POWER: {code: 'pwr', resource: ''},
    PARKOUR_POWER: {code: 'pwp', resource: ''},
    IRON_POWER: {code: 'pwi', resource: ''},
    FLASH_POWER: {code: 'pwf', resource: ''},
    BULLY_POWER: {code: 'pwb', resource: ''}
};

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

class VisualEntity {
    constructor (id, position) {
        this._id = id;
        this._type = EntityType.NONE.code;
        this._resource = '';
        this._layer = IndexLayer.NO_LEVEL;
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
        this._layer = IndexLayer.LEVEL_1;
    }
}

class TransitZone extends Zone {
    constructor (id, position) {
        super(id, position);
        this._resource = 'road.png';
        this._type = EntityType.TRANSIT_ZONE.code;
    }
}

class SafeZone extends Zone {
    constructor (id, position) {
        super(id, position);
        this._resource = 'meadow.jpg';
        this._type = EntityType.SAFE_ZONE.code;
    }
}

class InanimateObject extends VisualEntity {
    constructor (id, position) {
        super(id, position);
        this._layer = IndexLayer.LEVEL_2;
    }
}

class Bush extends InanimateObject {
    constructor (id, position) {
        super(id, position);
        this._layer = IndexLayer.LEVEL_4;
        this._resource = 'bush.png';
        this._type = EntityType.BUSH.code;
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
        this._type = EntityType.TREE.code;
    }
}
class Rock extends Obstacle {
    constructor (id, position) {
        super(id, position);
        this._resource = 'rock.png';
        this._type = EntityType.ROCK.code;
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
        this._type = EntityType.RANDOM_POWER.code;
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
        this._type = EntityType.PARKOUR_POWER.code;
    }
}
class IronPower extends PowerUp {
    constructor (id, position) {
        super(id, position);
        this._resource = 'ironPower.png';
        this._type = EntityType.IRON_POWER.code;
    }
}
class FlashPower extends PowerUp {
    constructor (id, position) {
        super(id, position);
        this._resource = 'flashPower.png';
        this._type = EntityType.FLASH_POWER.code;
    }
}
class BullyPower extends PowerUp {
    constructor (id, position) {
        super(id, position);
        this._resource = 'bullyPower.png';
        this._type = EntityType.BULLY_POWER.code;
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
        this._layer = IndexLayer.LEVEL_2;
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
        this._layer = IndexLayer.LEVEL_3;
        this._speed = 0;
        this._state = VehicleState.HIDDEN;
    }
}
class Car extends Vehicle {
    constructor () {
        super();
        this._speed = 5; // px/sec
        this._resource = 'car.png';
        this._type = EntityType.CAR.code;
    }
}
class SportCar extends Vehicle {
    constructor () {
        super();
        this._speed = 8; // px/sec
        this._resource = 'sportcar.png';
        this._type = EntityType.SPORT_CAR.code;
    }
}
class Bus extends Vehicle {
    constructor () {
        super();
        this._speed = 4; // px/sec
        this._resource = 'bus.png';
        this._type = EntityType.BUS.code;
    }
}
class Motorcyle extends Vehicle {
    constructor () {
        super();
        this._speed = 7; // px/sec
        this._resource = 'motorcycle.png';
        this._type = EntityType.MOTORCYCLE.code;
    }
}
class AnimalControl extends Vehicle {
    constructor () {
        super();
        this._speed = 4; // px/sec
        this._resource = 'animalControl.png';
        this._type = EntityType.ANIMAL_CONTROL.code;
    }
}