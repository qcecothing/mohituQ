# **mohituQ** **محيطك** <img src="docs/source/_static/images/mohituq_logo.png" alt="mohituQ Logo" width="60" align="right"/>

Quantum Optimization for Ocean Plastic Cleanup

**MohituQ** is an open-source project focused on leveraging quantum algorithms-specifically Decoded Quantum Interferometry (DQI)-to optimize the placement and routing of trash-collection systems for cleaning up ocean plastic. Inspired by initiatives like The Ocean Cleanup, Plastic Odyssey, and WWF Oceans, this repository aims to accelerate environmental impact through advanced computational techniques.

🌊 Project Goals
Model the logistical challenge of ocean plastic collection as a large-scale optimization problem.

Implement quantum-inspired and classical algorithms (DQI, QAOA, and others) to find optimal or near-optimal solutions for net placement and collection routes.

Support open science and environmental sustainability by providing transparent, reproducible code and data.

🚀 Features
Mathematical formulations for multi-objective optimization (maximize plastic collected, minimize environmental impact, etc.)

Example implementations of DQI and comparative classical algorithms

Tools for simulating ocean plastic distribution and evaluating cleanup strategies

Extensible framework for integrating real-world data and collaborating with citizen science initiatives

📖 Documentation
**Full documentation:** https://qcecothing.github.io/mohituQ/

docs/overview.md: Project overview and algorithmic background

docs/dqi.md: Details on Decoded Quantum Interferometry

docs/api.md: API reference

🤝 **Contributing:**
We welcome contributions! Please see CONTRIBUTING.md for guidelines on how to get started, report issues, or submit pull requests. All contributors are expected to follow our Code of Conduct.

🛡️ **Security:**
If you discover a security vulnerability, please see SECURITY.md for instructions on responsible disclosure.

🌍 **Acknowledgments:**
Inspired by The Ocean Cleanup, Plastic Odyssey, and WWF Oceans

**Quantum algorithm references:** Decoded Quantum Interferometry (DQI), QAOA

🌏 UN Sustainable Development Goals
This project contributes to the following United Nations Sustainable Development Goals:

- **SDG 3 - Good health and well-being**: Cleaning oceans safeguards human health by reducing exposure to marine pollutants in seafood and coastal waters.
- **SDG 6 - Clean water and sanitation**: Cleaning oceans helps protect marine water quality, which is crucial for resources like desalination and intrinsically linked to effective land-based water management.
- **SDG 11 - Department of Economic and Social Affairs**: Cleaning oceans enhances urban sustainability by tackling marine litter originating from cities, protecting coastal economies, and improving community resilience.
- **SDG 13 - Climate Action**: By optimizing ocean cleanup operations to reduce fuel consumption and emissions while maximizing impact.
- **SDG 14 - Life Below Water**: By directly addressing ocean plastic pollution that threatens marine ecosystems and biodiversity.
- **SDG 17 - Partnerships for Goals**: By fostering open collaboration between quantum computing experts, marine conservationists, and the global community.

📢 License
This project is licensed under the MIT License. See LICENSE for details.

Let's use open source and quantum computing to help restore our oceans!

# Implementations

📦 Installation
bash
# Clone this repository
git clone https://github.com/ecothing/mohituQ.git
cd mohituQ

# (Optional) Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
🛠️ Usage
bash

## DQI Max-XORSAT Implementation

This implementation uses the Decoded Quantum Interferometry (DQI) approach to solve the Maximum XOR Satisfiability (Max-XORSAT) problem, an NP-hard optimization problem relevant to network route optimization.

### Requirements

```
numpy>=1.20.0
qiskit>=0.39.0
qiskit-aer>=0.11.0
matplotlib>=3.5.0
```

### Running the Implementation

```bash
python src/dqi_max_xorsat_implementation.py
```

This script creates a DQI Max-XORSAT solver, builds and runs a quantum circuit using Qiskit, and exports the results as JSON, CSV, and visualization plots.

## QAOA Implementation

This implementation uses the Quantum Approximate Optimization Algorithm (QAOA) to solve optimization problems represented as N×N matrices.

### Requirements

```
pennylane>=0.30.0
numpy>=1.20.0
matplotlib>=3.5.0
```

### Running the Implementation

```bash
python src/implementingQAOA_N_by_N.py
```

You can modify the matrix size by changing the `N` parameter in the script. The implementation supports optimization of variable-sized matrices and provides visualizations of the results.

## Export Utilities

The repository includes helper modules for result export and visualization:

```bash
python src/simplified_xorsat_export.py
```

This utility demonstrates how to visualize and export optimization results to various formats (JSON, CSV, and PNG).

# Notes

The implementations showcase different quantum approaches to optimization problems relevant to ocean cleanup logistics. These algorithms can be adapted and scaled to address real-world distribution and collection route optimization challenges.
