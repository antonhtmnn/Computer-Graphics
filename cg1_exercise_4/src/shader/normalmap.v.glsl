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
in vec2 uv;

// output attributes
out vec3 attr_pos;
out vec3 attr_normal;
out vec2 attr_uv;


// main function gets executed for every vertex
void main()
{
    vec4 tmp = modelMatrix * vec4(position, 1.0);
    attr_pos = tmp.xyz / tmp.w;
    attr_normal = normal;
    attr_uv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
