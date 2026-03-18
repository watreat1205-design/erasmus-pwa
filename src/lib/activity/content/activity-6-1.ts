// src/lib/activity/content/activity-6-1.ts
import type { ActivityContent } from "@/src/lib/activity/content-types";

export const activity61Content: ActivityContent = {
  slug: "activity-6-1",
  title: "Green Skills",
  moduleLabel: "Module 6: Green Skills Training",
  intro:
    "Understanding the concept of green transformation and the importance of green skills.",

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
            "Ability to integrate green skills into one’s teaching or training practice",
            "Analytical skills to examine case studies/projects on sustainability and derive lessons for best practices",
            "Communication skills to create educational content",
          ],
        },
        {
          title: "Attitudes",
          items: [
            "Commitment to sustainability",
            "Openness to innovation",
            "Empowerment and inclusivity, fostering a mindset of leaving no one behind in the transition to a green economy",
            "Reflective attitude towards one’s teaching practice, continually seeking to improve and promote sustainable values",
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
            "The facilitator explains the purpose of the quiz – to gauge understanding and reinforce learning of sustainability basics in an engaging way.",
            "Instructions for accessing the quiz platform are given, for example sharing a game PIN for Kahoot or the quiz link.",
            "Participants are told that the quiz is not graded in a punitive way, but is a fun knowledge check to identify areas to focus on.",
          ],
        },
        {
          title: "Live Quiz",
          duration: "20 minutes",
          body: [
            "Participants complete an interactive multiple-choice quiz covering core knowledge from the first topic.",
            "Questions may include definitions, such as “What does ESD stand for?”, concept applications, such as identifying a sustainable practice in energy, and current facts related to sustainability and green skills.",
            "The quiz platform shows instant feedback after each question.",
            "The facilitator may pause after each question to clarify answers, helping correct misconceptions on the spot.",
          ],
        },
        {
          title: "Discussion of Answers",
          duration: "20 minutes",
          body: [
            "After the quiz, the facilitator reviews the questions one by one.",
            "For each question, participants are invited to explain their thought process and reasoning.",
            "This opens a group discussion on any contentious, surprising, or difficult questions.",
            "If many participants answered incorrectly, the facilitator revisits that content with real data or concrete examples to strengthen understanding.",
            "The discussion is kept supportive and informative.",
          ],
        },
        {
          title: "Identification of Knowledge Gaps",
          duration: "10 minutes",
          body: [
            "Based on the quiz results, the facilitator highlights which areas will need further attention.",
            "For example, if the concept of “just transition” was frequently missed, it is noted as a topic to emphasize later.",
            "Participants are encouraged to ask questions on any item they found confusing.",
            "This segment ensures that the quiz activity directly informs subsequent teaching, in line with formative assessment principles.",
          ],
        },
        {
          title: "Wrap-up",
          duration: "5 minutes",
          body: [
            "The facilitator concludes by summarizing overall performance.",
            "Participants are congratulated for their participation.",
            "The facilitator also reiterates how this activity is an example of active learning using technology, making learning more engaging than a traditional quiz.",
          ],
        },
      ],
    },

    {
      id: "assessment",
      type: "text",
      title: "Assessment",
      body: [
        "Quiz Performance: The quiz automatically records responses, providing the facilitator with data on each participant’s understanding. This serves as an initial diagnostic assessment of knowledge on sustainability basics. While the quiz itself is low-stakes, a high score indicates strong grasp of foundational concepts, whereas certain missed questions point to topics that need reinforcement.",
        "Observation during Discussion: The facilitator observes who participates actively in the discussion and how well participants articulate their reasoning. This qualitative assessment gives insight into confidence and misconceptions. It also checks engagement levels, since active discussion suggests the quiz stimulated interest.",
        "Follow-up Comparison: A similar quiz may be given at the end of the program to measure knowledge gained. Improvement in scores would demonstrate learning progress, with the baseline quiz results providing a reference point.",
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
