---
title: "forge-api"
description: "The longitudinal capstone for FORGE-120. One service that grows from a repository into retrieval, controlled tool use, and architecture defence."
slug: "forge-api"
date: "2026-10-02"
category: "Platform engineering"
technologies: ["Python", "FastAPI", "Docker", "Terraform", "Kubernetes", "AKS"]
difficulty: "Progressive"
status: "In Progress"
topic: "devops"
enabled: true
featured: true
---

# forge-api

One service for all 120 days of FORGE-120. This is a learning project, not employer production experience.

## One system

```text
source
→ test
→ container
→ CI
→ immutable artifact
→ Kubernetes
→ AKS
→ workload identity
→ Key Vault
→ observability
→ reliability
→ retrieval
→ controlled tool use
→ evaluation
→ architecture defence
```

## Stage targets

| Days | Target state by the end |
|---|---|
| 1–18 | Repository and evidence baseline, health script, Python utility, network and identity notes |
| 19–28 | CI workflow, artifact contract, OIDC model, Terraform plan and state foundation |
| 29–36 | Tested FastAPI health and readiness, container, Compose, non-root image, scan and provenance |
| 37–60 | Kubernetes workloads, probes, networking, RBAC, storage, DNS, and failure troubleshooting |
| 61–74 | AKS and ACR path, Workload Identity, Key Vault, monitoring, and cleanup |
| 75–88 | Terraform modules and state, Helm render, release, and rollback |
| 89–96 | Change gates, reliability signals, SLI, alerting, incident response, evidence boundary |
| 97–105 | Local RAG, citations, injection tests, review-only tool flow, deterministic policy, evaluation, disable path |
| 106–120 | Architecture defence, platform interface, trade-offs, closed-note troubleshooting |

## Evidence

- **OPERATED** — actually run in the named environment.
- **GENERATED** — produced by a model or tool.
- **SIMULATED** — local, fixture, or paper stand-in.
- **BLOCKED** — attempted, but an external dependency prevented proof.

A complete design does not make an unverified runtime path green. Future artifacts are added only when that day of the roadmap asks for them.
