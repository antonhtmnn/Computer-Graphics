import * as THREE from 'three';

export class RobotHelper {

    scene: THREE.Scene;
    selectedNode: THREE.Object3D;
    previousSelectedNode: THREE.Object3D;
    axes: THREE.AxesHelper;
    axesActive: boolean;
    siblingCount: number;
    nodes: THREE.Object3D[];
    nodesStoredMatrix: THREE.Matrix4[];

    constructor(scene: THREE.Scene) {

        this.scene = scene;
        this.selectedNode = scene;
        this.previousSelectedNode = scene;
        this.axes = new THREE.AxesHelper(1/2);
        this.axesActive = false;
        this.siblingCount = 0;
        this.nodes = [];
        this.nodesStoredMatrix = [];
    }

    // stores all nodes and their matrices into this.nodes and this.nodesStoredMatrix respectively
    // (call this method only if buildRobot was already called)
    storeCurrentPosition(obj: THREE.Object3D = this.scene.children[3]) {

        this.nodes.push(obj);

        const matrixCopy = new THREE.Matrix4();
        this.nodesStoredMatrix.push(matrixCopy.copy(obj.matrix));

        for (const child of obj.children) {
            this.storeCurrentPosition(child);
        }
    }

    // loads the stored robot position
    // (call this method only if storeCurrentPosition was already called)
    loadStoredPosition() {

        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].matrix.copy(this.nodesStoredMatrix[i]);
            ownUpdateMatrixWorld(this.nodes[i]);
        }
    }
}

// task 1: construct robot scene graph
export function buildRobot(scene: THREE.Scene) {

    const material = new THREE.MeshPhongMaterial({color: 0x71b978});

    // create geometries
    const bodyGeometry = new THREE.BoxGeometry(1/2, 3/4, 1/4);
    const legGeometry = new THREE.BoxGeometry(1/5, 1/2, 1/4);
    const footGeometry = new THREE.BoxGeometry(1/5, 1/8, 1/5);
    const leftArmGeometry = new THREE.BoxGeometry(1/2, 1/5, 1/4);
    const rightArmGeometry = new THREE.BoxGeometry(1/2, 1/5, 1/4);
    const headGeometry = new THREE.SphereGeometry(1/5);

    // create meshes
    const body = new THREE.Mesh(bodyGeometry, material);
    const leftLeg = new THREE.Mesh(legGeometry, material);
    const rightLeg = new THREE.Mesh(legGeometry, material);
    const leftFoot = new THREE.Mesh(footGeometry, material);
    const rightFoot = new THREE.Mesh(footGeometry, material);
    const leftArm = new THREE.Mesh(leftArmGeometry, material);
    const rightArm = new THREE.Mesh(rightArmGeometry, material);
    const head = new THREE.Mesh(headGeometry, material);

    // for console.log debugging
    body.name = 'body';
    leftLeg.name = 'leftLeg';
    rightLeg.name = 'rightLeg';
    leftFoot.name = 'leftFoot';
    rightFoot.name = 'rightFoot';
    leftArm.name = 'leftArm';
    rightArm.name = 'rightArm';
    head.name = 'head';

    // build scene graph
    scene.add(body);
    body.add(leftLeg);
    body.add(rightLeg);
    leftLeg.add(leftFoot);
    rightLeg.add(rightFoot)
    body.add(leftArm);
    body.add(rightArm);
    body.add(head);

    // translate geometries
    legGeometry.applyMatrix4(translationMatrix(new THREE.Vector3(0, -1/4, 0)));
    footGeometry.applyMatrix4(translationMatrix(new THREE.Vector3(0, 0, 1/10)));
    leftArmGeometry.applyMatrix4(translationMatrix(new THREE.Vector3(-1/4, 0, 0)));
    rightArmGeometry.applyMatrix4(translationMatrix(new THREE.Vector3(1/4, 0, 0)));

    // translate meshes and update matrix and matrixWorld
    applyMatrix(body, translationMatrix(new THREE.Vector3(0, 0, 0)));
    applyMatrix(leftLeg, translationMatrix(new THREE.Vector3(-0.15, -0.45, 0)));
    applyMatrix(rightLeg, translationMatrix(new THREE.Vector3(0.15, -0.45, 0)));
    applyMatrix(leftFoot, translationMatrix(new THREE.Vector3(0, -0.45, 1/5)));
    applyMatrix(rightFoot, translationMatrix(new THREE.Vector3(0, -0.45, 1/5)));
    applyMatrix(leftArm, translationMatrix(new THREE.Vector3(-1/3, 1/4, 0)));
    applyMatrix(rightArm, translationMatrix(new THREE.Vector3(1/3, 1/4, 0)));
    applyMatrix(head, translationMatrix(new THREE.Vector3(0, 2/3, 0)));
}

// task 2: update the selected node (and store it into rHelper.selectedNode)
export function updateSelectedNode(event: KeyboardEvent, rHelper: RobotHelper) {

    rHelper.previousSelectedNode = rHelper.selectedNode;

    // reset color of old selected node
    if (rHelper.selectedNode instanceof THREE.Mesh) {
        rHelper.selectedNode.material = new THREE.MeshPhongMaterial({color: 0x71b978});
    }

    switch (event.code) {
        case 'KeyW': // select parent node
            if (rHelper.selectedNode != rHelper.scene.children[3].children[1].children[0]) {
                // if selectedNode != rightFoot we need to reset the counter, otherwise
                // we get problems in case 'KeyA' and 'KeyD'
                rHelper.siblingCount = 0;   
            }
            if (rHelper.selectedNode.parent != null) {
                rHelper.selectedNode = rHelper.selectedNode.parent;
            }
            break;
            
        case 'KeyS': // select first child node
            if (rHelper.selectedNode == rHelper.scene) {
                // in this case we select the body and skip the light objects
                rHelper.selectedNode = rHelper.scene.children[3];

            } else if (rHelper.selectedNode.children.length != 0 &&
                rHelper.selectedNode.children[0] != rHelper.axes) {
                    rHelper.selectedNode = rHelper.selectedNode.children[0];
            }
            break;
            
        case 'KeyA': // select previous sibling node
            if (rHelper.selectedNode.parent == rHelper.scene.children[3]) {
                // condition above makes sure that the selected node has siblings
                // that are not light objects
                rHelper.siblingCount = (rHelper.siblingCount + 4) % 5;
                rHelper.selectedNode = rHelper.scene.children[3].children[rHelper.siblingCount];
            }
            break;

        case 'KeyD': // select next sibling node
            if (rHelper.selectedNode.parent == rHelper.scene.children[3]) {
                // condition above makes sure that the selected node has siblings
                // that are not light objects
                rHelper.siblingCount = (rHelper.siblingCount + 1) % 5;
                rHelper.selectedNode = rHelper.scene.children[3].children[rHelper.siblingCount];
            }
            break;

        default:
            break;
    }

    // update color of new selected node
    if (rHelper.selectedNode instanceof THREE.Mesh) {
        rHelper.selectedNode.material = new THREE.MeshPhongMaterial({color: 0x7871b9});
    }
}

// task 3: display the local coordinate system of the selected node
export function displayAxes(event: KeyboardEvent, rHelper: RobotHelper) {

    if (rHelper.selectedNode == rHelper.scene) {
        rHelper.axesActive = false;
        removeAxes(rHelper);
        return;
    }

    // update axesActive flag in rHelper
    if (event.code == 'KeyC' && !rHelper.axesActive) {
        rHelper.axesActive = true;
    } else if (event.code == 'KeyC' && rHelper.axesActive) {
        rHelper.axesActive = false;
    }

    // update or remove axes
    if (rHelper.axesActive) updateAxes(rHelper);
    else removeAxes(rHelper);
}

// task 5: rotate the selected node using the arrow keys
export function rotateSelectedNode(event: KeyboardEvent, rHelper: RobotHelper) {

    if (rHelper.selectedNode == rHelper.scene) return;

    const matrix = new THREE.Matrix4();
    const angle = 0.1;

    switch (event.code) {
        case 'ArrowUp':
            matrix.copy(rotationMatrix('x', -angle));
            break;
        
        case 'ArrowDown':
            matrix.copy(rotationMatrix('x', angle));
            break;
        
        case 'ArrowLeft':
            matrix.copy(rotationMatrix('y', -angle));
            break;
        
        case 'ArrowRight':
            matrix.copy(rotationMatrix('y', angle));
            break;
      
        default:
            break;
    }

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
        applyMatrix(rHelper.selectedNode, matrix);
    }
}

// task 6: restore the initial pose
export function resetRobot(event: KeyboardEvent, rHelper: RobotHelper) {

    if (event.code == 'KeyR') {
        rHelper.loadStoredPosition();
        if (rHelper.axesActive) updateAxes(rHelper);
    }
}

function updateAxes(rHelper: RobotHelper) {

    removeAxes(rHelper);
    rHelper.selectedNode.add(rHelper.axes);
    ownUpdateMatrixWorld(rHelper.axes);
}

function removeAxes(rHelper: RobotHelper) {

    rHelper.previousSelectedNode.remove(rHelper.axes);
}

// updates obj.matrix via multiplication with m
// obj.matrix = obj.matrix * m
function ownUpdateMatrix(obj: THREE.Object3D, m: THREE.Matrix4) {

    obj.matrix.multiply(m);
}

// updates obj.matrixWorld via multiplication with matrix of the parent (up to the root scene)
// obj.matrixWorld = scene.matrix * ... * obj.parent.parent.matrix * obj.parent.matrix * obj.matrix
function ownUpdateMatrixWorld(obj: THREE.Object3D) {
    
    obj.matrixWorld.copy(obj.matrix);
    var currentParent = obj.parent;

    while (currentParent != null) {
        obj.matrixWorld.premultiply(currentParent.matrix);
        currentParent = currentParent.parent;
    }
}

// task 4: applies the matrix transformation m to the object and calls updateMatrixWorldRec
function applyMatrix(obj: THREE.Object3D, m: THREE.Matrix4) {

    ownUpdateMatrix(obj, m);
    updateMatrixWorldRec(obj);
}

// updates obj.matrixWorld of the object and all the children depending on that object
function updateMatrixWorldRec(obj: THREE.Object3D) {

    ownUpdateMatrixWorld(obj);

    for (const child of obj.children) {
        updateMatrixWorldRec(child);
    }
}

// build a 4x4 translation matrix (translation by vector v)
function translationMatrix(v: THREE.Vector3) {
    
    const matrix = new THREE.Matrix4();
    matrix.set(
        1, 0, 0, v.x,
        0, 1, 0, v.y,
        0, 0, 1, v.z,
        0, 0, 0, 1
        );
    return matrix;
}

// build a 4x4 rotation matrix (rotation around axes, by angle a)
function rotationMatrix(axes: String, a: number) {
    
    const matrix = new THREE.Matrix4();

    if (axes == 'x') {
        matrix.set(
            1, 0          , 0           , 0,
            0, Math.cos(a), -Math.sin(a), 0,
            0, Math.sin(a), Math.cos(a) , 0,
            0, 0          , 0           , 1
            );
    } else if (axes == 'y') {
        matrix.set(
            Math.cos(a) , 0, Math.sin(a), 0,
            0           , 1, 0          , 0,
            -Math.sin(a), 0, Math.cos(a), 0,
            0           , 0, 0          , 1
            );
    } else if (axes == 'z') {
        matrix.set(
            Math.cos(a), -Math.sin(a), 0, 0,
            Math.sin(a), Math.cos(a) , 0, 0,
            0          , 0           , 1, 0,
            0          , 0           , 0, 1
            );
    }
    return matrix;
}
