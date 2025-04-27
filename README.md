# **mohituQ** **محيطك** <img src="docs/source/_static/images/mohituq_logo.png" alt="mohituQ Logo" width="60" align="right"/>

Quantum Optimization for Ocean Plastic Cleanup
mohituQ is an open-source project focused on leveraging quantum algorithms-specifically Decoded Quantum Interferometry (DQI)-to optimize the placement and routing of trash-collection systems for cleaning up ocean plastic. Inspired by initiatives like The Ocean Cleanup, Plastic Odyssey, and WWF Oceans, this repository aims to accelerate environmental impact through advanced computational techniques.

🌊 Project Goals
Model the logistical challenge of ocean plastic collection as a large-scale optimization problem.

Implement quantum-inspired and classical algorithms (DQI, QAOA, and others) to find optimal or near-optimal solutions for net placement and collection routes.

Support open science and environmental sustainability by providing transparent, reproducible code and data.

🚀 Features
Mathematical formulations for multi-objective optimization (maximize plastic collected, minimize environmental impact, etc.)

Example implementations of DQI and comparative classical algorithms

Tools for simulating ocean plastic distribution and evaluating cleanup strategies

Extensible framework for integrating real-world data and collaborating with citizen science initiatives

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
# Run a sample optimization
python run_optimization.py --config configs/sample_config.yaml

# Visualize results
python visualize.py --input results/sample_output.json
See the examples directory for more use cases and sample scripts.

📖 Documentation
**Full documentation:** https://qcecothing.github.io/mohituQ/

docs/overview.md: Project overview and algorithmic background

docs/dqi.md: Details on Decoded Quantum Interferometry

docs/api.md: API reference

🤝 Contributing
We welcome contributions! Please see CONTRIBUTING.md for guidelines on how to get started, report issues, or submit pull requests. All contributors are expected to follow our Code of Conduct.

🛡️ Security
If you discover a security vulnerability, please see SECURITY.md for instructions on responsible disclosure.

🌍 Acknowledgments
Inspired by The Ocean Cleanup, Plastic Odyssey, and WWF Oceans

Quantum algorithm references: Decoded Quantum Interferometry (DQI), QAOA

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

# DQI Max-XORSAT Implementation

This project implements a quantum algorithm for the Max-XORSAT problem using the Differential Quantum Inference (DQI) approach.

## Requirements

The following Python packages are required:

```
numpy>=1.20.0
qiskit>=0.39.0
qiskit-aer>=0.11.0
matplotlib>=3.5.0
```

## Installation

Install the required packages:

```bash
pip install -r requirements.txt
```

## Running the Code

The implementation has a known issue with conditional operations that needs to be fixed. The current code was written for an older version of Qiskit, and the `if_test` method now requires a classical bit or register, not a quantum bit.

To run the code after fixing the issue:

```bash
python src/dqi_max_xorsat_implementation.py
```

## Notes

The code needs to be updated to be compatible with the latest version of Qiskit (1.3.x). The conditional operations and the use of quantum registers in if statements needs to be modified to use classical registers instead.

# QAOA Implementation for N×N Matrices

This implementation uses the Quantum Approximate Optimization Algorithm (QAOA) to solve optimization problems with variable-sized matrices.

## Requirements

The following Python packages are required:

```
pennylane>=0.30.0
numpy>=1.20.0
matplotlib>=3.5.0
```

## Installation

Install the required packages:

```bash
# Clone the repository (if you haven't already)
git clone https://github.com/ecothing/mohituQ.git
cd mohituQ

# Install dependencies
pip install -r requirements.txt

# If you encounter import errors for specific packages:
pip install pennylane
pip install matplotlib
```

## Running the Code

To run the QAOA implementation with an N×N matrix:

```bash
python src/implementingQAOA_N_by_N.py
```

You can modify the matrix size by changing the `N` value at the top of the script.

## Notes

The implementation allows for flexible matrix sizes by adjusting the `N` parameter. Larger matrices (N > 10) may require more computational resources due to the exponential growth of the quantum state space.
