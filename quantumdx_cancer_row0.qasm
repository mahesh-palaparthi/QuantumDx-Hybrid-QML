OPENQASM 3.0;
include "stdgates.inc";

// ============================================================================
// QuantumDx: 4-Qubit ZZ Feature Map Circuit
// Dataset Sample: UCI Wisconsin Diagnostic Breast Cancer (Row #0)
// Ground Truth: Positive (Malignant)
// ============================================================================

qubit[4] q;
bit[4] c;

// --- REPETITION 1 ---
h q[0]; h q[1]; h q[2]; h q[3];

rz(4.0181) q[0];
rz(3.0304) q[1];
rz(1.8880) q[2];
rz(1.3878) q[3];

// Two-qubit ZZ entangling interactions
cx q[0], q[1]; rz(3.6839) q[1]; cx q[0], q[1];
cx q[1], q[2]; rz(7.1483) q[2]; cx q[1], q[2];
cx q[2], q[3]; rz(10.7581) q[3]; cx q[2], q[3];
cx q[0], q[3]; rz(5.5443) q[3]; cx q[0], q[3];

// --- REPETITION 2 ---
h q[0]; h q[1]; h q[2]; h q[3];

rz(4.0181) q[0];
rz(3.0304) q[1];
rz(1.8880) q[2];
rz(1.3878) q[3];

cx q[0], q[1]; rz(3.6839) q[1]; cx q[0], q[1];
cx q[1], q[2]; rz(7.1483) q[2]; cx q[1], q[2];
cx q[2], q[3]; rz(10.7581) q[3]; cx q[2], q[3];
cx q[0], q[3]; rz(5.5443) q[3]; cx q[0], q[3];

// --- MEASUREMENT ---
c[0] = measure q[0];
c[1] = measure q[1];
c[2] = measure q[2];
c[3] = measure q[3];
