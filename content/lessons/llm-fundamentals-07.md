---
title: "Inference and Generation"
course: "ai"
courseTitle: "Artificial Intelligence & LLMs"
courseOrder: 1
stage: "LLM Fundamentals"
stageOrder: 2
lesson: 7
topic: "ai"
status: "published"
description: "Trace what happens under the hood during model inference: prompt processing, autoregressive generation loop, sampling algorithms, and streaming."
---

# Inference and Generation

When you send a prompt to an LLM API, the model does not generate an entire paragraph in a single instantaneous step.

Instead, the model executes an **Autoregressive Generation Loop**—generating text strictly **one token at a time**, repeatedly appending each new token to the sequence, and passing the updated context back into the model to predict the next token.

Understanding inference is critical for optimizing latency, managing throughput, and tuning sampling hyperparameters in production applications.

---

## Why does this matter?

As an engineer building LLM applications, inference mechanics determine user experience and system reliability:

1. **Latency Profiles:** Why does the first word take longer to arrive than subsequent words (**Time to First Token vs Tokens per Second**)?
2. **Streaming:** How Server-Sent Events (SSE) stream tokens to user interfaces in real time as they are generated.
3. **Determinism vs Creativity:** How sampling strategies (Greedy, Temperature, Top-p) control whether the model gives identical outputs or diverse variations.
4. **Memory Management (KV Cache):** Why GPU VRAM consumption grows dynamically as conversations get longer.

---

## The Two Phases of LLM Inference

Every inference request consists of two fundamentally distinct computational phases:

```text
Phase 1: The Prefill Phase (Prompt Processing - Compute Bound)
[ "Translate", " this", " sentence", " to", " French" ] ──► Processed in PARALLEL across GPU cores

Phase 2: The Decode Phase (Autoregressive Generation - Memory-Bandwidth Bound)
Step 1: Predicts "Traduisez" ──► Appends to prompt
Step 2: Predicts " cette"    ──► Appends to prompt
Step 3: Predicts " phrase"   ──► Appends to prompt
Step 4: Predicts <EOS>       ──► Stops generation (Sequential, 1 token at a time)
```

### 1. The Prefill Phase
The model ingests the entire user prompt simultaneously. Because all input tokens are known in advance, the GPU performs massive parallel matrix multiplications to compute the initial key-value representations.

### 2. The Decode Phase
The model generates the response sequentially. Each forward pass calculates probabilities for only **one new token**. That new token is appended to the context, and the cycle repeats until the model produces an **End-of-Sequence token (`<EOS>`)** or reaches the maximum token limit.

---

## The Autoregressive Generation Loop

The complete generation loop operates as follows:

```text
┌─────────────────────────────────────────────────────────────┐
│ 1. Tokenize the incoming prompt text                        │
│ 2. Run Forward Pass through Transformer layers              │
│ 3. Extract output Logits (raw scores for all tokens)        │
│ 4. Apply Softmax ──► Probability Distribution               │
│ 5. Select ONE token using Sampling Strategy                 │
│ 6. If Token == <EOS> or limit reached ──► STOP              │
│ 7. Else: Append token to Context and REPEAT from Step 2     │
└─────────────────────────────────────────────────────────────┘
```

---

## How Tokens are Selected: Decoding Strategies

Once the model calculates a probability distribution across its 128,000-word vocabulary, how does it choose which token to output?

Suppose the top probabilities for the next token are:

- `"apple"` ($60\%$)
- `"banana"` ($25\%$)
- `"orange"` ($10\%$)
- `"spaceship"` ($0.001\%$)

```text
Probability Selection Methods
├── 1. Greedy Decoding (Argmax)
│      Always pick the single highest probability token ("apple").
│      Deterministic, repetitive, lacks creativity.
├── 2. Temperature Sampling
│      Flattens or sharpens the probability curve.
├── 3. Top-k Sampling
│      Restricts candidates to only the top K most likely tokens.
└── 4. Top-p (Nucleus) Sampling
       Restricts candidates to the smallest pool whose cumulative probability >= p.
```

### A. Greedy Decoding
The model picks the candidate with the highest probability.
- **Use Case:** Deterministic code generation, structured JSON extraction, exact mathematical answers.
- **Limitation:** Can get stuck in repetitive loops and dull phrasing.

### B. Temperature Sampling
Temperature ($T$) scales the raw logits before applying Softmax:

$$\text{Probability}_i = \frac{e^{z_i / T}}{\sum_j e^{z_j / T}}$$

- **Low Temperature ($T = 0.1 - 0.3$):** Sharpens the distribution. High-probability tokens become overwhelmingly likely. (Focused, analytical, factual).
- **High Temperature ($T = 0.8 - 1.2$):** Flattens the distribution. Lower-probability tokens get a higher chance of being picked. (Creative, diverse, exploratory).
- **$T = 0.0$:** Mathematically equivalent to Greedy Decoding.

### C. Top-p (Nucleus) Sampling
Instead of considering every token in the dictionary, Top-p sets a cumulative threshold (e.g., $p = 0.90$). The model sorts candidates by probability, keeps only the top tokens that add up to 90%, and discards the long tail of low-probability words.

---

## Key-Value (KV) Caching: The Speed Multiplier

Without optimization, generating token 100 would require recomputing self-attention for tokens 1 through 99 from scratch.

To prevent this redundant quadratic computation, inference engines use a **KV Cache**:

- The Key and Value vectors for all past tokens are calculated once and stored in GPU VRAM.
- On each new step, the model only computes the Key and Value vectors for the single newly generated token and appends them to the cache.

While the KV cache makes generation fast, it consumes significant GPU memory—a key constraint when serving thousands of concurrent users.

---

## Latency Metrics in Production

When benchmarking an LLM system, track three essential metrics:

1. **Time to First Token (TTFT):** How long the user waits before the first word appears on screen (driven by prompt length and prefill speed).
2. **Inter-Token Latency (ITL):** The time between consecutive emitted tokens (driven by memory bandwidth and model parameter size).
3. **Tokens Per Second (TPS):** The generation speed (e.g., 50 to 120 tokens/sec on modern GPU setups).

---

## Common Misconceptions

- **Misconception:** *Setting Temperature to 0 makes a model 100% immune to hallucinations.*
  **Reality:** Temperature = 0 makes generation deterministic, meaning the model will always give the exact same answer. If the model's highest-probability prediction is a hallucination, it will reliably repeat that hallucination every time.
- **Misconception:** *Streaming makes the model generate faster.*
  **Reality:** Streaming does not change overall compute time; it simply sends individual tokens over a websocket or Server-Sent Events (SSE) connection immediately so the user can begin reading while generation continues.

---

## Key Takeaways

> [!IMPORTANT]
> - LLM inference consists of a parallel **Prefill Phase** (processing the prompt) and a sequential **Decode Phase** (generating tokens one-by-one).
> - Autoregressive models predict strictly one token per forward pass.
> - **Greedy Decoding** picks the most probable token; **Temperature** and **Top-p** control randomness and creativity.
> - **KV Caching** stores past Keys and Values in VRAM to avoid recomputing past tokens on every step.

---

## What comes next?

How do you configure these generation dials in real-world APIs, and what are the hard limits of context windows?

In **Lesson 08**, we wrap up Stage 02 with **Context Windows, Temperature and Parameters**—the complete developer guide to configuring LLMs.
