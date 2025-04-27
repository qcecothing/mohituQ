Contributing
============

We welcome contributions from the community! This page provides guidelines on how to contribute to mohituQ.

Code of Conduct
--------------

All contributors are expected to adhere to our Code of Conduct. Please read it before participating.

Ways to Contribute
-----------------

There are many ways to contribute to mohituQ:

1. **Code Contributions**: Implement new features or fix bugs
2. **Documentation**: Improve or extend the documentation
3. **Testing**: Add tests or identify edge cases
4. **Bug Reports**: Submit detailed bug reports
5. **Feature Requests**: Suggest new features or improvements
6. **Use Cases**: Share how you're using mohituQ for ocean cleanup optimization

Development Workflow
-------------------

1. **Fork the Repository**
   
   Start by forking the repository on GitHub.

2. **Clone Your Fork**

   .. code-block:: bash

      git clone https://github.com/your-username/mohituQ.git
      cd mohituQ
      git remote add upstream https://github.com/ecothing/mohituQ.git

3. **Create a Branch**

   .. code-block:: bash

      git checkout -b feature-or-bugfix-name

4. **Make Your Changes**

   Implement your changes, following the coding style of the project.

5. **Write Tests**

   Add tests for your changes to ensure they work as expected.

6. **Run Tests**

   .. code-block:: bash

      pytest

7. **Submit a Pull Request**

   Push your changes to your fork and submit a pull request to the main repository.

Coding Guidelines
----------------

- Follow PEP 8 style guidelines for Python code
- Write docstrings for all functions, classes, and modules
- Add type hints to function signatures
- Keep functions focused on a single responsibility
- Write unit tests for new functionality

Documentation
------------

We use Sphinx for documentation. To build the docs locally:

.. code-block:: bash

   cd docs
   make html

You can then view the documentation in your browser by opening ``docs/build/html/index.html``.

Getting Help
-----------

If you need help with your contribution, you can:

- Open an issue on GitHub
- Contact the maintainers
- Join community discussions

Thank you for your interest in contributing to mohituQ! 