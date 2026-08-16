---
title: "Transformers Explained"
course: "ai"
courseTitle: "Artificial Intelligence & LLMs"
courseOrder: 1
stage: "LLM Fundamentals"
stageOrder: 2
lesson: 4
description: "Explore the landmark Transformer architecture, why it superseded recurrent networks, and how decoder-only blocks process tokens in parallel."
---

# Transformers Explained

In 2017, a team of researchers at Google published a landmark research paper titled *"Attention Is All You Need"*.

That paper introduced the **Transformer architecture**—the single neural network design that completely replaced previous sequence architectures and paved the way for modern Generative AI, ChatGPT, Claude, Llama, and Gemini.

---

## Why does this matter?

Before Transformers, natural language processing relied on **Recurrent Neural Networks (RNNs)** and **Long Short-Term Memory networks (LSTMs)**.

These older architectures suffered from two catastrophic bottlenecks:

1. **Sequential Processing Bottleneck (No Parallelism):** An RNN had to process token 1 before it could touch token 2, and token 2 before token 3. You could not utilize modern parallel GPU clusters effectively during training.
2. **Catastrophic Forgetting (Vanishing Gradients):** By the time an RNN read the 100th word in a document, its hidden state had overwritten or diluted the memory of the 1st word.

```text
RNN (Sequential & Slow):
Token 1 ──► Hidden State 1 ──► Token 2 ──► Hidden State 2 ──► Token 3 (Bottlenecked)

Transformer (Parallel & Scalable):
[ Token 1, Token 2, Token 3, ... Token 1000 ] ──► Processed simultaneously across GPU cores
```

The Transformer solved both problems: it eliminated recurrence, processed all tokens in parallel, and allowed every token to directly attend to every other token regardless of distance.

---

## The Three Transformer Families

The original 2017 Transformer was designed for machine translation and contained two halves: an **Encoder** and a **Decoder**.

Over time, AI research split the architecture into three specialized branches:

```text
The Transformer Family
├── 1. Encoder-Only (e.g., BERT, RoBERTa)
│      Bi-directional. Best for classification, search embeddings, extraction.
├── 2. Encoder-Decoder (e.g., T5, BART)
│      Transforms input sequence into output sequence. Translation, summarization.
└── 3. Decoder-Only (e.g., GPT-4, Llama 3, Claude, Gemini, Mistral)
       Autoregressive next-token generators. The universal foundation of modern LLMs.
```

Modern conversational and coding LLMs are almost exclusively **Decoder-Only Transformers** because the causal next-token prediction task scales predictably and generalizes across all text tasks.

---

## The Anatomy of a Transformer Block

An LLM is constructed by stacking dozens of identical **Transformer Blocks** (often 32 to 128 layers deep):

```text
Input Tokens ("The AI Rishi")
      │
      ▼
┌─────────────────────────────────────────────────────────────┐
│ Tokenizer + Embedding Layer + Positional Encoding           │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐  ▲
│ Transformer Block 1                                         │  │
│ ┌─────────────────────────────────────────────────────────┐ │  │
│ │ 1. Multi-Head Self-Attention (Context Mixing)           │ │  │
│ └─────────────────────────┬───────────────────────────────┘ │  │
│                           │ (Add & LayerNorm)               │  │
│ ┌─────────────────────────▼───────────────────────────────┐ │  │ Repeated
│ │ 2. Feed-Forward Network / MLP (Knowledge & Reasoning)   │ │  │ 32 to 128
│ └─────────────────────────┬───────────────────────────────┘ │  │ times
│                           │ (Add & LayerNorm)               │  │ (Deep Layers)
│                           ▼                                 │  │
└─────────────────────────────────────────────────────────────┘  ▼
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Final LayerNorm + Un-embedding Linear Projection            │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Softmax Layer ──► Next-Token Probabilities                  │
└─────────────────────────────────────────────────────────────┘
```

Let's examine the essential components inside each block:

### 1. Multi-Head Self-Attention
The communication layer. It allows tokens to look across the entire sequence, exchange information, and dynamically update their vector representations based on context.

### 2. Residual Connections (Skip Connections)
Notice the `Add` operations around each layer. The original input vector is added directly to the output of the attention layer:

$$\text{Output} = \text{LayerNorm}(x + \text{Attention}(x))$$

Residual connections prevent gradients from vanishing during backpropagation, allowing neural networks to scale to hundreds of layers deep without degrading.

### 3. Layer Normalization (LayerNorm / RMSNorm)
Standardizes vector values across features to keep activations within stable numerical ranges, preventing numbers from exploding or collapsing during deep matrix calculations.

### 4. Feed-Forward Network (MLP / SwiGLU)
The computation and knowledge layer. While attention routes information between different tokens, the Feed-Forward Network processes each token independently through multi-layer perceptrons to perform nonlinear reasoning and recall factual patterns encoded in the model's weights.

### 5. Final Linear Projection & Softmax
At the very top of the network, the final vector is projected across the entire vocabulary (e.g. 128,000 possibilities). A **Softmax** function converts the raw numbers (*logits*) into a clean probability distribution that sums to `1.0`.

---

## Why Transformers Scale So Well

The reason Transformers conquered AI is summarized by **Scaling Laws**:

As you increase:
1. **Model Parameter Count**
2. **Training Dataset Size**
3. **Training Compute (FLOPs)**

The model's cross-entropy loss drops following a smooth, predictable power-law curve. Transformers do not hit an early performance plateau—giving engineers confidence that investing millions into larger training runs consistently yields more capable models.

---

## Common Misconceptions

- **Misconception:** *Transformers understand grammar rules explicitly programmed by linguists.*
  **Reality:** No linguistic rules are hardcoded. The network discovers syntax, grammar, idioms, and logical reasoning patterns entirely from optimizing statistical next-token prediction.
- **Misconception:** *GPT models process prompts word-by-word during initial input reading.*
  **Reality:** During prompt ingestion (the prefill phase), the Transformer processes the entire prompt in parallel across GPU matrix units. Sequential generation only happens when emitting new tokens one by one.

---

## Key Takeaways

> [!IMPORTANT]
> - Transformers replaced sequential RNNs by processing all tokens in parallel using the Attention Mechanism.
> - Modern generative LLMs are **Decoder-Only Transformers** optimized for autoregressive next-token prediction.
> - A Transformer block consists of Multi-Head Attention (communication), Residual Connections (stability), Normalization, and Feed-Forward Networks (computation).
> - Transformers follow empirical scaling laws: performance improves predictably with more parameters, data, and compute.

---

## What comes next?

The core engine inside every Transformer block is the **Attention Mechanism**. How does a token actually "look" at other tokens to build context?

In **Lesson 05**, we dive deep into the **Attention Mechanism**, exploring Query, Key, and Value matrices.
