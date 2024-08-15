import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CanvasWidget } from './canvasWidget';
import RenderWidget from './lib/rendererWidget';
import * as helper from './helper';
import * as utils from './lib/utils';
import { Application, createWindow } from './lib/window';


function callback(changed: utils.KeyValuePair<helper.Settings>) {

    switch (changed.key) {
        case "width":
            canvasWid.changeDimensions(settings.width, settings.height);
            break;

        case "height":
            canvasWid.changeDimensions(settings.width, settings.height);
            break;
    
        default:
            break;
    }
}

// global variables
const backgroundColor = new THREE.Color("Black");
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let canvasWid: CanvasWidget;
let settings: helper.Settings;
let lights: THREE.PointLight[];

function main() {

    // set up the application
    let root = Application("Ray Tracing");
    root.setLayout([["canvas", "renderer"]]);
    root.setLayoutColumns(["50%", "50%"]);
    root.setLayoutRows(["100%"]);

    // create Settings and create GUI settings
    settings = new helper.Settings();
    helper.createGUI(settings);
    settings.addCallback(callback);

    //------------------------------------------------------------------------------
    // RIGHT WINDOW
    // create renderer
    let rendererDiv = createWindow("renderer");
    root.appendChild(rendererDiv);
    let renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    // create scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera();
    helper.setupCamera(camera);
    let controls = new OrbitControls(camera, rendererDiv);
    lights = helper.setupLight(scene);
    helper.setupControls(controls);
    helper.setupGeometry(scene);

    let wid = new RenderWidget(rendererDiv, renderer, camera, scene, controls);
    wid.animate();

    //------------------------------------------------------------------------------
    // LEFT WINDOW
    // create canvas
    let canvasDiv = createWindow("canvas");
    root.appendChild(canvasDiv);
    canvasWid = new CanvasWidget(canvasDiv, 256, 256);

    settings.saveImg = () => {canvasWid.savePNG()};
    settings.render = () => {rayTracer()};
}

function rayTracer() {

    const raycaster = new THREE.Raycaster();
    let rayColor = backgroundColor;
    let pos = new THREE.Vector3();
    let normal = new THREE.Vector3();
    let material = new THREE.MeshPhongMaterial();

    for (let x = 0; x < settings.width; x++) {
        for (let y = 0; y < settings.height; y++) {

            // calculate normalized coordinates (range [-1, 1])
            const normalizedX = (x / settings.width) * 2 - 1;
            const normalizedY = -(y / settings.height) * 2 + 1;

            // set primary ray (from eye through pixel center)
            raycaster.setFromCamera(new THREE.Vector2(normalizedX, normalizedY), camera);

            // calculate objects intersecting the primary ray
            const intersects = raycaster.intersectObjects(scene.children);
            const hitInfo = getIntersectedSphere(raycaster);

            // calculate ray color (different based on settings)
            if (settings.correctSpheres && hitInfo[0] && hitInfo[1] instanceof THREE.Mesh) {
                // set rayColor to material color of first intersected sphere (parametric definition)
                rayColor = hitInfo[1].material.color;
                // store infos for Phong shading calculation
                pos = hitInfo[2];
                material = hitInfo[1].material;
                normal.subVectors(pos, hitInfo[1].position);
                normal.normalize();
                // check if the sphere is occluded by other geometry
                if (intersects[0] && intersects[0].object instanceof THREE.Mesh && intersects[0].distance < hitInfo[3]) {
                    // set rayColor to material color of first intersected object
                    rayColor = intersects[0].object.material.color;
                    // store infos for Phong shading calculation
                    pos = intersects[0].point;
                    material = intersects[0].object.material;
                    if (intersects[0].face) {
                        let M = new THREE.Matrix3();
                        M.setFromMatrix4(intersects[0].object.matrixWorld);
                        M.invert().transpose();
                        normal = intersects[0].face.normal;
                        normal.applyMatrix3(M);
                        normal.normalize();
                    }
                }

            } else if (intersects[0] && intersects[0].object instanceof THREE.Mesh) {
                // set rayColor to material color of first intersected object
                rayColor = intersects[0].object.material.color;
                // store infos for Phong shading calculation
                pos = intersects[0].point;
                material = intersects[0].object.material;
                if (intersects[0].face) {
                    let M = new THREE.Matrix3();
                    M.setFromMatrix4(intersects[0].object.matrixWorld);
                    M.invert().transpose();
                    normal = intersects[0].face.normal;
                    normal.applyMatrix3(M);
                    normal.normalize();
                }

            } else {
                // if no intersection: set rayColor to background color
                rayColor = backgroundColor;
            }

            // evaluate the Phong shading model
            if (settings.phong) {
                rayColor = getPhongColor(pos, material, normal);
            }

            // draw pixel
            canvasWid.setPixel(x, y, rayColor);
        }
    }
}

function getPhongColor(pos: THREE.Vector3, material: THREE.MeshPhongMaterial, normal: THREE.Vector3) {

    let phongColor = new THREE.Color(0, 0, 0);
    let n = 1;
    if (settings.alllights) n = lights.length;
    
    for (let i = 0; i < n; i++) {

        const magnitude = material.shininess;
        const reflecDiff = material.color;
        const reflecSpec = material.specular;
        const lightDir = new THREE.Vector3();
        const camDir = new THREE.Vector3();
        const idealLightRay = new THREE.Vector3();
        const lightIntensity = new THREE.Color(lights[i].color.r * 4 * lights[i].intensity,
                                               lights[i].color.g * 4 * lights[i].intensity,
                                               lights[i].color.b * 4 * lights[i].intensity);

        lightDir.subVectors(lights[i].getWorldPosition(new THREE.Vector3), pos);
        const lightAttenuation = 1 / Math.pow(lightDir.length(), 2);
        lightDir.normalize();
        camDir.subVectors(camera.getWorldPosition(new THREE.Vector3), pos);
        camDir.normalize();
        const scaledNormal = normal;
        scaledNormal.multiplyScalar(2 * normal.dot(lightDir));
        idealLightRay.subVectors(scaledNormal, lightDir);

        // calculate diffuse light
        let diffLight: THREE.Color;
        const dotProdNL = normal.dot(lightDir);
        if (dotProdNL >= 0.0) {
            diffLight = new THREE.Color(reflecDiff.r * dotProdNL * lightIntensity.r,
                                        reflecDiff.g * dotProdNL * lightIntensity.g,
                                        reflecDiff.b * dotProdNL * lightIntensity.b);
        } else {
            diffLight = new THREE.Color(0, 0, 0);
        }

        // calculate specular light
        let specLight: THREE.Color;
        const dotProdRE = idealLightRay.dot(camDir);
        if (dotProdRE > 0.0 && dotProdNL >= 0.0) {
            specLight = new THREE.Color(reflecSpec.r * Math.pow(dotProdRE, magnitude) * lightIntensity.r,
                                        reflecSpec.g * Math.pow(dotProdRE, magnitude) * lightIntensity.g,
                                        reflecSpec.b * Math.pow(dotProdRE, magnitude) * lightIntensity.b);
        } else {
            specLight = new THREE.Color(0, 0, 0);
        }

        phongColor.add(diffLight);
        phongColor.add(specLight.multiplyScalar(magnitude/50));
        phongColor.multiplyScalar(lightAttenuation);
    }
    
    return phongColor;
}

// returns intersection infos of nearest ray-sphere intersection:
// [got hit?, intersected sphere, intersection point, distance]
function getIntersectedSphere(raycaster: THREE.Raycaster) {

    let hitInfo: [boolean, THREE.Object3D, THREE.Vector3, number]
    hitInfo = [false, new THREE.Object3D, new THREE.Vector3, Infinity];
    let currentMin = Infinity;

    // loop over all spheres in the scene
    for (const obj of scene.children) {
        if (obj instanceof THREE.Mesh && obj.geometry instanceof THREE.SphereGeometry) {
            const radius = obj.geometry.parameters.radius;
            const origin = obj.position;
            const direction = raycaster.ray.direction;
            const originRay = raycaster.ray.origin;

            let intersectInfo: any[] = intersect(radius, origin, direction, originRay);
            if (intersectInfo[0] && intersectInfo[1] < currentMin) {
                hitInfo[0] = true;
                hitInfo[1] = obj;
                hitInfo[2] = new THREE.Vector3(originRay.x + direction.x * intersectInfo[1],
                                                      originRay.y + direction.y * intersectInfo[1],
                                                      originRay.z + direction.z * intersectInfo[1]);
                hitInfo[3] = intersectInfo[1];
                currentMin = intersectInfo[1];
            }
        }
    }

    return hitInfo;
}

// https://www.scratchapixel.com/lessons/3d-basic-rendering/minimal-ray-tracer-rendering-simple-shapes/ray-sphere-intersection.html
// returns intersection infos of ray-sphere intersection:
// [got hit?, distance]
function intersect(radius: number, origin: THREE.Vector3, direction: THREE.Vector3, originRay: THREE.Vector3) {

    let t0: number;
    let t1: number;
    let result: any[];

    let L = new THREE.Vector3(originRay.x - origin.x,
                              originRay.y - origin.y,
                              originRay.z - origin.z);
    let a = direction.dot(direction);
    let b = 2 * direction.dot(L);
    let c = L.dot(L) - Math.pow(radius, 2);

    result = solveQuadratic(a, b, c);
    t0 = result[1];
    t1 = result[2];
    if (!result[0]) return [false, Infinity];

    if (t0 > t1) {
        [t0, t1] = [t1, t0];
    }
    if (t0 < 0) {
        t0 = t1;
        if (t0 < 0) return [false, Infinity];
    }
    
    return [true, t0];
}

// https://www.scratchapixel.com/lessons/3d-basic-rendering/minimal-ray-tracer-rendering-simple-shapes/ray-sphere-intersection.html
function solveQuadratic(a: number, b: number, c: number) {

    let x0: number;
    let x1: number;

    const discr = (b * b) - (4 * a * c);
  
    if (discr < 0) return [false, Infinity, Infinity];
    else if (discr == 0) {
        x0 = x1 = -0.5 * b / a;
    } else {
        const q = (b > 0) ? -0.5 * (b + Math.sqrt(discr)) : -0.5 * (b - Math.sqrt(discr));
        x0 = q / a;
        x1 = c / q;
    }
  
    if (x0 > x1) {
        [x0, x1] = [x1, x0];
    }
  
    return [true, x0, x1];
}

// call main entrypoint
main();
