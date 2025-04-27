Installation
============

Requirements
-----------

* Python 3.7+
* Git

Basic Installation
-----------------

To install mohituQ, follow these steps:

.. code-block:: bash

   # Clone this repository
   git clone https://github.com/ecothing/mohituQ.git
   cd mohituQ

   # (Optional) Create and activate a virtual environment
   python3 -m venv venv
   source venv/bin/activate  # On Windows, use: venv\Scripts\activate

   # Install dependencies
   pip install -r requirements.txt

Development Installation
-----------------------

If you plan to contribute to mohituQ, we recommend installing in development mode:

.. code-block:: bash

   # Clone this repository
   git clone https://github.com/ecothing/mohituQ.git
   cd mohituQ

   # Create and activate a virtual environment
   python3 -m venv venv
   source venv/bin/activate  # On Windows, use: venv\Scripts\activate

   # Install in development mode
   pip install -e .
   pip install -r requirements-dev.txt  # Installs development dependencies

Verifying Installation
---------------------

To verify that the installation was successful, run:

.. code-block:: python

   import mohituq
   
   # Should print the version number
   print(mohituq.__version__) 