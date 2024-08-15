import * as THREE from 'three';
import * as helper from './helper';
import { Window } from './lib/window';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import RenderWidget from './lib/rendererWidget';

export enum Spaces {

    world = "World",
    canonical = "Canonical",
    screen = "Screen"
}

export class Space {

    type: string;
    window: Window;
    settings: helper.Settings;
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    orbitCtrl?: OrbitControls;
    cameraPersp: THREE.PerspectiveCamera;
    cameraOrtho: THREE.OrthographicCamera;
    teddyBear?: THREE.Object3D;
    lastRX: number = 0;
    lastRY: number = 0;
    lastRZ: number = 0;
    lastTX: number = 0;
    lastTY: number = 0;
    lastTZ: number = 0;
    camHelper?: THREE.CameraHelper;
    planeX0 = new THREE.Plane(new THREE.Vector3(1, 0, 0), 1+0.00001);
    planeX1 = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 1+0.00001);
    planeY0 = new THREE.Plane(new THREE.Vector3(0, 1, 0), 1+0.00001);
    planeY1 = new THREE.Plane(new THREE.Vector3(0, -1, 0), 1+0.00001);
    planeZ0 = new THREE.Plane(new THREE.Vector3(0, 0, 1), 1+0.00001);
    planeZ1 = new THREE.Plane(new THREE.Vector3(0, 0, -1), 1+0.00001);

    constructor(type: string, window: Window, settings: helper.Settings, scene: THREE.Scene) {

        this.type = type;
        this.window = window;
        this.settings = settings;
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.scene = scene;
        this.cameraPersp = new THREE.PerspectiveCamera();
        this.cameraOrtho = new THREE.OrthographicCamera();
    }

    setup() {

        switch (this.type) {

            case Spaces.screen:
                // setup screen space (right)
                helper.setupCamera(this.cameraPersp, this.scene, this.settings.near, this.settings.far, this.settings.fov);
                // add teddy bear to scene
                this.teddyBear = helper.createTeddyBear();
                this.scene.add(this.teddyBear);
                // create OrbitControls
                var control = new OrbitControls(this.cameraPersp, this.window);
                helper.setupControls(control);
                this.orbitCtrl = control;
                // start the animation loop (async)
                var widget = new RenderWidget(this.window, this.renderer, this.cameraPersp, this.scene, control);
                widget.animate();
                break;

            case Spaces.canonical:
                // setup canonical viewing space (middle)
                this.cameraOrtho = helper.createCanonicalCamera();
                // add cube to scene
                helper.setupCube(this.scene);
                // create OrbitControls
                var control = new OrbitControls(this.cameraOrtho, this.window);
                helper.setupControls(control);
                this.orbitCtrl = control;
                // start the animation loop (async)
                var widget = new RenderWidget(this.window, this.renderer, this.cameraOrtho, this.scene, control);
                widget.animate();
                break;

            case Spaces.world:
                // setup world space (left)
                helper.setupCamera(this.cameraPersp, this.scene, 1, 42, 42);
                // create OrbitControls
                var control = new OrbitControls(this.cameraPersp, this.window);
                helper.setupControls(control);
                this.orbitCtrl = control;
                // start the animation loop (async)
                var widget = new RenderWidget(this.window, this.renderer, this.cameraPersp, this.scene, control);
                widget.animate();
                break;
        }
        // set scene color
        this.scene.background = new THREE.Color(1, 1, 1);
    }
}

export function ownApplyMatrix4(A: THREE.Matrix4, v: THREE.Vector4): THREE.Vector4 {

    const x = v.x;
    const y = v.y;
    const z = v.z;
    const w = v.w;
    const e = A.elements // column-major order

    v.x = e[0] * x + e[4] * y + e[8] * z + e[12] * w;
    v.y = e[1] * x + e[5] * y + e[9] * z + e[13] * w;
    v.z = e[2] * x + e[6] * y + e[10] * z + e[14] * w;
    v.w = e[3] * x + e[7] * y + e[11] * z + e[15] * w;

    return v;
}

export function removeArrayElem(array: any[], elem: any):any[] {

    var newArray = [];
    for (const e of array) {
        if (e != elem) {
            newArray.push(e);
        }
    }
    return newArray
}
