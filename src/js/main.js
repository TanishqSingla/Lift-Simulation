class Elevator {
  states = ["idle", "active"];
  currentState;
  currentFloor;
  maxFloors;
  elevatorDOMInstance;
  constructor(maxFloors, currentFloor) {
    this.currentState = this.states[0];
    this.maxFloors = maxFloors;
    this.currentFloor = currentFloor;
    this.createDOMInstance();
  }
  getState = () => (this.currentState);
  getFloor = () => (this.currentFloor);
  getElevatorDOM = () => (this.elevatorDOMInstance);
  setStatusActive = () => this.currentState = this.states[0];
  setStatusIdle = () => this.currentState = this.states[1];

  createDOMInstance = () => {
    const elevator = document.createElement('div');
    const elevatorDoor = document.createElement('div');
    elevator.classList.add('elevator');
    elevatorDoor.classList.add('elevator-door');
    elevator.appendChild(elevatorDoor);
    this.elevatorDOMInstance = elevator;
    return elevator;
  }

  ascendToFloor(floor) {
    this.setStatusIdle();
    this.currentFloor = floor;
    setTimeout(() => {
      this.setStatusActive();
    }, 500 * floor);
    
  }
  descendToFloor(floor) {
    this.setStatusIdle();
    this.currentFloor = floor;
    setTimeout(() => {
      this.setStatusActive();
    }, 500 * floor);
  }
}

class LiftManager {
  floors = [];
  elevators = [];
  constructor(floors, elevators) {
  }
};

class Floor {
  floorDownButton;
  floorUpButton;
  floorDOMInstance;
  constructor() {
    this.createFloorDOMInstance();
  }
  createFloorDOMInstance = () => {
    const floor = document.createElement('div');
    floor.classList.add('floor');
  }
}

const building = document.getElementById('building');
const form = document.querySelector('form')
const floorInput = document.getElementById('floors');
const elevatorInput = document.getElementById('elevators');
const createFloorsButton = document.getElementById('createFloorsButton');

let maxFloors = 0;
let lifts = 0;


function createUpButton() {
  const button = document.createElement('button');
  button.classList.add('upButton');
  button.textContent = "UP";
  return button;
}
function createDownButton() {
  const button = document.createElement('button');
  button.classList.add('downButton');
  button.textContent = "DOWN";
  return button;
}
function createElevatorButtons(button = "both") {
  const elevatorButtons = document.createElement('div');
  elevatorButtons.classList.add('elevatorButtons');
  if(button === "up") {
    elevatorButtons.appendChild(createUpButton());
  }
  if(button === "down") {
    elevatorButtons.appendChild(createDownButton());
  }
  if(button === "both") {
    elevatorButtons.appendChild(createUpButton());
    elevatorButtons.appendChild(createDownButton());   
  }
  return elevatorButtons;
}
function createFloor(index) {
  const floor =  document.createElement('div');
  floor.classList.add('floor');
  if(index == 0) {
    floor.appendChild(createElevatorButtons("up"));
  }
  else if(+floorInput.value - index == 1) {
    floor.appendChild(createElevatorButtons("down"));
  } else {
    floor.appendChild(createElevatorButtons());
  }
  return floor;
}
function createElevator() {
  const elevator = document.createElement('div');
  const elevatorDoor = document.createElement('div');
  elevator.classList.add('elevator');
  elevatorDoor.classList.add('elevator-door');
  elevator.appendChild(elevatorDoor)
  return elevator;
}

function hanldeSubmitInputs(event) {
  event.preventDefault();
  const floors = +floorInput.value;
  const elevators = +elevatorInput.value;

  if(!(floors && elevators))
    return;

  if(floors < 0 || floors > 5)
    return;
  if(elevators < 0 || elevators > 5)
    return;

  // TODO: Initialize building
  for(let i = 0; i < floors; i++) {
    building.appendChild(createFloor(i));
  }
  for(let i = 0; i < elevators; i++) {
    building.lastChild.appendChild(createElevator());
  }
  
  floorInput.value = "";
  elevatorInput.value = "";
  form.style.display = "none"
}
