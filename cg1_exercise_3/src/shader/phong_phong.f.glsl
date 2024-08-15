// defines the precision
precision highp float;

// These uniforms and attributes are provided by threejs.
// = object.matrixWorld
uniform mat4 modelMatrix;
// = camera position in world space
uniform vec3 cameraPosition;

// custom uniforms
uniform vec3 lightPosition; // light position in world space
uniform float[3] ambient_color;
uniform float ambient_reflectance;
uniform float[3] diffuse_color;
uniform float diffuse_reflectance;
uniform float[3] specular_color;
uniform float specular_reflectance;
uniform float magnitude;
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
    vec4 ambi_col, diff_col, spec_col, l_in;
    float dotProdNL, dotProdRE;
    vec3 normal; // interpolated normal vector in world space
    vec3 lightDir; // light direction (normal)
    vec3 camDir; // camera direction (normal)
    vec3 idealLightRay; // ideally reflected light ray

    normal = transpose(inverse(mat3(modelMatrix))) * normalize(normal_attr);
    normal = normalize(normal);
    lightDir = lightPosition - position_attr;
    lightDir = normalize(lightDir);
    camDir = cameraPosition - position_attr;
    camDir = normalize(camDir);
    idealLightRay = 2.0 * normal * dot(normal, lightDir) - lightDir;
    //idealLightRay = reflect(-lightDir, normal);
    l_in = vec4(light_color[0], light_color[1], light_color[2], 1.0);
    l_in = light_intensity * (1.0 / 255.0) * l_in;

    // calculate ambient light
    ambi_col = vec4(ambient_color[0], ambient_color[1], ambient_color[2], 1.0);
    ambi_col = ambient_reflectance * (1.0 / 255.0) * ambi_col;

    // calculate diffuse light
    diff_col = vec4(diffuse_color[0], diffuse_color[1], diffuse_color[2], 1.0);
    diff_col = (1.0 / 255.0) * diff_col;
    dotProdNL = dot(normal, lightDir);
    if (dotProdNL >= 0.0) {
        diff_col = diffuse_reflectance * diff_col * dotProdNL * l_in;
    } else {
        diff_col = vec4(0.0, 0.0, 0.0, 1.0);
    }

    // calculate specular light
    spec_col = vec4(specular_color[0], specular_color[1], specular_color[2], 1.0);
    spec_col = (1.0 / 255.0) * spec_col;
    dotProdRE = dot(idealLightRay, camDir);
    if (dotProdRE > 0.0 && dotProdNL >= 0.0) {
        spec_col = l_in * specular_reflectance * spec_col * pow(dotProdRE, magnitude);
    } else {
        spec_col = vec4(0.0, 0.0, 0.0, 1.0);
    }

    fragment_color = ambi_col + diff_col + spec_col;
}
