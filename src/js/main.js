"use strict";
var State;
(function (State) {
	State[(State["IDLE"] = 0)] = "IDLE";
	State[(State["ACTIVE"] = 1)] = "ACTIVE";
})(State || (State = {}));
const states = {
	IDLE: 0,
	ACTIVE: 1,
};
class Elevator {
	constructor(maxFloors, currentFloor) {
		this.getState = () => this.currentState;
		this.getFloor = () => this.currentFloor;
		this.getElevatorDOMInstance = () => this.elevatorDOMInstance;
		this.getElevatorTimeout = () => this.elevatorTimeout;
		this.setFloor = (floorIndex) => (this.currentFloor = floorIndex);
		this.setStatusActive = () => (this.currentState = states.ACTIVE);
		this.setStatusIdle = () => (this.currentState = states.IDLE);
		this.openDoors = () => {
			this.elevatorDoorDOMInstance.classList.add("open");
			this.elevatorTimeout = setTimeout(() => {
				this.elevatorDoorDOMInstance.classList.remove("open");
				setTimeout(() => {
					this.currentState = states.IDLE;
				}, 2500);
			}, 5000);
		};
		this.currentState = states.IDLE;
		this.maxFloors = maxFloors;
		this.currentFloor = currentFloor;
		this.elevatorDOMInstance = createDOMElementWithClass("div", "elevator");
		this.elevatorDoorDOMInstance = createDOMElementWithClass(
			"div",
			"elevator-door"
		);
		this.elevatorDOMInstance.appendChild(this.elevatorDoorDOMInstance);
	}
	moveToFloor(floorIndex) {
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
}
class Floor {
	constructor(floorIndex, maxFloors) {
		this.createFloorDOMInstance = () => {};
		this.getFloorDOMInstance = () => this.floorDOMInstance;
		this.getUpButton = () => this.floorUpButton;
		this.getDownButton = () => this.floorDownButton;
		this.getFloorIndex = () => this.floorIndex;
		this.floorIndex = floorIndex;
		this.maxFloors = maxFloors;
		this.createFloorDOMInstance();
		this.floorDOMInstance = createDOMElementWithClass("div", "floor");
		const buttonGroup = createDOMElementWithClass("div", "elevator-buttons");
		if (this.floorIndex === 0) {
			this.floorDownButton = createDOMElementWithClass(
				"button",
				"down-button",
				"Down"
			);
			buttonGroup.appendChild(this.floorDownButton);
		} else if (this.floorIndex === this.maxFloors - 1) {
			this.floorUpButton = createDOMElementWithClass(
				"button",
				"up-button",
				"Up"
			);
			buttonGroup.appendChild(this.floorUpButton);
		} else {
			this.floorDownButton = createDOMElementWithClass(
				"button",
				"down-button",
				"Down"
			);
			this.floorUpButton = createDOMElementWithClass(
				"button",
				"up-button",
				"Up"
			);
			buttonGroup.appendChild(this.floorUpButton);
			buttonGroup.appendChild(this.floorDownButton);
		}
		this.floorDOMInstance.appendChild(buttonGroup);
	}
}
class Building {
	constructor(floors, elevators) {
		this.floors = [];
		this.elevators = [];
		this.buildingDOMInstance = document.getElementById("building");
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
	callElevator(floorIndex) {
		const idleElevator = this.elevators.find(
			(elevator) => elevator.getState() === states.IDLE
		);
		if (idleElevator) {
			idleElevator.moveToFloor(floorIndex);
			return 0; // exits succesfully
		}
		return 1; // nope
	}
	requestElevator(floorIndex) {
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
const form = document.querySelector("form");
const floorInput = document.getElementById("floors");
const elevatorInput = document.getElementById("elevators");
let floorHeight;
let maxFloors = 0;
let lifts = 0;
function hanldeSubmitInputs(event) {
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
function createDOMElementWithClass(element, className, text = "") {
	const domElement = document.createElement(element);
	domElement.classList.add(className);
	domElement.textContent = text;
	return domElement;
}
