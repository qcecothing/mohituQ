Usage
=====

Basic Usage
-----------

mohituQ provides tools for modeling and optimizing ocean plastic cleanup operations using quantum and quantum-inspired algorithms.

Running an Optimization
----------------------

You can run a sample optimization using the provided configuration:

.. code-block:: bash

   python src/dqi_max_xorsat_implementation.py

   python src/implementingQAOA_N_by_N.py


The configuration file specifies parameters such as:

- Ocean current models
- Plastic distribution data
- Optimization objectives
- Algorithm selection (DQI, QAOA, etc.)
- Hardware backend (simulator or quantum device)

Visualizing Results
------------------

After running an optimization, you can visualize the results:

.. code-block:: bash

   python visualize.py --input results/sample_output.json

This will generate visualizations showing:

- Optimal placement of collection systems
- Cleanup route optimization
- Efficiency metrics
- Comparison with baseline strategies

Example Scripts
--------------

The ``examples/`` directory contains sample scripts demonstrating various use cases:

- ``examples/basic_optimization.py``: Simple optimization of collection points
- ``examples/multi_objective.py``: Balancing multiple objectives (collection efficiency, cost, etc.)
- ``examples/seasonal_variation.py``: Optimizing for seasonal changes in ocean currents
- ``examples/real_data_integration.py``: Using real-world plastic distribution data

API Reference
------------

For detailed API documentation, see the API section in the sidebar. 