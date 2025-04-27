DQI API
=======

Decoded Quantum Interferometry (DQI) Module
------------------------------------------

This module implements the DQI algorithm for optimization problems, specifically focusing on the Maximum XOR Satisfiability (Max-XORSAT) problem.

Module Overview
^^^^^^^^^^^^^

The ``dqi_max_xorsat_implementation.py`` module provides a comprehensive implementation of the Digital Quantum Intermediate (DQI) approach for solving the Max-XORSAT problem, which is relevant for optimizing collection routes and resource allocation in ocean cleanup operations.

Key Components:

* **DQIMaxXORSAT class**: Main implementation class
* **Circuit Construction**: Methods for building quantum circuits
* **Syndrome Decoding**: Implementation of syndrome-based error correction
* **Results Processing**: Visualization and export functionality

Basic Usage
^^^^^^^^^^

.. code-block:: python

   # Example usage of DQI
   from src.dqi_max_xorsat_implementation import DQIMaxXORSAT
   
   # Create a problem instance
   solver = DQIMaxXORSAT()
   
   # Build the circuit
   solver.build_circuit()
   
   # Run the algorithm
   results = solver.run()
   
   # Visualize and export results
   solver.visualize_results(results)
   solver.export_results(results)

Class Reference
^^^^^^^^^^^^^

.. code-block:: python

   class DQIMaxXORSAT:
       """
       Implements the Digital Quantum Intermediate (DQI) approach for solving the
       Maximum XOR Satisfiability (Max-XORSAT) problem.
       """
       
       def __init__(self, parity_check_matrix=None):
           """Initialize the solver with an optional parity check matrix."""
           
       def build_circuit(self):
           """Construct the full DQI quantum circuit."""
           
       def run(self, shots=1024):
           """Run the circuit and return the measurement results."""
           
       def visualize_results(self, counts, save_path=None):
           """Visualize the results as a histogram."""
           
       def export_results(self, results, output_dir='outputs'):
           """Export results to JSON, CSV, and PNG files."""

Core Methods and Functions
^^^^^^^^^^^^^^^^^^^^^^^^

The implementation includes several specialized methods:

* ``_create_syndrome_table()``: Builds the syndrome table for error correction
* ``_binary_to_unary()``: Converts binary representation to unary representation
* ``_prepare_dicke_state()``: Prepares a Dicke state in the quantum circuit
* ``_apply_vector_product_phase()``: Applies phase based on vector product
* ``_syndrome_decode()``: Implements syndrome decoding algorithm
* ``_hadamard_transform()``: Applies Hadamard transform to qubits

For detailed implementation, please refer to the source code in ``src/dqi_max_xorsat_implementation.py``. 