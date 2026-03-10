// src/lib/activity/content/activity-1-3.ts
import type { ActivityContent } from "@/src/lib/activity/content-types";

export const activity13Content: ActivityContent = {
  slug: "activity-1-3",
  title: "Deepening TEAL Application",
  moduleLabel: "Module 1: Introduction to TEAL teaching methodology",
  intro:
    "In this activity, participants explore the practical application of TEAL principles through the analysis of an article that highlights real-world TEAL implementation examples. They reflect on blended learning, active participation, and technology integration, and discuss how these approaches can be applied in their own teaching or learning environments.",
  meta: [
    { label: "Duration", value: "210 minutes", icon: "⏱" },
    { label: "Setting", value: "Face-to-Face", icon: "🧑‍🏫" },
    {
      label: "Type",
      value: "Discussion, Group activity",
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
          items: ["Applying TEAL principles through article analysis and discussion"],
        },
        {
          title: "Knowledge",
          items: [
            "Application of TEAL principles in diverse educational contexts",
            "Blended learning and technology-enhanced active learning",
            "Real-world examples of TEAL implementation",
            "Advantages and challenges of TEAL in practice",
            "Connections between active learning, collaboration, and technology integration",
          ],
        },
        {
          title: "Skills",
          items: [
            "Analyzing educational examples critically",
            "Reflecting on TEAL implementation",
            "Discussing and synthesizing ideas in groups",
            "Applying insights to personal teaching or learning environments",
            "Sharing findings in whole-group discussion",
          ],
        },
        {
          title: "Attitudes",
          items: [
            "Openness to blended learning approaches",
            "Reflective mindset",
            "Collaborative engagement",
            "Willingness to adapt teaching practice",
            "Appreciation of technology as a learning enabler",
          ],
        },
      ],
    },
    {
      id: "activity-overview",
      type: "text",
      title: "Activity Overview",
      body: [
        "The facilitator introduces the activity and explains that participants will explore the practical application of TEAL principles through the analysis of an article highlighting real-world TEAL implementation examples.",
        "Participants engage individually with the material and then work in groups to reflect on how the article demonstrates active learning, collaboration, and technology integration in educational practice.",
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
            "The facilitator introduces the activity and explains that participants will explore the practical application of TEAL principles through an article and guided discussion.",
            "The facilitator presents the objectives of the activity: to analyze how TEAL principles can be applied in different educational contexts and to reflect on TEAL strategies through reading and discussion.",
          ],
        },
        {
          title: "Reading",
          duration: "60 minutes",
          body: [
            'The facilitator provides participants with the article titled "Exploring student perceptions and use of face-to-face classes, technology-enhanced active learning, and online resources."',
            "Participants read the article individually for approximately 30 minutes.",
            "The facilitator may support the reading with presentation slides and guiding prompts.",
          ],
        },
        {
          title: "Group Discussion",
          duration: "60 minutes",
          body: [
            "After reading the article, participants are divided into small groups to discuss their insights.",
            "Each group reflects on how the article demonstrates TEAL principles and considers how these ideas could be applied in their own teaching or learning environments.",
            "Each group prepares a brief summary of its discussion to share with the larger group.",
          ],
          bullets: [
            "How the article reflects key TEAL principles: active learning, collaboration, and technology integration",
            "Advantages and challenges of implementing TEAL in different educational settings",
            "Ways to apply these insights in personal teaching or learning contexts",
          ],
        },
        {
          title: "Whole-Group Sharing and Debrief",
          duration: "30 minutes",
          body: [
            "Each group presents its findings to the whole group.",
            "The facilitator encourages participants to reflect on common themes, recurring challenges, and creative solutions for integrating TEAL principles into teaching.",
            "The session concludes with key takeaways on blended learning, active learning strategies, and the role of technology in modern education.",
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
      ],
    },
    {
      id: "assessment",
      type: "text",
      title: "Assessment",
      body: [
        "The facilitator assesses participants’ ability to understand and apply TEAL principles based on their participation in the reading session and discussions.",
        "Assessment focuses on the depth of discussion in small groups, the creativity of ideas for applying TEAL strategies, and the ability to engage in whole-group discussion and share insights effectively.",
      ],
    },
    {
      id: "videos",
      type: "videos",
      title: "Videos",
      items: [
        {
          title: "A Technology Enhanced Active Learning Space",
          url: "https://www.youtube.com/watch?v=SbF7pMVIcsU",
          description:
            "Watch a real Technology-Enhanced Active Learning (TEAL) classroom environment in practice.",
          thumbnailUrl: "https://img.youtube.com/vi/SbF7pMVIcsU/hqdefault.jpg",
        },
      ],
    },
    {
      id: "resources",
      type: "links",
      title: "Resources",
      items: [
        {
          title:
            "Article — Exploring student perceptions and use of face-to-face classes, technology-enhanced active learning, and online resources",
          description:
            "Read the article used in this activity to explore blended learning and technology-enhanced active learning in practice.",
          url: "https://pjjslpdbnwfkvlrxrkpr.supabase.co/storage/v1/object/public/course-assets/dsd-teal/Module-1/Activity%20-1-3/activity-1-3_pages-9-11.pdf",
          resourceType: "article",
        },
        {
          title: "Slides — Activity 1.3 Presentation",
          description: "Open the presentation slides used in this activity.",
          url: "https://pjjslpdbnwfkvlrxrkpr.supabase.co/storage/v1/object/public/course-assets/dsd-teal/Module-1/Activity%20-1-3/a1-3-presentation.pdf",
          resourceType: "slides",
        },
        {
          title: "Active Learning Strategies — Queen’s University",
          description:
            "Additional reading on active learning strategies and learner engagement.",
          url: "https://www.queensu.ca/ctl/resources/instructors/instructional-strategies/active-learning",
          resourceType: "external",
        },
        {
          title:
            "Enhancing Learning: The Power of Blended Approaches and Technology-Enhanced Active Learning",
          description:
            "Further reading on blended approaches and TEAL in higher education.",
          url: "https://link.springer.com/article/10.1186/s41239-023-00416-3",
          resourceType: "external",
        },
      ],
    },
  ],
};   
