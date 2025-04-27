# Demo Resources

This directory contains demonstration notebooks and resources for understanding and visualizing the quantum algorithms used in the mohituQ project.

## Jupyter Notebooks

### Hardcoding_maxxorsat.ipynb

**Description:** A manual implementation of the Max-XORSAT problem solution using quantum circuits.

```{eval-rst}
.. note::
   This notebook demonstrates step-by-step circuit construction without using high-level abstractions.
```

**Key sections:**
- Manual circuit construction for the Max-XORSAT problem
- Implementation of core quantum operators 
- Visualization and analysis of results

### decoding.ipynb

**Description:** Demonstrations of quantum decoding techniques used in DQI algorithm implementation.

```{eval-rst}
.. note::
   This notebook focuses on syndrome table construction and decoding strategies.
```

**Key sections:**
- Construction of syndrome tables for error correction
- Mapping between error patterns and their syndromes
- Practical examples of syndrome decoding

## Performance Visualizations

### dqi_perf.png

Performance benchmarks for the DQI algorithm on Max-XORSAT problems of various sizes, showing how algorithm performance scales with problem complexity.

```{eval-rst}
.. seealso::
   For implementation details, refer to ``src/dqi_max_xorsat_implementation.py``.
```

## Using These Resources

To run the Jupyter notebooks:

1. Ensure you have all dependencies installed:
   ```
   pip install -r requirements.txt
   ```

2. Launch Jupyter:
   ```
   jupyter notebook
   ```

3. Navigate to the `src/demo` directory and open the desired notebook.

These demos complement the main implementations in the parent directory and provide educational insights into the algorithms. 