// src/lib/activity/content/activity-1-5.ts
import type { ActivityContent } from "@/src/lib/activity/content-types";

export const activity15Content: ActivityContent = {
  slug: "activity-1-5",
  title: "Designing TEAL Activities with Digital Integration",
  moduleLabel: "Module 1: Introduction to TEAL teaching methodology",
  intro:
    "In this activity, participants design their own Technology-Enhanced Active Learning (TEAL) activity focused on sustainability education. They explore real-world environmental challenges and integrate digital tools into collaborative learning activities. Participants then present and refine their ideas through peer feedback.",
  meta: [
    { label: "Duration", value: "105 minutes", icon: "⏱" },
    { label: "Setting", value: "Face-to-Face", icon: "🧑‍🏫" },
    { label: "Type", value: "Group activity, Discussion, Design task", icon: "👥" },
  ],

  sections: [
    {
      id: "learning-focus",
      type: "cards",
      title: "Learning Focus",
      cards: [
        {
          title: "Topic",
          items: ["Designing TEAL learning activities with digital tools"],
        },
        {
          title: "Knowledge",
          items: [
            "Principles of Technology-Enhanced Active Learning",
            "Integration of digital tools in learning design",
            "Sustainability themes in education",
            "Collaborative learning design strategies",
            "Peer review and reflective practice",
          ],
        },
        {
          title: "Skills",
          items: [
            "Designing TEAL learning activities",
            "Integrating digital tools into lesson plans",
            "Collaborating in teams to develop learning scenarios",
            "Presenting and explaining educational design ideas",
            "Evaluating and refining learning activities",
          ],
        },
        {
          title: "Attitudes",
          items: [
            "Creative thinking in educational design",
            "Openness to experimentation with technology",
            "Collaboration and peer learning",
            "Awareness of sustainability challenges",
            "Commitment to learner-centered teaching",
          ],
        },
      ],
    },

    {
      id: "activity-overview",
      type: "text",
      title: "Activity Overview",
      body: [
        "Participants work in small groups to design a TEAL activity addressing a sustainability challenge such as waste reduction, biodiversity conservation, or energy efficiency.",
        "Each group completes a TEAL activity design template, integrating digital tools and defining learning objectives, activity steps, assessment methods, and accessibility considerations.",
      ],
    },

    {
      id: "steps",
      type: "steps",
      title: "Step-by-Step Activity",
      steps: [
        {
          title: "Introduction",
          duration: "15 minutes",
          body: [
            "The facilitator introduces the objectives of the activity and explains how TEAL can support sustainability education.",
            "Participants explore examples of sustainability themes such as waste reduction, climate change awareness, and energy efficiency.",
          ],
        },
        {
          title: "TEAL Lesson Design",
          duration: "45 minutes",
          body: [
            "Participants work in groups to design a TEAL learning activity that addresses a selected sustainability theme.",
            "Groups define learning objectives, select digital tools, and design collaborative learning tasks.",
          ],
          bullets: [
            "Choose a sustainability theme (e.g., waste reduction or energy efficiency)",
            "Integrate digital tools to support collaboration and engagement",
            "Design the learning activities and assessment approach",
          ],
        },
        {
          title: "Peer Review and Feedback",
          duration: "45 minutes",
          body: [
            "Each group presents its TEAL activity design to the class.",
            "Participants provide feedback on clarity, alignment with TEAL principles, and potential impact on learners.",
          ],
        },
      ],
    },

    {
      id: "requirements",
      type: "list",
      title: "Requirements",
      items: [
        "PC / Laptop",
        "Mobile devices",
        "Internet",
        "Projector",
        "Access to digital collaboration tools (Google Docs, Miro, etc.)",
      ],
    },

    {
      id: "assessment",
      type: "text",
      title: "Assessment",
      body: [
        "Participants are assessed based on the quality of their TEAL activity design, the integration of digital tools, and their ability to collaborate effectively within their group.",
        "Peer feedback and discussion are used to refine the proposed learning activities and encourage reflective practice.",
      ],
    },

    {
      id: "resources",
      type: "links",
      title: "Resources",
      items: [
        {
          title: "Slides — Activity 1.5 Presentation",
          description: "Open the presentation slides used in this activity.",
          url: "https://pjjslpdbnwfkvlrxrkpr.supabase.co/storage/v1/object/public/course-assets/dsd-teal/Module-1/Activity-%201-5/a1-5-presentation.pdf",
          resourceType: "slides",
        },
        {
          title: "Digital Tools for Collaborative Learning — Edutopia",
          url: "https://www.edutopia.org/article/digital-tools-collaborative-learning",
          resourceType: "external",
        },
        {
          title: "Using Technology to Promote Active Learning — Edutopia",
          url: "https://www.edutopia.org/article/using-technology-active-learning",
          resourceType: "external",
        },
      ],
    },
  ],
};
