import type { ActivityContent } from "@/src/lib/activity/content-types";

export const activity62Content: ActivityContent = {
  slug: "activity-6-2",
  title: "Teaching Sustainability with Tech",
  moduleLabel: "Module 6: Green Skills Training",
  intro: "Using communication, creativity, and technology to teach sustainability effectively.",

  meta: [
    { label: "Duration", value: "240 minutes", icon: "⏱" },
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
          items: ["Teaching Sustainability with Tech"],
        },
        {
          title: "Knowledge",
          items: [
            "Understand how communication supports sustainability education",
            "Recognize the role of storytelling and audience-focused messaging",
            "Explore how Augmented Reality (AR) and digital tools can make sustainability learning more engaging",
          ],
        },
        {
          title: "Skills",
          items: [
            "Develop educational communication skills",
            "Create a structured video script for sustainability awareness",
            "Collaborate in teams using digital tools",
            "Apply creativity and audience-focused thinking",
          ],
        },
        {
          title: "Attitudes",
          items: [
            "Openness to innovation",
            "Willingness to experiment with technology-enhanced teaching",
            "Commitment to clear and accessible sustainability communication",
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
          title: "Introduction and Purpose",
          duration: "15 minutes",
          body: [
            "The facilitator introduces the Video Script Project and links it to the course goals.",
            "Participants are told they will practice conveying a green message through a short video script.",
          ],
        },
        {
          title: "Mini-Lecture on Effective Messaging",
          duration: "20 minutes",
          body: [
            "The facilitator explains how to craft an effective educational message.",
            "This includes storytelling techniques, identifying audience, and keeping messages clear and engaging.",
          ],
        },
        {
          title: "Showcase Example",
          duration: "10 minutes",
          body: [
            "An example sustainability video is shown and analysed.",
            "Participants reflect on the message, visuals, and engagement techniques used.",
          ],
        },
        {
          title: "Group Formation and Topic Selection",
          duration: "15 minutes",
          body: [
            "Participants form small groups and choose or are assigned a sustainability topic.",
            "Each group focuses on a distinct topic to avoid overlap.",
          ],
        },
        {
          title: "Brainstorming",
          duration: "30 minutes",
          body: [
            "Groups discuss their key message, target audience, and possible technology angle.",
            "The facilitator rotates through breakout rooms to support and guide discussion.",
          ],
        },
        {
          title: "Script Writing Workshop",
          duration: "60 minutes",
          body: [
            "Groups co-write a script for a short video using a shared online document.",
            "The script should include narration, visuals, and optional use of AR or other digital tools.",
          ],
        },
        {
          title: "Group Presentations of Scripts",
          duration: "30 minutes",
          body: [
            "Groups present their video concept and explain their approach.",
            "They may read selected parts of the script and describe the intended audience and message.",
          ],
        },
        {
          title: "Feedback and Class Discussion",
          duration: "20 minutes",
          body: [
            "Participants and facilitator provide constructive feedback on creativity, clarity, and effectiveness.",
            "Suggestions for improvement are shared in a supportive way.",
          ],
        },
        {
          title: "Wrap-up and Reflection",
          duration: "10 minutes",
          body: [
            "The facilitator highlights how the activity developed teamwork, creativity, and technology use.",
            "Participants briefly reflect on how technology can make sustainability learning more effective.",
          ],
        },
      ],
    },

    {
      id: "assessment",
      type: "text",
      title: "Assessment",
      body: [
        "Each group’s script is assessed for content accuracy, clarity of message, creativity, and appropriateness for audience.",
        "Collaboration and participation are observed throughout the activity.",
        "Participants also complete a short self-reflection on what they learned from creating the video script.",
      ],
    },

    {
      id: "further-reading",
      type: "links",
      title: "Further Reading",
      items: [
        {
          title: "On Earth Environmental Short Film",
          url: "https://www.youtube.com/watch?v=QQYgCxu988s",
          resourceType: "external",
        },
        {
          title: "Creating Short Videos for Environmental Awareness: Tips for Impact",
          url: "https://shortlab.io/en/blog/creating-short-videos-for-environmental-awareness-tips-for-impact/",
          resourceType: "external",
        },
      ],
    },
  ],
};
