enum State {
	IDLE,
	ACTIVE,
}

const states = {
	IDLE: 0,
	ACTIVE: 1,
};

class Elevator {
	private currentState: State;
	private currentFloor: number;
	private maxFloors: number;
	private elevatorDOMInstance: HTMLDivElement;
	private elevatorDoorDOMInstance: HTMLDivElement;
	private elevatorTimeout: ReturnType<typeof setTimeout> | undefined;

	constructor(maxFloors: number, currentFloor: number) {
		this.currentState = states.IDLE;
		this.maxFloors = maxFloors;
		this.currentFloor = currentFloor;
		this.elevatorDOMInstance = createDOMElementWithClass(
			"div",
			"elevator"
		) as HTMLDivElement;
		this.elevatorDoorDOMInstance = createDOMElementWithClass(
			"div",
			"elevator-door"
		) as HTMLDivElement;
		this.elevatorDOMInstance.appendChild(this.elevatorDoorDOMInstance);
	}

	getState = () => this.currentState;
	getFloor = () => this.currentFloor;
	getElevatorDOMInstance = () => this.elevatorDOMInstance;
	getElevatorTimeout = () => this.elevatorTimeout;
	setFloor = (floorIndex: number) => (this.currentFloor = floorIndex);
	public setStatusActive = () => (this.currentState = states.ACTIVE);
	public setStatusIdle = () => (this.currentState = states.IDLE);

	moveToFloor(floorIndex: number) {
		this.currentState = states.ACTIVE;
		const totalTime = Math.abs(this.currentFloor - floorIndex) * 2000;
		const floorIndexOffset = this.maxFloors - floorIndex - 1;
		this.currentFloor = floorIndex;
		this.elevatorDOMInstance.style.transition = `${totalTime}ms ease-in-out`;
		this.elevatorDOMInstance.style.transform = `translateY(-${
			floorIndexOffset * floorHeight
		}px)`;
		this.elevatorTimeout = setTimeout(() => {
			this.openDoors();
		}, totalTime);
	}

	openDoors = () => {
		this.elevatorDoorDOMInstance.classList.add("open");
		this.elevatorTimeout = setTimeout(() => {
			this.elevatorDoorDOMInstance.classList.remove("open");
			setTimeout(() => {
				this.currentState = states.IDLE;
			}, 2500);
		}, 5000);
	};
}

class Floor {
	private floorIndex;
	private floorDownButton: HTMLDivElement | undefined;
	private floorUpButton: HTMLDivElement | undefined;
	private floorDOMInstance: HTMLDivElement;
	private maxFloors;
	constructor(floorIndex: number, maxFloors: number) {
		this.floorIndex = floorIndex;
		this.maxFloors = maxFloors;
		this.createFloorDOMInstance();
		this.floorDOMInstance = createDOMElementWithClass(
			"div",
			"floor"
		) as HTMLDivElement;
		const buttonGroup = createDOMElementWithClass(
			"div",
			"elevator-buttons"
		) as HTMLDivElement;
		if (this.floorIndex === 0) {
			this.floorDownButton = createDOMElementWithClass(
				"button",
				"down-button",
				"Down"
			) as HTMLDivElement;
			buttonGroup.appendChild(this.floorDownButton);
		} else if (this.floorIndex === this.maxFloors - 1) {
			this.floorUpButton = createDOMElementWithClass(
				"button",
				"up-button",
				"Up"
			) as HTMLDivElement;
			buttonGroup.appendChild(this.floorUpButton);
		} else {
			this.floorDownButton = createDOMElementWithClass(
				"button",
				"down-button",
				"Down"
			) as HTMLDivElement;
			this.floorUpButton = createDOMElementWithClass(
				"button",
				"up-button",
				"Up"
			) as HTMLDivElement;
			buttonGroup.appendChild(this.floorUpButton);
			buttonGroup.appendChild(this.floorDownButton);
		}
		this.floorDOMInstance.appendChild(buttonGroup);
	}
	createFloorDOMInstance = () => {};

	getFloorDOMInstance = () => this.floorDOMInstance;
	getUpButton = () => this.floorUpButton;
	getDownButton = () => this.floorDownButton;
	getFloorIndex = () => this.floorIndex;
}

class Building {
	private floors: Floor[] = [];
	private elevators: Elevator[] = [];
	private buildingDOMInstance;

	constructor(floors: number, elevators: number) {
		this.buildingDOMInstance = document.getElementById(
			"building"
		) as HTMLDivElement;
		for (let i = 0; i < floors; i++) {
			this.floors.push(new Floor(i, floors));
			const floorUpButton = this.floors[i].getUpButton();
			const floorDownButton = this.floors[i].getDownButton();
			if (floorUpButton) {
				floorUpButton.addEventListener("click", () => this.requestElevator(i));
			}
			if (floorDownButton) {
				floorDownButton.addEventListener("click", () =>
					this.requestElevator(i)
				);
			}
		}
		for (let i = 0; i < elevators; i++) {
			this.elevators.push(new Elevator(floors, 0));
		}
		this.elevators.map((elevator) =>
			this.floors[floors - 1]
				.getFloorDOMInstance()
				.appendChild(elevator.getElevatorDOMInstance())
		);
		this.elevators.forEach((elevator) =>
			elevator.setFloor(this.floors.length - 1)
		);

		this.floors.map((floor) =>
			this.buildingDOMInstance.appendChild(floor.getFloorDOMInstance())
		);
		floorHeight = this.floors[0].getFloorDOMInstance().offsetHeight;
	}

	callElevator(floorIndex: number) {
		const idleElevator = this.elevators.find(
			(elevator) => elevator.getState() === states.IDLE
		);
		if (idleElevator) {
			idleElevator.moveToFloor(floorIndex);
			return 0; // exits succesfully
		}
		return 1; // nope
	}

	requestElevator(floorIndex: number) {
		const isElevatorOnFloor = this.elevators.find(
			(elevator) => elevator.getFloor() === floorIndex
		);

		if (isElevatorOnFloor) {
			isElevatorOnFloor.setStatusActive();
			clearTimeout(isElevatorOnFloor.getElevatorTimeout());
			isElevatorOnFloor.openDoors();
		} else {
			if (this.callElevator(floorIndex)) {
				const pendingInterval = setInterval(() => {
					!this.callElevator(floorIndex) && clearTimeout(pendingInterval);
				}, 500);
			}
		}
	}
}

const form = document.querySelector("form") as HTMLFormElement;
const floorInput = document.getElementById("floors") as HTMLInputElement;
const elevatorInput = document.getElementById("elevators") as HTMLInputElement;
let floorHeight: number;

let maxFloors = 0;
let lifts = 0;

function hanldeSubmitInputs(event: SubmitEvent) {
	event.preventDefault();
	const floors = +floorInput.value;
	const elevators = +elevatorInput.value;

	if (!(floors && elevators)) {
		return;
	}
	if (floors <= 0) {
		return;
	}
	if (elevators <= 0) {
		return;
	}

	new Building(floors, elevators);
	form.style.display = "none";
}

function createDOMElementWithClass(
	element: string,
	className: string,
	text = ""
) {
	const domElement = document.createElement(element);
	domElement.classList.add(className);
	domElement.textContent = text;
	return domElement;
}
