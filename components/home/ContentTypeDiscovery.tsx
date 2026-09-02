import Link from "next/link";
import { ArrowRight, Layers, HelpCircle, Radio, UserCheck } from "lucide-react";
import { getAllContentTypes, type HomepageSection } from "@/lib/config";
import LearnIcon from "@/components/icons/LearnIcon";
import GuidesIcon from "@/components/icons/GuidesIcon";
import ProjectsIcon from "@/components/icons/ProjectsIcon";
import YouTubeIcon from "@/components/icons/YouTubeIcon";
import InstagramIcon from "@/components/icons/InstagramIcon";
import type { ComponentType } from "react";

interface ContentTypeDiscoveryProps {
  section?: HomepageSection;
}

type IconProps = { className?: string };
type IconComponent = ComponentType<IconProps>;

function getIconComponent(iconName: string): IconComponent {
  switch (iconName) {
    case "LearnIcon":
      return LearnIcon as IconComponent;
    case "GuidesIcon":
      return GuidesIcon as IconComponent;
    case "ProjectsIcon":
      return ProjectsIcon as IconComponent;
    case "YouTubeIcon":
      return YouTubeIcon as IconComponent;
    case "InstagramIcon":
      return InstagramIcon as IconComponent;
    case "HelpCircle":
      return HelpCircle as IconComponent;
    case "Radio":
      return Radio as IconComponent;
    case "UserCheck":
      return UserCheck as IconComponent;
    default:
      return LearnIcon as IconComponent;
  }
}

export default function ContentTypeDiscovery({ section }: ContentTypeDiscoveryProps) {
  // getAllContentTypes reads from platform.json → contentTypes array
  // URLs are resolved: url field takes priority, else /topics/<topicSlug>
  const contentTypes = getAllContentTypes();

  const title = section?.title ?? "What You'll Find Here";
  const subtitle = section?.subtitle ?? "Format Diversity";

  return (
    <section className="py-12 sm:py-16 bg-white/[0.01] border-y border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-b border-white/[0.08] pb-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-violet-300">
            <Layers className="h-3.5 w-3.5" />
            <span>{subtitle}</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-4xl font-semibold tracking-[-0.03em] text-white">
            {title}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-white/50 max-w-xl leading-relaxed">
            Consume knowledge in the format that best suits your learning style—from interactive courses to short visual notes.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contentTypes.map((ct) => {
            const Icon = getIconComponent(ct.iconName);
            const href = ct.url ?? "#";
            const comingSoon = ct.status === "coming-soon";
            return (
              <Link
                key={ct.id}
                href={href}
                className="group rounded-3xl border border-white/[0.08] bg-black/40 p-6 flex flex-col justify-between transition duration-300 hover:border-violet-400/30 hover:bg-white/[0.02]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[10px] font-mono text-white/40">
                      {comingSoon ? "Coming Soon" : ct.badge}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base sm:text-lg font-semibold text-white group-hover:text-violet-200 transition">
                    {ct.title}
                  </h3>

                  <p className="mt-1.5 text-xs text-white/50 leading-relaxed">
                    {ct.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.05] flex items-center justify-between text-xs font-medium text-violet-300 group-hover:text-white transition">
                  <span>{comingSoon ? "Coming Soon" : "Browse Format"}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
