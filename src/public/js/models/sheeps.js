VisualEntityModel.SHEEP = new VisualEntityModel('sh', '/assets/sheep.png');

const SheepState = {
    MOVING: 'MOVING',
    STANDING: 'STANDING',
    WELL_MOVED: 'WELL MOVED',
    BADLY_MOVED: 'BADLE MOVED',
    DEAD: 'DEAD',
    EMPOWERED: 'EMPOWERED'
}

class Sheep extends SheepInteractEntity {
    constructor (id, position, sprite) {
        super(id, position, VisualEntityModel.SHEEP);
        this._layer = IndexLayer.LEVEL_2;
        this._alive = true;
        this._state = SheepState.STANDING;
        this._power = undefined;
        this._move = undefined;
        this._nextPosition = this._position.clone();
    }
    interact(sheep) {
        // if no power, I was first! sheep.setState(BADLY_MOVED)
        // if bully
            // if I am iron -> BADLY MOVED
            // if I am bully -> BADLY MOVED
            // else -> I get pushed -> WELL_MOVED
    }
    getNextPosition() {
        return this._nextPosition;
    }
    move(x,y) {
        this._nextPosition.update(x,y);
    }
    handleInput(moveCommand) {
        if (moveCommand && this._state != SheepState.DEAD) {
            // console.log(moveCommand);
            if (!this._move) {
                this._move = moveCommand;
            }
        }
    }
    update() {
        if (this._state == SheepState.STANDING && this._move) {
            this._move.execute(); // updates nextPosition
            this._state = SheepState.MOVING;
        }
        else if (this._state == SheepState.WELL_MOVED) {
            this._swap();
            this._state = SheepState.STANDING;
            this._move = undefined;
        }
        else if (this._state == SheepState.BADLY_MOVED) {
            this._swapBack();
            this._state = SheepState.STANDING;
            this._move = undefined;
        }
        else if (this._state == SheepState.DEAD) {
            this._swap();
            this._move = undefined;
        }
    }
    render() { 
        this._sprite.x = this._position.getRealX();
        this._sprite.y = this._position.getRealY();
    }
    _swapBack() {
        this._nextPosition.setCoordinates(this._position.getX(), this._position.getY());
    }
    _swap() {
        this._position.setCoordinates(this._nextPosition.getX(), this._nextPosition.getY());
    }
    evalPosition(result) {
        console.log(result);
        if (result) {
            this._state = SheepState.WELL_MOVED;
        }
        else {
            this._state = SheepState.BADLY_MOVED;
        }
    }
}
VisualEntityModel.SHEEP.setEntity(Sheep);