import os
import sys
sys.path.insert(0, os.path.abspath('../'))
js_source_path = '../kooljs'
root_for_relative_js_paths = '../kooljs'
primary_domain = 'js'


extensions = [
    'sphinx.ext.autodoc',  # Core library for html generation from docstrings
    'sphinx.ext.autosummary',  # Create neat summary tables
    'myst_parser',
    'sphinxarg.ext','sphinxcontrib.autoprogram',
    'sphinx_js'
    ]
source_suffix = {
    '.rst': 'restructuredtext',
    '.txt': 'markdown',
    '.md': 'markdown',
}
autosummary_generate = True  # Turn on sphinx.ext.autosummary
#autodoc_mock_imports = [                        ]
templates_path = ['_templates']

html_theme = 'sphinx_rtd_theme'
html_theme_options = {
    "rightsidebar": "true",
    "relbarbgcolor": "black"
}

project = 'kooljs'
author = 'ji-podhead'
release = '0.2.0'

templates_path = ['_templates']
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']
