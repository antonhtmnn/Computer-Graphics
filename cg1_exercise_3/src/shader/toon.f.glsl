// defines the precision
precision highp float;

// These uniforms and attributes are provided by threejs.
// = object.matrixWorld
uniform mat4 modelMatrix;
// = camera position in world space
uniform vec3 cameraPosition;

// custom input attributes
in vec3 position_attr; // position of the interpolated vertex in world space
in vec3 normal_attr; // interpolated normal vector in local space

// output attributes
out vec4 fragment_color;


// main function gets executed for every pixel
void main()
{
    vec4 toon_col;
    float dotProd;
    vec3 normal; // interpolated normal vector in world space
    vec3 camDir; // camera direction (normal)

    toon_col = vec4(0.77, 0.26, 0.26, 1.0);
    normal = transpose(inverse(mat3(modelMatrix))) * normalize(normal_attr);
    normal = normalize(normal);
    camDir = cameraPosition - position_attr;
    camDir = normalize(camDir);
    dotProd = dot(normal, camDir);

    if (dotProd >= 0.75) toon_col = toon_col;
    else if (dotProd >= 0.50) toon_col = (3.0 / 4.0) * toon_col;
    else if (dotProd >= 0.25) toon_col = (2.0 / 4.0) * toon_col;
    else toon_col = (1.0 / 4.0) * toon_col;

    fragment_color = toon_col;
}
