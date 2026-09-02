---
title: "How LLMs Understand Text"
course: "ai"
courseTitle: "Artificial Intelligence & LLMs"
courseOrder: 1
stage: "LLM Fundamentals"
stageOrder: 2
lesson: 3
topic: "ai"
status: "published"
description: "Discover vector embeddings, semantic vector spaces, contextual representations, and positional encoding that allow models to process language meaning."
---

# How LLMs Understand Text

Once raw text is converted into integer Token IDs (like `[15496, 9552]`), the model faces a fundamental challenge:

An integer ID has no inherent semantic meaning. To a computer, token ID `405` is mathematically no closer to token ID `406` than it is to token ID `98231`.

To understand relationships, synonyms, analogies, and grammatical roles, language models project token IDs into a continuous geometric coordinate space known as an **Embedding Space**.

---

## Why does this matter?

Embeddings are the cornerstone of modern AI architectures. Beyond LLM text comprehension, embeddings power:

- **Semantic Search:** Finding documents by concept rather than exact keyword match.
- **Retrieval-Augmented Generation (RAG):** Locating relevant enterprise knowledge to feed into an LLM prompt.
- **Classification & Clustering:** Grouping customer tickets, detecting duplicates, and identifying anomalies.
- **Recommendation Systems:** Suggesting articles, videos, or products with similar semantic profiles.

---

## What is an Embedding?

An **Embedding** is a dense numerical vector (an array of floating-point numbers) that represents the semantic meaning of a piece of text.

Instead of representing the word `"king"` as a single arbitrary integer, the model represents it as a point in a high-dimensional space (typically 4,096 to 12,288 dimensions in frontier models):

$$\text{Vector("king")} = [0.241, -0.812, 0.054, 0.639, \dots, -0.192]$$

```text
Token ID: 4958 ──► [ Embedding Lookup Table ] ──► Dense Vector (e.g. 4096 floats)
```

In this geometric space, words with related meanings, shared contexts, or similar functional roles are mapped to coordinates that sit close to one another.

---

## The Geometry of Semantic Space

In a well-trained embedding space, distances and geometric directions correspond to semantic relationships:

```text
                  ▲ Y (Royalty Dimension)
                  │
        King ●    │    ● Queen
                  │
                  │
        Man  ●    │    ● Woman
                  │
  ────────────────┼────────────────► X (Gender Dimension)
                  │
```

### Semantic Relationships as Vector Arithmetic
Because semantic concepts map to vector directions, mathematical operations capture intuitive relationships:

$$\text{Vector("King")} - \text{Vector("Man")} + \text{Vector("Woman")} \approx \text{Vector("Queen")}$$

Similarly, geographical relationships emerge naturally:

$$\text{Vector("Paris")} - \text{Vector("France")} + \text{Vector("Japan")} \approx \text{Vector("Tokyo")}$$

---

## Measuring Similarity: Cosine Similarity

To calculate how semantically related two words, sentences, or documents are, we measure the angle between their embedding vectors using **Cosine Similarity**:

$$\text{Cosine Similarity}(\vec{A}, \vec{B}) = \frac{\vec{A} \cdot \vec{B}}{\|\vec{A}\| \|\vec{B}\|}$$

```text
┌─────────────────────────────────────────────────────────────┐
│ Angle = 0°   ──► Cosine = 1.0   ──► Identical meaning       │
│ Angle = 90°  ──► Cosine = 0.0   ──► Completely unrelated    │
│ Angle = 180° ──► Cosine = -1.0  ──► Opposite meaning        │
└─────────────────────────────────────────────────────────────┘
```

- `"dog"` and `"puppy"` have a cosine similarity near `0.92`.
- `"dog"` and `"database"` have a cosine similarity near `0.05`.

---

## Static Embeddings vs Contextual Embeddings

Early embedding systems (like Word2Vec and GloVe from 2013–2014) assigned a single static vector to every word in the dictionary.

- **The Polysemy Problem:** What does the word `"bank"` mean?
  - *"He sat on the river **bank**."* (Geography/Nature)
  - *"She deposited money in the **bank**."* (Finance)

With static embeddings, `"bank"` always had the exact same coordinate vector regardless of context.

### Modern Contextual Embeddings in Transformers
Modern LLMs resolve this problem through **Contextual Representation**. 

1. A token starts with an initial base embedding.
2. As the token passes through the layers of the Transformer neural network, it interacts with every other token in the prompt through the *Attention Mechanism*.
3. The embedding dynamically shifts its coordinates in response to neighboring words.

In a sentence about fishing, the vector for `"bank"` shifts toward geographical coordinates; in a sentence about loans, it shifts toward financial coordinates.

---

## Positional Encoding: Giving Order to Words

Language depends strictly on word order:

- *"The cat ate the fish."*
- *"The fish ate the cat."*

By default, neural attention mechanisms process all tokens simultaneously in parallel—they are mathematically unordered.

To inject sequence awareness, the model adds a **Positional Encoding** vector to each token's embedding before feeding it into the network:

$$\text{Final Input Vector} = \text{Token Embedding} + \text{Positional Embedding}$$

Modern LLMs use advanced positional techniques like **RoPE (Rotary Position Embeddings)**, which encode relative distance between tokens mathematically via rotational matrices, allowing models to scale to long context lengths.

---

## Common Misconceptions

- **Misconception:** *Embeddings represent conscious understanding of human concepts.*
  **Reality:** Embeddings represent statistical co-occurrence and contextual distributions in mathematical vector space.
- **Misconception:** *Any two embedding models can be compared directly.*
  **Reality:** Embedding spaces are unique to the model that trained them. A vector from OpenAI's `text-embedding-3` cannot be compared with a vector from `Cohere` or `BERT` without projecting across shared spaces.

---

## Key Takeaways

> [!IMPORTANT]
> - Embeddings map discrete token IDs into continuous, high-dimensional vector coordinates.
> - Geometric distance (cosine similarity) in vector space reflects semantic similarity in human language.
> - Modern Transformers generate **contextual embeddings**, shifting a word's representation based on surrounding text.
> - Positional encodings ensure the neural network recognizes the grammatical order of tokens in a sequence.

---

## What comes next?

Now that we understand how tokens become contextualized numerical vectors, what neural network architecture actually processes these vectors to produce intelligence?

In **Lesson 04**, we explore **Transformers Explained**—the groundbreaking architecture powering all modern foundation models.
