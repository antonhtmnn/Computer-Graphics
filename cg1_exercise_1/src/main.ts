// external dependencies
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import RenderWidget from './lib/rendererWidget';
import { Application, createWindow, Window } from './lib/window';

import * as helper from './helper';

// put your imports here
import * as ownHelper from './ownHelper';

/*******************************************************************************
 * Main entrypoint. Previouly declared functions get managed/called here.
 * Start here with programming.
 ******************************************************************************/

var camera: THREE.PerspectiveCamera;
var controls: OrbitControls;
var rendererDiv: Window;

function main(){

    var root = Application("Robot");
  	root.setLayout([["renderer"]]);
    root.setLayoutColumns(["100%"]);
    root.setLayoutRows(["100%"]);

    // ---------------------------------------------------------------------------

    // create RenderDiv
    rendererDiv = createWindow("renderer");
    root.appendChild(rendererDiv);

    // create renderer
    var renderer = new THREE.WebGLRenderer({
        antialias: true,  // to enable anti-alias and get smoother output
    });

    // important exercise specific limitation, do not remove this line
    THREE.Object3D.DEFAULT_MATRIX_AUTO_UPDATE = false;

    // create scene
    var scene = new THREE.Scene();
    // manually set matrixWorld
    scene.matrixWorld.copy(scene.matrix);

    helper.setupLight(scene);

    // create camera
    camera = new THREE.PerspectiveCamera();
    helper.setupCamera(camera, scene);

    // create controls
    controls = new OrbitControls(camera, rendererDiv);
    helper.setupControls(controls);

    // start the animation loop (async)
    var wid = new RenderWidget(rendererDiv, renderer, camera, scene, controls);
    wid.animate();

    // ---------------------------------------------------------------------------

    // build robot scene graph and initialize RobotHelper object
    const robotHelper = new ownHelper.RobotHelper(scene);
    ownHelper.buildRobot(scene);
    robotHelper.storeCurrentPosition();

    document.addEventListener('keydown', event => {

      // update selected node
      ownHelper.updateSelectedNode(event, robotHelper);

      // display local coordinate system of selected node
      ownHelper.displayAxes(event, robotHelper);

      // rotate selected node
      ownHelper.rotateSelectedNode(event, robotHelper);

      // reset
      ownHelper.resetRobot(event, robotHelper);
    });
}

// call main entrypoint
main();
