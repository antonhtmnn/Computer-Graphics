// external dependencies
import * as THREE from 'three';
// local from us provided utilities
import * as utils from './lib/utils';
import { Application, createWindow } from './lib/window';
// helper lib, provides exercise dependent prewritten Code
import * as helper from './helper';
// own imports here
import * as ownHelper from './ownHelper';


function callback(changed: utils.KeyValuePair<helper.Settings>) {

  var delta: number;

  switch (changed.key) {

    case "rotateX":
      delta = Math.abs(screen.lastRX - changed.value);
      if (changed.value < screen.lastRX) {
        screen.teddyBear?.rotateX(-delta);
      } else if (changed.value != screen.lastRX) {
        screen.teddyBear?.rotateX(delta);
      }
      screen.lastRX = changed.value;
      break;

    case "rotateY":
      delta = Math.abs(screen.lastRY - changed.value);
      if (changed.value < screen.lastRY) {
        screen.teddyBear?.rotateY(-delta);
      } else if (changed.value != screen.lastRY) {
        screen.teddyBear?.rotateY(delta);
      }
      screen.lastRY = changed.value;
      break;

    case "rotateZ":
      delta = Math.abs(screen.lastRZ - changed.value);
      if (changed.value < screen.lastRZ) {
        screen.teddyBear?.rotateZ(-delta);
      } else if (changed.value != screen.lastRZ) {
        screen.teddyBear?.rotateZ(delta);
      }
      screen.lastRZ = changed.value;
      break;

    case "translateX":
      delta = Math.abs(screen.lastTX - changed.value);
      if (changed.value < screen.lastTX) {
        screen.teddyBear?.translateX(-delta);
      } else if (changed.value != screen.lastTX) {
        screen.teddyBear?.translateX(delta);
      }
      screen.lastTX = changed.value;
      break;

    case "translateY":
      delta = Math.abs(screen.lastTY - changed.value);
      if (changed.value < screen.lastTY) {
        screen.teddyBear?.translateY(-delta);
      } else if (changed.value != screen.lastTY) {
        screen.teddyBear?.translateY(delta);
      }
      screen.lastTY = changed.value;
      break;

    case "translateZ":
      delta = Math.abs(screen.lastTZ - changed.value);
      if (changed.value < screen.lastTZ) {
        screen.teddyBear?.translateZ(-delta);
      } else if (changed.value != screen.lastTZ) {
        screen.teddyBear?.translateZ(delta);
      }
      screen.lastTZ = changed.value;
      break;
      
    case "near":
      screen.cameraPersp.near = changed.value;
      break;

    case "far":
      screen.cameraPersp.far = changed.value;
      break;

    case "fov":
      screen.cameraPersp.fov = changed.value;
      break;

    case "planeX0": // plane left
      if (changed.value && Array.isArray(canonical.renderer.clippingPlanes)) {
        canonical.renderer.clippingPlanes.push(canonical.planeX0);
      } else if (Array.isArray(canonical.renderer.clippingPlanes)) {
        canonical.renderer.clippingPlanes = ownHelper.removeArrayElem(canonical.renderer.clippingPlanes ,canonical.planeX0);
      }
      break;

    case "planeX1": // plane right
      if (changed.value && Array.isArray(canonical.renderer.clippingPlanes)) {
        canonical.renderer.clippingPlanes.push(canonical.planeX1);
      } else if (Array.isArray(canonical.renderer.clippingPlanes)) {
        canonical.renderer.clippingPlanes = ownHelper.removeArrayElem(canonical.renderer.clippingPlanes ,canonical.planeX1);
      }
      break;

    case "planeY0": // plane bottom
      if (changed.value && Array.isArray(canonical.renderer.clippingPlanes)) {
        canonical.renderer.clippingPlanes.push(canonical.planeY0);
      } else if (Array.isArray(canonical.renderer.clippingPlanes)) {
        canonical.renderer.clippingPlanes = ownHelper.removeArrayElem(canonical.renderer.clippingPlanes ,canonical.planeY0);
      }
      break;

    case "planeY1": // plane top
      if (changed.value && Array.isArray(canonical.renderer.clippingPlanes)) {
        canonical.renderer.clippingPlanes.push(canonical.planeY1);
      } else if (Array.isArray(canonical.renderer.clippingPlanes)) {
        canonical.renderer.clippingPlanes = ownHelper.removeArrayElem(canonical.renderer.clippingPlanes ,canonical.planeY1);
      }
      break;

    case "planeZ0": // plane back
      if (changed.value && Array.isArray(canonical.renderer.clippingPlanes)) {
        canonical.renderer.clippingPlanes.push(canonical.planeZ0);
      } else if (Array.isArray(canonical.renderer.clippingPlanes)) {
        canonical.renderer.clippingPlanes = ownHelper.removeArrayElem(canonical.renderer.clippingPlanes ,canonical.planeZ0);
      }
      break;

    case "planeZ1": // plane front
      if (changed.value && Array.isArray(canonical.renderer.clippingPlanes)) {
        canonical.renderer.clippingPlanes.push(canonical.planeZ1);
      } else if (Array.isArray(canonical.renderer.clippingPlanes)) {
        canonical.renderer.clippingPlanes = ownHelper.removeArrayElem(canonical.renderer.clippingPlanes ,canonical.planeZ1);
      }
      break;
  }
  // do updates
  screen.cameraPersp.updateProjectionMatrix();
  world.camHelper?.update();
  transformToNDC();
}

/*******************************************************************************
 * Main entrypoint.
 ******************************************************************************/

var settings: helper.Settings;

var screen: ownHelper.Space;
var world: ownHelper.Space;
var canonical: ownHelper.Space;

function main() {

  var root = Application("Camera");
  root.setLayout([["world", "canonical", "screen"]]);
  root.setLayoutColumns(["1fr", "1fr", "1fr"]);
  root.setLayoutRows(["100%"]);

  // create screenDiv
  var screenDiv = createWindow("screen");
  root.appendChild(screenDiv);
  // create RenderDiv
  var worldDiv = createWindow("world");
  root.appendChild(worldDiv);
  // create canonicalDiv
  var canonicalDiv = createWindow("canonical");
  root.appendChild(canonicalDiv);

  // ---------------------------------------------------------------------------
  // create Settings and create GUI settings

  settings = new helper.Settings();
  helper.createGUI(settings);
  settings.addCallback(callback);

  // ---------------------------------------------------------------------------
  // setup world (left), cononical viewing (middle) and screen (right) space

  screen = new ownHelper.Space(ownHelper.Spaces.screen, screenDiv, settings, new THREE.Scene());
  screen.setup();

  world = new ownHelper.Space(ownHelper.Spaces.world, worldDiv, settings, screen.scene);
  world.setup();

  canonical = new ownHelper.Space(ownHelper.Spaces.canonical, canonicalDiv, settings, new THREE.Scene());
  canonical.setup();

  // ---------------------------------------------------------------------------

  // add visualization of the 'screen' camera
  world.camHelper = new THREE.CameraHelper(screen.cameraPersp);
  world.scene.add(world.camHelper);

  // initial call
  transformToNDC()

  // add event listener to OrbitContol of 'screen' scene
  screen.orbitCtrl?.addEventListener("change", orbitListener);

  // add all clipping planes (default settings)
  if (Array.isArray(canonical.renderer.clippingPlanes)) {
    canonical.renderer.clippingPlanes.push(canonical.planeX0);
    canonical.renderer.clippingPlanes.push(canonical.planeX1);
    canonical.renderer.clippingPlanes.push(canonical.planeY0);
    canonical.renderer.clippingPlanes.push(canonical.planeY1);
    canonical.renderer.clippingPlanes.push(canonical.planeZ0);
    canonical.renderer.clippingPlanes.push(canonical.planeZ1);
  }
}

// call main entrypoint
main();


function transformToNDC() {

  // remove old teddyBear from 'canonical' scene
  if (canonical.teddyBear) {
    canonical.scene.remove(canonical.teddyBear);
  }
  canonical.teddyBear = screen.teddyBear?.clone();

  // calculate NDC
  canonical.teddyBear?.traverse(calcNDC);

  // reset matrices to identity
  canonical.teddyBear?.traverse(resetToIdentity);

  // add teddyBear in NDC to 'canonical' scene
  if (canonical.teddyBear) {
    canonical.scene.add(canonical.teddyBear);
  }
}

function calcNDC(obj: THREE.Object3D) {

  if (obj instanceof THREE.Mesh && obj.geometry instanceof THREE.BufferGeometry) {

    for (let i = 0; i < obj.geometry.getAttribute("position").count; i++) {

      // store old coords in vector v
      var x = obj.geometry.getAttribute("position").getX(i);
      var y = obj.geometry.getAttribute("position").getY(i);
      var z = obj.geometry.getAttribute("position").getZ(i);
      var v = new THREE.Vector4(x, y, z, 1);
      
      // update before transform, otherwise middle teddy bear glitchy
      screen.cameraPersp.updateMatrixWorld();

      // transform v to NDC and store it in vNDC
      var vNDC: THREE.Vector4;
      var tmpGeo = obj.geometry.clone();

      // vNDC = v.applyMatrix4(obj.matrixWorld);
      // vNDC = vNDC.applyMatrix4(screen.cameraPersp.matrixWorldInverse);
      // vNDC = vNDC.applyMatrix4(screen.cameraPersp.projectionMatrix);
      vNDC = ownHelper.ownApplyMatrix4(obj.matrixWorld, v);
      vNDC = ownHelper.ownApplyMatrix4(screen.cameraPersp.matrixWorldInverse, vNDC);
      vNDC = ownHelper.ownApplyMatrix4(screen.cameraPersp.projectionMatrix, vNDC);
      tmpGeo.getAttribute("position").setXYZ(i, vNDC.x/vNDC.w, vNDC.y/vNDC.w, -vNDC.z/vNDC.w);

      obj.geometry = tmpGeo;
    }
    obj.geometry.getAttribute("position").needsUpdate = true;
  }
}

function resetToIdentity(obj: THREE.Object3D) {

  obj.matrixAutoUpdate = false;
  obj.matrix.copy(new THREE.Matrix4());
  //console.log(JSON.parse(JSON.stringify(obj.matrix)))
}

function orbitListener() {

  // do updates
  screen.cameraPersp.updateProjectionMatrix();
  world.camHelper?.update();
  transformToNDC();
}
