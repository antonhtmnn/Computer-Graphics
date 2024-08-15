// defines the precision
precision highp float;

// These uniforms and attributes are provided by threejs.
// = object.matrixWorld
uniform mat4 modelMatrix;
// = camera position in world space
uniform vec3 cameraPosition;

// custom uniforms
uniform sampler2D textureImg;
uniform sampler2D drawingTexture;
uniform sampler2D normalMap;

// input attributes
in vec3 attr_pos;
in vec3 attr_normal;
in vec2 attr_uv;

// output attributes
out vec4 fragment_color;

// define constants
const vec3 lightPosition = vec3(2.0, 2.0, 3.0);
const float ambient_reflectance = 0.2;
const float diffuse_reflectance = 1.0;
const float specular_reflectance = 0.25;
const float specular_color[3] = float[3](255.0, 255.0, 255.0);
const float magnitude = 50.0;


// calculate light as in phong_phong.f.glsl (ex. 03)
vec4 calc_light(vec4 texture_col, vec4 spec_col, vec3 normal)
{
    vec3 position_attr = attr_pos;
    float dotProdNL, dotProdRE;
    vec4 ambient_color = 255.0 * texture_col;
    vec4 diffuse_color = 255.0 * texture_col;
    vec3 lightDir, camDir, idealLightRay;
    vec4 ambi_col, diff_col;
    lightDir = lightPosition - position_attr;
    lightDir = normalize(lightDir);
    camDir = cameraPosition - position_attr;
    camDir = normalize(camDir);
    idealLightRay = 2.0 * normal * dot(normal, lightDir) - lightDir;

    // calculate ambient light
    ambi_col = vec4(ambient_color[0], ambient_color[1], ambient_color[2], 1.0);
    ambi_col = ambient_reflectance * (1.0 / 255.0) * ambi_col;

    // calculate diffuse light
    diff_col = vec4(diffuse_color[0], diffuse_color[1], diffuse_color[2], 1.0);
    diff_col = (1.0 / 255.0) * diff_col;
    dotProdNL = dot(normal, lightDir);
    if (dotProdNL >= 0.0) {
        diff_col = diffuse_reflectance * diff_col * dotProdNL;
    } else {
        diff_col = vec4(0.0, 0.0, 0.0, 1.0);
    }

    // calculate specular light
    spec_col = vec4(specular_color[0], specular_color[1], specular_color[2], 1.0);
    spec_col = (1.0 / 255.0) * spec_col;
    dotProdRE = dot(idealLightRay, camDir);
    if (dotProdRE > 0.0 && dotProdNL >= 0.0) {
        spec_col = specular_reflectance * spec_col * pow(dotProdRE, magnitude);
    } else {
        spec_col = vec4(0.0, 0.0, 0.0, 1.0);
    }

    return ambi_col + diff_col + spec_col;
}

// main function gets executed for every pixel
void main()
{
    // calculate texture color
    vec4 texture_col;
    vec4 texture_drawing = texture(drawingTexture, attr_uv);
    vec4 texture_image = texture(textureImg, attr_uv);
    if(texture_drawing.w != 0.0) {
        texture_col = texture_drawing;
    } else {
        texture_col = texture_image;
    }

    // calculate normal from normalMap
    vec3 normal = texture(normalMap, attr_uv).xyz;
    normal = normalize(2.0 * normal - 1.0);
    // vec3 normal = transpose(inverse(mat3(modelMatrix))) * normalize(attr_normal);
    // normal = normalize(normal);

    // calculate light color
    vec4 light_color;
    vec4 spec_col = vec4(specular_color[0], specular_color[1], specular_color[2], 1.0);
    spec_col = (1.0 / 255.0) * spec_col;
    light_color = calc_light(texture_col, spec_col, normal);

    fragment_color = light_color;
}
