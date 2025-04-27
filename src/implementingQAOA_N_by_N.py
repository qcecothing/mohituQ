import pennylane as qml
from pennylane import numpy as np
import matplotlib.pyplot as plt

# Set the size of the N x N matrix
N = 5  # You can change this to any value you want

# Function to create Q matrix of size N x N
def create_q_matrix(n):
    # Initialize a matrix with 5's
    Q = np.ones((n, n)) * 5
    
    # Set diagonal elements with a pattern similar to the original
    for i in range(n):
        if i == 0:
            Q[i, i] = -9
        elif i == 1:
            Q[i, i] = -6
        else:
            Q[i, i] = 5
    
    return Q

# Create the Q matrix with the specified size
Q = np.array([
    [-2,  2,  0,  2],
    [ 2, -2,  2,  0],
    [ 0,  2, -2,  2],
    [ 2,  0,  2, -2]
])

print("Q matrix:")
print(Q)

# Number of qubits
n_qubits = Q.shape[0]
wires = range(n_qubits)

# Translate QUBO to cost Hamiltonian
coeffs = []
ops = []

for i in range(n_qubits):
    coeffs.append(Q[i, i] / 2)
    ops.append(qml.PauliZ(i))
    for j in range(i + 1, n_qubits):
        coeffs.append(Q[i, j] / 4)
        ops.append(qml.PauliZ(i) @ qml.PauliZ(j))

cost_h = qml.Hamiltonian(coeffs, ops)
print("\nCost Hamiltonian:")
print(cost_h)

# Define mixer Hamiltonian (standard X mixer)
mixer_coeffs = [1 for _ in range(n_qubits)]
mixer_ops = [qml.PauliX(i) for i in range(n_qubits)]
mixer_h = qml.Hamiltonian(mixer_coeffs, mixer_ops)

print("\nMixer Hamiltonian:")
print(mixer_h)

# QAOA layer
def qaoa_layer(gamma, alpha):
    qml.qaoa.cost_layer(gamma, cost_h)
    qml.qaoa.mixer_layer(alpha, mixer_h)

# Circuit
depth = 2

def circuit(params, **kwargs):
    for w in wires:
        qml.Hadamard(wires=w)
    for d in range(depth):
        qaoa_layer(params[d, 0], params[d, 1])

# Define device
dev = qml.device("default.qubit", wires=n_qubits)

# Cost function
@qml.qnode(dev)
def cost_fn(params):
    circuit(params)
    return qml.expval(cost_h)

# Optimize
opt = qml.GradientDescentOptimizer()
steps = 200
params = np.array([[0.5, 0.5] for _ in range(depth)], requires_grad=True)

print("\nOptimizing parameters...")
for i in range(steps):
    params = opt.step(cost_fn, params)
    if i % 10 == 0:
        print(f"Step {i}: Cost = {cost_fn(params):.6f}")

print("\nOptimal Parameters:")
print(params)

# Get final probabilities
@qml.qnode(dev)
def prob_circuit(params):
    circuit(params)
    return qml.probs(wires=wires)

probs = prob_circuit(params)

# Plot
plt.style.use("seaborn-v0_8") if "seaborn-v0_8" in plt.style.available else plt.style.use("default")
plt.figure(figsize=(10, 6))
plt.bar(range(2 ** n_qubits), probs)
plt.xlabel("Bitstring (decimal)")
plt.ylabel("Probability")
plt.title(f"QAOA Output Distribution for {n_qubits}x{n_qubits} Q Matrix")
plt.xticks(range(2 ** n_qubits))
plt.savefig(f"qaoa_output_N{N}.png")
plt.show()

# Find the most likely solution
most_likely_bitstring = np.argmax(probs)
binary_solution = format(most_likely_bitstring, f'0{n_qubits}b')
print(f"\nMost likely solution: |{binary_solution}⟩ with probability {probs[most_likely_bitstring]:.4f}")

# Calculate the energy of the solution
solution_energy = 0
for i in range(n_qubits):
    bit_i = int(binary_solution[i])
    # Convert bit from 0/1 to +1/-1 for Ising model
    spin_i = 1 - 2 * bit_i
    solution_energy += Q[i, i] * spin_i
    for j in range(i + 1, n_qubits):
        bit_j = int(binary_solution[j])
        spin_j = 1 - 2 * bit_j
        solution_energy += Q[i, j] * spin_i * spin_j

print(f"Energy of the solution: {solution_energy}")

# Show how to use different N values
print("\nTo use a different matrix size, change the N value at the top of the script.")
print("Examples:")
print("- For 4x4 matrix: N = 4")
print("- For 5x5 matrix: N = 5")
print("- For larger matrices, you may need to increase computation resources.") 