// src/lib/activity/content/activity-2-2.ts
import type { ActivityContent } from "@/src/lib/activity/content-types";

export const activity22Content: ActivityContent = {
  slug: "activity-2-2",
  title: "To Become a Changemaker",
  moduleLabel:
    "Module 2: The foundations of environmental education and sustainable development",

  intro:
    "Reflection and discussion activity focused on personal change, responsibility, and sustainable choices.",

  meta: [
    { label: "Duration", value: "40 minutes", icon: "⏱" },
    { label: "Setting", value: "F2F", icon: "🧑‍🏫" },
    { label: "Type", value: "Discussion, Reflection", icon: "👥" },
  ],

  sections: [
    {
      id: "learning-focus",
      type: "cards",
      title: "Learning Focus",
      cards: [
        {
          title: "Topic",
          items: [
            "Personal transformation, sustainable choices, and becoming a changemaker",
          ],
        },
        {
          title: "Knowledge",
          items: [
            "Understand the meaning of personal change in relation to sustainability.",
            "Recognise the difference between needs and wants.",
            "Identify examples of wasteful consumption and reflect on better choices.",
          ],
        },
        {
          title: "Skills",
          items: [
            "Reflect on personal habits and consumption patterns.",
            "Discuss ideas with others and exchange perspectives.",
            "Identify practical changes that can support more sustainable living.",
          ],
        },
        {
          title: "Attitudes",
          items: [
            "Develop openness to change and self-improvement.",
            "Show responsibility for personal choices.",
            "Strengthen motivation to contribute positively to society and the environment.",
          ],
        },
      ],
    },

    {
      id: "activity-overview",
      type: "text",
      title: "Activity Overview",
      body: [
        "Participants reflect individually on things they own but rarely use.",
        "They consider what they would choose instead and how their decisions connect to sustainability.",
        "The activity encourages participants to think about change in their lives and how they can become changemakers.",
        "The session continues with discussion and exchange of ideas.",
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
          title: "Introduction to the activity",
          duration: "5 minutes",
          body: [
            "The facilitator introduces the activity and explains that participants will reflect on their own habits, choices, and experiences of change.",
            "Participants are invited to think about how personal transformation can contribute to a more sustainable world.",
          ],
        },
        {
          title: "Individual reflection",
          duration: "10 minutes",
          body: [
            "Participants work individually.",
            "They mention all the things they have in their house that they rarely use and that were probably a waste of money.",
            "They reflect on what they would choose instead if they had the chance to give those items back.",
          ],
        },
        {
          title: "Thinking about change",
          duration: "10 minutes",
          body: [
            "Participants think about the last 12 months and how much change they have experienced.",
            "They reflect on questions such as: What if you could lead change in your work and life, rather than simply responding to it?",
            "What if you were responsible for your own transformation?",
            "What if you could be adaptable enough to surf the waves of change rather than be overwhelmed by them?",
          ],
        },
        {
          title: "Discussion and sharing",
          duration: "10 minutes",
          body: [
            "Participants discuss their reflections in pairs or small groups.",
            "They exchange ideas about sustainable choices, personal responsibility, and how individuals can influence change in daily life.",
            "The facilitator encourages participants to connect their reflections to the wider goals of sustainable development.",
          ],
        },
        {
          title: "Conclusion",
          duration: "5 minutes",
          body: [
            "Participants share one key takeaway from the activity.",
            "The facilitator concludes by highlighting that meaningful change often begins with small personal decisions and awareness.",
          ],
        },
      ],
    },

    {
      id: "assessment",
      type: "text",
      title: "Assessment",
      body: [
        "Assessment is based on participation in the reflection and discussion.",
        "Participants demonstrate understanding by identifying personal examples of change and suggesting more sustainable choices.",
      ],
    },

    {
      id: "resources",
      type: "links",
      title: "Resources",
      items: [
        {
          title: "Slides — Activity 2.2 Presentation",
          description:
            "Slides used to introduce the changemaker reflection activity.",
          url: "https://pjjslpdbnwfkvlrxrkpr.supabase.co/storage/v1/object/public/course-assets/dsd-teal/Module-2/Activity-2-2/a2-2-presentation.pdf",
          resourceType: "slides",
        },
      ],
    },
  ],
};
