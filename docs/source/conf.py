# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = 'mohituQ'
copyright = '2025, qcecothing'
author = 'qcecothing'
release = '0.1.0'

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = [
    'sphinx.ext.autodoc',
    'sphinx.ext.viewcode',
    'sphinx.ext.napoleon',
    'sphinx.ext.mathjax',
    'sphinx.ext.intersphinx',
]

templates_path = ['_templates']
exclude_patterns = []

language = 'en'

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = 'sphinx_rtd_theme'
html_static_path = ['_static']

# Logo configuration
html_logo = '_static/images/mohituq_logo.png'
html_favicon = '_static/images/mohituq_logo.png'

# Theme options
html_theme_options = {
    'logo_only': True,  # Display only the logo
    'display_version': True,
    'navigation_depth': 4,
    'collapse_navigation': False,
    'sticky_navigation': True,
    'style_nav_header_background': '#3179B9',  # Match logo blue background
}

# Add any paths that contain custom static files (such as style sheets) here
html_css_files = [
    'css/custom.css',
]

# Add any paths that contain custom JavaScript files
html_js_files = [
    'js/custom.js',
]

# Full sidebar
html_sidebars = {
    '**': [
        'globaltoc.html',
        'relations.html',
        'sourcelink.html',
        'searchbox.html',
    ]
}

# External links
intersphinx_mapping = {
    'python': ('https://docs.python.org/3', None),
}

# Setup function to modify HTML output
def setup(app):
    app.add_css_file('css/custom.css')
    app.add_js_file('js/custom.js')
