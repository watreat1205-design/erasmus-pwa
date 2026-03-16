import type { ActivityContent } from "@/src/lib/activity/content-types";

export const activity64Content: ActivityContent = {
  slug: "activity-6-4",
  title: "ESD in Action Personal Blog",
  moduleLabel: "Module 6: Green Skills Training",
  intro: "A reflective writing activity that turns sustainability learning into personal voice, advocacy, and action.",

  meta: [
    { label: "Duration", value: "210 minutes", icon: "⏱" },
    { label: "Setting", value: "Self-directed learning / online", icon: "💻" },
    { label: "Type", value: "Individual activity", icon: "✍️" },
  ],

  sections: [
    {
      id: "learning-focus",
      type: "cards",
      title: "Learning Focus",
      cards: [
        {
          title: "Topic",
          items: ["ESD in Action Personal Blog"],
        },
        {
          title: "Knowledge",
          items: [
            "Understand how green skills connect with everyday life and work",
            "Recognize the value of communication as a sustainability skill",
            "Explore how reflection and advocacy support sustainable development",
          ],
        },
        {
          title: "Skills",
          items: [
            "Write a structured reflective article or blog post",
            "Communicate sustainability ideas clearly and persuasively",
            "Integrate personal insight with course concepts",
            "Use peer feedback to improve written work",
          ],
        },
        {
          title: "Attitudes",
          items: [
            "Commitment to sustainability",
            "Reflective and action-oriented mindset",
            "Confidence in sharing personal perspectives on sustainable development",
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
          title: "Setting the Stage",
          duration: "10 minutes",
          body: [
            "The facilitator explains that each participant will write a short article or blog post on Green Skills for Sustainable Development.",
            "The goal is to translate learning into a form that could influence or inform others.",
          ],
        },
        {
          title: "Brainstorming Topics",
          duration: "15 minutes",
          body: [
            "Participants brainstorm possible angles for their blog article.",
            "Ideas may include issues, solutions, educational approaches, or personal action plans.",
          ],
        },
        {
          title: "Guidance on Writing",
          duration: "20 minutes",
          body: [
            "The facilitator provides tips on defining a main message, writing accessibly, using examples, and supporting arguments with facts.",
            "Participants are encouraged to write authentically and in their own voice.",
          ],
        },
        {
          title: "Writing First Draft",
          duration: "90 minutes",
          body: [
            "Participants write an individual article draft of about 600–800 words.",
            "They are encouraged to integrate course ideas, personal reflection, and practical examples.",
          ],
        },
        {
          title: "Peer Review Exchange",
          duration: "30 minutes",
          body: [
            "Participants exchange drafts and provide constructive feedback using a simple checklist.",
            "Feedback focuses on clarity, personal voice, structure, and impact.",
          ],
        },
        {
          title: "Revision and Finalization",
          duration: "20 minutes",
          body: [
            "Participants revise their articles based on peer feedback and finalize their submission.",
          ],
        },
        {
          title: "Sharing and Closing Discussion",
          duration: "30 minutes",
          body: [
            "Volunteers share an excerpt or summarize their article.",
            "The facilitator concludes with reflection questions on attitude change and future action.",
          ],
        },
      ],
    },

    {
      id: "assessment",
      type: "text",
      title: "Assessment",
      body: [
        "The final written article is assessed for understanding of content, personal insight, communication, and clarity.",
        "Participation in peer feedback is also considered.",
        "The activity serves as a culminating task, showing how well participants integrate knowledge from across the module.",
      ],
    },

    {
      id: "further-reading",
      type: "links",
      title: "Further Reading",
      items: [
        {
          title: "IBM SkillsBuild – Sustainability Learning Path",
          url: "https://skillsbuild.org/adult-learners/explore-learning/sustainability",
          resourceType: "external",
        },
      ],
    },
  ],
};
