Implementations
==============

This section documents the core implementations of the mohituQ project. These implementations demonstrate how quantum algorithms can be applied to optimize ocean plastic cleanup operations.

DQI Max-XORSAT Implementation
----------------------------

The Digital Quantum Intermediate (DQI) approach for solving the Maximum XOR Satisfiability (Max-XORSAT) problem provides a foundation for optimizing collection routes and resource allocation.

.. code-block:: python

   # Create a DQI Max-XORSAT solver
   from src import DQIMaxXORSAT
   
   # Initialize a solver instance
   solver = DQIMaxXORSAT()
   
   # Run the algorithm
   results = solver.run()
   
   # Visualize and export results
   solver.visualize_results(results)
   solver.export_results(results)

Key aspects of the implementation:

* Quantum circuit construction for DQI
* Syndrome decoding for error correction
* Result processing and visualization

For more details, explore the source code in ``src/dqi_max_xorsat_implementation.py``.

XORSAT Export Utilities
---------------------

The simplified XORSAT export module provides utility functions for visualizing and exporting results from Max-XORSAT problem solutions.

.. code-block:: python

   from src.simplified_xorsat_export import visualize_results, export_results
   
   # Visualize results
   visualize_results(results)
   
   # Export results to JSON, CSV, and image files
   summary = export_results(results)
   print(f"Best solution: {summary['best_solution']}")

These utilities help with:

* Generating and visualizing result histograms
* Exporting results to various file formats (JSON, CSV, PNG)
* Identifying optimal solutions

For more details, explore the source code in ``src/simplified_xorsat_export.py``.

QAOA for N×N Matrix Optimization
------------------------------

The Quantum Approximate Optimization Algorithm (QAOA) implementation solves optimization problems based on N×N matrices, providing an alternative quantum approach.

.. code-block:: python

   # Run the QAOA algorithm with a 5×5 matrix
   # Default matrix size is 5×5, but can be modified
   python src/implementingQAOA_N_by_N.py
   
   # Output includes:
   # - Solution probabilities
   # - Most likely solution
   # - Solution energy
   # - CSV output file
   # - Visualization of results

Key concepts in the implementation:

* Translation of QUBO problems to quantum Hamiltonians
* Parameter optimization using gradient descent
* Probability distribution analysis for solution identification

For more details, explore the source code in ``src/implementingQAOA_N_by_N.py``.

Jupyter Notebooks
---------------

Interactive Jupyter notebooks provide a hands-on way to explore the implementations:

* ``src/implementingQAOA.ipynb``: Interactive exploration of QAOA algorithm
* ``src/demo/Hardcoding_maxxorsat.ipynb``: Step-by-step Max-XORSAT implementation
* ``src/demo/decoding.ipynb``: Quantum decoding techniques for DQI

These notebooks offer:

* In-depth explanations of algorithm concepts
* Visualizations of quantum circuits and results
* Interactive experimentation for better understanding

For more interactive content, see the :doc:`demo/index` section. 