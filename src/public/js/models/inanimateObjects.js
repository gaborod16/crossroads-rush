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
class InanimateObject extends SheepInteractEntity {
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

    interact(sheep) {
        //hide sheep
        sheep.setState(SheepState.WELL_MOVED);
    }
}
VisualEntityModel.BUSH.setEntity(Bush);

// Sub abstract class: Obstacle
class Obstacle extends InanimateObject {
    constructor (id, position, model=VisualEntityModel.DEFAULT) {
        super(id, position, model);
    }
    interact(sheep) {
        sheep.setState(SheepState.BADLY_MOVED);
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
    }
    interact(sheep) {
        sheep.setState(SheepState.WELL_MOVED);
        if (this._taken) {
            return;
        }
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
    interact(sheep) {
        super.interact(sheep); // if it passes, it wasn't taken
        // empower sheep
        this._taken = true;
    }
}
VisualEntityModel.POWER_UP_RANDOM.setEntity(RandomPower);

class ParkourPower extends PowerUp {
    constructor (id, position) {
        super(id, position, VisualEntityModel.POWER_UP_PARKOUR);
    }
    interact(sheep) {
        super.interact(sheep); // if it passes, it wasn't taken
        // empower sheep
        this._taken = true;
    }
}
VisualEntityModel.POWER_UP_PARKOUR.setEntity(ParkourPower);

class IronPower extends PowerUp {
    constructor (id, position) {
        super(id, position, VisualEntityModel.POWER_UP_IRON);
    }
    interact(sheep) {
        super.interact(sheep); // if it passes, it wasn't taken
        // empower sheep
        this._taken = true;
    }
}
VisualEntityModel.POWER_UP_IRON.setEntity(IronPower);

class FlashPower extends PowerUp {
    constructor (id, position) {
        super(id, position, VisualEntityModel.POWER_UP_FLASH);
    }
    interact(sheep) {
        super.interact(sheep); // if it passes, it wasn't taken
        // empower sheep
        this._taken = true;
    }
}
VisualEntityModel.POWER_UP_FLASH.setEntity(FlashPower);

class BullyPower extends PowerUp {
    constructor (id, position) {
        super(id, position, VisualEntityModel.POWER_UP_BULLY);
    }
    interact(sheep) {
        super.interact(sheep); // if it passes, it wasn't taken
        // empower sheep
        this._taken = true;
    }
}
VisualEntityModel.POWER_UP_BULLY.setEntity(BullyPower);