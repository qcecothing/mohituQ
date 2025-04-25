# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = 'mohituQ'
copyright = '2025, ecothing'
author = 'ecothing'
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
    'prev_next_buttons_location': 'bottom',
    'style_external_links': False,
    'style_nav_header_background': '#3179B9',  # Match logo blue background
    # Toc options
    'collapse_navigation': True,
    'sticky_navigation': True,
    'navigation_depth': 4,
    'includehidden': True,
    'titles_only': False
}

# Add any paths that contain custom static files (such as style sheets) here,
# relative to this directory. They are copied after the builtin static files,
# so a file named "default.css" will overwrite the builtin "default.css".

# Custom CSS for styling
html_css_files = [
    'css/custom.css',
]

# Custom JavaScript
html_js_files = [
    'js/custom.js',
]

# External links
intersphinx_mapping = {
    'python': ('https://docs.python.org/3', None),
}

# Setup function to modify HTML output
def setup(app):
    app.add_css_file('css/custom.css')
    app.add_js_file('js/custom.js')
