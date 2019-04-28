{
    init: function(elevators, floors) {
        var upFloors = [];
        var downFloors = [];
        var lastFloor = floors.length - 1;
        var logColors = ['#e74c3c', '#27ae60', '#2980b9', '#8e44ad', '#f39c12', '#f1c40f'];

        ////////////////////
        // Register events
        ///////////////////

        for (var elevatorNum in elevators) {
            elevatorNum = parseInt(elevatorNum);
            var elevator = elevators[elevatorNum];
            elevator.elevatorNum = elevatorNum;
            elevator.logColor = logColors[elevatorNum];

            registerHelpers(elevator);
            registerElevatorEvents(elevator);
        }

        for (var floorNum in floors) {
            console.log("floorNum >>", parseInt(floorNum));
            floorNum = parseInt(floorNum);
            registerFloorEvents(floors[floorNum], floorNum);
        }

        //////////////////////
        // Register functions
        //////////////////////

        function registerFloorEvents(floor, floorNum) {
            floor.on("up_button_pressed", function() {
                // if floorNum already present, no need to add again
                if (upFloors.indexOf(floorNum) > -1) {
                    return;
                }
                upFloors.push(floorNum);
                upFloors = upFloors.sort();
            });

            floor.on("down_button_pressed", function() {
                // if floorNum already present, no need to add again
                if (downFloors.indexOf(floorNum) > -1) {
                    return;
                }
                downFloors.push(floorNum);
                downFloors = downFloors.sort(function(a,b) { return b-a });
            })
        }

        function registerHelpers(elevator) {
            elevator.isGoingUp = function() {
                return elevator.destinationDirection() === "up";
            }

            elevator.isGoingDown = function() {
                return elevator.destinationDirection() === "up";
            }

            elevator.isStopped = function() {
                return elevator.destinationDirection() === "stopped";
            }
        }
        
        function registerElevatorEvents(elevator) {
            elevator.on("idle", function() {
                console.log(`%c ELevator ${elevator.elevatorNum} is idle at ${elevator.currentFloor()}!`, `color: ${elevator.logColor}`);
                console.log("%c upFloors >>", upFloors, `color: ${elevator.logColor}`);
                console.log("%c downFloors >>", downFloors, `color: ${elevator.logColor}`);


                // filter currentFloor
                var currentFloor = elevator.currentFloor();
                var _upFloors = getUpFloors(currentFloor);
                var _downFloors = getDownFloors(currentFloor);
                var callQueue = upFloors.concat(downFloors);

                if (elevator.isGoingUp() && _upFloors.length) {

                    var floorNum = _upFloors.shift();
                    elevator.goToFloor(floorNum);

                    console.log(`%c Elevator ${elevator.elevatorNum} going up to floor ${floorNum}`, `color: ${elevator.logColor}`);

                } else if (elevator.isGoingDown() && _downFloors.length) {

                    var floorNum = _downFloors.pop();
                    elevator.goToFloor(floorNum);

                    console.log(`%c Elevator ${elevator.elevatorNum} going down to floor ${floorNum}`, `color: ${elevator.logColor}`);

                } else if (elevator.isStopped() && callQueue.length) {

                    if (elevator.currentFloor() > parseInt(lastFloor/2)) {
                        callQueue.sort().reverse();

                        console.log(`%c Elevator ${elevator.elevatorNum} going up to down`, `color: ${elevator.logColor}`);

                    } else {
                        callQueue.sort();

                        console.log(`%c Elevator ${elevator.elevatorNum} going down to up`, `color: ${elevator.logColor}`);
                    }

                    for (var i in callQueue) {
                        var floorNum = callQueue[i];
                        goToFloor(elevator, floorNum, true);

                        console.log(`%c Elevator ${elevator.elevatorNum} going to floor ${floorNum}`, `color: ${elevator.logColor}`);
                    }

                } else {
                    console.log(`%c Elevator ${elevator.elevatorNum} direction is ${elevator.destinationDirection()}`, `color: ${elevator.logColor}`)
                    console.log(`%c Elevator ${elevator.elevatorNum} has no where to go!!`, `color: ${elevator.logColor}`);
                }
                
                console.log("--------------------------------------");
            });

            elevator.on("floor_button_pressed", function(floorNum) {

                // check if floorNum exists in Queue, ignore if already present in queue
                if (elevator.destinationQueue.indexOf(floorNum) === -1) {
                    goToFloor(elevator, floorNum);
                    console.log(`Elevator-${elevator.elevatorNum} keypad pressed, going to floor ${floorNum}`);
                } else {
                    console.log(`%c Elevator-${elevator.elevatorNum} keypad pressed for ${floorNum}, ignoring since already present in queue`, `color: ${elevator.logColor}`);
                }

                console.log(`%c Elevator-${elevator.elevatorNum} Queue >> ${elevator.destinationQueue}`, `color: ${elevator.logColor}`);
                console.log("--------------------------------------");
            });

            elevator.on("passing_floor", function(floorNum, direction) {

                console.log(`%c Elevator ${elevator.elevatorNum} passing floor ${floorNum}!`, `color: ${elevator.logColor}`);

                if (direction === "up" && upFloors.indexOf(floorNum) > -1 && !isFull(elevator)) {

                    // remove floorNum from upFloor Queue
                    upFloors = upFloors.splice(1, upFloors.indexOf(floorNum));

                    // Check if floorNum exists in elevator Queue, don't need to add if already present
                    if (elevator.destinationQueue.indexOf(floorNum) === -1) {
                        goToFloor(elevator, floorNum, true);

                        console.log(`%c Elevator-${elevator.elevatorNum} is stopping at ${floorNum}`, `color: ${elevator.logColor}`);
                    } else {
                        console.log(`%c Elevator-${elevator.elevatorNum} floor ${floorNum} already exists in queue!`, `color: ${elevator.logColor}`);
                    }

                    console.log(`%c Elevator-${elevator.elevatorNum} Queue >> ${elevator.destinationQueue}`, `color: ${elevator.logColor}`);

                } else if (direction === "down" && downFloors.indexOf(floorNum) > -1 && !isFull(elevator)) {

                    // remove floorNum from downFloor Queue 
                    downFloors = downFloors.splice(1, downFloors.indexOf(floorNum));

                    // Check if floorNum exists in elevator Queue, don't need to add if already present
                    if (elevator.destinationQueue.indexOf(floorNum) === -1) {
                        goToFloor(elevator, floorNum, true);

                        console.log(`%c Elevator-${elevator.elevatorNum} is stopping at ${floorNum}`, `color: ${elevator.logColor}`);
                    } else {
                        console.log(`%c Elevator-${elevator.elevatorNum} floor ${floorNum} already exists in queue!`, `color: ${elevator.logColor}`);
                    }
                    
                    console.log(`%c Elevator-${elevator.elevatorNum} Queue >> ${elevator.destinationQueue}`, `color: ${elevator.logColor}`);
                }

                console.log("--------------------------------------");
            });

            
        }

        //////////////////////
        // Utility Functions
        //////////////////////

        function isFull(elevator) {
            return elevator.loadFactor() === 0.8;
        }

        function getUpFloors(currentFloor) {
            // filter currentFloor
            return upFloors.filter(function(floorNum) {
                return floorNum === currentFloor
            });
        }

        function getDownFloors(currentFloor) {
            // filter currentFloor
            return downFloors.filter(function(floorNum) {
                return floorNum === currentFloor;
            });
        }

        function goToFloor(elevator, floorNum, force = false) {

            //checkAndSetElevatorDirection(elevator, floorNum);

            if (force) {
                elevator.goToFloor(floorNum, true);
            } else {
                elevator.goToFloor(floorNum);
            }
        }

        function checkAndSetElevatorDirection(elevator, floorNum = null) {
            if (elevator.destinationDirection === "up") {
                elevator.goingUpIndicator(true);
                elevator.goingDownIndicator(false);
            } else if (elevator.destinationDirection === "down") {
                elevator.goingUpIndicator(false);
                elevator.goingDownIndicator(true);
            } else {
                if (floorNum && floorNum > elevator.currentFloor()) {
                    elevator.goingDownIndicator(false);
                    elevator.goingUpIndicator(true);
                } else if (floorNum && floorNum < elevator.currentFloor()) {
                    elevator.goingDownIndicator(true);
                    elevator.goingUpIndicator(false);
                }
            }
        }

        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
