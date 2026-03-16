// src/components/activity/ActivityContentRenderer.tsx
"use client";

import type {
  ActivityContent,
  ActivitySection,
  ActivityImageItem,
} from "@/src/lib/activity/content-types";
import { openInPlatform } from "@/components/lesson/openInPlatform";

function getSectionIcon(section: ActivitySection) {
  switch (section.type) {
    case "cards":
      return "🎯";
    case "steps":
      return "🧭";
    case "videos":
      return "🎥";
    case "links":
      return "📖";
    case "list":
      return "✅";
    case "text":
      return "📝";
    case "images":
      return "🖼️";
    default:
      return "•";
  }
}

function getLinkIcon(resourceType?: string) {
  if (resourceType === "video") {
    return <span>🎥</span>;
  }

  if (
    resourceType === "slides" ||
    resourceType === "article" ||
    resourceType === "case-study" ||
    resourceType === "pdf"
  ) {
    return <span>📄</span>;
  }

  return <span>🔗</span>;
}

function isSlidesResource(resourceType?: string) {
  return resourceType === "slides" || resourceType === "pdf";
}

function isFurtherReadingResource(resourceType?: string) {
  return resourceType !== "slides" && resourceType !== "pdf";
}

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-[30px] border border-white/50 bg-emerald-50/70 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-md sm:p-7">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-lime-100/40 via-transparent to-emerald-100/50" />
      <div className="relative">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/60 bg-emerald-50/70 text-lg shadow-sm">
            {icon}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <div className="mt-1 h-[2px] w-16 rounded-full bg-gradient-to-r from-emerald-500/70 to-transparent" />
          </div>
        </div>

        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}

function renderTextWithMarkdownLink(
  p: string,
  key: string,
  buttonClassName?: string
) {
  const markdownMatch = p.match(/^\[(.*?)\]\((.*?)\)$/);

  if (markdownMatch) {
    const label = markdownMatch[1];
    const url = markdownMatch[2];

    return (
      <button
        key={key}
        type="button"
        onClick={() => {
          if (url.startsWith("/quizzes/")) {
            window.location.href = url;
          } else {
            openInPlatform(url);
          }
        }}
        className={
          buttonClassName ??
          "mt-3 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm hover:bg-emerald-100"
        }
      >
        {label} →
      </button>
    );
  }

  const parenUrlMatch = p.match(/^\((https?:\/\/[^\s)]+)\)\.?$/);

  if (parenUrlMatch) {
    const url = parenUrlMatch[1];

    return (
      <button
        key={key}
        type="button"
        onClick={() => openInPlatform(url)}
        className={
          buttonClassName ??
          "mt-3 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm hover:bg-emerald-100"
        }
      >
        Open link →
      </button>
    );
  }

  const plainUrlMatch = p.match(/^(https?:\/\/\S+)$/);

  if (plainUrlMatch) {
    const url = plainUrlMatch[1];

    return (
      <button
        key={key}
        type="button"
        onClick={() => openInPlatform(url)}
        className={
          buttonClassName ??
          "mt-3 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm hover:bg-emerald-100"
        }
      >
        Open link →
      </button>
    );
  }

  return (
    <p key={key} className="leading-7">
      {p}
    </p>
  );
}

function renderSection(section: ActivitySection, stepStartNumber = 1) {
  const icon = getSectionIcon(section);

  switch (section.type) {
    case "text":
      return (
        <SectionCard key={section.id} title={section.title} icon={icon}>
          <div className="space-y-4 text-gray-700">
            {section.body.map((p: string, i: number) =>
              renderTextWithMarkdownLink(p, `text-${section.id}-${i}`)
            )}
          </div>
        </SectionCard>
      );

    case "list":
      return (
        <SectionCard key={section.id} title={section.title} icon={icon}>
          <ul className="grid gap-3 sm:grid-cols-2">
            {section.items.map((item: string, i: number) => (
              <li
                key={i}
                className="rounded-2xl border border-white/60 bg-[#edf8ee]/92 px-4 py-3 text-gray-800 shadow-sm"
              >
                {item}
              </li>
            ))}
          </ul>
        </SectionCard>
      );

    case "cards":
      return (
        <SectionCard key={section.id} title={section.title} icon={icon}>
          <div className="grid gap-4 lg:grid-cols-2">
            {section.cards.map(
              (
                card: { title: string; items: string[] },
                i: number
              ) => (
                <div
                  key={i}
                  className="rounded-3xl border border-white/60 bg-[#f2f9f2]/92 p-5 shadow-sm"
                >
                  <h3 className="text-base font-semibold text-gray-900">
                    {card.title}
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm text-gray-700">
                    {card.items.map((item: string, idx: number) => (
                      <li key={idx} className="flex gap-2">
                        <span className="mt-1 text-emerald-600">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}
          </div>
        </SectionCard>
      );

    case "steps":
      return (
        <SectionCard key={section.id} title={section.title} icon={icon}>
          <div className="space-y-5">
            {section.steps.map(
              (
                step: {
                  title: string;
                  duration?: string;
                  body: string[];
                  bullets?: string[];
                },
                i: number
              ) => (
                <div
                  key={i}
                  className="rounded-3xl border border-white/60 bg-[#f2f9f2]/92 p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {stepStartNumber + i}. {step.title}
                    </h3>
                    {step.duration ? (
                      <span className="inline-flex w-fit rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                        {step.duration}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4 space-y-3 text-gray-700">
                    {step.body.map((p: string, idx: number) =>
                      renderTextWithMarkdownLink(
                        p,
                        `step-${section.id}-${i}-${idx}`,
                        "inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 shadow-sm hover:bg-emerald-100"
                      )
                    )}
                  </div>

                  {step.bullets?.length ? (
                    <ul className="mt-4 space-y-2 text-gray-700">
                      {step.bullets.map((item: string, idx: number) => (
                        <li key={idx} className="flex gap-2">
                          <span className="mt-1 text-emerald-600">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              )
            )}
          </div>
        </SectionCard>
      );

    case "videos":
      return (
        <SectionCard key={section.id} title={section.title} icon={icon}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {section.items.map(
              (
                item: {
                  title: string;
                  url: string;
                  thumbnailUrl?: string;
                  description?: string;
                },
                i: number
              ) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => openInPlatform(item.url)}
                  className="overflow-hidden rounded-3xl border border-white/60 bg-[#f2f9f2]/92 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="aspect-video w-full overflow-hidden bg-gray-100">
                    {item.thumbnailUrl ? (
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                        Video preview
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="text-sm font-medium text-emerald-700">
                      Video
                    </div>
                    <div className="mt-2 text-base font-semibold text-gray-900">
                      {item.title}
                    </div>
                    {item.description ? (
                      <p className="mt-2 text-sm text-gray-600">
                        {item.description}
                      </p>
                    ) : null}
                    <div className="mt-4 text-sm font-medium text-blue-700">
                      Open inside platform →
                    </div>
                  </div>
                </button>
              )
            )}
          </div>
        </SectionCard>
      );

    case "images":
      return (
        <SectionCard key={section.id} title={section.title} icon={icon}>
          <div className="grid gap-4 md:grid-cols-1">
            {section.items.map((item: ActivityImageItem, i: number) => (
              <div
                key={i}
                className="overflow-hidden rounded-3xl border border-white/60 bg-[#f2f9f2]/92 shadow-sm"
              >
                <img
                  src={item.url}
                  alt={item.alt ?? item.title}
                  className="w-full object-cover"
                />
                <div className="p-4">
                  <div className="text-base font-semibold text-gray-900">
                    {item.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      );

      case "links": {
  const furtherReadingItems = section.items.filter(
    (item: (typeof section.items)[number]) =>
      isFurtherReadingResource(item.resourceType)
  );

  const slideItems = section.items.filter(
    (item: (typeof section.items)[number]) =>
      isSlidesResource(item.resourceType)
  );

      return (
        <SectionCard key={section.id} title={section.title} icon={icon}>
          <div className="space-y-8">
            {furtherReadingItems.length > 0 ? (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Case Studies and Further Reading
                </h3>

                {furtherReadingItems.map(
                  (
                    item: {
                      title: string;
                      url: string;
                      description?: string;
                      resourceType?: string;
                    },
                    i: number
                  ) => (
                    <button
                      key={`reading-${i}`}
                      type="button"
                      onClick={() => openInPlatform(item.url)}
                      className="block w-full rounded-3xl border border-white/60 bg-[#f2f9f2]/92 p-4 text-left shadow-sm transition hover:shadow-md"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-emerald-700">
                          {getLinkIcon(item.resourceType)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="text-base font-semibold text-gray-900">
                            {item.title}
                          </div>

                          {item.description ? (
                            <div className="mt-1 text-sm text-gray-600">
                              {item.description}
                            </div>
                          ) : null}

                          <div className="mt-4 text-sm font-medium text-emerald-700">
                            Open material →
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                )}
              </div>
            ) : null}

            {slideItems.length > 0 ? (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Resources
                </h3>

                {slideItems.map(
                  (
                    item: {
                      title: string;
                      url: string;
                      description?: string;
                      resourceType?: string;
                    },
                    i: number
                  ) => (
                    <button
                      key={`slides-${i}`}
                      type="button"
                      onClick={() => openInPlatform(item.url)}
                      className="block w-full rounded-3xl border border-white/60 bg-[#f2f9f2]/92 p-4 text-left shadow-sm transition hover:shadow-md"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-emerald-700">
                          {getLinkIcon(item.resourceType)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="text-base font-semibold text-gray-900">
                            {item.title}
                          </div>

                          {item.description ? (
                            <div className="mt-1 text-sm text-gray-600">
                              {item.description}
                            </div>
                          ) : null}

                          <div className="mt-4 text-sm font-medium text-emerald-700">
                            Open material →
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                )}
              </div>
            ) : null}
          </div>
        </SectionCard>
      );
    }

    default:
      return null;
  }
}

export default function ActivityContentRenderer({
  activity,
}: {
  activity: ActivityContent;
}) {
  const stepsSection = activity.sections.find(
    (section) => section.type === "steps"
  );

  const flowSteps =
    stepsSection && stepsSection.type === "steps"
      ? stepsSection.steps.slice(0, 3)
      : [];

  const shouldSplitSpecial =
    activity.slug === "activity-1-1" ||
    activity.slug === "activity-2-5" ||
    activity.slug === "activity-3-1";

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[34px] border border-white/50 bg-emerald-50/70 p-6 shadow-[0_12px_32px_rgba(0,0,0,0.10)] backdrop-blur-md sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-lime-100/70 via-emerald-50/35 to-green-100/65" />
        <div className="relative">
          <div className="max-w-3xl">
            <div className="text-sm font-medium text-emerald-700">
              {activity.moduleLabel}
            </div>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
              {activity.title}
            </h1>

            {activity.intro ? (
              <p className="mt-5 text-base leading-8 text-gray-700 sm:text-lg">
                {activity.intro}
              </p>
            ) : null}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {activity.meta.map(
              (
                item: {
                  label: string;
                  value: string;
                  icon?: string;
                },
                i: number
              ) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/75 px-4 py-2 text-sm text-gray-800 shadow-sm backdrop-blur-sm"
                >
                  {item.icon ? <span>{item.icon}</span> : null}
                  <span className="font-medium">{item.label}:</span>
                  <span>{item.value}</span>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {(() => {
        const requirements = activity.sections.find(
          (section) => section.id === "requirements"
        );
        return requirements ? renderSection(requirements) : null;
      })()}

      {flowSteps.length > 0 ? (
        <section className="relative overflow-hidden rounded-[30px] border border-white/50 bg-emerald-50/75 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-md sm:p-6">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-lime-100/35 via-transparent to-emerald-100/45" />
          <div className="relative">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/60 bg-emerald-50/70 shadow-sm">
                🚀
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Activity Flow
                </h2>
                <p className="text-sm text-gray-600">
                  A simple guide to complete this activity
                </p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {flowSteps.map(
                (
                  step: {
                    title: string;
                    body: string[];
                  },
                  index: number
                ) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-white/60 bg-[#f2f9f2]/92 p-4 shadow-sm"
                  >
                    <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                      Step {index + 1}
                    </div>
                    <div className="mt-2 text-sm font-medium text-gray-900">
                      {step.title}
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      {step.body?.[0] ?? ""}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      ) : null}

      {(() => {
        const section = activity.sections.find((s) => s.id === "learning-focus");
        return section ? renderSection(section) : null;
      })()}

      {shouldSplitSpecial ? (
        <>
          {(() => {
            const part1 = activity.sections.find((s) => s.id === "steps-part-1");

            if (part1 && part1.type === "steps") {
              return renderSection(part1, 1);
            }

            const fallbackSteps = activity.sections.find((s) => s.type === "steps");
            if (fallbackSteps && fallbackSteps.type === "steps") {
              const splitPart1 = {
                ...fallbackSteps,
                id: `${fallbackSteps.id}-part-1`,
                title: "Step-by-Step Activity (Part 1)",
                steps: fallbackSteps.steps.slice(0, 3),
              };
              return renderSection(splitPart1, 1);
            }

            return null;
          })()}

          {(() => {
            const videos = activity.sections.find((s) => s.type === "videos");
            return videos ? renderSection(videos) : null;
          })()}

          {(() => {
            const part2 = activity.sections.find((s) => s.id === "steps-part-2");

            if (part2 && part2.type === "steps") {
              return renderSection(part2, 4);
            }

            const fallbackSteps = activity.sections.find((s) => s.type === "steps");
            if (fallbackSteps && fallbackSteps.type === "steps") {
              const splitPart2 = {
                ...fallbackSteps,
                id: `${fallbackSteps.id}-part-2`,
                title: "Step-by-Step Activity (Part 2)",
                steps: fallbackSteps.steps.slice(3),
              };
              return splitPart2.steps.length ? renderSection(splitPart2, 4) : null;
            }

            return null;
          })()}
        </>
      ) : (
        <>
          {(() => {
            const section = activity.sections.find((s) => s.type === "steps");
            return section ? renderSection(section) : null;
          })()}

          {(() => {
            const section = activity.sections.find((s) => s.type === "videos");
            return section ? renderSection(section) : null;
          })()}
        </>
      )}

      {activity.slug === "activity-3-3" ? (
        <>
          {(() => {
            const section = activity.sections.find((s) => s.id === "case-study-1");
            return section ? renderSection(section) : null;
          })()}

          {(() => {
            const section = activity.sections.find(
              (s) => s.id === "case-study-1-image"
            );
            return section ? renderSection(section) : null;
          })()}

          {(() => {
            const section = activity.sections.find((s) => s.id === "case-study-2");
            return section ? renderSection(section) : null;
          })()}

          {(() => {
            const section = activity.sections.find(
              (s) => s.id === "case-study-2-image"
            );
            return section ? renderSection(section) : null;
          })()}
        </>
      ) : null}

      {(() => {
        const section = activity.sections.find((s) => s.id === "assessment");
        return section ? renderSection(section) : null;
      })()}

      {(() => {
        const section =
          activity.sections.find((s) => s.id === "further-reading") ||
          activity.sections.find((s) => s.id === "resources");
        return section ? renderSection(section) : null;
      })()}
    </div>
  );
}
