// src/lib/activity/content/activity-2-5.ts
import type { ActivityContent } from "@/src/lib/activity/content-types";

export const activity25Content: ActivityContent = {
  slug: "activity-2-5",
  title: "Fit for 55 Packages",
  moduleLabel:
    "Module 2: The foundations of environmental education and sustainable development",

  intro:
    "Participants explore the Fit for 55 package, reflect on its possible impact, and design creative solutions that support climate goals.",

  meta: [
    { label: "Duration", value: "90 minutes", icon: "⏱" },
    { label: "Setting", value: "F2F", icon: "🧑‍🏫" },
    { label: "Type", value: "Video, Reading, Group Activity", icon: "👥" },
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
            "Fit for 55 packages and practical innovation for sustainability",
          ],
        },
        {
          title: "Knowledge",
          items: [
            "Understand what the Fit for 55 package is and how it fits into the EU climate strategy.",
            "Identify key components, objectives, and implementation ideas related to Fit for 55.",
            "Recognise how Fit for 55 measures may affect businesses, organisations, and communities.",
          ],
        },
        {
          title: "Skills",
          items: [
            "Reflect on policy impacts and raise relevant questions.",
            "Work collaboratively to design practical sustainability solutions.",
            "Present ideas clearly and connect them to climate goals.",
          ],
        },
        {
          title: "Attitudes",
          items: [
            "Encourage openness to sustainable innovation.",
            "Promote responsibility and awareness regarding climate policy.",
            "Strengthen motivation to contribute to practical environmental solutions.",
          ],
        },
      ],
    },

    {
      id: "activity-overview",
      type: "text",
      title: "Activity Overview",
      body: [
        "The facilitator introduces the Fit for 55 package and explains how it supports the EU climate strategy.",
        "Participants watch a short explanatory video and then read a short article or infographic.",
        "They reflect individually on possible impacts of the Fit for 55 package on businesses and organisations.",
        "In groups, participants take part in an innovation challenge and propose practical solutions connected to Fit for 55 goals.",
      ],
    },

    {
      id: "requirements",
      type: "list",
      title: "Requirements",
      items: ["PC/Laptop", "Mobile Devices", "Internet", "Projector", "Flipchart"],
    },

    {
      id: "steps-part-1",
      type: "steps",
      title: "Description of activity (step-by-step)",
      steps: [
        {
          title: "Introduction by the Facilitator",
          duration: "5 minutes",
          body: [
            "The facilitator gives a brief overview of how the Fit for 55 package fits into the EU’s climate strategy.",
          ],
        },
        {
          title: "Interactive Presentation: What is the Fit for 55 package?",
          duration: "15 minutes",
          body: [
            "The facilitator uses slides from the module presentation to explain the Fit for 55 package.",
            "Participants are introduced to the main objectives and why the package is important for the green transition.",
          ],
        },
        {
          title: "Video",
          duration: "10 minutes",
          body: [
            "Participants watch a short video explaining the Fit for 55 package.",
            "The facilitator may use a resource from the European Commission or Euronews.",
          ],
        },
      ],
    },

        {
          id: "videos",
          type: "videos",
          title: "Videos",
          items: [
       {
          title: "What could be the impact of the Fit for 55 packages?",
          url: "https://www.youtube.com/watch?v=LBxlsEiL7ic&t=11s",
          thumbnailUrl: "https://img.youtube.com/vi/LBxlsEiL7ic/hqdefault.jpg",
          description: "Video resource used in the activity.",
       },
     ],
   },


    {
      id: "steps-part-2",
      type: "steps",
      title: "Description of activity (step-by-step)",
      steps: [
        {
          title: "Individual Activity: Reading and Reflection",
          duration: "15 minutes",
          body: [
            "The facilitator provides an article or infographic summarising the Fit for 55 measures.",
            "Participants highlight key points and write down one question or concern they have.",
            "Reflection question: What could be the impact of the Fit for 55 package on businesses and organisations?",
          ],
        },
        {
          title: "Group Activity: Invent the Future – Fit for 55 Innovation Challenge",
          duration: "30 minutes",
          body: [
            "Participants are divided into small groups of 3–5 people.",
            "Each group is assigned one Fit for 55 focus area: sustainable transport, renewable energy, energy-efficient buildings, carbon pricing and emissions reduction, or social fairness and inclusion.",
            "Each group receives a challenge brief and designs a practical, sustainable solution.",
            "Groups are encouraged to name their project, define the problem, describe the solution, explain how it supports Fit for 55 goals, and include a visual such as a poster, diagram, or concept map.",
          ],
        },
        {
          title: "Pitch and Share",
          duration: "10 minutes",
          body: [
            "Each group presents its idea in a short 2-minute pitch.",
            "The class may optionally vote on the most innovative or impactful idea.",
          ],
        },
        {
          title: "Conclusion and Reflection",
          duration: "20 minutes",
          body: [
            "The facilitator summarises the session and invites participants to reflect on how the Fit for 55 package could affect their country or region.",
            "Participants discuss what challenges might arise in implementing these measures.",
            "They also reflect on how educators can raise awareness about these policies and identify one action they can take in their teaching or daily life.",
          ],
        },
      ],
    },

    {
      id: "assessment",
      type: "text",
      title: "Assessment",
      body: [
        "Assessment is based on participation in reflection, discussion, and group presentation.",
        "Participants demonstrate understanding by explaining Fit for 55 ideas and proposing practical solutions linked to climate goals.",
      ],
    },

    {
  id: "resources",
  type: "links",
  title: "Resources",
  items: [

    {
      title: "Video — What could be the impact of the Fit for 55 packages?",
      description: "Video resource used in the activity.",
      url: "https://www.youtube.com/watch?v=LBxlsEiL7ic&t=11s",
      resourceType: "external",
    },
 

    {
      title: "Slides — Activity 2.5 Presentation",
      description: "Presentation used during the activity.",
      url: "https://pjjslpdbnwfkvlrxrkpr.supabase.co/storage/v1/object/public/course-assets/dsd-teal/Module-2/Activity-2-5/a2-5-presentation.pdf",
      resourceType: "slides",
    },
    {
      title: "Reading — OECD: Effects of the EU Fit for 55 package",
      description: "Supporting reading for reflection activity.",
      url: "https://pjjslpdbnwfkvlrxrkpr.supabase.co/storage/v1/object/public/course-assets/dsd-teal/Module-2/Activity-2-5/fit-for-55-article.pdf",
      resourceType: "external",
     }
    ],
   } 

  ],
};
