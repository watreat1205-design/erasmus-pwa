import type { ActivityContent } from "@/src/lib/activity/content-types";

export const activity61Content: ActivityContent = {
  slug: "activity-6-1",
  title: "Green Skills",
  moduleLabel: "Module 6: Green Skills Training",
  intro: "Understanding the concept of green transformation and the importance of green skills.",

  meta: [
    { label: "Duration", value: "90 minutes", icon: "⏱" },
    { label: "Setting", value: "Self-directed learning / online", icon: "💻" },
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
          items: ["Green Skills Training"],
        },
        {
          title: "Knowledge",
          items: [
            "Understand the concept of green transformation",
            "Define green skills and distinguish their categories",
            "Recognize examples of green skills in practice",
            "Identify how digital tools like Augmented Reality (AR) can enhance environmental education by increasing student engagement and learning outcomes",
          ],
        },
        {
          title: "Skills",
          items: [
            "Ability to integrate green skills into teaching or training practice",
            "Analytical skills to examine case studies and sustainability projects",
            "Communication skills to create educational content",
          ],
        },
        {
          title: "Attitudes",
          items: [
            "Commitment to sustainability",
            "Openness to innovation",
            "Empowerment and inclusivity",
            "Reflective attitude towards teaching practice",
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
          title: "Recap Mini-Lecture",
          duration: "15 minutes",
          body: [
            "The facilitator begins with a brief recap of foundational content from Topic 1.",
            "Key points about sustainable development and global environmental issues are highlighted to refresh participants’ memory.",
            "This serves as a lead-in to the quiz, ensuring everyone is prepared.",
          ],
        },
        {
          title: "Quiz Instructions",
          duration: "5 minutes",
          body: [
            "The facilitator explains the purpose of the quiz: to gauge understanding and reinforce learning of sustainability basics in an engaging way.",
            "Instructions for accessing the quiz platform are provided.",
            "Participants are told that the quiz is a fun knowledge check to identify areas to focus on.",
          ],
        },
        {
          title: "Live Quiz",
          duration: "20 minutes",
          body: [
            "Participants complete an interactive multiple-choice quiz covering core knowledge from the first topic.",
            "Questions may include definitions, concept applications, and current facts related to sustainability and green skills.",
            "The quiz platform shows instant feedback after each question.",
          ],
        },
        {
          title: "Discussion of Answers",
          duration: "20 minutes",
          body: [
            "After the quiz, the facilitator reviews the questions one by one.",
            "Participants are invited to share their reasoning and discuss surprising or difficult questions.",
            "Misconceptions are clarified with real data or concrete examples.",
          ],
        },
        {
          title: "Identification of Knowledge Gaps",
          duration: "10 minutes",
          body: [
            "Based on the quiz results, the facilitator highlights which areas need further attention.",
            "Participants are encouraged to ask questions on items they found confusing.",
            "This ensures the quiz activity directly informs subsequent teaching.",
          ],
        },
        {
          title: "Wrap-up",
          duration: "5 minutes",
          body: [
            "The facilitator summarizes overall performance and congratulates participants for their participation.",
            "The activity is highlighted as an example of active learning using technology.",
          ],
        },
      ],
    },

    {
      id: "assessment",
      type: "text",
      title: "Assessment",
      body: [
        "Quiz performance provides the facilitator with data on each participant’s understanding and serves as an initial diagnostic assessment.",
        "Observation during discussion helps assess engagement, confidence, and misconceptions.",
        "A follow-up comparison with a similar quiz at the end of the program can be used to measure knowledge gained.",
      ],
    },

    {
      id: "further-reading",
      type: "links",
      title: "Further Reading",
      items: [
        {
          title: "What is Sustainable Development",
          url: "https://www.youtube.com/watch?v=7V8oFI4GYMY",
          resourceType: "external",
        },
        {
          title: "UN Sustainable Development Goals",
          url: "https://www.youtube.com/watch?v=OolK0ISD3eA",
          resourceType: "external",
        },
        {
          title: "Sustainable Earth Videos",
          url: "https://sustainable-earth.org/videos/",
          resourceType: "external",
        },
        {
          title: "Google Form Quiz",
          url: "https://docs.google.com/forms/d/e/1FAIpQLSeLpYXsxhMPVx5J217GPADMg9CXpdbWoD80155-T5oTEbMrzA/viewform?usp=dialog",
          resourceType: "external",
        },
      ],
    },
  ],
};
