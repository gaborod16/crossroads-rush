//Models
MapableEntityModel.BUSH = new MapableEntityModel('b', '/assets/bush.png', [VisualEntityModel.SAFE_ZONE]);
MapableEntityModel.TREE = new MapableEntityModel('ot', '/assets/tree.png', [VisualEntityModel.SAFE_ZONE]);
MapableEntityModel.ROCK = new MapableEntityModel('or', '/assets/rock.png', [VisualEntityModel.SAFE_ZONE]);
MapableEntityModel.POWER_UP_RANDOM = new MapableEntityModel('pwr', '/assets/powerup.png', [VisualEntityModel.SAFE_ZONE, VisualEntityModel.TRANSIT_ZONE]);
MapableEntityModel.POWER_UP_PARKOUR = new MapableEntityModel('pwp', '/assets/powerup.png', [VisualEntityModel.SAFE_ZONE, VisualEntityModel.TRANSIT_ZONE]);
MapableEntityModel.POWER_UP_IRON = new MapableEntityModel('pwi', '/assets/powerup.png', [VisualEntityModel.SAFE_ZONE, VisualEntityModel.TRANSIT_ZONE]);
MapableEntityModel.POWER_UP_FLASH = new MapableEntityModel('pwf', '/assets/powerup.png', [VisualEntityModel.SAFE_ZONE, VisualEntityModel.TRANSIT_ZONE]);
MapableEntityModel.POWER_UP_BULLY = new MapableEntityModel('pwb', '/assets/powerup.png', [VisualEntityModel.SAFE_ZONE, VisualEntityModel.TRANSIT_ZONE]);


// Super class
class InanimateObject extends VisualEntity {
    constructor (id, position) {
        super(id, position);
        this._layer = IndexLayer.LEVEL_2;
    }
    getCodeFormatted() {
        return {code: this._code, x: this._position.getX(), y: this._position.getY()};
    }
}

// Sub class: Bush
class Bush extends InanimateObject {
    constructor (id, position) {
        super(id, position);
        this._layer = IndexLayer.LEVEL_4;
        this._resource = MapableEntityModel.BUSH.getResource();
        this._code = MapableEntityModel.BUSH.getCode();
        this._onTopOf = MapableEntityModel.BUSH.getCode();
        this._sheeps = [];
    }
}
MapableEntityModel.BUSH.setEntity(Bush);

// Sub abstract class: Obstacle
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
        this._resource = MapableEntityModel.TREE.getResource();
        this._code = MapableEntityModel.TREE.getCode();
        this._onTopOf = MapableEntityModel.TREE.getCode();
    }
}
MapableEntityModel.TREE.setEntity(Tree);

class Rock extends Obstacle {
    constructor (id, position) {
        super(id, position);
        this._resource = MapableEntityModel.ROCK.getResource();
        this._code = MapableEntityModel.ROCK.getCode();
        this._onTopOf = MapableEntityModel.ROCK.getCode();
    }
}
MapableEntityModel.ROCK.setEntity(Rock);

// Sub abstract class: PowerUp
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
        this._resource = MapableEntityModel.POWER_UP_RANDOM.getResource();
        this._code = MapableEntityModel.POWER_UP_RANDOM.getCode();
        this._onTopOf = MapableEntityModel.POWER_UP_RANDOM.getCode();
        this._power = new ParkourPower(id, position);
    }
}
MapableEntityModel.POWER_UP_RANDOM.setEntity(RandomPower);

class ParkourPower extends PowerUp {
    constructor (id, position) {
        super(id, position);
        this._resource = MapableEntityModel.POWER_UP_PARKOUR.getResource();
        this._code = MapableEntityModel.POWER_UP_PARKOUR.getCode();
        this._onTopOf = MapableEntityModel.POWER_UP_PARKOUR.getCode();
    }
}
MapableEntityModel.POWER_UP_PARKOUR.setEntity(ParkourPower);

class IronPower extends PowerUp {
    constructor (id, position) {
        super(id, position);
        this._resource = MapableEntityModel.POWER_UP_IRON.getResource();
        this._code = MapableEntityModel.POWER_UP_IRON.getCode();
        this._onTopOf = MapableEntityModel.POWER_UP_IRON.getCode();
    }
}
MapableEntityModel.POWER_UP_IRON.setEntity(IronPower);

class FlashPower extends PowerUp {
    constructor (id, position) {
        super(id, position);
        this._resource = MapableEntityModel.POWER_UP_FLASH.getResource();
        this._code = MapableEntityModel.POWER_UP_FLASH.getCode();
        this._onTopOf = MapableEntityModel.POWER_UP_FLASH.getCode();
    }
}
MapableEntityModel.POWER_UP_FLASH.setEntity(FlashPower);

class BullyPower extends PowerUp {
    constructor (id, position) {
        super(id, position);
        this._resource = MapableEntityModel.POWER_UP_BULLY.getResource();
        this._code = MapableEntityModel.POWER_UP_BULLY.getCode();
        this._onTopOf = MapableEntityModel.POWER_UP_BULLY.getCode();
    }
}
MapableEntityModel.POWER_UP_BULLY.setEntity(BullyPower);