// defines the precision
precision highp float;

// These uniforms and attributes are provided by threejs.
// = object.matrixWorld
uniform mat4 modelMatrix;

// custom uniforms
uniform vec3 lightPosition; // light position in world space
uniform float[3] diffuse_color;
uniform float diffuse_reflectance;
uniform float[3] light_color;
uniform float light_intensity;

// custom input attributes
in vec3 position_attr; // position of the interpolated vertex in world space
in vec3 normal_attr; // interpolated normal vector in local space

// output attributes
out vec4 fragment_color;


// main function gets executed for every pixel
void main()
{
    vec4 diff_col, l_in;
    float dotProdNL;
    vec3 normal; // interpolated normal vector in world space
    vec3 lightDir; // light direction (normal)

    normal = transpose(inverse(mat3(modelMatrix))) * normalize(normal_attr);
    normal = normalize(normal);
    lightDir = lightPosition - position_attr;
    lightDir = normalize(lightDir);
    l_in = vec4(light_color[0], light_color[1], light_color[2], 1.0);
    l_in = light_intensity * (1.0 / 255.0) * l_in;

    // calculate diffuse light
    diff_col = vec4(diffuse_color[0], diffuse_color[1], diffuse_color[2], 1.0);
    diff_col = (1.0 / 255.0) * diff_col;
    dotProdNL = dot(normal, lightDir);
    if (dotProdNL >= 0.0) {
        diff_col = diffuse_reflectance * diff_col * dotProdNL * l_in;
    } else {
        diff_col = vec4(0.0, 0.0, 0.0, 1.0);
    }

    fragment_color = diff_col;
}
