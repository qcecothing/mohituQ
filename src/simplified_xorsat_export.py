import matplotlib.pyplot as plt
import json
import os
import csv
from datetime import datetime

def generate_mock_results():
    """Generate mock results for demonstration"""
    return {
        "000101": 324,
        "010101": 217,
        "110001": 186,
        "101010": 152,
        "001100": 145
    }

def visualize_results(counts, save_path=None):
    """
    Visualize the results as a simple bar chart.
    
    Args:
        counts: Result counts from the algorithm
        save_path: Optional path to save the plot. If None, displays the plot.
    """
    plt.figure(figsize=(10, 6))
    solutions = list(counts.keys())
    counts_values = list(counts.values())
    
    plt.bar(solutions, counts_values)
    plt.xlabel('Solutions')
    plt.ylabel('Counts')
    plt.title("Max-XORSAT Solutions")
    plt.xticks(rotation=45)
    
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        plt.close()
    else:
        plt.show()
        
def export_results(results, output_dir='src'):
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
    visualize_results(results, save_path=plot_path)
    
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

if __name__ == "__main__":
    # Generate mock results
    print("Generating mock results...")
    results = generate_mock_results()
    
    # Export results to files
    print("Exporting results to files...")
    output_summary = export_results(results)
    
    # Print summary information
    print(f"\nBest solution: {output_summary['best_solution']}")
    print("\nFiles exported:")
    for file_type, path in output_summary['output_files'].items():
        print(f"- {file_type.upper()}: {path}") 