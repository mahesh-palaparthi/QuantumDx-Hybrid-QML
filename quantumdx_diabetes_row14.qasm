OPENQASM 3.0;
include "stdgates.inc";

// ============================================================================
// QuantumDx: 4-Qubit ZZ Feature Map Circuit
// Dataset Sample: Sylhet Early Stage Diabetes Dataset (Row #14)
// Ground Truth: Positive
// ============================================================================

qubit[4] q;
bit[4] c;

// --- REPETITION 1 ---
h q[0]; h q[1]; h q[2]; h q[3];

rz(3.7699) q[0];
rz(5.3407) q[1];
rz(5.6549) q[2];
rz(1.1310) q[3];

// Two-qubit ZZ entangling interactions
cx q[0], q[1]; rz(1.1844) q[1]; cx q[0], q[1];
cx q[1], q[2]; rz(0.2961) q[2]; cx q[1], q[2];
cx q[2], q[3]; rz(1.6186) q[3]; cx q[2], q[3];
cx q[0], q[3]; rz(6.4745) q[3]; cx q[0], q[3];

// --- REPETITION 2 ---
h q[0]; h q[1]; h q[2]; h q[3];

rz(3.7699) q[0];
rz(5.3407) q[1];
rz(5.6549) q[2];
rz(1.1310) q[3];

cx q[0], q[1]; rz(1.1844) q[1]; cx q[0], q[1];
cx q[1], q[2]; rz(0.2961) q[2]; cx q[1], q[2];
cx q[2], q[3]; rz(1.6186) q[3]; cx q[2], q[3];
cx q[0], q[3]; rz(6.4745) q[3]; cx q[0], q[3];

// --- MEASUREMENT ---
c[0] = measure q[0];
c[1] = measure q[1];
c[2] = measure q[2];
c[3] = measure q[3];
