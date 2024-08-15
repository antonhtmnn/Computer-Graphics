// defines the precision
precision highp float;

// custom input attributes
in vec4 color_attr;

// output attributes
out vec4 fragment_color;


// main function gets executed for every pixel
void main()
{
    fragment_color = color_attr;
}
