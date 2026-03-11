// src/lib/activity/content/activity-1-1.ts
import type { ActivityContent } from "@/src/lib/activity/content-types";

export const activity11Content: ActivityContent = {
  slug: "activity-1-1",
  title: "Exploring TEAL",
  moduleLabel: "Module 1: Introduction to TEAL teaching methodology",
  intro: "Introduction to TEAL teaching methodology",
  meta: [
    { label: "Duration", value: "110 minutes", icon: "⏱" },
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
          items: ["Introduction to TEAL teaching methodology"],
        },
        {
          title: "Knowledge",
          items: [
            "TEAL Principles and Comparison",
            "Active Teaching Strategies",
            "Teacher and Student Role",
            "Digital Tools for TEAL",
            "TEAL Activity Planning",
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
      id: "requirements",
      type: "list",
      title: "Requirements",
      items: ["PC/Laptop", "Mobile Devices", "Internet", "Projector"],
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
            "The facilitator begins by introducing the module's objectives and providing a brief overview of the session.",
            "The facilitator explains that the goal is to explore the TEAL (Technology-Enhanced Active Learning) approach and its key components: active learning, technology integration, and collaboration.",
          ],
        },
        {
          title: "Icebreaker — Two Truths and a Lie",
          duration: "20 minutes",
          body: [
            'The facilitator starts with the "Two Truths and a Lie" icebreaker activity. Each participant shares three statements about themselves: two are true, and one is false. The rest of the group guesses which statement is the lie.',
            "Activity Objective:",
            "– Create a relaxed and interactive atmosphere.",
            "– Encourage communication and interaction among participants.",
            "– Stimulate reflection on the theme of active learning and technology integration.",
            "Discussion Guide (Facilitator):",
            "– Ask participants to include at least one educational reflection or teaching experience among their statements (e.g., a situation where they used technology or an active learning approach in an interesting or challenging way).",
            "– Example statements:",
            `↳ "I used an online platform for collaborative learning in the classroom, but it didn't work as I expected."`,
            `↳ "I once incorporated technology to make my teaching more engaging, but the students were confused about how to use it."`,
            "– After the activity, invite participants to reflect on how the shared experiences may relate to the concepts of active learning and technology that will be explored in the module.",
            "– Stimulate a discussion on how using technology in teaching activities can improve student interaction and make learning more engaging.",
          ],
        },
        {
          title: "Interactive Presentation",
          duration: "40 minutes",
          body: [
            "The facilitator begins by introducing the definition of TEAL, exploring its roots in higher education, and emphasizing its adaptability to a range of teaching contexts.",
            `The presentation then delves into TEAL's core components – active learning, technology integration, and collaboration – with the support of videos on "What is Active Learning?", "Integration of Technology in the Classroom," and "Collaborative Learning."`,
            "To illustrate TEAL's application, the facilitator provides practical examples of TEAL in teaching.",
            "Furthermore, the facilitator offers concrete examples of how technology and active learning can be effectively integrated into instructional practices.",
            "Participants are actively invited to ask questions and contribute their insights throughout the presentation.",
          ],
        },
        {
          title: "Think-Pair-Share Activity",
          duration: "20 minutes",
          body: [
            'To deepen the engagement with the content, the facilitator organizes a Think-Pair-Share activity. The facilitator poses the question: "How do teaching and learning dynamics change when using TEAL compared to traditional methods?" Participants first reflect individually on this question for a few minutes. Then, they pair up with a partner to discuss their thoughts. Finally, the pairs share their insights with the whole group.',
          ],
        },
        {
          title: "Brainstorming and Group Discussion",
          duration: "20 minutes",
          body: [
            "The facilitator divides participants into small groups using coloured cards. Each participant receives a coloured card and those with the same colour form a group.",
            "Each group explores a specific aspect of TEAL (active learning, technology integration, or collaboration).",
            "The groups discuss and write down their ideas on paper or a whiteboard.",
            "At the end, each group shares their reflections with the whole group, and the facilitator leads the final discussion.",
          ],
        },
        {
          title: "Conclusion",
          duration: "5 minutes",
          body: [
            "To conclude the session, the facilitator summarizes the key points covered during the session and invites participants to share their main takeaways.",
            "The facilitator encourages participants to reflect on how they can apply TEAL principles in their own teaching practice.",
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
      id: "assessment",
      type: "text",
      title: "Assessment",
      body: [
        "Participants’ understanding of TEAL principles will be assessed through a combination of observation and a digital quiz.",
        "The facilitator observes participants’ engagement during Think-Pair-Share and group discussion activities. This provides qualitative insights into their ability to apply TEAL concepts and engage in collaborative discussions.",
        "A digital quiz will also be administered via Google Forms to assess participants’ understanding of TEAL terminology, principles, and comparisons to traditional teaching methods. The quiz will include both multiple choice and short answer questions to test both recall and comprehension of the material.",
        "[Open the Module Quiz](/quizzes/0691176a-40d3-49f7-8b16-6f22274aff03)",
      ],
    },

    {
      id: "further-reading",
      type: "links",
      title: "Further Reading",
      items: [
        {
          title: 'Video on "What is Active Learning?"',
          url: "https://www.youtube.com/watch?v=D8Wc3eSRaLE",
          resourceType: "external",
        },
        {
          title: "Integration of Technology in the Classroom",
          url: "https://www.youtube.com/watch?v=4jLKL2VCZrA",
          resourceType: "external",
        },
        {
          title: "Collaborative Learning (Explained in 2 Minutes)",
          url: "https://www.youtube.com/watch?v=jXwBzbb0Huc&t=15s",
          resourceType: "external",
        },
        {
          title: "Traditional Learning vs TEAL_CANVA",
          url: "https://www.canva.com/design/DAGi7OXb-v0/dwdRyWbH8KSBXthFFbIlmg/edit",
          resourceType: "external",
        },
        {
          title: "Active Learning — Edutopia",
          url: "https://www.edutopia.org/topic/active-learning",
          resourceType: "external",
        },
        {
          title: "What is Technology-Enhanced Learning? — WGU",
          url: "https://www.wgu.edu/blog/what-is-technology-enhanced-learning2006.html",
          resourceType: "external",
        },
        {
          title: "Examples of Collaborative Learning — TeachThought",
          url: "https://www.teachthought.com/pedagogy/examples-of-collaborative-learning/",
          resourceType: "external",
        },
      ],
    },
  ],
};
