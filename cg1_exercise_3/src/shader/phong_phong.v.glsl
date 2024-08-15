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
in vec3 normal;

// output attributes
out vec3 position_attr; // position of the vertex in world space
out vec3 normal_attr; // normal vector in local space


// main function gets executed for every vertex
void main()
{
    vec4 tmp = modelMatrix * vec4(position, 1.0);
    position_attr = tmp.xyz / tmp.w;
    normal_attr = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
