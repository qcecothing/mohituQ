# mohituQ Documentation

This directory contains the Sphinx documentation for the mohituQ project.

## Building the Documentation

To build the documentation locally:

1. Install the required dependencies:

```bash
pip install sphinx sphinx-rtd-theme
```

2. Create the logo image (optional, a placeholder will be used if not created):

```bash
# If you have ImageMagick installed:
mkdir -p source/_static/images
convert -size 200x100 xc:#3179B9 -fill white -gravity center -font Arial -pointsize 24 -annotate 0 "mohituQ" source/_static/images/mohituq_logo.png
```

3. Build the HTML documentation:

```bash
cd docs
make html
```

The built documentation will be available in the `build/html` directory. Open `build/html/index.html` in your browser to view it.

## Troubleshooting

If you encounter any issues with the documentation:

- Make sure all paths in the configuration are correct
- Check that the logo file exists at `source/_static/images/mohituq_logo.png`
- Verify that all RST files are properly formatted
- Clear the build directory (`rm -rf build`) and rebuild if necessary

## Deploying to GitHub Pages

The documentation is automatically deployed to GitHub Pages via a GitHub Action workflow when changes are pushed to the main branch.

The published documentation will be available at:
https://qcecothing.github.io/mohituQ/

## Documentation Structure

The documentation follows this structure:

- `source/`: Contains the source reStructuredText files
- `source/_static/`: Contains static files (CSS, JS, images)
- `source/_templates/`: Contains custom HTML templates
- `build/`: Contains the built documentation (generated)
- `Makefile`: Contains commands for building the documentation

## Adding New Documentation

To add new documentation:

1. Create a new `.rst` file in the appropriate directory
2. Add the file to the appropriate toctree in `index.rst`
3. Build the documentation to verify it works

## Updating the Logo

The project logo is stored in `source/_static/images/mohituq_logo.png`. To update it, replace this file with your new logo. 

The ideal dimensions for the logo are 200x100 pixels with a blue (#3179B9) background.

For RTL (Arabic) text support, we use custom CSS and JavaScript in the `_static` directory. 