// src/lib/activity/content/activity-1-1.ts
import type { ActivityContent } from "@/src/lib/activity/content-types";

export const activity11Content: ActivityContent = {
  slug: "activity-1-1",
  title: "Exploring TEAL",
  moduleLabel: "Module 1: Introduction to TEAL teaching methodology",
  intro:
    "In this activity, participants explore the Technology-Enhanced Active Learning (TEAL) approach and its key components: active learning, technology integration, and collaboration.",
  meta: [
    { label: "Duration", value: "110 minutes", icon: "⏱" },
    { label: "Setting", value: "Face-to-Face", icon: "🧑‍🏫" },
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
          items: ["Introduction to TEAL teaching methodology"],
        },
        {
          title: "Knowledge",
          items: [
            "TEAL principles and comparison",
            "Active teaching strategies",
            "Teacher and student role",
            "Digital tools for TEAL",
            "TEAL activity planning",
          ],
        },
        {
          title: "Skills",
          items: [
            "Analyzing and applying TEAL",
            "Selecting teaching strategies",
            "Using digital tools",
            "Designing teaching activities",
            "Critically evaluating TEAL",
          ],
        },
        {
          title: "Attitudes",
          items: [
            "Openness to educational innovation",
            "Appreciation for active learning",
            "Willingness to experiment",
            "Awareness of the role of technology",
            "Reflective and collaborative mindset",
          ],
        },
      ],
    },
    {
      id: "activity-overview",
      type: "text",
      title: "Activity Overview",
      body: [
        "The facilitator introduces the module objectives and provides a brief overview of the session.",
        "The session focuses on understanding TEAL and how active learning, technology integration, and collaboration can work together in teaching practice.",
      ],
    },
    {
      id: "steps",
      type: "steps",
      title: "Step-by-Step Activity",
      steps: [
        {
          title: "Introduction to the Module",
          duration: "5 minutes",
          body: [
            "The facilitator begins by introducing the module objectives and providing a brief overview of the session.",
            "The facilitator explains that the goal is to explore the TEAL approach and its key components: active learning, technology integration, and collaboration.",
          ],
        },
        {
          title: "Icebreaker — Two Truths and a Lie",
          duration: "20 minutes",
          body: [
            "Each participant shares three statements about themselves: two are true, and one is false. The rest of the group guesses which statement is the lie.",
            "Participants are encouraged to include at least one educational reflection or teaching experience involving technology or active learning.",
          ],
          bullets: [
            "Create a relaxed and interactive atmosphere",
            "Encourage communication and interaction among participants",
            "Stimulate reflection on active learning and technology integration",
            "Discuss how technology can improve student interaction and make learning more engaging",
          ],
        },
        {
          title: "Interactive Presentation",
          duration: "40 minutes",
          body: [
            "The facilitator introduces the definition of TEAL, its roots in higher education, and its adaptability to different teaching contexts.",
            "The presentation covers TEAL's core components: active learning, technology integration, and collaboration.",
            "Practical examples are used to show how TEAL can be applied in teaching.",
            "Participants are invited to ask questions and contribute insights throughout the presentation.",
          ],
        },
        {
          title: "Think-Pair-Share Activity",
          duration: "20 minutes",
          body: [
            'Participants reflect on the question: "How do teaching and learning dynamics change when using TEAL compared to traditional methods?"',
            "They first think individually, then discuss in pairs, and finally share their reflections with the whole group.",
          ],
        },
        {
          title: "Brainstorming and Group Discussion",
          duration: "20 minutes",
          body: [
            "Participants are divided into small groups using coloured cards.",
            "Each group explores one aspect of TEAL: active learning, technology integration, or collaboration.",
            "Groups discuss and write down their ideas on paper or a whiteboard, then share them with the whole group.",
          ],
        },
        {
          title: "Conclusion",
          duration: "5 minutes",
          body: [
            "The facilitator summarizes the key points covered during the session and invites participants to share their main takeaways.",
            "Participants are encouraged to reflect on how they can apply TEAL principles in their own teaching practice.",
            "The session ends with a brief Q&A and any final thoughts from participants.",
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
          title: "What is Active Learning?",
          url: "https://www.youtube.com/watch?v=D8Wc3eSRaLE",
          thumbnailUrl: "https://img.youtube.com/vi/D8Wc3eSRaLE/hqdefault.jpg",
        },
        {
          title: "Integration of Technology in the Classroom",
          url: "https://www.youtube.com/watch?v=4jLKL2VCZrA",
          thumbnailUrl: "https://img.youtube.com/vi/4jLKL2VCZrA/hqdefault.jpg",
        },
        {
          title: "Collaborative Learning (Explained in 2 Minutes)",
          url: "https://www.youtube.com/watch?v=jXwBzbb0Huc&t=15s",
          thumbnailUrl: "https://img.youtube.com/vi/jXwBzbb0Huc/hqdefault.jpg",
        },
      ],
    },
    {
      id: "requirements",
      type: "list",
      title: "Requirements",
      items: ["PC / Laptop", "Mobile devices", "Internet", "Projector"],
    },
    {
      id: "assessment",
      type: "text",
      title: "Assessment",
      body: [
        "Participants’ understanding of TEAL principles is assessed through a combination of observation and a digital quiz.",
        "The facilitator observes engagement during Think-Pair-Share and group discussion activities to evaluate understanding and collaboration.",
      ],
    },

    {
  id: "further-reading",
  type: "links",
  title: "Further Reading",
  items: [
    {
      title: "Active Learning — Edutopia",
      url: "https://www.edutopia.org/article/active-learning-strategies",
      resourceType: "external",
    },
    {
      title: "What is Technology-Enhanced Learning? — WGU",
      url: "https://www.wgu.edu/blog/what-technology-enhanced-learning2009.html",
      resourceType: "external",
    },
    {
      title: "Examples of Collaborative Learning — TeachThought",
      url: "https://www.teachthought.com/learning/collaborative-learning/",
      resourceType: "external",
    },
    {
      title: "Traditional Learning vs TEAL — Canva",
      url: "https://ctl.columbia.edu/resources-and-technology/teaching-with-technology/teal/",
      resourceType: "external",
       },
      ],
    },
  ],
};
