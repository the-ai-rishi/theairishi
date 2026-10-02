#!/usr/bin/env python3
"""Normalize the FORGE-120 roadmap into the website catalog.

Operator workflow (the curriculum repo is private and is not fetched at runtime):

  python3 scripts/import-forge-120.py /path/to/ai-devops-engineer-mastery

Writes:
  data/curriculum/forge-120.json
  and updates the featured program in content/config/programs.json

The public JSON does not include the private repository URL.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROGRAMS = ROOT / "content" / "config" / "programs.json"
OUT = ROOT / "data" / "curriculum" / "forge-120.json"

PHASES = [
    ("phase-01", 1, "Foundations", 1, 12, "Linux, Git, HTTP, DNS, TLS, processes and evidence-driven practice"),
    ("phase-02", 2, "Azure networking and identity", 13, 18, "VNet, NSG, private access, DNS and identity foundations"),
    ("phase-03", 3, "CI and delivery", 19, 26, "Pipelines, artifacts, environments, OIDC and delivery portability"),
    ("phase-04", 4, "Terraform and application", 27, 36, "Terraform foundations, FastAPI, Docker and supply-chain basics"),
    ("phase-05", 5, "Kubernetes", 37, 60, "Workloads, networking, storage, scheduling, security and troubleshooting"),
    ("phase-06", 6, "AKS", 61, 74, "Azure networking, ACR, Workload Identity, Key Vault and monitoring"),
    ("phase-07", 7, "Infrastructure delivery", 75, 88, "Terraform modules/state, Helm, promotion, rollback and cost"),
    ("phase-08", 8, "Reliability", 89, 96, "Change gates, retries, SLI/SLO, alerting, incidents and evidence boundaries"),
    ("phase-09", 9, "RAG and controlled tool use", 97, 105, "Retrieval, citations, evaluation, policy checks and AI-infrastructure awareness"),
    ("phase-10", 10, "Design and defence", 106, 120, "Architecture, platform interfaces, trade-offs and closed-note war rooms"),
]

GATES = [
    {"id": "foundation", "name": "Foundation", "around": "D12", "evidence": "Git recovery, slow-host triage, process/service failure and HTTP evidence"},
    {"id": "ci", "name": "CI", "around": "D26", "evidence": "blank-file pipeline work, one failure, OIDC trace and CI portability review"},
    {"id": "containers", "name": "Containers", "around": "D36", "evidence": "multi-stage non-root image, runtime diagnosis and provenance reasoning"},
    {"id": "kubernetes", "name": "Kubernetes", "around": "D60", "evidence": "empty EndpointSlice, CrashLoop, ImagePull/Pending/OOM or RBAC variation and unfamiliar diagnosis"},
    {"id": "aks-identity", "name": "AKS / identity", "around": "D74", "evidence": "AKS path, ACR pull identity, Workload Identity trace, Key Vault result/blocker and cleanup"},
    {"id": "terraform-helm", "name": "Terraform / Helm", "around": "D88", "evidence": "state/lock, module interface, dangerous-plan review and Helm render/upgrade/rollback"},
    {"id": "operate", "name": "Operate", "around": "D96", "evidence": "measurable SLI, actionable alert, incident recovery and explicit evidence boundary"},
    {"id": "ai-tool-use", "name": "AI / tool use", "around": "D105", "evidence": "grounding, injection test, schema/allowlist, deterministic block, evaluation and disable path"},
    {"id": "war-room", "name": "War room", "around": "D120", "evidence": "unfamiliar failure, evidence-first diagnosis, safe mitigation, recovery verification and design defence"},
]

CAPSTONE_STAGES = [
    {"days": "D1–18", "state": "repository/evidence baseline, health script, Python utility, network and identity path notes"},
    {"days": "D19–28", "state": "CI workflow, artifact contract, OIDC model, Terraform plan/state foundation"},
    {"days": "D29–36", "state": "tested FastAPI health/readiness service, container, Compose, non-root image, scan/provenance"},
    {"days": "D37–60", "state": "Kubernetes workloads, probes, networking, RBAC, storage/DNS and failure troubleshooting"},
    {"days": "D61–74", "state": "AKS/ACR path, Workload Identity, Key Vault, monitoring and cleanup"},
    {"days": "D75–88", "state": "Terraform modules/state, Helm rendering/release/rollback and final system path"},
    {"days": "D89–96", "state": "change gates, reliability signals, SLI, alerting, incident response and evidence boundary"},
    {"days": "D97–105", "state": "local RAG, citations, injection tests, review-only tool flow, deterministic policy, evaluation and disable path"},
    {"days": "D106–120", "state": "architecture defence, platform interface, trade-offs, closed-note troubleshooting and final evidence review"},
]

POST_120_KEEP_OPTIONAL = [
    "CUDA and model-training specialisation",
    "multiple agent SDKs",
    "multiple vector databases",
    "portal implementation",
    "service-mesh depth",
]


def phase_for(day: int) -> tuple[str, str, int]:
    for phase_id, number, name, start, end, _summary in PHASES:
        if start <= day <= end:
            return phase_id, name, number
    raise SystemExit(f"day {day} is outside the roadmap stages")


def parse_days(roadmap: Path) -> list[dict]:
    text = "\n".join(
        (roadmap / name).read_text(encoding="utf-8")
        for name in (
            "01-DAYS-001-030.md",
            "02-DAYS-031-060.md",
            "03-DAYS-061-090.md",
            "04-DAYS-091-120.md",
        )
    )
    days = []
    for part in re.split(r"(?=^### DAY \d+ — )", text, flags=re.M):
        match = re.match(r"### DAY (\d+) — (.+)\n", part)
        if not match:
            continue
        day = int(match.group(1))

        def field(name: str) -> str:
            found = re.search(rf"\*\*{re.escape(name)}:\*\* (.+)", part)
            return found.group(1).strip() if found else ""

        topics = []
        block = re.search(r"\*\*Key topics:\*\*\n((?:  - .+\n)+)", part)
        if block:
            topics = [line.strip()[2:].strip() for line in block.group(1).splitlines() if line.strip().startswith("-")]
        phase_id, phase_name, phase_number = phase_for(day)
        days.append(
            {
                "day": day,
                "title": match.group(2).strip(),
                "phaseId": phase_id,
                "phase": phase_name,
                "phaseNumber": phase_number,
                "goal": field("Goal"),
                "concepts": topics,
                "capstoneConnection": field("How this helps forge-api"),
                "next": field("Next day"),
            }
        )
    days.sort(key=lambda item: item["day"])
    if [item["day"] for item in days] != list(range(1, 121)):
        raise SystemExit("expected contiguous days 1–120")
    for item in days:
        if not item["title"] or not item["goal"]:
            raise SystemExit(f"day {item['day']} is missing a title or goal")
    return days


def slug_for(day: int, previous: dict[int, str]) -> str:
    if day in previous:
        return previous[day]
    width = 3 if day >= 100 else 2
    return f"day-{day:0{width}d}"


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("usage: python3 scripts/import-forge-120.py /path/to/curriculum-repo")
    roadmap = Path(sys.argv[1]) / "roadmap"
    if not (roadmap / "00-ROADMAP.md").is_file():
        raise SystemExit(f"roadmap not found at {roadmap}")
    days = parse_days(roadmap)
    catalog = json.loads(PROGRAMS.read_text(encoding="utf-8"))
    program = next(item for item in catalog["programs"] if item["id"] == catalog["featuredProgramId"])
    previous = {item["day"]: item["slug"] for item in program["days"]}
    old_titles = {item["day"]: item["title"] for item in program["days"]}

    snapshot_days = []
    program_days = []
    for item in days:
        slug = slug_for(item["day"], previous)
        snapshot_days.append({**item, "slug": slug})
        program_days.append(
            {
                "day": item["day"],
                "phaseId": item["phaseId"],
                "slug": slug,
                "title": item["title"],
                "summary": item["goal"],
            }
        )

    program["title"] = "FORGE-120"
    program["durationLabel"] = "120 days · about 275 hours"
    program["description"] = (
        "A 120-day hands-on path from fundamentals to DevOps, Kubernetes, AKS, reliability, retrieval, and controlled tool-use engineering. "
        "Days are published here as they are ready."
    )
    program["outcome"] = (
        "Day 120 is an independent-engineering checkpoint, not a claim of instant mastery. "
        "Mastery continues through repeated practice after the programme."
    )
    program["capstone"] = (
        "forge-api, one service: source, test, container, CI, immutable artifact, Kubernetes, AKS, "
        "workload identity, Key Vault, observability, reliability, retrieval, controlled tool use, evaluation, architecture defence."
    )
    program["mapTitle"] = "Ten stages"
    program["currentPhaseId"] = "phase-01"
    program["phases"] = [
        {
            "id": phase_id,
            "number": number,
            "name": name,
            "daysLabel": f"{start}–{end}",
            "startDay": start,
            "endDay": end,
            "summary": summary,
        }
        for phase_id, number, name, start, end, summary in PHASES
    ]
    program["days"] = program_days

    changed = [day for day in days if old_titles.get(day["day"]) != day["title"]]
    snapshot = {
        "programme": "FORGE-120",
        "identity": "A 120-day hands-on path from fundamentals to strong DevOps, Kubernetes, AKS, reliability, retrieval and controlled tool-use engineering.",
        "hours": "roughly 275 hours over 120 days",
        "phases": program["phases"],
        "days": snapshot_days,
        "gates": GATES,
        "capstone": {
            "name": "forge-api",
            "note": "One longitudinal capstone. A learning project, not employer production experience.",
            "sequence": [
                "source",
                "test",
                "container",
                "CI",
                "immutable artifact",
                "Kubernetes",
                "AKS",
                "workload identity",
                "Key Vault",
                "observability",
                "reliability",
                "retrieval",
                "controlled tool use",
                "evaluation",
                "architecture defence",
            ],
            "stages": CAPSTONE_STAGES,
            "evidenceLabels": ["OPERATED", "GENERATED", "SIMULATED", "BLOCKED"],
        },
        "interview": {
            "questions": [
                "What is it?",
                "How does it work?",
                "What did you write?",
                "What fails?",
                "What is the first useful evidence?",
                "What trade-off did you make?",
                "Where does it exist in forge-api?",
            ],
            "closedNote": "Days 110–120",
        },
        "post120": {
            "rule": "Deepen by real requirement. Close evidence gaps before adding new tools.",
            "keepOptionalUntilRequired": POST_120_KEEP_OPTIONAL,
        },
        "touchpoints": {
            "day12": "M1 mock + LLM sampler",
            "day59": "First LLM helper read-only",
            "retrieval": "Days 97–105",
            "awarenessLimit": "Day 105 is AI infrastructure awareness, not a claim of ML-infrastructure specialisation.",
        },
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(snapshot, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    PROGRAMS.write_text(json.dumps(catalog, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"days {len(days)} title changes {len(changed)} phases {len(program['phases'])}")
    for day in changed:
        if day["day"] in (1, 12, 27, 37, 59, 61, 75, 89, 97, 101, 105, 106, 120) or day["day"] % 15 == 0:
            print(f"  {day['day']:3} {old_titles.get(day['day'], '—')}  →  {day['title']}")


if __name__ == "__main__":
    main()
