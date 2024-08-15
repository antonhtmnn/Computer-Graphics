// external dependencies
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// local from us provided utilities
import * as utils from './lib/utils';
import RenderWidget from './lib/rendererWidget';
import { Application, createWindow } from './lib/window';

// helper lib, provides exercise dependent prewritten Code
import * as helper from './helper';
import ImageWidget from './imageWidget';

// load shaders
import uvVertexShader from './shader/uv.v.glsl?raw';
import uvFragmentShader from './shader/uv.f.glsl?raw';
import sphericalVertexShader from './shader/spherical.v.glsl?raw';
import sphericalFragmentShader from './shader/spherical.f.glsl?raw';
import fixSphericalVertexShader from './shader/fixSpherical.v.glsl?raw';
import fixSphericalFragmentShader from './shader/fixSpherical.f.glsl?raw';
import envMappingVertexShader from './shader/envMapping.v.glsl?raw';
import envMappingFragmentShader from './shader/envMapping.f.glsl?raw';
import normalmapVertexShader from './shader/normalmap.v.glsl?raw';
import normalmapFragmentShader from './shader/normalmap.f.glsl?raw';


function buildQuadGeometry() {

  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array([
    // triangle A
    -1.0, -1.0, 0.0,
     1.0, -1.0, 0.0,
    -1.0,  1.0, 0.0,
    // triangle B
     1.0,  1.0, 0.0,
    -1.0,  1.0, 0.0,
     1.0, -1.0, 0.0
  ]);
  const uv_coords = new Float32Array([
    0.0,  0.0,
    1.0,  0.0,
    0.0,  1.0,
    1.0,  1.0,
    0.0,  1.0,
    1.0,  0.0
  ]);
  const normals = new Float32Array([
    0.0,  0.0,  1.0,
    0.0,  0.0,  1.0,
    0.0,  0.0,  1.0,
    0.0,  0.0,  1.0,
    0.0,  0.0,  1.0,
    0.0,  0.0,  1.0
 ]);
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geometry.setAttribute("uv", new THREE.BufferAttribute(uv_coords, 2));
  geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
  return geometry;
}

function updateUniforms() {

  uniforms = {
    textureImg: {value: currentTexture},
    drawingTexture: {value: new THREE.CanvasTexture(ImgWid.getDrawingCanvas())},
    normalMap: {value: currentNormalMap}
  };
}

function updateMaterial() {

  if (settings.shader != helper.Shaders.uv) {
    ImgWid.disableDrawing();
  }

  if (settings.shader == helper.Shaders.uv) {
    ImgWid.enableDrawing();
    material = new THREE.RawShaderMaterial({
      uniforms: uniforms,
      vertexShader: uvVertexShader,
      fragmentShader: uvFragmentShader
    });
  } else if (settings.shader == helper.Shaders.spherical) {
    material = new THREE.RawShaderMaterial({
      uniforms: uniforms,
      vertexShader: sphericalVertexShader,
      fragmentShader: sphericalFragmentShader
    });
  } else if (settings.shader == helper.Shaders.fixSpherical) {
    material = new THREE.RawShaderMaterial({
      uniforms: uniforms,
      vertexShader: fixSphericalVertexShader,
      fragmentShader: fixSphericalFragmentShader
    });
  } else if (settings.shader == helper.Shaders.envMapping) {
    material = new THREE.RawShaderMaterial({
      uniforms: uniforms,
      vertexShader: envMappingVertexShader,
      fragmentShader: envMappingFragmentShader
    });
  } else if (settings.shader == helper.Shaders.normalmap) {
    material = new THREE.RawShaderMaterial({
      uniforms: uniforms,
      vertexShader: normalmapVertexShader,
      fragmentShader: normalmapFragmentShader
    });
  }

  material.glslVersion = THREE.GLSL3;
  if (model) model.material = material;
}

function updateSceneBackground() {

  if (settings.environment) {
    currentTexture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = currentTexture;
  } else {
    currentTexture.mapping = THREE.Texture.DEFAULT_MAPPING;
    scene.background = new THREE.Color("black");
  }
}

function callback(changed: utils.KeyValuePair<helper.Settings>) {

  switch (changed.key) {
    case "geometry":
      if (settings.geometry == helper.Geometries.box) {
        geometry = helper.createBox();
      } else if (settings.geometry == helper.Geometries.sphere) {
        geometry = helper.createSphere();
      } else if (settings.geometry == helper.Geometries.knot) {
        geometry = helper.createKnot();
      } else if (settings.geometry == helper.Geometries.quad) {
        geometry = buildQuadGeometry();
      } else if (settings.geometry == helper.Geometries.bunny) {
        geometry = helper.createBunny();
      }
      model.geometry = geometry;
      break;
      
    case "texture":
      ImgWid.setImage("src/textures/" + settings.texture.toLowerCase() + ".jpg");
      currentTexture = loader.load(("src/textures/" + settings.texture.toLowerCase() + ".jpg"));
      break;

    case "normalmap":
      currentNormalMap = loader.load(("src/textures/" + settings.normalmap.toLowerCase() + "_normals.jpg"));
      break;

    default:
      break;
  }

  updateUniforms();
  updateMaterial();
  if (currentTexture) {
    updateSceneBackground();
  }
}

const loader = new THREE.TextureLoader();
let currentTexture: THREE.Texture;
let currentNormalMap: THREE.Texture;
let settings: helper.Settings;
let ImgWid: ImageWidget;
let scene: THREE.Scene;
let material: THREE.RawShaderMaterial;
let geometry: THREE.BufferGeometry;
let model: THREE.Mesh;
let uniforms: {[uniform: string] : THREE.IUniform};

function main() {

  let root = Application("Texturing");
  root.setLayout([["texture", "renderer"]]);
  root.setLayoutColumns(["50%", "50%"]);
  root.setLayoutRows(["100%"]);

  // ---------------------------------------------------------------------------
  // create Settings and create GUI settings
  settings = new helper.Settings();
  helper.createGUI(settings);
  // adds the callback that gets called on settings change
  settings.addCallback(callback);

  // ---------------------------------------------------------------------------
  let textureDiv = createWindow("texture");
  root.appendChild(textureDiv);

  // the image widget. Change the image with setImage
  // you can enable drawing with enableDrawing
  // and it triggers the event "updated" while drawing
  ImgWid = new ImageWidget(textureDiv);

  // ---------------------------------------------------------------------------
  // create RenderDiv
	let rendererDiv = createWindow("renderer");
  root.appendChild(rendererDiv);

  // create renderer
  let renderer = new THREE.WebGLRenderer({
      antialias: true,  // to enable anti-alias and get smoother output
  });

  // create scene
  scene = new THREE.Scene();

  // create camera
  let camera = new THREE.PerspectiveCamera();
  helper.setupCamera(camera, scene);

  // create controls
  let controls = new OrbitControls(camera, rendererDiv);
  helper.setupControls(controls);

  let wid = new RenderWidget(rendererDiv, renderer, camera, scene, controls);
  wid.animate();

  // ---------------------------------------------------------------------------
  // set initial settings and add event listener for drawing
  
  settings.pen = () => {ImgWid.clearDrawing()};

  ImgWid.DrawingCanvas.addEventListener("updated", function(){
    updateUniforms();
    updateMaterial();
  });
  ImgWid.setImage("src/textures/" + settings.texture.toLowerCase() + ".jpg");
  ImgWid.enableDrawing();

  currentTexture = loader.load(("src/textures/" + settings.texture.toLowerCase() + ".jpg"));
  currentNormalMap = loader.load(("src/textures/" + settings.normalmap.toLowerCase() + "_normals.jpg"));

  updateUniforms();
  updateMaterial();
  material.glslVersion = THREE.GLSL3;

  geometry = buildQuadGeometry();
  model = new THREE.Mesh(geometry, material);
  scene.add(model);
}


// call main entrypoint
main();
