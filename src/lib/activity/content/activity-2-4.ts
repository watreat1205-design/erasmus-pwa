// src/lib/activity/content/activity-2-4.ts
import type { ActivityContent } from "@/src/lib/activity/content-types";

export const activity24Content: ActivityContent = {
  slug: "activity-2-4",
  title: "To Promote Green Deal Policies",
  moduleLabel:
    "Module 2: The foundations of environmental education and sustainable development",

  intro:
    "Participants explore the European Green Deal and analyse practical sustainability case studies connected to schools and communities.",

  meta: [
    { label: "Duration", value: "90 minutes", icon: "⏱" },
    { label: "Setting", value: "F2F", icon: "🧑‍🏫" },
    { label: "Type", value: "Presentation, Case Study, Discussion", icon: "👥" },
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
            "The European Green Deal and practical sustainability case studies",
          ],
        },
        {
          title: "Knowledge",
          items: [
            "Understand what the European Green Deal is and why it is important.",
            "Identify key Green Deal objectives and benefits.",
            "Recognise how Green Deal principles can be applied in schools and communities.",
          ],
        },
        {
          title: "Skills",
          items: [
            "Analyse sustainability challenges through case studies.",
            "Discuss practical solutions in groups.",
            "Present ideas and reflect on how Green Deal principles can be applied in educational contexts.",
          ],
        },
        {
          title: "Attitudes",
          items: [
            "Develop awareness of sustainability in education.",
            "Promote responsibility for environmental action.",
            "Encourage openness to innovative green practices in schools and local communities.",
          ],
        },
      ],
    },

    {
      id: "activity-overview",
      type: "text",
      title: "Activity Overview",
      body: [
        "The facilitator introduces the European Green Deal and its relevance to sustainability and education.",
        "Participants explore examples of Green Deal action through case studies.",
        "They work in groups, discuss challenges and solutions, and present their ideas to the whole group.",
      ],
    },

    {
      id: "requirements",
      type: "list",
      title: "Requirements",
      items: ["PC/Laptop", "Mobile Devices", "Internet", "Projector", "Flipchart"],
    },

    {
      id: "steps",
      type: "steps",
      title: "Description of activity (step-by-step)",
      steps: [
        {
          title: "Introduction by the facilitator",
          duration: "5 minutes",
          body: [
            "The facilitator introduces the European Green Deal and explains why it is important.",
            "Participants are invited to reflect on how sustainability policies influence daily life and education.",
          ],
        },
        {
          title: "Interactive Presentation: What is the European Green Deal?",
          duration: "20 minutes",
          body: [
            "The facilitator presents the concept and objectives of the European Green Deal.",
            "Participants learn that the Green Deal is the EU’s response to climate change and environmental degradation.",
            "The facilitator explains the aim of climate neutrality and the importance of sustainable transformation.",
          ],
        },
        {
          title: "Case Study Analysis",
          duration: "40 minutes",
          body: [
            "Participants are divided into small groups.",
            "Each group receives a different case study scenario.",
            "Groups analyse the scenario, identify the sustainability challenge, and discuss possible solutions connected to Green Deal principles.",
            "The two case studies are: Greener Schools: Reducing Carbon Footprints in Education, and Sustainable Mobility Campaign.",
          ],
        },
        {
          title: "Presentation of Solutions and Guided Discussion",
          duration: "20 minutes",
          body: [
            "Each group presents its ideas and proposed solutions.",
            "The facilitator guides discussion and encourages participants to connect the case studies to their own work and educational settings.",
          ],
        },
        {
          title: "Conclusion",
          duration: "5 minutes",
          body: [
            "The facilitator summarises the main ideas of the European Green Deal and highlights the importance of practical action.",
            "Participants reflect on one sustainability action they could promote in their own context.",
          ],
        },
      ],
    },

    {
      id: "assessment",
      type: "text",
      title: "Assessment",
      body: [
        "Participants are assessed through participation in case study analysis and group discussion.",
        "They demonstrate understanding by identifying practical actions that support Green Deal objectives.",
      ],
    },
    {
  id: "resources",
  type: "links",
  title: "Resources",
  items: [
    {
      title: "Slides — Activity 2.4 Presentation",
      description: "Presentation used during the activity.",
      url: "https://pjjslpdbnwfkvlrxrkpr.supabase.co/storage/v1/object/public/course-assets/dsd-teal/Module-2/Activity-2-4/a2-4-presentation.pdf",
      resourceType: "slides",
    },
    {
      title: "Case Study — Greener Schools: Reducing Carbon Footprints in Education",
      description: "Case study resource for group analysis.",
      url: "https://pjjslpdbnwfkvlrxrkpr.supabase.co/storage/v1/object/public/course-assets/dsd-teal/Module-2/Activity-2-4/case-study-greener-schools.pdf",
      resourceType: "external",
    },
    {
      title: "Case Study — Sustainable Mobility Campaign",
      description: "Case study resource for group analysis.",
      url: "https://pjjslpdbnwfkvlrxrkpr.supabase.co/storage/v1/object/public/course-assets/dsd-teal/Module-2/Activity-2-4/case-study-sustainable-mobility.pdf",
      resourceType: "external",
      },
    ],
   }  
  ],
};
