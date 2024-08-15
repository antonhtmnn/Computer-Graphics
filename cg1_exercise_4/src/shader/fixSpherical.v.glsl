// defines the precision
precision highp float;

// These uniforms and attributes are provided by threejs.
// = object.matrixWorld
uniform mat4 modelMatrix;
// = camera.matrixWorldInverse * object.matrixWorld
uniform mat4 modelViewMatrix;
// = camera.projectionMatrix
uniform mat4 projectionMatrix;

// default vertex attributes provided by Geometry and BufferGeometry
in vec3 position;

// output attributes
out vec3 attr_pos;


// main function gets executed for every vertex
void main()
{
    vec4 tmp = modelMatrix * vec4(position, 1.0);
    attr_pos = tmp.xyz / tmp.w;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
