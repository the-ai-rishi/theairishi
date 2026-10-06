# Curriculum migration

Date: 2026-10-02.

## Sources

The public catalog is `data/curriculum/forge-120.json` and `content/config/programs.json`.
A private authoring snapshot was used while the catalogue was prepared. This repository does not publish that snapshot's URL, commit, or pack files, and the site does not fetch it at runtime.

## Migration matrix

| Area | Old repo / previous site catalog | New repo | Website impact |
|---|---|---|---|
| Programme identity | DevOps Engineer Mastery. Eleven phases. AI described as later. | FORGE-120. Hands-on path to DevOps, Kubernetes, AKS, reliability, retrieval, and controlled tool use. | Public title, description, SEO, and homepage copy now say FORGE-120. Internal content id stays `devops-engineer-mastery` so published lesson frontmatter and local progress keys do not break. `/programs/devops` remains. `/programs/forge-120` aliases the same program. |
| Roadmap structure | 11 phases. Kubernetes 37–62. AKS 63–76. Design + resume 97–108. War room 109–120. | 10 stages. Kubernetes 37–60. AKS 61–74. Infrastructure delivery 75–88. Reliability 89–96. RAG and controlled tool use 97–105. Design and defence 106–120. | `programs.json` phases and all 120 day phase ids regenerated. 115 day titles changed. |
| Days 1–30 | Site titles such as “Shell from zero”, “Foundations mock”, “First Terraform, no-AI”. | Contract, repo, honesty through the early application days. Day 12 is “M1 mock + LLM sampler”. | Catalog titles and goals replaced from the roadmap. Published Day 1 lesson reframed to the contract, first commit, and evidence labels. |
| Days 31–60 | Kubernetes block ran longer and ended in an interview gate. | Kubernetes ends at day 60. Day 59 is “First LLM helper read-only”. | The site no longer calls day 59 a local capstone deploy. |
| Days 61–90 | AKS started at 63. Terraform + Helm at 77. Operate at 89. | AKS 61–74. Infrastructure delivery 75–88. Reliability begins at 89. | Phase ranges moved. Day 75 is Terraform modules, not an AKS credential day. |
| Days 91–120 | Design, resume, and war room. No RAG stage. | Reliability through 96, retrieval and controlled tool use 97–105, design and defence 106–120. | This is the structural change. Day 97 is “RAG terms and chunking”, not “CI for many services”. |
| AI content | Treated as a future course after the DevOps program. | Inside the 120 days, late. Day 12 sampler. Day 59 read-only helper. Days 97–105 are the control layer. | Homepage and about no longer say AI and Agentic AI come later as empty courses. |
| RAG | Not a phase. | Days 97–98: terms, chunking, retrieve, cite, poison test. | Retrieval row on the homepage, labeled with those day titles. |
| Tool use | Not a phase. | Day 99 review-only agent loop. Day 100 deterministic policy checks. | The control loop is a real set of buttons, not a particle metaphor. |
| Agents | A planned future “Agentic AI” track. | Review-only loop with a disable path. Multiple agent SDKs are post-120 and optional. | The future-path widget no longer advertises a separate agent course. |
| MCP | Absent. | Day 101, protocol and tool boundary. | Boundary diagram: model, MCP boundary, allowed tool, blocked tool, resource. |
| Evaluation | Absent as a stage. | Day 102, golden eval harness. | Fixture shows a missing citation failing an assertion. Labeled as a teaching fixture, not a live model. |
| Security / injection | Absent as a stage. | Day 103, injection lab. | Ordinary question allows. Hidden instruction in retrieved text blocks. |
| Observability | Operate phase, infrastructure. | Reliability days 89–96, plus day 104 pin, kill switch, and AI telemetry. | Gates list includes Operate at D96. Day 104 is named in the control panel. No fake live metrics. |
| Capstone | FastAPI + Postgres → Docker → CI → ACR → Terraform → AKS → Helm → identity → monitor → rollback. | forge-api. One service through retrieval, controlled tool use, evaluation, and architecture defence. | `content/projects/forge-api.md` and the program `capstone` field follow `roadmap/05-CAPSTONE.md`. |
| Assessment gates | Not represented as capability gates. | Nine gates: Foundation, CI, Containers, Kubernetes, AKS / identity, Terraform / Helm, Operate, AI / tool use, War room. | Rendered from `forge-120.json`, not from a progress percentage. |
| Interview preparation | Implied by war-room days. | Seven questions from day 1. Closed-note in days 110–120. | Stored on the snapshot. Not turned into a fake interview product. |
| Future direction | AI, then agents, after the program. | Deepen by requirement. CUDA, model training, multiple agent SDKs, multiple vector databases, portal implementation, and service-mesh depth stay optional. | About and the path section say this. Day 105 is awareness, not an ML-infrastructure claim. |

## What was not copied onto the public site

The roadmap’s full daily labs stay in the private repository. The website publishes a day only when a lesson file is published. Today that is still days 1–3 plus the older archive notes. Unpublished days are titles, goals, and phase membership. That is intentional: the catalog is complete, the lessons are not all written here yet.

## Internal id

`featuredProgramId` remains `devops-engineer-mastery`. Published markdown uses `course:` and `program:` with that id, and continue-learning is keyed from the catalog. Renaming the id would orphan those lessons and local progress. The learner-facing name is FORGE-120.

## Old references

Learner-facing copy in `platform.json`, `courses.json`, the three published day lessons, the homepage, about, README, and `docs/START-HERE.md` no longer describe the programme as “DevOps Engineer Mastery” with AI postponed. Historical research notes and the operator test fixtures still mention the old name where they are describing the previous catalog or a schema example. `docs/DEVOPS-ENGINEER-MASTERY.md` is the previous operator note; this file supersedes it for curriculum truth.
