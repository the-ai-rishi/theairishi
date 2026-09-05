---
title: "Tokens and Tokenization"
course: "ai"
courseTitle: "Artificial Intelligence & LLMs"
courseOrder: 1
stage: "LLM Fundamentals"
stageOrder: 2
lesson: 2
topic: "ai"
status: "published"
description: "Learn how language models convert raw text into discrete numerical tokens, why subword tokenization rules the field, and how it impacts latency, costs, and context."
---

# Tokens and Tokenization

Computers and neural networks do not understand words, characters, or sentences directly. They only perform mathematical operations on numerical matrices and vectors.

**Tokenization** is the translation layer that breaks raw human text into discrete chunks called **Tokens**, and assigns each token a unique numerical ID.

Understanding tokenization is vital for software engineers because tokens directly dictate API costs, memory consumption, context window limits, and model latency.

---

## Why does this matter?

In traditional software development, strings are measured in bytes or characters. When working with LLMs, the universal unit of measurement is the **Token**:

1. **Pricing & Billing:** Cloud LLM providers (OpenAI, Anthropic, Google) charge per million input and output tokens.
2. **Context Window Limits:** A model with a "128k context window" can process at most 128,000 tokens of prompt and response combined.
3. **Latency & Throughput:** Inference speed is measured in *Tokens Per Second (TPS)*.
4. **Model Behavior:** If a tokenizer splits a domain-specific word, URL, or JSON schema inefficiently, the model may struggle with accuracy or waste context space.

---

## What is a Token?

A token is the atomic unit of text processed by an LLM. 

Depending on the language and tokenizer design, a token can be:
- A complete common word (`"apple"`, `"the"`, `"learn"`)
- A subword or syllable (`"un"`, `"believ"`, `"able"`)
- A single character (`"a"`, `"Z"`, `";"`)
- Spaces, indentation tabs, and punctuation marks (`" "`, `"\n\n"`, `"{"`)

```text
Input String:   "Understanding artificial intelligence is essential."
Tokens:         ["Understand", "ing", " artificial", " intelligence", " is", " essential", "."]
Token IDs:      [8732, 278, 14920, 11043, 374, 10245, 13]
```

> [!TIP]
> **Rule of Thumb for English:**
> - $1\text{ token} \approx 4\text{ characters}$ of English text.
> - $1\text{ token} \approx 0.75\text{ words}$.
> - $100\text{ tokens} \approx 75\text{ words}$.

---

## The Three Approaches to Tokenization

Why not just split text by whole words or by individual characters?

```text
┌────────────────────────────────────────────────────────────────────────┐
│ 1. Word-Level Tokenization                                             │
│    "unbelievable" ──► ["unbelievable"]                                 │
│    Problem: Vocabulary explodes to millions of words. Fails on typos.  │
├────────────────────────────────────────────────────────────────────────┤
│ 2. Character-Level Tokenization                                        │
│    "unbelievable" ──► ['u','n','b','e','l','i','e','v','a','b','l','e']│
│    Problem: Sequence lengths become massive; consumes compute quickly. │
├────────────────────────────────────────────────────────────────────────┤
│ 3. Subword Tokenization (Modern Standard)                              │
│    "unbelievable" ──► ["un", "believ", "able"]                         │
│    Advantage: Compact vocabulary (~32k–128k) while handling ANY word. │
└────────────────────────────────────────────────────────────────────────┘
```

Modern LLMs use **Subword Tokenization algorithms** (such as Byte-Pair Encoding or WordPiece):

- Common words remain single compact tokens (`"the"`, `"system"`, `"database"`).
- Rare or compound words are cleanly decomposed into recognized subword syllables (`"microservices"` $\to$ `["micro", "services"]`).
- Unknown words or typos are broken down to character bytes, ensuring the model never crashes on an "out-of-vocabulary" word.

---

## The Tokenization Pipeline

The journey from text to model inputs follows a strict linear sequence:

```text
┌──────────────┐     ┌───────────┐     ┌───────────┐     ┌────────────────┐
│  Raw Text    ├───► │ Tokenizer ├───► │ Token IDs ├───► │ Embedding      │
│  "Hello AI"  │     │ (BPE/Vocab│     │ [15496,   │     │ (Vectorization)│
└──────────────┘     └───────────┘     │  9552]    │     └────────────────┘
                                       └───────────┘
```

1. **Tokenization (Encoding):** The string is segmented into string tokens using a pre-compiled vocabulary table.
2. **Numerical Mapping (Token IDs):** Each token string is mapped to its unique integer ID within the model's vocabulary dictionary (e.g., `"Hello"` $\to 15496$).
3. **Model Processing:** The integer IDs are passed to the neural network's embedding layer.
4. **Detokenization (Decoding):** When the model outputs new token IDs, the tokenizer converts the numbers back into readable human text strings.

---

## Real-World Engineering Implications

### 1. Code Tokenization
In source code, spaces and indentation are syntactically critical. Modern tokenizers are specifically trained to represent common indentation blocks (like 2 or 4 leading spaces) as single tokens, reducing the token count of programming files.

```python
# Inefficient tokenizer: 4 separate space tokens
# Efficient tokenizer: 1 dedicated "    " token
```

### 2. The Non-English "Token Tax"
Because early tokenizers were trained predominantly on English text, non-Latin scripts (such as Hindi, Arabic, Japanese, or Cyrillic) and accented characters are often fragmented into multiple byte tokens per character.

- English word `"Philosophy"` $\to 1\text{ token}$.
- Hindi translation `"दर्शनशास्त्र"` $\to 4\text{ to }8\text{ tokens}$.

This means non-English prompts can cost more and consume context window capacity faster. Modern frontier models (GPT-4o, Llama 3, Gemini) have expanded vocabulary sizes from 32,000 to over 128,000+ tokens to dramatically reduce this multilingual penalty.

### 3. Arithmetic and Number Tokenization
LLMs often struggle with large-number arithmetic because tokenizers group digits unpredictably:
- `"1000"` might be 1 token (`[1000]`).
- `"10005"` might be split into 2 tokens (`[100]`, `[05]`).
Because the model sees fragmented numerical tokens rather than unified place-value representations, performing long manual arithmetic requires chain-of-thought scratchpads or external tool calling.

---

## Common Misconceptions

- **Misconception:** *1 word always equals 1 token.*
  **Reality:** In English, 1 word is roughly 1.3 tokens on average. Code, punctuation, and non-English scripts often require significantly more tokens per word.
- **Misconception:** *All LLMs use the same tokenizer.*
  **Reality:** Every model family (GPT, Llama, Claude, Gemini) trains its own custom tokenizer with distinct vocabulary sizes and merge rules. A prompt of 500 tokens in GPT-4 may be 460 tokens in Claude and 520 in Llama.

---

## Key Takeaways

> [!IMPORTANT]
> - A token is a subword chunk of text and the fundamental computational unit of all modern LLMs.
> - Subword tokenization combines the efficiency of word-level models with the flexibility of character-level models.
> - Token count determines API pricing, context consumption, and generation latency.
> - The pipeline is: $\text{Raw Text} \to \text{Tokens} \to \text{Token IDs (Integers)} \to \text{Model}$.

---

## What comes next?

Now that text is converted into discrete integer Token IDs, how does a neural network understand the *meaning* and relationships between those tokens?

In **Lesson 03**, we explore **How LLMs Understand Text** through high-dimensional vector embeddings and semantic space.
