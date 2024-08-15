// external dependencies
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// local from us provided utilities
import RenderWidget from './lib/rendererWidget';
import { Application, createWindow } from './lib/window';
import type * as utils from './lib/utils';

// helper lib, provides exercise dependent prewritten Code
import * as helper from './helper';

// load shaders
import basicVertexShader from './shader/basic.v.glsl?raw';
import basicFragmentShader from './shader/basic.f.glsl?raw';
import ambientVertexShader from './shader/ambient.v.glsl?raw';
import ambientFragmentShader from './shader/ambient.f.glsl?raw';
import normalVertexShader from './shader/normal.v.glsl?raw';
import normalFragmentShader from './shader/normal.f.glsl?raw';
import toonVertexShader from './shader/toon.v.glsl?raw';
import toonFragmentShader from './shader/toon.f.glsl?raw';
import lambertVertexShader from './shader/lambert.v.glsl?raw';
import lambertFragmentShader from './shader/lambert.f.glsl?raw';
import gouraud_phongVertexShader from './shader/gouraud_phong.v.glsl?raw';
import gouraud_phongFragmentShader from './shader/gouraud_phong.f.glsl?raw';
import phong_phongVertexShader from './shader/phong_phong.v.glsl?raw';
import phong_phongFragmentShader from './shader/phong_phong.f.glsl?raw';
import phong_cooktorranceVertexShader from './shader/phong_cooktorrance.v.glsl?raw';
import phong_cooktorranceFragmentShader from './shader/phong_cooktorrance.f.glsl?raw';


// defines callback that should get called whenever the
// params of the settings get changed (eg. via GUI)
function callback(changed: utils.KeyValuePair<helper.Settings>) {

  // update the light material color and position
  lightMaterial.color = new THREE.Color(settings.light_color[0]/255.0,
                                        settings.light_color[1]/255.0,
                                        settings.light_color[2]/255.0);
  var delta: number;
  if (changed.key == "lightX") {
    delta = Math.abs(changed.value - lastLightPosX);
    if (changed.value < lastLightPosX) light.translateX(-delta);
    else light.translateX(delta);
    lastLightPosX = changed.value;

  } else if (changed.key == "lightY") {
    delta = Math.abs(changed.value - lastLightPosY);
    if (changed.value < lastLightPosY) light.translateY(-delta);
    else light.translateY(delta);
    lastLightPosY = changed.value;

  } else if (changed.key == "lightZ") {
    delta = Math.abs(changed.value - lastLightPosZ);
    if (changed.value < lastLightPosZ) light.translateZ(-delta);
    else light.translateZ(delta);
    lastLightPosZ = changed.value;
  }

  // update the uniforms
  uniforms = {
    ambient_color: {value: settings.ambient_color},
    ambient_reflectance: {value: settings.ambient_reflectance},
    lightPosition: {value: light.getWorldPosition(new THREE.Vector3)},
    diffuse_reflectance: {value: settings.diffuse_reflectance},
    diffuse_color: {value: settings.diffuse_color},
    specular_reflectance: {value: settings.specular_reflectance},
    specular_color: {value: settings.specular_color},
    magnitude: {value: settings.magnitude},
    roughness: {value: settings.roughness},
    light_color: {value: settings.light_color},
    light_intensity: {value: settings.light_intensity}
  };

  // update the shader
  switch (settings.shader) {

    case helper.Shaders.basic:
      material = new THREE.RawShaderMaterial({
        vertexShader: basicVertexShader,
        fragmentShader: basicFragmentShader
      });
      break;

    case helper.Shaders.ambient:
      material = new THREE.RawShaderMaterial({
        uniforms: uniforms,
        vertexShader: ambientVertexShader,
        fragmentShader: ambientFragmentShader
      });
      break;

    case helper.Shaders.normal:
      material = new THREE.RawShaderMaterial({
        vertexShader: normalVertexShader,
        fragmentShader: normalFragmentShader
      });
      break;

    case helper.Shaders.toon:
      material = new THREE.RawShaderMaterial({
        vertexShader: toonVertexShader,
        fragmentShader: toonFragmentShader
      });
      break;

    case helper.Shaders.lambert:
      material = new THREE.RawShaderMaterial({
        uniforms: uniforms,
        vertexShader: lambertVertexShader,
        fragmentShader: lambertFragmentShader
      });
      break;

    case helper.Shaders.gouraud_phong:
      material = new THREE.RawShaderMaterial({
        uniforms: uniforms,
        vertexShader: gouraud_phongVertexShader,
        fragmentShader: gouraud_phongFragmentShader
      });
      break;

    case helper.Shaders.phong_phong:
      material = new THREE.RawShaderMaterial({
        uniforms: uniforms,
        vertexShader: phong_phongVertexShader,
        fragmentShader: phong_phongFragmentShader
      });
      break;

    case helper.Shaders.phong_cooktorrance:
      material = new THREE.RawShaderMaterial({
        uniforms: uniforms,
        vertexShader: phong_cooktorranceVertexShader,
        fragmentShader: phong_cooktorranceFragmentShader
      });
      break;
  }

  // update material
  material.glslVersion = THREE.GLSL3;
  model0.material = material;
  model1.material = material;
  model2.material = material;
  model3.material = material;
}

var settings: helper.Settings;
var uniforms: {[uniform: string] : THREE.IUniform};
var material: THREE.RawShaderMaterial;
var model0: THREE.Mesh;
var model1: THREE.Mesh;
var model2: THREE.Mesh;
var model3: THREE.Mesh;
var light: THREE.Mesh;
var lightMaterial: THREE.MeshBasicMaterial;
var lastLightPosX: number = 2.0;
var lastLightPosY: number = 2.0;
var lastLightPosZ: number = 2.0;

// feel free to declar certain variables outside the main function to change them somewhere else
// e.g. settings, light or material
function main() {

  // setup/layout root Application.
  // Its the body HTMLElement with some additional functions.
  // More complex layouts are possible too.
  var root = Application("Shader");
	root.setLayout([["renderer"]]);
  root.setLayoutColumns(["100%"]);
  root.setLayoutRows(["100%"]);

  // ---------------------------------------------------------------------------
  // create Settings and create GUI settings
  settings = new helper.Settings();
  helper.createGUI(settings);
  // adds the callback that gets called on params change
  settings.addCallback(callback);

  // ---------------------------------------------------------------------------
  // create RenderDiv
	var rendererDiv = createWindow("renderer");
  root.appendChild(rendererDiv);

  // create renderer
  var renderer = new THREE.WebGLRenderer({
      antialias: true,  // to enable anti-alias and get smoother output
  });

  // create scene
  var scene = new THREE.Scene();
  ({ material, model0, model1, model2, model3 } = helper.setupGeometry(scene));

  // add light proxy
  var lightgeo = new THREE.SphereGeometry(0.1, 32, 32);
  lightMaterial = new THREE.MeshBasicMaterial({color: 0xff8010});
  light = new THREE.Mesh(lightgeo, lightMaterial);
  scene.add(light);
  light.translateX(settings.lightX);
  light.translateY(settings.lightY);
  light.translateZ(settings.lightZ);
  lightMaterial.color = new THREE.Color(settings.light_color[0]/255.0,
                                        settings.light_color[1]/255.0,
                                        settings.light_color[2]/255.0);

  // create camera
  var camera = new THREE.PerspectiveCamera();
  helper.setupCamera(camera, scene);

  // create controls
  var controls = new OrbitControls(camera, rendererDiv);
  helper.setupControls(controls);

  // fill the renderDiv. In RenderWidget happens all the magic.
  // It handles resizes, adds the fps widget and most important defines the main animate loop.
  // You dont need to touch this, but if feel free to overwrite RenderWidget.animate
  var wid = new RenderWidget(rendererDiv, renderer, camera, scene, controls);
  // start the draw loop (this call is async)
  wid.animate();
}

// call main entrypoint
main();
