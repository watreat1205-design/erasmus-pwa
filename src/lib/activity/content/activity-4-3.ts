// src/lib/activity/content/activity-4-3.ts
import type { ActivityContent } from "@/src/lib/activity/content-types";

export const activity43Content: ActivityContent = {
  slug: "activity-4-3",
  title: "Green Life Scenarios – Who Gets What in the Transition?",
  moduleLabel:
    "Module 4: Ecological transition: scenario, political and regulatory framework",

  intro:
    "Participants explore real-life situations related to ecological transition and reflect on how EU policies affect different groups in society.",

  meta: [
    { label: "Duration", value: "110 minutes", icon: "⏱" },
    {
      label: "Setting",
      value: "Self-directed learning / online",
      icon: "💻",
    },
    {
      label: "Type",
      value: "Lecture, Individual activity, Interactive quiz - reflection",
      icon: "👤",
    },
  ],

  sections: [
    {
      id: "requirements",
      type: "list",
      title: "Requirements",
      items: [
        "Personal devices (PC, tablet, mobile phone)",
        "Internet access",
        "Zoom (or other platform)",
      ],
    },

    {
      id: "steps",
      type: "steps",
      title: "Step-by-Step Activity",
      steps: [
    {
      title: "Welcome and Icebreaker",
      duration: "15 min",
      body: [
        '– “Weather Check” Participants are asked to describe their current mood using a weather metaphor (e.g. "I\'m feeling like a sunny spring day"). This promotes a light and engaging start to the session.',
        "After that start with “Real People in the Green Shift”",
        "Participants are invited to think about common life situations that relate to green transition.",
        "Each participant chooses or is assigned a quick character sketch that might reflect someone from their own community: e.g., “a young person living in a small town,” “a family running a rural B&B,” “a self-employed electrician,” or “a pensioner in a poorly insulated flat.”",
        "They briefly introduce themselves",
      ],
    },

    {
      title: "Presentation – Understanding Ecological Transition",
      duration: "30 min",
      body: [
        "What the Green Deal Means for Everyday Life",
        "Facilitator presents:",
        "• What is the ecological transition and how is it already happening around us?",
        "• Key sectors that are being transformed (agriculture, housing, transport, energy, jobs)",
        "• Overview of how EU policies aim to support this shift with tools like clean energy funding, renovation grants, training for green jobs, and support for vulnerable regions",
        "• Focus on practical effects and opportunities",
      ],
    },
    {
      title: "Interactive Quiz (Google Forms) – Test Your Understanding",
      duration: "20 min",
      body: [
        "Participants complete an online quiz with:",
        "◦ Multiple choice and short-answer questions.",
        "◦ Situational applications",
        "◦ True or false on key facts about the instruments.",
      ],
    },
    {
      title: "Reflection and Group Debrief",
      duration: "30 min",
      body: [
        "Participants reflect on two questions:",
        "◦ What is one thing you didn’t know before this session?",
        "◦ How might these EU policies impact your local community or learners? Reflections can be shared in breakout rooms or posted on a collaborative bord or just discssed one by one",
      ],
    },
    {
      title: "Facilitator Closing",
      duration: "15 min",
      body: [
        "Summary of key points, sharing a few powerful quotes or insights from participants, and invitation to follow up through future modules or group discussions.",
      ],
    },
  ],
},
  
    {
      id: "assessment",
      type: "list",
      title: "Assessment",
      items: [
        "Online quiz to measure comprehension of real-world policy applications",
        "Open-ended responses measuring reflection, personal insight, and ability to relate concepts to everyday settings",
        "Optional journal prompt: “If you had one minute with your mayor, what would you ask for in support of your green transition?”",
      ],
    },

    {
      id: "further-reading",
      type: "links",
      title: "Further Reading",
      items: [
        {
          title:
            "European Commission (2023). Just and Inclusive Transition Mechanisms",
          url: "https://commission.europa.eu/",
          resourceType: "external",
        },
        {
          title:
            "Climate Reality Project Europe. Teaching Climate Justice",
          url: "https://www.climaterealityeurope.org/",
          resourceType: "external",
        },
        {
          title:
            "Eurostat. Statistics Explained: EU Green Deal indicators",
          url: "https://ec.europa.eu/eurostat/",
          resourceType: "external",
        },
        {
          title:
            "European Environmental Bureau (2022). Fairness in the Green Transition",
          url: "https://eeb.org/",
          resourceType: "external",
        },
      ],
    },
  ],
};
