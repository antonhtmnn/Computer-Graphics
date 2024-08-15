// defines the precision
precision highp float;

// These uniforms and attributes are provided by threejs.
// = camera.matrixWorldInverse * object.matrixWorld
uniform mat4 modelViewMatrix;
// = camera.projectionMatrix
uniform mat4 projectionMatrix;

// default vertex attributes provided by Geometry and BufferGeometry
in vec3 position;
in vec2 uv;

// output attributes
out vec2 uv_coord;


// main function gets executed for every vertex
void main()
{
    uv_coord = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
