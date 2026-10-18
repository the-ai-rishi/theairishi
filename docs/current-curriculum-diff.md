# Current curriculum diff

Date: 2026-10-02.

Authoritative snapshot: `data/curriculum/forge-120.json`.
The website does not read a private authoring repository at runtime, and this public repository does not publish that repository's URL or history.

This file is the short OLD → NEW trail. The longer matrix is [curriculum-migration-report.md](curriculum-migration-report.md).

## Programme

| | OLD | NEW |
|---|---|---|
| Public name | DevOps Engineer Mastery | FORGE-120 |
| Shape | 11 phases. AI described as a later course | 10 phases. Retrieval and controlled tool use are days 97–105 |
| Day 120 | Re-score the matrix | Final reconstruction and defence. An independent-engineering checkpoint, not instant mastery |
| Capstone | FastAPI + Postgres chain through Helm and rollback | forge-api: one service through retrieval, controlled tool use, evaluation, and architecture defence |
| Internal id | `devops-engineer-mastery` | Unchanged, so lesson frontmatter and local progress keys stay valid |

## Phases

| OLD | NEW |
|---|---|
| Foundations, then a longer Kubernetes block (37–62) | Foundations, days 1–12 |
| Azure inside a different range | Azure networking and identity, days 13–18 |
| CI earlier, without a separate reliability stage before AI | CI and delivery, days 19–26 |
| Terraform mixed with later Helm | Terraform and application, days 27–36 |
| Kubernetes 37–62 | Kubernetes, days 37–60 |
| AKS 63–76 | AKS, days 61–74 |
| Terraform + Helm from 77 | Infrastructure delivery, days 75–88 |
| Operate, then design and resume | Reliability, days 89–96 |
| Design + resume 97–108 | RAG and controlled tool use, days 97–105 |
| War room 109–120 | Design and defence, days 106–120 |

## Days that change the meaning

| Day | OLD site title | NEW title |
|---|---|---|
| 1 | Shell from zero | Contract, repo, honesty |
| 12 | Foundations mock | M1 mock + LLM sampler |
| 59 | Local capstone deploy | First LLM helper read-only |
| 97 | CI for many services | RAG terms and chunking |
| 98 | — | Retrieve, cite, poison test |
| 99 | — | Review-only agent loop |
| 100 | — | Deterministic policy checks |
| 101 | Env + artifact promotion | MCP protocol and tool boundary |
| 102 | — | Golden eval harness |
| 103 | — | Injection lab |
| 104 | — | Pin, kill switch and AI telemetry |
| 105 | Capstone story | AI infrastructure awareness |
| 120 | Re-score the matrix | Final reconstruction and defence |

115 of 120 titles changed in the import. The site catalog and `programs.json` use the new titles. `scripts/check-brand-language.js` fails if those titles, the 10 phase names, the nine gate positions, or the forge-api capstone drift.

## AI, reliability, assessment, after day 120

| Topic | OLD | NEW |
|---|---|---|
| When AI enters | “AI is later”, as a separate course | Not day 1. Day 12 sampler. Day 59 read-only helper. Control layer is days 97–105 |
| RAG | Not a phase | Days 97–98 |
| Agents | Planned “Agentic AI” course | Day 99 review-only loop. Multiple agent SDKs stay optional after day 120 |
| MCP | Absent | Day 101 |
| Evaluation | Absent as a stage | Day 102 |
| Injection | Absent as a stage | Day 103 |
| AI telemetry | Absent | Day 104 pin, kill switch, and AI telemetry |
| Limit | — | Day 105 is awareness, not an ML-infrastructure claim |
| Reliability | Folded into operate | Days 89–96: change gates, retries, SLI, alert, incident, evidence boundary |
| Gates | Not shown as capability gates | D12, D26, D36, D60, D74, D88, D96, D105, D120 |
| Post-120 | AI course, then an agent course | Deepen by requirement. CUDA, model training, multiple agent SDKs, multiple vector databases, portal implementation, and service-mesh depth stay optional |

## Copy contradictions fixed in this pass

| Contradiction | Resolution |
|---|---|
| Homepage still said “The path is open” and “the day this system is holding” | Replaced with the programme outcome and the capstone sentence from `programs.json` |
| Boot copy said “Dormant” / “Signal” | Removed |
| Progress said “days lit” | Says “days complete”, and only after local progress hydrates |
| Control heading was a slogan | Uses the phase names Reliability, and RAG and controlled tool use |
| Operator docs still told authors the live title was DevOps Engineer Mastery | Those instructions now say FORGE-120. Historical notes still name the old title |
| Hero could ignore `heroPrimaryCtaHref` because of operator precedence | The configured href is used |
