# Computer-Graphics

This repository contains various projects related to computer graphics, focusing on different fundamental topics such as setting up a development environment, working with Three.js, affine transformations, projection, shading, texture mapping, ray tracing, and animation. Each project involves implementing specific graphics techniques using WebGL and Three.js.

## Table of Contents

- [Setup and Installation](#setup-and-installation)
- [Projects](#projects)
  - [Project 0: Setup](#project-0-setup)
  - [Project 1: Robot](#project-1-robot)
  - [Project 2: Canonical View](#project-2-canonical-view)
  - [Project 3: Shading](#project-3-shading)
  - [Project 4: Texturing](#project-4-texturing)
  - [Project 5: Ray Tracing](#project-5-ray-tracing)
  - [Project 6: Animation & Simulation](#project-6-animation--simulation)

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/antonhtmnn/Computer-Graphics.git
   ```

2. Navigate to the specific project directory (e.g., for Project 0):
   ```bash
   cd Computer-Graphics/cg1_exercise_0
   ```

3. Install dependencies using npm:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Access the application at `127.0.0.1:5173` in your browser.

## Projects

### Project 0: Setup

- **Objective**: Set up the development environment using npm and TypeScript, and get familiar with Three.js by modifying a basic template.
- **Key Tasks**:
  - Set up the project using the provided code skeleton.
  - Implement basic functionality such as background color change on spacebar press and scaling of objects using a slider.

### Project 1: Robot

- **Objective**: Implement a simple robot model using affine transformations and scene graphs in Three.js.
- **Key Tasks**:
  - Construct a scene graph for a robot model.
  - Implement navigation through the scene graph using keyboard controls.
  - Allow rotation of robot parts and resetting to the initial pose.

### Project 2: Canonical View

- **Objective**: Explore the process of transforming a 3D scene onto a 2D screen using different camera projections.
- **Key Tasks**:
  - Render scenes in world space, canonical viewing space, and screen space.
  - Implement functionality to visualize the effects of different camera parameters.

### Project 3: Shading

- **Objective**: Implement various shading techniques using vertex and fragment shaders in GLSL.
- **Key Tasks**:
  - Implement shaders for ambient shading, normal visualization, toon shading, Lambert illumination, and Phong illumination.
  - Extend the shaders to include Cook-Torrance illumination.

### Project 4: Texturing

- **Objective**: Map textures onto 3D objects and implement advanced texturing techniques.
- **Key Tasks**:
  - Implement basic UV mapping.
  - Apply spherical mapping to objects without predefined UV coordinates.
  - Implement environment mapping and normal mapping.

### Project 5: Ray Tracing

- **Objective**: Implement a basic ray tracer using Three.js and render scenes without WebGL.
- **Key Tasks**:
  - Implement ray casting and intersection calculations.
  - Apply Phong shading and handle shadows and reflections.

### Project 6: Animation & Simulation

- **Objective**: Implement linear blend skinning (LBS) for animating a mesh and simulate a double pendulum.
- **Key Tasks**:
  - Visualize and animate the skeleton of a mesh.
  - Implement linear blend skinning for mesh deformation.
  - Simulate and visualize a double pendulum with gravity and spring forces.
