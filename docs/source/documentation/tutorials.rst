Tutorials
=========

This section provides step-by-step guides for common use cases of the mohituQ library.

Basic Tutorial
--------------

This tutorial demonstrates how to use the mohituQ library for a simple optimization problem.

.. code-block:: python

   import mohituq
   
   # Initialize the optimizer
   optimizer = mohituq.DQI()
   
   # Prepare input data
   problem_matrix = [
       [0, 1, 0, 1],
       [1, 0, 1, 0],
       [0, 1, 0, 1],
       [1, 0, 1, 0]
   ]
   
   # Run optimization
   result = optimizer.solve(problem_matrix)
   
   # Print results
   print(f"Optimal solution: {result['solution']}")
   print(f"Solution quality: {result['quality']}")

Advanced Tutorial
-----------------

For more complex scenarios and advanced features, see the :doc:`advanced` section.

Interactive Examples
--------------------

For interactive examples, refer to the Jupyter notebooks in the ``examples`` directory of the repository.

Next Steps
----------

Once you're comfortable with the basics, explore the :doc:`api` documentation for a complete reference of available functions and classes. 