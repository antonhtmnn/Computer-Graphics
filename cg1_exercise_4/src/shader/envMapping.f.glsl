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

// input attributes
in vec3 attr_pos;
in vec3 attr_normal;

// output attributes
out vec4 fragment_color;

// define PI manually
const float PI = 3.14159265359;


// main function gets executed for every pixel
void main()
{
    // calculate UV-coordinates for environment mapping
    float u, v;
    vec3 normal, eyeDir, r;
    normal = transpose(inverse(mat3(modelMatrix))) * normalize(attr_normal);
    normal = normalize(normal);
    eyeDir = cameraPosition - attr_pos;
    eyeDir = normalize(eyeDir);
    r = 2.0 * dot(eyeDir, normal) * normal - eyeDir;

    u = PI + atan(r.z, r.x);
    u *= 1.0/(2.0*PI);
    v = atan(sqrt(pow(r.x, 2.0)+pow(r.z, 2.0)), -r.y);
    v *= 1.0/PI;
    vec2 uv_coord = vec2(u, v);

    vec4 texture_drawing = texture(drawingTexture, uv_coord);
    vec4 texture_image = texture(textureImg, uv_coord);

    if(texture_drawing.w != 0.0) {
        fragment_color = texture_drawing;
    } else {
        fragment_color = texture_image;
    }
}
