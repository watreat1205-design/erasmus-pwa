// src/lib/activity/content/activity-2-3.ts
import type { ActivityContent } from "@/src/lib/activity/content-types";

export const activity23Content: ActivityContent = {
  slug: "activity-2-3",
  title: "Needs and Wants",
  moduleLabel:
    "Module 2: The foundations of environmental education and sustainable development",

  intro:
    "Participants explore the difference between needs and wants and reflect on how these choices influence sustainability and daily life.",

  meta: [
    { label: "Duration", value: "30 minutes", icon: "⏱" },
    { label: "Setting", value: "F2F", icon: "🧑‍🏫" },
    { label: "Type", value: "Discussion, Group activity", icon: "👥" },
  ],

  sections: [
    {
      id: "learning-focus",
      type: "cards",
      title: "Learning Focus",
      cards: [
        {
          title: "Topic",
          items: ["Understanding the difference between needs and wants"],
        },
        {
          title: "Knowledge",
          items: [
            "Understand the concept of needs and wants.",
            "Recognise how consumption choices affect sustainability.",
            "Connect everyday decisions with Sustainable Development Goals.",
          ],
        },
        {
          title: "Skills",
          items: [
            "Analyse personal priorities and consumption patterns.",
            "Engage in group discussion and debate.",
            "Reflect critically on daily habits.",
          ],
        },
        {
          title: "Attitudes",
          items: [
            "Encourage responsible consumption.",
            "Develop awareness of personal impact on the environment.",
            "Promote thoughtful decision-making.",
          ],
        },
      ],
    },

    {
      id: "activity-overview",
      type: "text",
      title: "Activity Overview",
      body: [
        "Participants explore the difference between needs and wants.",
        "They reflect on how personal choices influence sustainability and wellbeing.",
        "The activity encourages critical thinking about priorities and consumption habits.",
      ],
    },

    {
      id: "requirements",
      type: "list",
      title: "Requirements",
      items: ["Paper", "Pens", "Flipchart"],
    },

    {
      id: "steps",
      type: "steps",
      title: "Description of activity (step-by-step)",
      steps: [
        {
          title: "Introduction",
          duration: "5 minutes",
          body: [
            "The facilitator introduces the concept of needs and wants.",
            "Participants discuss how the line between needs and wants can often become blurred.",
          ],
        },
        {
          title: "Group Activity",
          duration: "15 minutes",
          body: [
            "Participants form small groups.",
            "Each group chooses a topic and names their group after one SDG.",
            "They identify examples of needs and wants related to the topic.",
          ],
        },
        {
          title: "Debate and Discussion",
          duration: "10 minutes",
          body: [
            "Groups discuss how different choices influence sustainability.",
            "Participants reflect on whether their wants contribute to personal growth or act as distractions.",
            "Each group shares their reflections with the whole group.",
          ],
        },
      ],
    },

    {
      id: "assessment",
      type: "text",
      title: "Assessment",
      body: [
        "Assessment is based on participation in group discussion.",
        "Participants demonstrate understanding by explaining the difference between needs and wants.",
      ],
    },

    {
      id: "resources",
      type: "links",
      title: "Resources",
      items: [
        {
          title: "Slides — Activity 2.3 Presentation",
          description: "Slides supporting the Needs and Wants activity.",
          url: "https://pjjslpdbnwfkvlrxrkpr.supabase.co/storage/v1/object/public/course-assets/dsd-teal/Module-2/Activity-2-3/a2-3-presentation.pdf",
          resourceType: "slides",
        },
      ],
    },
  ],
};
