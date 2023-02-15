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
  getElevatorDOMInstance = () => (this.elevatorDOMInstance);
  setStatusActive = () => this.currentState = this.states[0];
  setStatusIdle = () => this.currentState = this.states[1];

  createDOMInstance = () => {
    this.elevatorDOMInstance = createDOMElementWithClass('div', 'elevator');
    const elevatorDoor = createDOMElementWithClass('div', 'elevator-door'); 
    this.elevatorDOMInstance.appendChild(elevatorDoor);
  }

  ascendToFloor(floor) {
    this.setStatusIdle();
    this.currentFloor = floor;
    this.elevatorDOMInstance.style.transform = `translateY(-${floor * floorHeight}px)`;
    setTimeout(() => {
      this.setStatusActive();
    }, 1000 * floor);
  }
  descendToFloor(floor) {
    this.setStatusIdle();
    this.currentFloor = floor;
    setTimeout(() => {
      this.setStatusActive();
    }, 900 * floor);
  }
}

class Floor {
  floorIndex;
  floorDownButton;
  floorUpButton;
  floorDOMInstance;
  maxFloors;
  constructor(floorIndex, maxFloors) {
    this.floorIndex = floorIndex;
    this.maxFloors = maxFloors;
    this.createFloorDOMInstance();
  }
  createFloorDOMInstance = () => {
    this.floorDOMInstance = createDOMElementWithClass('div', 'floor');
    const buttonGroup = createDOMElementWithClass('div', 'elevator-buttons');
    if(this.floorIndex === 0) {
      this.floorDownButton = createDOMElementWithClass('button', 'down-button', "Down");
      buttonGroup.appendChild(this.floorDownButton);
    } 
    else if(this.floorIndex === this.maxFloors - 1) {
      this.floorUpButton = createDOMElementWithClass('button', 'up-button', "Up");
      buttonGroup.appendChild(this.floorUpButton);
    }
    else {
      this.floorDownButton = createDOMElementWithClass('button', 'down-button', "Down");
      this.floorUpButton = createDOMElementWithClass('button', 'up-button', "Up");
      buttonGroup.appendChild(this.floorUpButton);
      buttonGroup.appendChild(this.floorDownButton);
    }
    this.floorDOMInstance.appendChild(buttonGroup);
  }

  getFloorDOMInstance = () => this.floorDOMInstance;
  getFloorIndex = () => this.floorIndex;
}

class Building {
  floors = [];
  elevators = [];
  buildingDOMInstance;
  constructor(floors, elevators) {
    this.buildingDOMInstance = document.getElementById('building');
    for(let i = 0; i < floors; i++) {
      this.floors.push(new Floor(i, floors))
    }
    for(let i = 0; i < elevators; i++) {
      this.elevators.push(new Elevator(floors, 0))
    }
    this.elevators.map(elevator => this.floors[floors - 1].getFloorDOMInstance().appendChild(elevator.getElevatorDOMInstance()));

    this.floors.map(floor => this.buildingDOMInstance.appendChild(floor.getFloorDOMInstance()));
    floorHeight = this.floors[0].floorDOMInstance.offsetHeight;
    this.elevators[0].ascendToFloor(1);
  }
}

const form = document.querySelector('form')
const floorInput = document.getElementById('floors');
const elevatorInput = document.getElementById('elevators');
let floorHeight;

let maxFloors = 0;
let lifts = 0;

function hanldeSubmitInputs(event) {
  event.preventDefault();
  const floors = +floorInput.value;
  const elevators = +elevatorInput.value;

  if(!(floors && elevators)) {return;}
  if(floors < 0 || floors > 5) {return;}
  if(elevators < 0 || elevators > 5) {return;}

  new Building(floors, elevators);
  form.style.display = "none";
}

function createDOMElementWithClass(element, className, text = '') {
  const domElement = document.createElement(element);
  domElement.classList.add(className);
  domElement.textContent = text
  return domElement;
}
