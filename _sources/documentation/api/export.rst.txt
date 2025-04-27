Export Utilities API
=================

This section documents the export utilities provided by mohituQ for visualizing and exporting results from quantum optimization algorithms.

Simplified XORSAT Export Module
-----------------------------

The ``simplified_xorsat_export.py`` module provides utility functions for generating, visualizing, and exporting results from Max-XORSAT problem solutions.

Module Overview
^^^^^^^^^^^^^

This module includes functions for:

* Generating mock results for demonstration purposes
* Visualizing results as histograms
* Exporting results to various file formats (JSON, CSV, PNG)

Key Components:

* **Results Generation**: Mock data creation for testing and demonstrations
* **Visualization Tools**: Histogram generation for solution analysis
* **Export Functions**: Multi-format data export for further analysis

Basic Usage
^^^^^^^^^^

.. code-block:: python

   from src.simplified_xorsat_export import generate_mock_results, visualize_results, export_results
   
   # Generate mock results
   results = generate_mock_results()
   
   # Visualize results
   visualize_results(results)
   
   # Export results to various formats
   summary = export_results(results, output_dir='outputs')
   
   # Access information about the export
   print(f"Best solution: {summary['best_solution']}")
   print(f"JSON file: {summary['output_files']['json']}")
   print(f"CSV file: {summary['output_files']['csv']}")
   print(f"Plot file: {summary['output_files']['plot']}")

Function Reference
^^^^^^^^^^^^^^

.. code-block:: python

   def generate_mock_results():
       """
       Generate mock results for demonstration purposes.
       
       Returns:
           dict: A dictionary mapping solution bitstrings to their counts
       """
   
   def visualize_results(counts, save_path=None):
       """
       Visualize the results as a simple bar chart.
       
       Args:
           counts (dict): Result counts from the algorithm
           save_path (str, optional): Path to save the plot
       """
   
   def export_results(results, output_dir='outputs'):
       """
       Export the results to various file formats.
       
       Args:
           results (dict): Dictionary with results
           output_dir (str): Directory to save outputs
           
       Returns:
           dict: Dictionary with paths and summary information
       """

Standalone Usage
^^^^^^^^^^^^^^

The module can also be run as a standalone script:

.. code-block:: bash

   python src/simplified_xorsat_export.py
   
This will generate mock results and export them to the 'outputs' directory.

Integration with Other Modules
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The export utilities are designed to work seamlessly with the DQI and QAOA implementations:

.. code-block:: python

   # DQI implementation integration
   from src.dqi_max_xorsat_implementation import DQIMaxXORSAT
   from src.simplified_xorsat_export import export_results
   
   # Run DQI algorithm
   solver = DQIMaxXORSAT()
   results = solver.run()
   
   # Use export utilities with the results
   export_summary = export_results(results)

For detailed implementation, please refer to the source code in ``src/simplified_xorsat_export.py``. 