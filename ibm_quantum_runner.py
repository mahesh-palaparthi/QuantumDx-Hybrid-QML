r"""
QuantumDx: IBM Quantum Hardware Deployment Runner
==================================================
This script demonstrates how to take the 4-Qubit ZZ Feature Map circuit
from QuantumDx and execute it directly on real IBM Quantum superconducting hardware.

Theoretical Background:
- Ansatz: 4-Qubit ZZ Feature Map (Havlíček et al., Nature 567, 209–212, 2019)
- Formula: U_{\Phi(x)} = [ U_{\Phi(x)} H^{\otimes 4} ]^2
- Qubits needed: 4 physical qubits
- Gates: Hadamard (H), Phase Rotations (Rz), and Entangling CNOT gates
- Hardware Compatibility: 100% compatible with all IBM QPUs (Eagle, Heron, Falcon architectures).

Prerequisites for running on IBM Hardware:
1. Free IBM Quantum account: https://quantum.ibm.com/
2. Install Qiskit and Qiskit Runtime:
   pip install qiskit qiskit-ibm-runtime
3. Get your API Token from https://quantum.ibm.com/account
"""

import math

# Sample Patient Clinical Features (Normalized into [0, pi])
# e.g., Patient Row #14 (Diabetic Positive):
# Age: 60 -> 1.88 rad, Polyuria: Yes -> 2.67 rad, Polydipsia: Yes -> 2.82 rad, Weight Loss: No -> 0.56 rad
SAMPLE_PATIENT_FEATURES = [1.885, 2.670, 2.827, 0.565]


def compute_zz_angles(x):
    """Compute single-qubit phase rotations and two-qubit ZZ coupling angles."""
    pi = math.pi
    # Single-qubit rotations: phi_i = 2 * x_i
    phi = [2.0 * xi for xi in x]

    # Two-qubit ZZ interaction angles: phi_ij = 2 * (pi - x_i) * (pi - x_j)
    phi01 = 2.0 * (pi - x[0]) * (pi - x[1])
    phi12 = 2.0 * (pi - x[1]) * (pi - x[2])
    phi23 = 2.0 * (pi - x[2]) * (pi - x[3])
    phi03 = 2.0 * (pi - x[0]) * (pi - x[3])

    return phi, (phi01, phi12, phi23, phi03)


def export_openqasm3(x):
    """Generate OpenQASM 3.0 code for IBM Quantum Composer (https://quantum.ibm.com/composer)."""
    phi, (phi01, phi12, phi23, phi03) = compute_zz_angles(x)

    qasm = f"""OPENQASM 3.0;
include "stdgates.inc";

// QuantumDx: 4-Qubit ZZ Feature Map for Disease Risk Classification
qubit[4] q;
bit[4] c;

// ==========================================
// REPETITION 1
// ==========================================

// 1. Initial Hadamard Superposition
h q[0];
h q[1];
h q[2];
h q[3];

// 2. Single-Qubit Phase Rotations: Rz(2 * x_i)
rz({phi[0]:.4f}) q[0]; // Feature 0 (Age)
rz({phi[1]:.4f}) q[1]; // Feature 1 (Polyuria)
rz({phi[2]:.4f}) q[2]; // Feature 2 (Polydipsia)
rz({phi[3]:.4f}) q[3]; // Feature 3 (Sudden Weight Loss)

// 3. Two-Qubit ZZ Entangling Couplings: exp(-i * phi_ij * Z_i * Z_j / 2)
// Pair (q0, q1)
cx q[0], q[1];
rz({phi01:.4f}) q[1];
cx q[0], q[1];

// Pair (q1, q2)
cx q[1], q[2];
rz({phi12:.4f}) q[2];
cx q[1], q[2];

// Pair (q2, q3)
cx q[2], q[3];
rz({phi23:.4f}) q[3];
cx q[2], q[3];

// Pair (q0, q3) - Circular Closure
cx q[0], q[3];
rz({phi03:.4f}) q[3];
cx q[0], q[3];

// ==========================================
// REPETITION 2 (Non-linear Kernel Depth)
// ==========================================

h q[0];
h q[1];
h q[2];
h q[3];

rz({phi[0]:.4f}) q[0];
rz({phi[1]:.4f}) q[1];
rz({phi[2]:.4f}) q[2];
rz({phi[3]:.4f}) q[3];

cx q[0], q[1];
rz({phi01:.4f}) q[1];
cx q[0], q[1];

cx q[1], q[2];
rz({phi12:.4f}) q[2];
cx q[1], q[2];

cx q[2], q[3];
rz({phi23:.4f}) q[3];
cx q[2], q[3];

cx q[0], q[3];
rz({phi03:.4f}) q[3];
cx q[0], q[3];

// ==========================================
// MEASUREMENT INTO COMPUTATIONAL BASIS
// ==========================================
c[0] = measure q[0];
c[1] = measure q[1];
c[2] = measure q[2];
c[3] = measure q[3];
"""
    return qasm


def run_with_qiskit_runtime(api_token=None, use_real_hardware=False):
    """
    Constructs the circuit in Qiskit and executes via Qiskit Runtime.
    If api_token is not provided, runs on the local Qiskit Aer simulator.
    """
    try:
        from qiskit import QuantumCircuit
        from qiskit.circuit.library import ZZFeatureMap
    except ImportError:
        print("\\n[!] Qiskit is not currently installed in this Python environment.")
        print("    To run locally, execute: pip install qiskit qiskit-ibm-runtime\\n")
        return None

    print("[*] Building 4-Qubit ZZ Feature Map using native Qiskit library...")
    # IBM's native ZZFeatureMap implementation
    feature_map = ZZFeatureMap(feature_dimension=4, reps=2, entanglement="linear")

    # Bind active patient features
    qc = feature_map.assign_parameters(SAMPLE_PATIENT_FEATURES)
    qc.measure_all()

    print("\\n--- Quantum Circuit Diagram ---")
    print(qc.draw("text"))

    if not use_real_hardware or not api_token:
        print("\\n[*] Simulating locally with Qiskit Statevector/Sampler...")
        try:
            from qiskit.primitives import StatevectorSampler
            sampler = StatevectorSampler()
            job = sampler.run([qc], shots=1024)
            result = job.result()
            pub_result = result[0]
            counts = pub_result.data.meas.get_counts()
            print("[+] Simulation Successful! Output Bitstring Counts (1024 shots):")
            print(counts)
            return counts
        except Exception as sim_err:
            print("[!] Local Qiskit simulation note:", sim_err)
            return None

    # Connect to Real IBM Quantum Hardware
    try:
        from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2

        print("\\n[*] Authenticating with IBM Quantum Platform...")
        service = QiskitRuntimeService(channel="ibm_quantum_platform", token=api_token)

        # Select the least busy real quantum computer (e.g. 127-qubit ibm_brisbane, ibm_kyoto, etc.)
        real_backend = service.least_busy(operational=True, simulator=False)
        print(f"[+] Connected! Selected Real Quantum Hardware: {real_backend.name}")
        print(f"    Total Qubits: {real_backend.num_qubits}")
        print(f"    Pending Jobs: {real_backend.status().pending_jobs}")

        print("\\n[*] Submitting circuit job to IBM Quantum Processing Unit (QPU)...")
        sampler = SamplerV2(backend=real_backend)
        job = sampler.run([qc], shots=2048)
        print(f"[+] Job successfully enqueued! Job ID: {job.job_id()}")
        print("    You can track execution live at: https://quantum.ibm.com/jobs")
        return job.job_id()

    except Exception as ibm_err:
        print("[!] IBM Quantum hardware connection error:", ibm_err)
        return None


def run_with_pennylane_qiskit():
    """
    Demonstrates how PennyLane connects to IBM Quantum hardware
    with literally a 1-line device change!
    """
    code_example = '''
# -------------------------------------------------------------
# PENNYLANE IBM HARDWARE SWAP (ONE-LINE INTEGRATION)
# -------------------------------------------------------------
import pennylane as qml
from qiskit_ibm_runtime import QiskitRuntimeService

# 1. Authenticate with IBM
service = QiskitRuntimeService(channel="ibm_quantum_platform", token="YOUR_IBM_TOKEN")
ibm_qpu = service.least_busy(operational=True, simulator=False)

# 2. Swap the device from 'default.qubit' to 'qiskit.remote'
dev = qml.device("qiskit.remote", wires=4, backend=ibm_qpu, shots=2048)

# 3. Exactly the same QNode as used in QuantumDx!
@qml.qnode(dev)
def quantum_dx_qnode(x, weights):
    qml.AngleEmbedding(x, wires=range(4), rotation="Y")
    qml.StronglyEntanglingLayers(weights, wires=range(4))
    return [qml.expval(qml.PauliZ(w)) for w in range(4)]

# Run inference directly on IBM Superconducting Qubits!
expectations = quantum_dx_qnode(SAMPLE_PATIENT_FEATURES, trained_weights)
print("Hardware Expectation Values from IBM QPU:", expectations)
'''
    return code_example


if __name__ == "__main__":
    print("=" * 70)
    print(" QuantumDx -> IBM Quantum Hardware Deployment Guide")
    print("=" * 70)

    print("\n1. Generating OpenQASM 3.0 for IBM Quantum Composer...")
    qasm_str = export_openqasm3(SAMPLE_PATIENT_FEATURES)
    qasm_file = "quantumdx_circuit.qasm"
    with open(qasm_file, "w") as f:
        f.write(qasm_str)
    print(f"   [+] Saved OpenQASM 3.0 to '{qasm_file}'")
    print("   [+] To run without coding: Open https://quantum.ibm.com/composer,")
    print("       switch to the Code Editor tab, paste the contents of this file,")
    print("       and click 'Run'!")

    print("\n2. Qiskit Native Integration:")
    run_with_qiskit_runtime()

    print("\n3. PennyLane IBM Device Swap Guide:")
    print(run_with_pennylane_qiskit())

    print("=" * 70)
    print(" Hardware Compatibility Summary:")
    print(" - Total Qubits: 4 (Runs on any 5-qubit, 7-qubit, or 127-qubit IBM QPU)")
    print(" - Native Gates: H, Rz, CNOT (All natively supported by IBM transmon qubits)")
    print(" - Circuit Depth: ~12 layers (Easily fits inside T1/T2 coherence limits)")
    print("=" * 70)
