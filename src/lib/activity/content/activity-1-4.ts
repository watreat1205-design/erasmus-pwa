// src/lib/activity/content/activity-1-4.ts
import type { ActivityContent } from "@/src/lib/activity/content-types";

export const activity14Content: ActivityContent = {
  slug: "activity-1-4",
  title: "Digital Tools for TEAL",
  moduleLabel: "Module 1: Introduction to TEAL teaching methodology",
  intro:
    "In this activity, participants explore the role of digital tools in supporting Technology-Enhanced Active Learning (TEAL). They analyze categories of digital tools, watch demonstrations of selected platforms, and gain hands-on experience applying tools such as Google Docs, Kahoot, and Mentimeter in collaborative learning activities.",
  meta: [
    { label: "Duration", value: "150 minutes", icon: "⏱" },
    { label: "Setting", value: "Face-to-Face", icon: "🧑‍🏫" },
    {
      label: "Type",
      value: "Discussion, Group activity, Individual activity",
      icon: "👥",
    },
  ],
  sections: [
    {
      id: "learning-focus",
      type: "cards",
      title: "Learning Focus",
      cards: [
        {
          title: "Topic",
          items: ["Digital tools supporting TEAL methodology"],
        },
        {
          title: "Knowledge",
          items: [
            "Categories of digital tools used in TEAL",
            "Communication and collaboration platforms",
            "Content creation and assessment tools",
            "Benefits and challenges of digital tools in learning",
            "Strategies for integrating tools into TEAL activities",
          ],
        },
        {
          title: "Skills",
          items: [
            "Exploring digital learning platforms",
            "Using collaborative tools in teaching activities",
            "Designing interactive learning experiences",
            "Evaluating digital tools for learning goals",
            "Collaborating with peers using digital platforms",
          ],
        },
        {
          title: "Attitudes",
          items: [
            "Openness to digital innovation in teaching",
            "Confidence in experimenting with educational technology",
            "Collaborative mindset",
            "Reflective thinking about tool effectiveness",
            "Awareness of equitable technology access",
          ],
        },
      ],
    },

    {
      id: "activity-overview",
      type: "text",
      title: "Activity Overview",
      body: [
        "The facilitator introduces the importance of digital tools in Technology-Enhanced Active Learning (TEAL). Participants explore how digital platforms can support interaction, collaboration, and engagement in learning environments.",
        "Through demonstrations and hands-on exploration, participants experiment with selected digital tools and reflect on how these technologies can enhance active learning strategies in their own teaching or learning contexts.",
      ],
    },

    {
      id: "steps",
      type: "steps",
      title: "Step-by-Step Activity",
      steps: [
        {
          title: "Introduction",
          duration: "10 minutes",
          body: [
            "The facilitator introduces the activity and explains the role of digital tools in supporting active learning and collaboration.",
            "Participants reflect briefly on digital tools they have previously used in teaching or learning.",
          ],
        },
        {
          title: "Interactive Presentation of Digital Tools",
          duration: "30 minutes",
          body: [
            "The facilitator presents categories of digital tools used in TEAL environments.",
            "Examples include communication tools (Slack, Microsoft Teams), collaboration tools (Google Docs, Miro), content creation tools (Mentimeter, Nearpod), and assessment tools (Google Forms, Kahoot).",
          ],
        },
        {
          title: "Video Demonstrations of Tool Usage",
          duration: "30 minutes",
          body: [
            "Participants watch short demonstrations showing how digital tools can support interactive and collaborative learning.",
            "The facilitator highlights key features and practical applications of the tools.",
          ],
        },
        {
          title: "Hands-on Exploration of Tools",
          duration: "45 minutes",
          body: [
            "Participants work in groups to explore selected digital tools.",
            "Each group focuses on one tool and experiments with creating collaborative content or interactive learning materials.",
          ],
          bullets: [
            "Group 1: Google Docs — Collaborative document creation",
            "Group 2: Kahoot — Interactive quiz creation",
            "Group 3: Mentimeter — Interactive poll creation",
          ],
        },
        {
          title: "Group Discussion on Integration Strategies",
          duration: "15 minutes",
          body: [
            "Participants share their experiences using the tools.",
            "The facilitator guides discussion on how digital tools can enhance engagement, collaboration, and assessment in TEAL environments.",
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
          title: "Google Docs Tutorial for Beginners",
          url: "https://www.youtube.com/watch?v=eRqUE6IHTEA",
          thumbnailUrl: "https://img.youtube.com/vi/eRqUE6IHTEA/hqdefault.jpg",
        },
        {
          title: "How to Use Kahoot",
          url: "https://www.youtube.com/watch?v=pAfnia7-rMk",
          thumbnailUrl: "https://img.youtube.com/vi/pAfnia7-rMk/hqdefault.jpg",
        },
        {
          title: "Mentimeter Tutorial",
          url: "https://www.youtube.com/watch?v=CsasywVt6E8&t=4s",
          thumbnailUrl: "https://img.youtube.com/vi/CsasywVt6E8/hqdefault.jpg",
       }
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
        "Access to digital platforms (Google Docs, Kahoot, Mentimeter)",
      ],
    },

    {
      id: "assessment",
      type: "text",
      title: "Assessment",
      body: [
        "Participants’ understanding is assessed through their engagement in hands-on activities and group discussions.",
        "The facilitator observes how effectively participants use digital tools to support collaboration, interaction, and active learning.",
      ],
    },

    {
      id: "resources",
      type: "links",
      title: "Resources",
      items: [
        {
          title: "Slides — Activity 1.4 Presentation",
          description:
            "Open the presentation slides used during this activity.",
          url: "https://pjjslpdbnwfkvlrxrkpr.supabase.co/storage/v1/object/public/course-assets/dsd-teal/Module-1/Activity%20-1-4/a1-4-presentation.pdf",
          resourceType: "slides",
        },
        {
          title: "Using Technology for Active Learning — Edutopia",
          url: "https://www.edutopia.org/article/using-technology-active-learning",
          resourceType: "external",
        },
        {
          title: "Collaborative Digital Presentations — Edutopia",
          url: "https://www.edutopia.org/video/collaborative-digital-presentations-enrich-projects-tech2learn-series",
          resourceType: "external",
        },
        {
          title: "Using Kahoot! for Engaging Quizzes and Assessments",
          description:
         "A guide on how to effectively use Kahoot! in the classroom to engage students and assess learning.",
          url: "https://kahoot.com/",
          resourceType: "external",
        },
        {
          title: "Getting Started with Miro",
          url: "https://miro.com/",
          resourceType: "external",
        },
        {
          title: "Mentimeter for Interactive Presentations",
          description:
         "How to use Mentimeter to create real-time interactive presentations, polls, and surveys to engage students.",
          url: "https://www.mentimeter.com/",
          resourceType: "external",
       },  
      ],
    },
  ],
};
