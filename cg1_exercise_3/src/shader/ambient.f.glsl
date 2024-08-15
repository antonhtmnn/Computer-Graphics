// defines the precision
precision highp float;

// custom uniforms
uniform float[3] ambient_color;
uniform float ambient_reflectance;

// output attributes
out vec4 fragment_color;


// main function gets executed for every pixel
void main()
{
    vec4 ambi_col = vec4(ambient_color[0], ambient_color[1], ambient_color[2], 1.0);
    fragment_color = ambient_reflectance * (1.0 / 255.0) * ambi_col;
}
