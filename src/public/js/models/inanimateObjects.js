//Models
VisualEntityModel.BUSH = new VisualEntityModel('b', '/assets/bush.png');
VisualEntityModel.TREE = new VisualEntityModel('ot', '/assets/tree.png');
VisualEntityModel.ROCK = new VisualEntityModel('or', '/assets/rock.png');
VisualEntityModel.POWER_UP_RANDOM = new VisualEntityModel('pwr', '/assets/powerup.png');
VisualEntityModel.POWER_UP_PARKOUR = new VisualEntityModel('pwp', '/assets/powerup.png');
VisualEntityModel.POWER_UP_IRON = new VisualEntityModel('pwi', '/assets/powerup.png');
VisualEntityModel.POWER_UP_FLASH = new VisualEntityModel('pwf', '/assets/powerup.png');
VisualEntityModel.POWER_UP_BULLY = new VisualEntityModel('pwb', '/assets/powerup.png');


// Super class
class InanimateObject extends VisualEntity {
    constructor (id, position, model=VisualEntityModel.DEFAULT) {
        super(id, position, model);
        this._layer = IndexLayer.LEVEL_2;
    }
    getMappedEntity() {
        return {code: this._model.getCode(), x: this._position.getX(), y: this._position.getY()};
    }
}

// Sub class: Bush
class Bush extends InanimateObject {
    constructor (id, position) {
        super(id, position, VisualEntityModel.BUSH);
        this._layer = IndexLayer.LEVEL_4;
        this._sheeps = [];
    }
}
VisualEntityModel.BUSH.setEntity(Bush);

// Sub abstract class: Obstacle
class Obstacle extends InanimateObject {
    constructor (id, position, model=VisualEntityModel.DEFAULT) {
        super(id, position, model);
        // if (this.constructor === Obstacle) {
        //     throw new Error("Can't instantiate abstract class!");
        // }
    }
}
class Tree extends Obstacle {
    constructor (id, position) {
        super(id, position, VisualEntityModel.TREE);
    }
}
VisualEntityModel.TREE.setEntity(Tree);

class Rock extends Obstacle {
    constructor (id, position) {
        super(id, position, VisualEntityModel.ROCK);
    }
}
VisualEntityModel.ROCK.setEntity(Rock);

// Sub abstract class: PowerUp
class PowerUp extends InanimateObject {
    constructor (id, position, model=VisualEntityModel.DEFAULT) {
        super(id, position, model);
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
        super(id, position, VisualEntityModel.POWER_UP_RANDOM);
        this._power = new ParkourPower(id, position);
    }
}
VisualEntityModel.POWER_UP_RANDOM.setEntity(RandomPower);

class ParkourPower extends PowerUp {
    constructor (id, position) {
        super(id, position, VisualEntityModel.POWER_UP_PARKOUR);
    }
}
VisualEntityModel.POWER_UP_PARKOUR.setEntity(ParkourPower);

class IronPower extends PowerUp {
    constructor (id, position) {
        super(id, position, VisualEntityModel.POWER_UP_IRON);
    }
}
VisualEntityModel.POWER_UP_IRON.setEntity(IronPower);

class FlashPower extends PowerUp {
    constructor (id, position) {
        super(id, position, VisualEntityModel.POWER_UP_FLASH);
    }
}
VisualEntityModel.POWER_UP_FLASH.setEntity(FlashPower);

class BullyPower extends PowerUp {
    constructor (id, position) {
        super(id, position, VisualEntityModel.POWER_UP_BULLY);
    }
}
VisualEntityModel.POWER_UP_BULLY.setEntity(BullyPower);