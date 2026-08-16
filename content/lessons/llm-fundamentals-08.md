---
title: "Context Windows, Temperature and Parameters"
course: "ai"
courseTitle: "Artificial Intelligence & LLMs"
courseOrder: 1
stage: "LLM Fundamentals"
stageOrder: 2
lesson: 8
description: "Master practical runtime controls: context window constraints, temperature and sampling tuning, token budgets, and distinguishing model weights from generation parameters."
---

# Context Windows, Temperature and Parameters

When calling an LLM through an API (such as OpenAI, Anthropic, or local inference servers like Ollama and vLLM), developers configure parameters that directly govern model behavior, creativity, and token limits.

To build production-grade AI systems, you must cleanly separate **Model Parameters** (the frozen internal weights of the neural network) from **Generation Hyperparameters** (the runtime configuration knobs you pass in API requests).

---

## Why does this matter?

Passing incorrect generation parameters leads to subtle, costly bugs in production:

- Using high temperature for JSON output causes malformed schemas and parsing crashes.
- Exceeding the context window results in abrupt request truncation or high latency.
- Setting `max_tokens` too low truncates code in the middle of a function.
- Failing to manage token budgets causes unexpected multi-thousand dollar API bills.

---

## 1. Model Parameters vs Generation Parameters

This is the most critical distinction in AI engineering:

```text
┌─────────────────────────────────────────────────────────────┐
│ 1. Model Parameters (Weights)                               │
│    - Internal learned numbers (e.g., 8B, 70B, 405B)         │
│    - Established during Pre-training & Fine-tuning          │
│    - Frozen and immutable at runtime                        │
├─────────────────────────────────────────────────────────────┤
│ 2. Generation Hyperparameters (Runtime Configuration)       │
│    - External controls passed in API payload                │
│    - Temperature, Top-p, Max Tokens, Frequency Penalty      │
│    - Modifiable on every individual API call                │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. The Context Window

The **Context Window** is the maximum total number of tokens a model can process in a single request.

$$\text{Total Tokens} = \text{Input Prompt Tokens} + \text{Generated Output Tokens} \le \text{Context Window Limit}$$

```text
┌─────────────────────────────────────────────────────────────┐
│ Context Window Capacity (e.g., 128,000 Tokens)              │
├────────────────────────────────────────┬────────────────────┤
│ Input Prompt (System + History + User) │ Generated Output   │
│ (e.g., 118,000 tokens)                 │ (Max 10,000 tokens)│
└────────────────────────────────────────┴────────────────────┘
```

### Context Window vs Persistent Memory
An LLM has **no persistent memory** between independent API calls.

When you chat with ChatGPT or Claude and it remembers what you said five minutes ago, the frontend application is silently re-sending the **entire previous conversation history** in every new request.

Once the total conversation length exceeds the model's context window limit, old messages must be truncated, summarized, or stored in an external vector database (RAG).

### The "Lost in the Middle" Phenomenon
Even in models with massive 1,000,000+ token context windows, attention mechanisms do not distribute focus uniformly across huge prompts:
- Models recall information placed at the **very beginning** (system prompt) and **very end** (immediate query) with highest accuracy.
- Facts buried in the middle of a 200-page document can suffer from retrieval degradation.

---

## 3. The Developer's Parameter Guide

Here is how to configure standard API generation parameters:

| Parameter | Type | Default Range | Purpose |
| :--- | :--- | :--- | :--- |
| **`temperature`** | Float | `0.0` to `2.0` | Controls randomness. Lower = deterministic & focused; Higher = creative & varied. |
| **`top_p`** | Float | `0.0` to `1.0` | Nucleus sampling. Limits choices to top cumulative probability mass. |
| **`max_tokens`** | Integer | `1` to `4096+` | The hard ceiling on the number of tokens the model can generate in its reply. |
| **`presence_penalty`** | Float | `-2.0` to `2.0` | Penalizes tokens based on whether they have already appeared in the text. Encourages introducing new topics. |
| **`frequency_penalty`**| Float | `-2.0` to `2.0` | Penalizes tokens based on how many times they have appeared. Prevents verbatim word repetition. |
| **`stop`** | Array | `["\n", "###"]` | Custom string delimiters that instantly halt generation when emitted. |

---

## Recommended Presets by Use Case

### 1. Structured Data, SQL, and Code Generation
```json
{
  "temperature": 0.0,
  "top_p": 1.0,
  "response_format": { "type": "json_object" }
}
```
*Goal:* Maximum determinism, strict adherence to syntax rules, zero random deviation.

### 2. General Q&A, Technical Documentation, and Summarization
```json
{
  "temperature": 0.3,
  "top_p": 0.9
}
```
*Goal:* Clear, factual, coherent responses with natural sentence variation.

### 3. Creative Brainstorming and Marketing Copy
```json
{
  "temperature": 0.85,
  "top_p": 0.95,
  "presence_penalty": 0.5
}
```
*Goal:* High lexical diversity, novel analogies, and exploration of uncommon associations.

> [!TIP]
> **Best Practice:** Alter *either* `temperature` or `top_p`, not both simultaneously, to maintain predictable control over sampling dynamics.

---

## Common Misconceptions

- **Misconception:** *A 1M token context window means you should dump all your company documents into the prompt.*
  **Reality:** Huge context prompts are expensive, introduce higher latency (slower prefill), and can suffer from "lost in the middle" retrieval degradation. Hybrid architectures with RAG (Retrieval-Augmented Generation) remain more cost-effective and accurate for large knowledge bases.
- **Misconception:** *`max_tokens` limits how long your input prompt can be.*
  **Reality:** `max_tokens` restricts only the **output** generation length. Your prompt length is bounded only by the overall context window minus `max_tokens`.

---

## Key Takeaways

> [!IMPORTANT]
> - **Model Parameters** are frozen neural network weights; **Generation Parameters** are runtime request options.
> - The context window is shared between input prompt and generated output.
> - LLMs have zero persistent state; conversation memory requires re-sending previous turns.
> - Use low temperature ($0.0$) for deterministic code/data extraction, and moderate temperature ($0.3 - 0.7$) for general reasoning.

---

## The Big Picture: You Have Mastered LLM Fundamentals!

Congratulations! You have completed **Stage 02: LLM Fundamentals**.

Let's review the journey so far:

```text
┌─────────────────────────────────────────────────────────────┐
│ Stage 01: AI Fundamentals (Completed)                      │
│ - AI vs ML vs Deep Learning vs Generative AI                │
│ - Supervised, Unsupervised, Reinforcement Learning          │
│ - Neural Networks & Representation Learning                 │
├─────────────────────────────────────────────────────────────┤
│ Stage 02: LLM Fundamentals (Completed)                     │
│ - Large Language Models & Foundation Architectures          │
│ - Tokens, Tokenization & Token Economics                    │
│ - Vector Embeddings & Contextual Space                      │
│ - Transformers, Self-Attention & Q-K-V Mechanics            │
│ - Pre-training, SFT, RLHF Alignment & Inference Loops       │
│ - Context Windows, Sampling & Hyperparameters               │
├─────────────────────────────────────────────────────────────┤
│ Stage 03: RAG & Vector Knowledge Systems (Next Stage)       │
│ - Vector Databases, Chunking & Semantic Search              │
│ - Hybrid Retrieval & Knowledge Grounding                    │
│ - Building Production RAG Pipelines                         │
├─────────────────────────────────────────────────────────────┤
│ Stage 04: AI Agents & Autonomous Execution                  │
│ - Tool Calling & Function Execution                         │
│ - ReAct Loops, Planning & Multi-Agent Systems               │
└─────────────────────────────────────────────────────────────┘
```

You now possess the foundational engineering intuition required to build real-world AI applications, vector search pipelines, and autonomous agents.
