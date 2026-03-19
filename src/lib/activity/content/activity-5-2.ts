// src/lib/activity/content/activity-5-2.ts
import type { ActivityContent } from "@/src/lib/activity/content-types";

export const activity52Content: ActivityContent = {
  slug: "activity-5-2",
  title: "Walking the Talk: Personal Footprint & Habit Challenge",
  moduleLabel: "Module 5: Adult education for environmental sustainability",
  meta: [
    { label: "Duration", value: "60 minutes", icon: "⏱" },
    { label: "Setting", value: "F2F", icon: "🧑‍🏫" },
    {
      label: "Type",
      value: "Individual reflection, Group activity, Peer reflection",
      icon: "👥",
    },
  ],

  sections: [
    {
      id: "requirements",
      type: "list",
      title: "Requirements",
      items: [
        "Projector and laptop",
        "Stationery (flipcharts, markers, sticky notes)",
        "Smartphones or computers for participants",
      ],
    },

    {
      id: "learning-focus",
      type: "cards",
      title: "Learning Focus",
      cards: [
        {
          title: "Resources",
          items: [
            "Handout: Eco Journal template",
            "Flipchart paper",
            "Markers/Post-its",
            "Reflection prompts handout",
            "Projector",
          ],
        },
      ],
    },

    {
      id: "steps",
      type: "steps",
      title: "Step-by-Step Activity",
      steps: [
        {
          title: "Phase 1: Framing the Experiment",
          duration: "10 min",
          body: [
            "Introduce the activity as a behavioral observation experiment, not a guilt exercise. Explain that environmental literacy starts with noticing—not judging—our own patterns. Present a few sample daily choices with hidden impacts: streaming video energy use, washing half loads, food waste from over-purchasing.",
            "Brief group question: “What daily action do you suspect has the biggest hidden footprint?” Write 3-4 examples on the board.",
          ],
        },
        {
          title: "Phase 2: Setting up the Eco-Journal",
          duration: "15 min",
          body: [
            "Distribute or display the journal template with these columns:",
            "Time / Action / Context / Emotion / Environmental note (energy, food, mobility, waste) / Possible alternative.",
            "Demonstrate:",
            "Example: “7:45 a.m. - Drove 1 km to buy bread - in a rush - Mobility - Could walk if I plan earlier.”",
            "Participants fill one or two real entries on the spot. Discuss insights: “Which category shows up most often?” Emphasize awareness as the foundation of commitment.",
          ],
        },
        {
          title: "Phase 3: Emotional Mapping",
          duration: "15 min",
          body: [
            "Ask participants to review their sample entries. Then, on sticky notes, label emotions tied to each action: convenience, stress, pleasure, obligation, habit.",
            "Facilitator draws two axes on the board: Ease vs. Impact. Participants post notes where their actions fall.",
            "Debrief: “Which high-impact actions are easy to change? Which low-impact ones are emotionally hard to let go?” This bridges self-awareness with realistic goal-setting.",
          ],
        },
        {
          title: "Phase 4: Reflection and Goal Definition",
          duration: "20 min",
          body: [
            "Give participants a Reflection Prompts sheet:",
            "What did I learn about my automatic routines?",
            "Which single action, if improved, would create the biggest change?",
            "What support or cue would help me sustain it?",
            "Each person writes a short “Re-design Action” — one practical behavior to replace or reduce (e.g., unplug devices nightly, reduce online deliveries, switch to local food once a week).",
            "Pair participants for quick exchange: each reads their chosen action aloud and receives one suggestion for strengthening it.",
            "Facilitator encourages using phone reminders or journal cues as part of TEAL (tech-assisted learning).",
          ],
        },
        {
          title: "Phase 5: Week-Long Experiment",
          duration: "Between sessions",
          body: [
            "Participants keep the Eco-Journal for one week.",
            "They choose one behavior to track and re-design.",
            "Optionally, they take one photo, screenshot, or short note per day as “evidence” of change (e.g., lunchbox prepared, bike used, appliances unplugged).",
          ],
        },
        {
          title: "Follow-Up Session",
          duration: "10 min",
          body: [
            "One week later, invite participants to share one insight from the journal and one habit they successfully shifted—or struggled with.",
            "Facilitator asks: “What made the change easier or harder than expected?”",
            "Close by reinforcing that sustainable citizenship starts with awareness, but grows through experimentation and support.",
          ],
        },
      ],
    },

    {
      id: "assessment",
      type: "text",
      title: "Assessment",
      body: [
        "This activity includes both formative and reflective assessment, centered on learners’ ability to observe and reinterpret their own environmental habits. During the session, the facilitator can assess participation by reviewing whether learners complete at least one Eco-Journal entry with sufficient detail (action, context, emotional trigger, environmental note, alternative). Their contributions during the emotional mapping phase also offer insight into how well they connect personal behavior with sustainability impacts and emotional drivers.",
        "The most important assessment element is the quality of reflection. In Phase 4, learners should identify one realistic behavior to redesign and explain why they chose it. The facilitator can collect or briefly review these “Re-design Actions” as evidence of understanding and intentional goal-setting. The follow-up session a week later adds a behavioral assessment dimension: learners report whether they implemented the selected action, what obstacles they faced, and what changed in their awareness or routine. Evidence such as journal notes, photos, or self-reported examples can support this reflection.",
        "Rather than measuring right/wrong answers, this assessment focuses on growth in self-awareness, honesty in observation, and the learner’s capacity to make a feasible commitment to change. The Eco-Journal thus serves both as a learning tool and an assessment artifact, capturing the process of personal sustainability learning in a concrete and meaningful way.",
      ],
    },

    {
      id: "further-reading",
      type: "text",
      title: "Sources / Further reading",
      body: [
        "UNESCO (2022). Education for Sustainable Lifestyles.",
        "Prochaska & DiClemente (Behavior Change Model).",
        "EU GreenComp Framework (2022).",
      ],
    },
  ],
};
