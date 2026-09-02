import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import YouTubeIcon from "@/components/icons/YouTubeIcon";
import InstagramIcon from "@/components/icons/InstagramIcon";
import { getSocialPlatforms } from "@/lib/config";

export default function SocialShowcase() {
  // Driven entirely by platform config — no hardcoded youtube/instagram
  const platforms = getSocialPlatforms();

  const youtube = platforms.find((p) => p.id === "youtube");
  const instagram = platforms.find((p) => p.id === "instagram");

  const hasYoutube = Boolean(youtube);
  const hasInstagram = Boolean(instagram);

  if (!hasYoutube && !hasInstagram) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 bg-white/[0.01] border-t border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-violet-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Multi-Channel Ecosystem</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-4xl font-semibold tracking-[-0.03em] text-white">
            {[youtube?.displayName, instagram?.displayName].filter(Boolean).join(" & ")} Content
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-white/50 leading-relaxed">
            Connecting deep written courses with visual architectural carousels on Instagram and long-form video teardowns on YouTube.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* YouTube Card — driven by config */}
          {hasYoutube && youtube && (
            <div className="group rounded-3xl border border-white/[0.08] bg-black/40 p-8 flex flex-col justify-between transition duration-300 hover:border-red-500/30">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400">
                    <YouTubeIcon className="h-6 w-6 text-red-400" />
                  </div>
                  <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-mono text-red-300 uppercase tracking-wider">
                    {youtube.badge ?? "Video Teardowns"}
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-semibold text-white group-hover:text-red-200 transition">
                  {youtube.displayName ?? youtube.label}
                </h3>

                <p className="mt-3 text-xs sm:text-sm text-white/50 leading-relaxed">
                  {youtube.description ?? "In-depth video tutorials, architectural walk-throughs, and first-principles software build-in-public streams."}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-between">
                <Link
                  href={youtube.href}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-red-400 hover:text-red-300 transition"
                >
                  <span>Browse Video Showcase</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}

          {/* Instagram Card — driven by config */}
          {hasInstagram && instagram && (
            <div className="group rounded-3xl border border-white/[0.08] bg-black/40 p-8 flex flex-col justify-between transition duration-300 hover:border-pink-500/30">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-pink-500/20 bg-pink-500/10 text-pink-400">
                    <InstagramIcon className="h-6 w-6 text-pink-400" />
                  </div>
                  <span className="rounded-full border border-pink-500/20 bg-pink-500/10 px-3 py-1 text-[11px] font-mono text-pink-300 uppercase tracking-wider">
                    {instagram.badge ?? "Visual Flowcharts"}
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-semibold text-white group-hover:text-pink-200 transition">
                  {instagram.displayName ?? instagram.label}
                </h3>

                <p className="mt-3 text-xs sm:text-sm text-white/50 leading-relaxed">
                  {instagram.description ?? "Bite-sized visual guides, architecture carousels, and quick concept teardowns designed for rapid daily tech learning."}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-between">
                <Link
                  href={instagram.href}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-pink-400 hover:text-pink-300 transition"
                >
                  <span>Browse Visual Notes</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
