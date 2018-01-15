class MoveCommand {
	constructor(entity) {
		this._entity = entity;
	}
	execute() {
		console.log('nothing happened');
	}
	undo() {
		console.log('nothing happened');
	}
}

class MoveLeftCommand extends MoveCommand {
	constructor(entity) {
		super(entity);
	}
	execute() {
		this._entity.move(-1,0);
	}
	undo() {
		this._entity.move(1,0);
	}
}

class MoveDownCommand extends MoveCommand {
	constructor(entity) {
		super(entity);
	}
	execute() {
		this._entity.move(0,1);
	}
	undo() {
		this._entity.move(0,-1);
	}
}

class MoveRightCommand extends MoveCommand {
	constructor(entity) {
		super(entity);
	}
	execute() {
		this._entity.move(1,0);
	}
	undo() {
		this._entity.move(-1,0);
	}
}

class MoveUpCommand extends MoveCommand {
	constructor(entity) {
		super(entity);
	}
	execute() {
		this._entity.move(0,-1);
	}
	undo() {
		this._entity.move(0,1);
	}
}