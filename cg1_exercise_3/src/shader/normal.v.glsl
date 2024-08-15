// defines the precision
precision highp float;

// These uniforms and attributes are provided by threejs.
// = camera.matrixWorldInverse * object.matrixWorld
uniform mat4 modelViewMatrix;
// = camera.projectionMatrix
uniform mat4 projectionMatrix;

// default vertex attributes provided by Geometry and BufferGeometry
in vec3 position;
in vec3 normal;

// output attributes
out vec3 normal_attr; // normal vector in local space


// main function gets executed for every vertex
void main()
{
    normal_attr = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
