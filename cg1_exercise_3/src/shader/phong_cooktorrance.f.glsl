// defines the precision
precision highp float;

// These uniforms and attributes are provided by threejs.
// = object.matrixWorld
uniform mat4 modelMatrix;
// = camera position in world space
uniform vec3 cameraPosition;

// custom uniforms
uniform vec3 lightPosition; // light position in world space
uniform float[3] diffuse_color;
uniform float diffuse_reflectance;
uniform float[3] specular_color;
uniform float specular_reflectance;
uniform float roughness;
uniform float[3] light_color;
uniform float light_intensity;

// custom input attributes
in vec3 position_attr; // position of the interpolated vertex in world space
in vec3 normal_attr; // interpolated normal vector in local space

// output attributes
out vec4 fragment_color;

// define PI manually
const float PI = 3.14159265359;


// GGX distribution function
float D(vec3 n, vec3 h)
{
    float a = roughness;
    float nh = dot(n, h);
    float nh2 = pow(nh, 2.0);

    if (nh > 0.0) {
        float tmp = nh2 * (pow(a, 2.0) + ((1.0-nh2)/nh2));
        tmp = PI * pow(tmp, 2.0);
        return pow(a, 2.0)/tmp;
    } else {
        return 0.0;
    }
}

// geometric attenuation helper
float G1(vec3 x, vec3 h)
{
    float a = roughness;
    float xh = dot(x, h);
    float xh2 = pow(xh, 2.0);

    if (xh > 0.0) {
        float tmp = pow(a, 2.0) * (1.0 - xh2)/xh2;
        tmp = 1.0 + sqrt(1.0 + tmp);
        return 2.0/tmp;
    } else {
        return 0.0;
    }
}

// geometric attenuation
float G(vec3 v, vec3 l, vec3 h)
{
    return G1(v, h) * G1(l, h);
}

// Schlick's approximation
vec4 F(vec4 F0, vec3 v, vec3 h)
{
    vec4 result;
    result.x = F0.x + (1.0-F0.x) * pow(1.0-dot(v, h), 5.0);
    result.y = F0.y + (1.0-F0.y) * pow(1.0-dot(v, h), 5.0);
    result.z = F0.z + (1.0-F0.z) * pow(1.0-dot(v, h), 5.0);
    result.w = 1.0;
    return result;
}

// main function gets executed for every pixel
void main()
{
    vec4 diff_col, spec_col, l_in;
    float dotProdNL, dotProdNV;
    vec3 normal; // interpolated normal vector in world space
    vec3 lightDir; // light direction (normal)
    vec3 camDir; // camera direction (normal)
    vec3 h; // bisector of view and light direction

    normal = transpose(inverse(mat3(modelMatrix))) * normalize(normal_attr);
    normal = normalize(normal);
    lightDir = lightPosition - position_attr;
    lightDir = normalize(lightDir);
    camDir = cameraPosition - position_attr;
    camDir = normalize(camDir);
    l_in = vec4(light_color[0], light_color[1], light_color[2], 1.0);
    l_in = light_intensity * (1.0 / 255.0) * l_in;

    // calculate diffuse light/albedo
    diff_col = vec4(diffuse_color[0], diffuse_color[1], diffuse_color[2], 1.0);
    diff_col = (1.0 / 255.0) * diff_col;
    dotProdNL = dot(normal, lightDir);
    if (dotProdNL >= 0.0) {
        diff_col = diffuse_reflectance * diff_col;
    } else {
        diff_col = vec4(0.0, 0.0, 0.0, 1.0);
    }

    // calculate specular light
    spec_col = vec4(specular_color[0], specular_color[1], specular_color[2], 1.0);
    spec_col = (1.0 / 255.0) * spec_col;
    dotProdNV = dot(normal, camDir);
    h = normalize(camDir+lightDir);
    float D = D(normal, h);
    float G = G(camDir, lightDir, normal);
    vec4 F = F(spec_col, camDir, h);
    spec_col = (D*G*F) / (4.0*abs(dotProdNL)*abs(dotProdNV));

    fragment_color = ((diff_col/PI) + (specular_reflectance*spec_col)) * max(0.0, dotProdNL) * l_in;
}
