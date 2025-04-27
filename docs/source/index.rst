.. mohituQ documentation master file

================================
Welcome to mohituQ documentation
================================

.. image:: _static/images/mohituq_logo.png
   :align: right
   :width: 60px

**محيطك - Your Ocean**

*Quantum Optimization for Ocean Plastic Cleanup*

Overview
========

mohituQ is an open-source project focused on leveraging quantum algorithms-specifically Decoded Quantum Interferometry (DQI)-to optimize the placement and routing of trash-collection systems for cleaning up ocean plastic. Inspired by initiatives like The Ocean Cleanup, Plastic Odyssey, and WWF Oceans, this repository aims to accelerate environmental impact through advanced computational techniques.

Note
----

The name "محيطك" (mohituQ) means "Your Ocean" in Arabic, reflecting our commitment to empowering communities to reclaim their marine environments through advanced technology.

Project Goals
=============

* Model the logistical challenge of ocean plastic collection as a large-scale optimization problem.
* Implement quantum-inspired and classical algorithms (DQI, QAOA, and others) to find optimal or near-optimal solutions for net placement and collection routes.
* Support open science and environmental sustainability by providing transparent, reproducible code and data.

Features
========

* Mathematical formulations for multi-objective optimization (maximize plastic collected, minimize environmental impact, etc.)
* Example implementations of DQI and comparative classical algorithms
* Tools for simulating ocean plastic distribution and evaluating cleanup strategies
* Extensible framework for integrating real-world data and collaborating with citizen science initiatives

Quick Start
===========

Installation
------------

.. code-block:: bash

   # Clone this repository
   git clone https://github.com/qcecothing/mohituQ.git
   cd mohituQ

   # Create and activate a virtual environment
   python3 -m venv venv
   source venv/bin/activate

   # Install dependencies
   pip install -r requirements.txt

Basic Usage
-----------

.. code-block:: bash

   # Run a sample optimization
   python src/dqi_max_xorsat_implementation.py


UN Sustainable Development Goals
================================

This project contributes to the following United Nations Sustainable Development Goals:

**SDG 3 - Good health and well-being** 
   Cleaning oceans safeguards human health by reducing exposure to marine pollutants in seafood and coastal waters.

**SDG 6 - Clean water and sanitation** 
   Cleaning oceans helps protect marine water quality, which is crucial for resources like desalination and intrinsically linked to effective land-based water management.

**SDG 11 - Department of Economic and Social Affairs** 
   Cleaning oceans enhances urban sustainability by tackling marine litter originating from cities, protecting coastal economies, and improving community resilience.

**SDG 13 - Climate Action**
   By optimizing ocean cleanup operations to reduce fuel consumption and emissions while maximizing impact.

**SDG 14 - Life Below Water**
   By directly addressing ocean plastic pollution that threatens marine ecosystems and biodiversity.

**SDG 17 - Partnerships for Goals**
   By fostering open collaboration between quantum computing experts, marine conservationists, and the global community.

.. toctree::
   :maxdepth: 2
   :hidden:
   :caption: Contents:

   overview
   installation
   usage
   implementations
   documentation/index
   demo/index
   contributing
   acknowledgments

Contributing
------------

We welcome contributions! Please see the :doc:`contributing` page for guidelines on how to get started, report issues, or submit pull requests. All contributors are expected to follow our Code of Conduct.

Acknowledgments
---------------

* Inspired by The Ocean Cleanup, Plastic Odyssey, and WWF Oceans
* Quantum algorithm references: Decoded Quantum Interferometry (DQI), QAOA

License
-------

This project is licensed under the MIT License. See `LICENSE <https://github.com/qcecothing/mohituQ/blob/main/LICENSE>`_ for details.

|

    "The future of our changing climate is tied inextricably to tech, and these leaders are showing how we can use open source to fight back."
    
    — GitHub Environmental Sustainability Team

