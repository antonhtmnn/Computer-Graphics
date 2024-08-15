// defines the precision
precision highp float;

// custom uniforms
uniform sampler2D textureImg;
uniform sampler2D drawingTexture;

// input attributes
in vec3 attr_pos;

// output attributes
out vec4 fragment_color;

// define PI manually
const float PI = 3.14159265359;


// main function gets executed for every pixel
void main()
{
    // calculate UV-coordinates (pixel wise, based on interpolated vertex position)
    float u, v;
    u = PI + atan(-attr_pos.z, attr_pos.x);
    u *= 1.0/(2.0*PI);
    v = atan(sqrt(pow(attr_pos.x, 2.0)+pow(attr_pos.z, 2.0)), -attr_pos.y);
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
