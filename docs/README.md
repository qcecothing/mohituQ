# mohituQ Documentation

This directory contains the Sphinx documentation for the mohituQ project.

## Building the Documentation

To build the documentation locally:

1. Install the required dependencies:

```bash
pip install sphinx sphinx-rtd-theme
```

2. Build the HTML documentation:

```bash
cd docs
make html
```

The built documentation will be available in the `build/html` directory. Open `build/html/index.html` in your browser to view it.

## Deploying to GitHub Pages

To deploy the documentation to GitHub Pages:

1. Build the documentation as described above
2. Copy the contents of the `build/html` directory to the `gh-pages` branch of your repository

You can automate this with a GitHub Action by adding a workflow file to your repository.

## Documentation Structure

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

For RTL (Arabic) text support, we use custom CSS and JavaScript in the `_static` directory. 