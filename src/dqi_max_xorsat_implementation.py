import numpy as np
from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
from qiskit.circuit.library import QFT
from qiskit_aer import Aer
from qiskit.visualization import plot_histogram
import matplotlib.pyplot as plt
import json
import os
import csv
from datetime import datetime

class DQIMaxXORSAT:
    def __init__(self, parity_check_matrix=None):
        """
        Initialize the DQI Max-XORSAT solver.
        
        Args:
            parity_check_matrix: The parity check matrix for the XORSAT problem.
                                Default is the one from the example.
        """
        # Default parity check matrix from the .qmod file
        if parity_check_matrix is None:
            self.parity_check_matrix = np.array([
                [1, 1, 0, 0, 0, 0],
                [1, 0, 1, 0, 0, 0],
                [0, 0, 1, 1, 0, 0],
                [0, 0, 0, 1, 1, 0],
                [0, 1, 0, 0, 0, 1],
                [0, 0, 0, 0, 1, 1]
            ])
        else:
            self.parity_check_matrix = parity_check_matrix
        
        self.n_bits = self.parity_check_matrix.shape[1]
        
        # Create lookup table for syndrome decoding
        self.syndrome_table = self._create_syndrome_table()
    
    def _create_syndrome_table(self):
        """Create the syndrome lookup table for decoding."""
        syndrome_table = {}
        
        # For each possible error pattern with Hamming weight <= 2
        for i in range(2**self.n_bits):
            # Only consider patterns with at most 2 bits set
            error = np.array([int(bit) for bit in bin(i)[2:].zfill(self.n_bits)])
            if np.sum(error) <= 2:
                # Calculate the syndrome for this error
                syndrome = np.mod(np.dot(self.parity_check_matrix, error), 2)
                syndrome_int = int("".join(map(str, syndrome)), 2)
                syndrome_table[syndrome_int] = i
        
        return syndrome_table
    
    def _binary_to_unary(self, qc, binary_qubits, unary_qubits):
        """Convert from binary to unary encoding using modern Qiskit approach."""
        # Create a temporary register for one-hot encoding
        one_hot = QuantumRegister(4, "one_hot")
        one_hot_c = ClassicalRegister(4, "one_hot_c")  # Classical register for conditioning
        qc.add_register(one_hot)
        qc.add_register(one_hot_c)
        
        # Map binary to one-hot positions
        qc.cx(binary_qubits[1], one_hot[0])
        qc.x(one_hot[0])
        qc.cx(binary_qubits[0], one_hot[1])
        
        # Apply the transformation with properly controlled operations
        qc.cx(one_hot[1], one_hot[0])
        
        # Instead of if_test, measure and use classical control
        qc.measure(one_hot[3], one_hot_c[3])
        with qc.if_test((one_hot_c[3], 1)):
            qc.swap(one_hot[0], one_hot[2])
        
        # Reset the classical bit for potential reuse
        qc.reset(one_hot[3])
        
        qc.cx(one_hot[2], one_hot[3])
        qc.cx(one_hot[3], one_hot[1])
        
        # Convert one-hot to unary
        for i in range(3):
            qc.cx(one_hot[3-i], one_hot[2-i])
        qc.x(one_hot[0])
        
        # Map one-hot to unary outputs
        for i in range(3):
            qc.cx(one_hot[i+1], unary_qubits[i])
    
    def _prepare_dicke_state(self, qc, qubits):
        """Prepare a Dicke state on the specified qubits using proper control structures."""
        n = len(qubits)
        
        # Apply the cycle shift operations using control gates
        if n >= 2:
            qc.cx(qubits[1], qubits[0])
            
            # Using control gates instead of conditional blocks
            angle = np.pi/2  # Default for n=2
            if n == 3:
                angle = 1.9106332362490186
            elif n == 4:
                angle = 2.0943951023931957
            elif n == 5:
                angle = 2.214297435588181
            elif n == 6:
                angle = 2.300523983021863
                
            # Controlled RY gate
            qc.cry(angle, qubits[0], qubits[1])
        
        if n >= 3:
            qc.cx(qubits[2], qubits[0])
            
            # Using multi-controlled RY for multi-qubit control
            angle = 1.2309594173407747  # For n=3
            if n == 4:
                angle = 1.5707963267948968
            elif n == 5:
                angle = 1.7721542475852274
            elif n == 6:
                angle = 1.9106332362490186
            
            # For multi-controlled operation, decompose into basic gates
            control_qubits = [qubits[0], qubits[1]]
            target = qubits[2]
            
            # Simple implementation of multi-controlled RY 
            # using available gates in Qiskit
            qc.h(target)
            qc.mcry(angle, control_qubits, target)
            qc.h(target)
        
        # Recursively prepare Dicke state on the remaining qubits
        if n > 1:
            self._prepare_dicke_state(qc, qubits[1:])
    
    def _apply_vector_product_phase(self, qc, qubits, phase_vector=None):
        """Apply phase based on the vector product."""
        if phase_vector is None:
            phase_vector = [1.0] * 6  # Default from qmod file
        
        for i, phase in enumerate(phase_vector):
            if phase > 0:
                qc.z(qubits[i])
    
    def _apply_matrix_vector_product(self, qc, input_qubits, output_qubits):
        """Apply the matrix-vector product operation."""
        # This implements the parity check matrix multiplication
        # out[0] = y[0] ⊕ y[1]
        qc.cx(input_qubits[0], output_qubits[0])
        qc.cx(input_qubits[1], output_qubits[0])
        
        # out[1] = y[0] ⊕ y[2]
        qc.cx(input_qubits[0], output_qubits[1])
        qc.cx(input_qubits[2], output_qubits[1])
        
        # out[2] = y[2] ⊕ y[3]
        qc.cx(input_qubits[2], output_qubits[2])
        qc.cx(input_qubits[3], output_qubits[2])
        
        # out[3] = y[3] ⊕ y[4]
        qc.cx(input_qubits[3], output_qubits[3])
        qc.cx(input_qubits[4], output_qubits[3])
        
        # out[4] = y[1] ⊕ y[5]
        qc.cx(input_qubits[1], output_qubits[4])
        qc.cx(input_qubits[5], output_qubits[4])
        
        # out[5] = y[4] ⊕ y[5]
        qc.cx(input_qubits[4], output_qubits[5])
        qc.cx(input_qubits[5], output_qubits[5])
    
    def _syndrome_decode(self, qc, syndrome_qubits, error_qubits):
        """Apply the syndrome decoding using classical bits and modern control approach."""
        # Create classical registers for syndrome measurement
        syndrome_c = ClassicalRegister(len(syndrome_qubits), "syndrome_c")
        qc.add_register(syndrome_c)
        
        # Measure syndrome qubits to classical bits
        qc.measure(syndrome_qubits, syndrome_c)
        
        # For each possible syndrome in our table
        for syndrome_int, error_pattern in self.syndrome_table.items():
            # Convert syndrome to binary string
            syndrome_bin = bin(syndrome_int)[2:].zfill(6)
            
            # Create control condition based on syndrome value
            # For each syndrome bit that should be 1, check that classical bit
            condition = []
            for i, bit in enumerate(syndrome_bin):
                if bit == '1':
                    condition.append((syndrome_c[i], 1))
                else:
                    condition.append((syndrome_c[i], 0))
            
            # Apply error correction based on syndrome pattern
            error_bin = bin(error_pattern)[2:].zfill(6)
            for i, bit in enumerate(error_bin):
                if bit == '1':
                    # Apply X gate conditionally based on the syndrome
                    # For simplicity, just handle each bit individually
                    with qc.if_test(condition[0]):
                        with qc.if_test(condition[1]):
                            # Continue with additional conditions as needed
                            qc.x(error_qubits[i])
        
        # Reset syndrome qubits for potential reuse
        qc.reset(syndrome_qubits)
    
    def _hadamard_transform(self, qc, qubits):
        """Apply Hadamard gates to all qubits."""
        for qubit in qubits:
            qc.h(qubit)
    
    def build_circuit(self):
        """Build the DQI Max-XORSAT circuit."""
        # Create quantum registers
        k_register = QuantumRegister(2, "k")  # Register for k (number of errors)
        y_register = QuantumRegister(6, "y")  # Register for y (the solution vector)
        solution_register = QuantumRegister(6, "solution")  # Register for the solution
        unary_register = QuantumRegister(3, "unary")  # Register for unary encoding
        
        # Create classical registers for measurement
        y_classical = ClassicalRegister(6, "y_meas")
        solution_classical = ClassicalRegister(6, "solution_meas")
        
        # Create circuit
        qc = QuantumCircuit(k_register, unary_register, y_register, solution_register, 
                           y_classical, solution_classical)
        
        # Prepare the superposition for k (number of errors)
        # This creates a superposition of 1 and 2 errors
        qc.ry(np.arccos(0.5), k_register[0])
        qc.x(k_register[1])
        qc.cx(k_register[0], k_register[1])
        
        # Convert binary k to unary representation
        self._binary_to_unary(qc, k_register, unary_register)
        
        # Map unary to y register (which will be padded with zeros)
        for i in range(3):
            qc.cx(unary_register[i], y_register[i])
        
        # Prepare the Dicke state on y register
        self._prepare_dicke_state(qc, y_register)
        
        # Apply phase based on vector product
        self._apply_vector_product_phase(qc, y_register)
        
        # Apply matrix-vector product for syndrome calculation
        self._apply_matrix_vector_product(qc, y_register, solution_register)
        
        # Apply syndrome decoding
        self._syndrome_decode(qc, solution_register, y_register)
        
        # Apply Hadamard transform to solution register
        self._hadamard_transform(qc, solution_register)
        
        # Measure the results
        qc.measure(y_register, y_classical)
        qc.measure(solution_register, solution_classical)
        
        return qc
    
    def run(self, shots=1024):
        """Run the DQI circuit and return results."""
        circuit = self.build_circuit()
        
        # Use the statevector simulator for accurate results
        simulator = Aer.get_backend('qasm_simulator')
        job = simulator.run(circuit, shots=shots)
        result = job.result()
        
        # Get the solution counts
        counts = result.get_counts()
        
        # Process results to separate y and solution measurements
        solution_counts = {}
        for bitstring, count in counts.items():
            # Parse the solution part (last 6 bits)
            solution = bitstring[:6]
            if solution in solution_counts:
                solution_counts[solution] += count
            else:
                solution_counts[solution] = count
        
        return solution_counts
    
    def visualize_results(self, counts, save_path=None):
        """
        Visualize the results of the algorithm.
        
        Args:
            counts: Result counts from the algorithm
            save_path: Optional path to save the plot. If None, displays the plot.
        """
        figure = plot_histogram(counts)
        plt.title("DQI Max-XORSAT Solutions")
        
        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')
            plt.close()
        else:
            plt.show()
            
    def export_results(self, results, output_dir='outputs'):
        """
        Export the results to files.
        
        Args:
            results: Dictionary containing the results
            output_dir: Directory to save the outputs
        
        Returns:
            Dictionary with paths to the exported files
        """
        # Create timestamp for unique filenames
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Create output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)
        
        # Export paths
        json_path = os.path.join(output_dir, f"results_{timestamp}.json")
        csv_path = os.path.join(output_dir, f"results_{timestamp}.csv")
        plot_path = os.path.join(output_dir, f"histogram_{timestamp}.png")
        
        # Export as JSON
        with open(json_path, 'w') as f:
            json.dump(results, f, indent=2)
            
        # Export as CSV
        with open(csv_path, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['Solution', 'Count'])
            for solution, count in results.items():
                writer.writerow([solution, count])
        
        # Export plot
        self.visualize_results(results, save_path=plot_path)
        
        # Find best solution
        best_solution = max(results.items(), key=lambda x: x[1])[0]
        
        # Create summary
        summary = {
            'best_solution': best_solution,
            'output_files': {
                'json': json_path,
                'csv': csv_path,
                'plot': plot_path
            }
        }
        
        return summary

# Example usage
if __name__ == "__main__":
    # Create and run the DQI Max-XORSAT solver
    dqi_solver = DQIMaxXORSAT()
    circuit = dqi_solver.build_circuit()
    print("Circuit built successfully.")
    
    # Run the circuit and get results
    print("Running circuit...")
    results = dqi_solver.run(shots=1024)
    
    # Export results to files
    print("Exporting results to files...")
    output_summary = dqi_solver.export_results(results)
    
    # Print summary information
    print(f"\nBest solution: {output_summary['best_solution']}")
    print("\nFiles exported:")
    for file_type, path in output_summary['output_files'].items():
        print(f"- {file_type.upper()}: {path}") 