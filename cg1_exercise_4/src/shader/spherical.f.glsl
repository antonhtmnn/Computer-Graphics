// defines the precision
precision highp float;

// custom uniforms
uniform sampler2D textureImg;
uniform sampler2D drawingTexture;

// input attributes
in vec2 uv_coord;

// output attributes
out vec4 fragment_color;


// main function gets executed for every pixel
void main()
{
    vec4 texture_drawing = texture(drawingTexture, uv_coord);
    vec4 texture_image = texture(textureImg, uv_coord);

    if(texture_drawing.w != 0.0) {
        fragment_color = texture_drawing;
    } else {
        fragment_color = texture_image;
    }
}
