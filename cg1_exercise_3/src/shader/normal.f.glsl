// defines the precision
precision highp float;

// These uniforms and attributes are provided by threejs.
// = object.matrixWorld
uniform mat4 modelMatrix;

// custom input attributes
in vec3 normal_attr; // interpolated normal vector in local space

// output attributes
out vec4 fragment_color;


// main function gets executed for every pixel
void main()
{
    vec3 normal; // interpolated normal vector in world space
    normal = transpose(inverse(mat3(modelMatrix))) * normalize(normal_attr);
    normal = normalize(normal);

    // bijective mapping: [-1, 1]^3 -> [0, 1]^3
    fragment_color.x = (normal.x + 1.0) / 2.0;
    fragment_color.y = (normal.y + 1.0) / 2.0;
    fragment_color.z = (normal.z + 1.0) / 2.0;
    fragment_color.w = 1.0;
}
