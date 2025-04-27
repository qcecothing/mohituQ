# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

import os
import sys
sys.path.insert(0, os.path.abspath('..'))

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = 'mohituQ'
copyright = '2025, MohituQ Contributors'
author = 'MohituQ Contributors'
release = '0.1.0'

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = [
    'sphinx.ext.autodoc',
    'sphinx.ext.viewcode',
    'sphinx.ext.napoleon',
    'sphinx.ext.intersphinx',
    'sphinx.ext.mathjax',
    'nbsphinx',  # For Jupyter notebooks
    'myst_parser',  # For Markdown support
]

templates_path = ['_templates']
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store', '.ipynb_checkpoints']

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = 'sphinx_rtd_theme'
html_static_path = ['_static']
html_logo = "_static/images/mohituq_logo.png"
html_favicon = "_static/images/favicon.ico"

# -- Options for nbsphinx ----------------------------------------------------
nbsphinx_allow_errors = True
nbsphinx_execute = 'never'  # Prevents execution of notebooks during build

# -- Options for MyST-Parser ------------------------------------------------
myst_enable_extensions = [
    "colon_fence",
    "deflist",
    "dollarmath",
    "amsmath",
]
myst_heading_anchors = 3

# -- Additional configurations -----------------------------------------------

# Make sure that the src directory is properly handled in sphinx
intersphinx_mapping = {
    'python': ('https://docs.python.org/3', None),
    'numpy': ('https://numpy.org/doc/stable/', None),
    'matplotlib': ('https://matplotlib.org/', None),
}

# Ensure jupyter notebooks are properly handled
nbsphinx_kernel_name = 'python3'
nbsphinx_prompt_width = '0'

# Configure source parsing
source_suffix = {
    '.rst': 'restructuredtext',
    '.md': 'markdown',
    '.ipynb': 'nbsphinx',
} 