// src/lib/activity/content/activity-1-2.ts
import type { ActivityContent } from "@/src/lib/activity/content-types";

export const activity12Content: ActivityContent = {
  slug: "activity-1-2",
  title: "TEAL in Action: Applying TEAL Strategies in Real Scenarios",
  moduleLabel: "Module 1: Introduction to TEAL teaching methodology",
  intro:
    "In this activity, participants explore practical applications of TEAL through case study analysis and role-playing. They examine how TEAL principles can be applied in different contexts and develop TEAL-based responses to realistic teaching scenarios.",
  meta: [
    { label: "Duration", value: "90 minutes", icon: "⏱" },
    { label: "Setting", value: "Face-to-Face", icon: "🧑‍🏫" },
    {
      label: "Type",
      value: "Discussion, Group activity, Case study analysis, Role-playing",
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
          items: ["Applying TEAL strategies in real teaching scenarios"],
        },
        {
          title: "Knowledge",
          items: [
            "Practical application of TEAL principles",
            "Case study analysis",
            "Role-playing as a learning strategy",
            "Teaching challenges in different contexts",
            "TEAL-based solution design",
          ],
        },
        {
          title: "Skills",
          items: [
            "Analyzing real teaching scenarios",
            "Applying TEAL principles to practice",
            "Developing creative learning solutions",
            "Presenting and defending ideas",
            "Collaborating effectively in groups",
          ],
        },
        {
          title: "Attitudes",
          items: [
            "Openness to experimentation",
            "Confidence in applying TEAL in practice",
            "Collaborative mindset",
            "Reflective problem-solving",
            "Learner-centered thinking",
          ],
        },
      ],
    },
    {
      id: "activity-overview",
      type: "text",
      title: "Activity Overview",
      body: [
        "The facilitator introduces the activity and explains that participants will explore practical applications of TEAL through case study analysis and role-playing.",
        "The activity aims to help participants analyze how TEAL principles can be applied in different contexts and experience TEAL strategies in action.",
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
            "The facilitator introduces the activity and explains that participants will explore practical applications of TEAL through case study analysis and role-playing.",
            "The facilitator presents the objectives of the activity: to analyze how TEAL principles can be applied in different contexts and to experience TEAL strategies through role-playing.",
          ],
        },
        {
          title: "Case Study Analysis",
          duration: "40 minutes",
          body: [
            "The facilitator divides participants into small groups.",
            "Each group receives a different case study scenario illustrating a teaching situation.",
            "Groups analyze their assigned case study, identify opportunities to apply TEAL principles and strategies, and discuss how they would modify the situation using TEAL.",
          ],
          bullets: [
            "Case Study — TEAL for Upskilling: enhancing adult learning through interactive methods",
            "Case Study — Unmotivated Class: increasing student engagement in a disengaged group of learners",
          ],
        },
        {
          title: "Presentation of Solutions and Guided Discussion",
          duration: "40 minutes",
          body: [
            "After analyzing the case study, each group prepares a brief presentation of its TEAL-based solution.",
            "Groups present their proposals to the class, explaining how they applied TEAL principles to address the challenges in the case study.",
            "The facilitator leads a structured discussion to deepen the reasoning behind the proposed solutions, compare strategies, and reflect on key takeaways.",
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
        "Internet (if digital case studies are used)",
        "Projector",
      ],
    },
    {
      id: "assessment",
      type: "text",
      title: "Assessment",
      body: [
        "The trainer assesses participants’ ability to apply TEAL principles through their analysis of the case studies and their participation in the role-playing activity.",
        "Assessment focuses on the depth of analysis, the creativity and effectiveness of the proposed TEAL strategies, and the ability to collaborate and communicate effectively within groups.",
      ],
    },
    {
      id: "further-reading",
      type: "links",
      title: "Case Studies and Further Reading",
      items: [
        {
          title: "Case Study — TEAL for Upskilling",
          description:
            "Explore a practical scenario on enhancing adult learning through interactive TEAL methods.",
          url: "https://pjjslpdbnwfkvlrxrkpr.supabase.co/storage/v1/object/public/course-assets/dsd-teal/Module-1/Activity%20-1-2/case-study-teal-for-upskilling.pdf",
          resourceType: "case-study",
        },
        {
          title: "Case Study — Unmotivated Class",
          description:
            "Review a classroom scenario focused on improving engagement through TEAL strategies.",
          url: "https://pjjslpdbnwfkvlrxrkpr.supabase.co/storage/v1/object/public/course-assets/dsd-teal/Module-1/Activity%20-1-2/case-study-unmotivated-class.pdf",
          resourceType: "case-study",
        },
        {
          title: "Slides — Activity 1.2 Presentation",
          description: "Open the presentation slides used in this activity.",
          url: "https://pjjslpdbnwfkvlrxrkpr.supabase.co/storage/v1/object/public/course-assets/dsd-teal/Module-1/Activity%20-1-2/a1-2-presentation.pdf",
          resourceType: "slides",
        },
        {
          title: "Active Learning Strategies — Queen’s University",
          description:
            "Additional reading on active learning strategies and learner engagement.",
          url: "https://www.queensu.ca/ctl/resources/instructors/instructional-strategies/active-learning",
          resourceType: "external",
        },
      ],
    },
  ],
};
