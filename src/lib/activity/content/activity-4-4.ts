// src/lib/activity/content/activity-4-4.ts
import type { ActivityContent } from "@/src/lib/activity/content-types";

export const activity44Content: ActivityContent = {
  slug: "activity-4-4",
  title: "From Policy to Practice – Case Study Reflection",
  moduleLabel:
    "Module 4: Ecological transition: scenario, political and regulatory framework",
  intro:
    "The facilitator introduces the concept of transition scenarios, using relatable local or national examples (e.g. shift to renewables in a rural municipality, energy-efficiency in households, sustainable mobility in smaller towns). The participants are reminded how the EU plans for the future via strategies like REPowerEU or national climate plans.",

  meta: [
    { label: "Duration", value: "120 min", icon: "⏱" },
    { label: "Setting", value: "F2F", icon: "🧑‍🏫" },
    { label: "Type", value: "Discussion, Group activity", icon: "👥" },
  ],

  sections: [
    {
      id: "requirements",
      type: "list",
      title: "Requirements",
      items: [
        "PC/Laptop",
        "Internet",
        "Projector",
        "Whiteboard or pinboard for final sharing",
        "Flipchart or A3 paper + markers",
        "Sticky notes",
      ],
    },

    {
      id: "steps",
      type: "steps",
      title: "Step-by-Step Activity",
      steps: [
        {
          title: "Introduction",
          duration: "10 min",
          body: [
            "The facilitator introduces the concept of transition scenarios, using relatable local or national examples (e.g. shift to renewables in a rural municipality, energy-efficiency in households, sustainable mobility in smaller towns). The participants are reminded how the EU plans for the future via strategies like REPowerEU or national climate plans.",
          ],
        },
        {
          title: "Case Study Review",
          duration: "15 min",
          body: [
            'The facilitator briefly presents the case study "Adapting to Transition in a Rural Municipality". Participants are introduced to the situation: a rural community facing ecological transition challenges and opportunities across agriculture, energy, and infrastructure. They learn about challenges like depopulation, outdated heating systems, and local skepticism, as well as opportunities like EU funding or sustainable farming models',
          ],
        },
        {
          title: "Group Work",
          duration: "35 min",
          body: [
            "Participants are divided into groups. Each group is assigned one aspect of the scenario to analyze (e.g. energy transition, mobility, agriculture, agrosolar systems or local governance). Using the handout and guiding questions, they discuss:",
            "What are the social, economic and environmental implications in this case?",
            "What obstacles exist, and what supports could help (e.g. policy tools, funding, education)?",
            "How can a just transition be ensured for all groups?",
            "They prepare a summary on A2 papers",
          ],
        },
        {
          title: "Gallery Walk",
          duration: "20 min",
          body: [
            "Groups place their outputs on the posters. Everyone walks through the outputs, reading and leaving sticky-note comments, reflections or connections to their own region.",
          ],
        },
        {
          title: "Role-based Dialogue",
          duration: "20 min",
          body: [
            "Each participant takes on a role (e.g. farmer, municipal officer, unemployed youth, green entrepreneur). They are asked to react to a transition scenario from their character's point of view. This encourages empathy, creative thinking, and identifying gaps in communication or support.",
          ],
        },
        {
          title: "Closing Circle",
          duration: "20 min",
          body: [
            "The facilitator leads a group reflection:",
            "Which ideas surprised you most?",
            "Did any roles spark unexpected perspectives?",
            "What needs to be done to prepare educators and citizens to navigate these transitions? Participants write one key insight or action they will take in their community or work.",
          ],
        },
      ],
    },

    {
      id: "case-study",
      type: "links",
      title: "Case Study",
      items: [
        {
          title: "Case Study: Adapting to Transition in a Rural Municipality",
          url: "https://pjjslpdbnwfkvlrxrkpr.supabase.co/storage/v1/object/public/course-assets/dsd-teal/Module-4/Activity-4-4/Case-study-4.pdf",
          description: "PDF/handout used during the activity.",
          resourceType: "case-study",
        },
      ],
    },

    {
      id: "assessment",
      type: "list",
      title: "Assessment",
      items: [
        "Group Output: Each group’s work (maps, sketches, or posters) demonstrates understanding of transition dimensions.",
        "Participation: Facilitator observes engagement, role-play participation, and contributions during discussion.",
        "Reflection: Individual written insight at the end is reviewed for depth of understanding and personal connection to content.",
      ],
    },

    {
      id: "further-reading",
      type: "links",
      title: "Further Reading",
      items: [
        {
          title: "EU Green Deal – Summary",
          url: "https://commission.europa.eu/strategy-and-policy/priorities-2019-2024/european-green-deal_en",
          resourceType: "external",
        },
        {
          title: "REPowerEU",
          url: "https://commission.europa.eu/strategy-and-policy/eu-budget/recovery-plan-europe/recovery-and-resilience-facility/repowereu_en",
          resourceType: "external",
        },
        {
          title: "Long-Term Climate Strategy",
          url: "https://climate.ec.europa.eu/eu-action/long-term-strategy_en",
          resourceType: "external",
        },
        {
          title: "Just Transition Mechanism",
          url: "https://commission.europa.eu/strategy-and-policy/priorities-2019-2024/european-green-deal/finance-and-green-deal/just-transition-mechanism_en",
          resourceType: "external",
        },
      ],
    },
  ],
};
