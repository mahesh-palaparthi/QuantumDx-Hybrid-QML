OPENQASM 3.0;
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
rz(3.7700) q[0]; // Feature 0 (Age)
rz(5.3400) q[1]; // Feature 1 (Polyuria)
rz(5.6540) q[2]; // Feature 2 (Polydipsia)
rz(1.1300) q[3]; // Feature 3 (Sudden Weight Loss)

// 3. Two-Qubit ZZ Entangling Couplings: exp(-i * phi_ij * Z_i * Z_j / 2)
// Pair (q0, q1)
cx q[0], q[1];
rz(1.1852) q[1];
cx q[0], q[1];

// Pair (q1, q2)
cx q[1], q[2];
rz(0.2967) q[2];
cx q[1], q[2];

// Pair (q2, q3)
cx q[2], q[3];
rz(1.6212) q[3];
cx q[2], q[3];

// Pair (q0, q3) - Circular Closure
cx q[0], q[3];
rz(6.4755) q[3];
cx q[0], q[3];

// ==========================================
// REPETITION 2 (Non-linear Kernel Depth)
// ==========================================

h q[0];
h q[1];
h q[2];
h q[3];

rz(3.7700) q[0];
rz(5.3400) q[1];
rz(5.6540) q[2];
rz(1.1300) q[3];

cx q[0], q[1];
rz(1.1852) q[1];
cx q[0], q[1];

cx q[1], q[2];
rz(0.2967) q[2];
cx q[1], q[2];

cx q[2], q[3];
rz(1.6212) q[3];
cx q[2], q[3];

cx q[0], q[3];
rz(6.4755) q[3];
cx q[0], q[3];

// ==========================================
// MEASUREMENT INTO COMPUTATIONAL BASIS
// ==========================================
c[0] = measure q[0];
c[1] = measure q[1];
c[2] = measure q[2];
c[3] = measure q[3];
