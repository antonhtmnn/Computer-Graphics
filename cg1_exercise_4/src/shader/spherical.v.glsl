// defines the precision
precision highp float;

// These uniforms and attributes are provided by threejs.
// = camera.matrixWorldInverse * object.matrixWorld
uniform mat4 modelViewMatrix;
// = camera.projectionMatrix
uniform mat4 projectionMatrix;

// default vertex attributes provided by Geometry and BufferGeometry
in vec3 position;

// output attributes
out vec2 uv_coord;

// define PI manually
const float PI = 3.14159265359;


// main function gets executed for every vertex
void main()
{
    float u, v;
    u = PI + atan(-position.z, position.x);
    u *= 1.0/(2.0*PI);
    v = atan(sqrt(pow(position.x, 2.0)+pow(position.z, 2.0)), -position.y);
    v *= 1.0/PI;

    uv_coord = vec2(u, v);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
