DQI API
=======

Decoded Quantum Interferometry (DQI) Module
------------------------------------------

This module implements the DQI algorithm for optimization problems.

.. code-block:: python

   # Example usage of DQI
   from mohituq.dqi import MaxXORSAT
   
   # Create a problem instance
   problem = MaxXORSAT(num_qubits=6)
   
   # Set up the clauses
   problem.add_clause([0, 1, 2])
   problem.add_clause([1, 2, 3])
   problem.add_clause([2, 3, 4])
   problem.add_clause([3, 4, 5])
   
   # Solve using DQI
   solution = problem.solve()
   print(f"Best solution: {solution}") 