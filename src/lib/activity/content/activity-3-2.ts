// src/lib/activity/content/activity-3-2.ts
import type { ActivityContent } from "@/src/lib/activity/content-types";

export const activity32Content: ActivityContent = {
  slug: "activity-3-2",
  title: "Eco Footprint Challenge",
  moduleLabel: "Module 3: From knowledge to skills for a transformative education",
  intro: "3.1 Expertise in environmental education",

  meta: [
    { label: "Duration", value: "90 min", icon: "⏱" },
    {
      label: "Type of activity",
      value: "Interactive group activity + self-assessment",
      icon: "👥",
    },
  ],

  sections: [
    {
      id: "learning-focus",
      type: "cards",
      title: "Learning Outcomes",
      cards: [
        {
          title: "Topic",
          items: ["From knowledge to skills for a transformative education"],
        },
        {
          title: "Knowledge",
          items: [
            "Environmental education",
            "Sustainability",
            "Active Teaching Strategies",
            "Teacher and Student Role",
            "Digital Tools for TEAL",
            "TEAL Activity Planning",
          ],
        },
        {
          title: "Skills",
          items: [
            "Analyzing the impact of your own decisions on the environment using digital tools",
            "Selecting teaching strategies",
            "Using digital tools",
            "Designing teaching activities",
          ],
        },
        {
          title: "Attitudes",
          items: [
            "Critical thinking towards sources of information about the environment.",
            "Demonstrates openness to change and individual and collective responsibility.",
            "Active involvement in the community to support environmental education initiatives.",
          ],
        },
      ],
    },

    {
      id: "requirements",
      type: "list",
      title: "Requirements",
      items: ["PC/Laptop", "Mobile Devices", "Internet", "Projector"],
    },

    {
      id: "steps",
      type: "steps",
      title: "Description of activity (step-by-step)",
      steps: [
        {
          title: "Introduction",
          duration: "10 min",
          body: [
            "Facilitator introduces the concept of the ecological footprint and its relevance to environmental sustainability and individual impact.",
          ],
        },
        {
          title: "Individual assessment",
          duration: "20 min",
          body: [
             "Each participant uses the online calculator to determine their personal ecological footprint.",
             "(https://www.footprintcalculator.org)",
             "They record the results on the printed sheet."
         ], 

        },
        {
          title: "Group discussion",
          duration: "20 min",
          body: [
            "Participants are divided into small groups to compare their results and identify common high-impact behaviors (e.g., transportation, food waste, energy consumption).",
          ],
        },
        {
          title: "Solutions brainstorm",
          duration: "20 min",
          body: [
            "Each group develops 2–3 actionable strategies to reduce individual or group ecological footprints and writes them on the flipchart.",
          ],
        },
        {
          title: "Presentation & reflection",
          duration: "20 min",
          body: [
            "Groups present their solutions.",
            "The facilitator guides a discussion about feasibility, barriers, and personal commitment.",
          ],
        },
      ],
    },

    {
      id: "assessment",
      type: "text",
      title: "Assessment",
      body: [
        "Completion of individual footprint calculation",
        "Active participation in group discussions",
        "Quality and feasibility of proposed reduction strategies",
        "Reflection journal (optional follow-up)",
      ],
    },

    {
      id: "further-reading",
      type: "links",
      title: "Online resources used in the activity",
      items: [
        {
          title: "Footprint Calculator",
          url: "https://www.footprintcalculator.org",
          resourceType: "external",
        },
      ],
    },
  ],
};
