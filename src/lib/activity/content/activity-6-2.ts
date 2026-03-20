// src/lib/activity/content/activity-6-2.ts
import type { ActivityContent } from "@/src/lib/activity/content-types";

export const activity62Content: ActivityContent = {
  slug: "activity-6-2",
  title: "Teaching Sustainability with Tech",
  moduleLabel: "Module 6: Green Skills Training",
  intro:
    "Using communication, creativity, and technology to teach sustainability effectively.",

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
          title: "Introduction & Purpose",
          duration: "15 minutes",
          body: [
            "The facilitator introduces the Video Script Project, linking it to the course goals.",
            "“Communication is key to sustainability. In this activity, you will practice conveying a green message through a short video script. We’ll also see how technology like AR can enhance environmental education.”",
            "The learning objectives are stated: to develop skills in communication and creative use of technology for ESD.",
          ],
        },
        {
          title: "Mini-Lecture on Effective Messaging",
          duration: "20 minutes",
          body: [
            "The facilitator provides guidance on how to craft an effective educational message.",
            "This includes a quick review of storytelling techniques, identifying your audience, and keeping messages clear and engaging.",
            "For example, they highlight how an environmental video might start with a personal story or a surprising fact to hook viewers.",
            "They also briefly touch on visualization tools – how AR or animations can make abstract concepts concrete.",
          ],
        },
        {
          title: "Showcase Example",
          duration: "10 minutes",
          body: [
            "An example 2–3 minute sustainability video is played, such as the “On Earth Environmental Short Film”.",
            "The facilitator and participants analyse it: What was the core message? What techniques were used to engage the audience, such as humor, data, or visuals?",
            "If an AR demo or video is available, the facilitator shows how AR overlays information on the real world, for example pointing a phone camera at a picture of a forest and seeing virtual wildlife appear.",
            "This inspires participants to think creatively about using technology in their own scripts.",
          ],
        },
        {
          title: "Group Formation and Topic Selection",
          duration: "15 minutes",
          body: [
            "Participants are split into small groups of 3–4 people.",
            "Each group chooses or is assigned a specific sustainability topic or scenario.",
            "Topics can align with personal interests or areas covered in earlier sessions, for instance energy saving tips for offices, sustainable food choices, or an introduction to solar panels.",
            "The facilitator ensures that each group has a distinct topic to avoid overlap.",
          ],
        },
        {
          title: "Brainstorming",
          duration: "30 minutes",
          body: [
            "In breakout rooms, groups discuss what key message they want to deliver and how to make it engaging.",
            "They consider: Who is the target audience, such as children, consumers, or coworkers? What is the call to action? Will they incorporate a technology angle, such as referencing an app or AR experience?",
            "During this time, the facilitator rotates through breakout rooms to provide input.",
            "For example, the facilitator may suggest: “Maybe you can include an AR element – describe what the viewer would see through their phone when learning about recycling.”",
            "Groups take notes on their ideas.",
          ],
        },
        {
          title: "Script Writing Workshop",
          duration: "60 minutes",
          body: [
            "Still in groups, participants co-write a script for a 3-minute video on their topic.",
            "They use a shared online document so they can write collaboratively in real time.",
            "The script should include narration or dialogue, visuals or actions described, and optionally where any technology such as AR, images, or charts would be used.",
            "The facilitator provides a simple template: beginning (introduction of problem), middle (explanation or demonstration), end (conclusion or call-to-action).",
            "Participants divide roles, for example one may focus on the introduction while others work on the body or visuals.",
            "They are encouraged to be creative but also factual, requiring them to draw on knowledge from the course.",
            "For instance, a group writing about climate change for a general public audience might script a scene using AR: the narrator points a phone at a map of the city and an AR overlay shows which districts would be flooded by 2050 if emissions continue.",
            "The facilitator remains available for questions or to review drafts as groups work.",

            "Example Video Script:",
            "Hi everyone! Welcome to our short video on “Teaching Sustainability with Tech.” Today, we explore how to reduce plastic waste and how AR can enhance learning.",
            "Plastic pollution is a major global issue, with over 300 million tons produced annually. Much comes from single-use items like bottles and packaging. Education helps change behavior and awareness.",
            "Augmented Reality (AR) can visualize these impacts. For example, pointing your phone at a recycling bin could show where waste goes or how it affects ecosystems.",
            "AR increases engagement and helps learners better understand sustainability challenges. It turns passive learning into interactive exploration.",
          ],
        },
        {
          title: "Group Presentations of Scripts",
          duration: "30 minutes",
          body: [
            "Groups return to the main room and present their video concept.",
            "They do not act it out fully, but explain their approach and optionally read a few engaging lines from the script.",
            "For example: “Our video opens with a shot of two trash bins. Using AR, we’d show how much plastic goes into landfills. Our target audience is high school students, so we kept it informal in tone.”",
            "Each presentation lasts around 5 minutes.",
          ],
        },
        {
          title: "Feedback and Class Discussion",
          duration: "20 minutes",
          body: [
            "After each presentation, the facilitator and other participants offer constructive feedback.",
            "They highlight strong points, such as creativity and clarity of message, and suggest improvements.",
            "Examples include adding a statistic for impact or showing the positive outcome if behaviour changes.",
            "This peer review process helps everyone learn about different approaches and reflect on their own work.",
            "The facilitator links feedback to key principles of ESD communication, such as making content relevant to the audience, ensuring accuracy, and inspiring action rather than doom and gloom.",
          ],
        },
        {
          title: "Wrap-up & Reflection",
          duration: "10 minutes",
          body: [
            "The facilitator concludes by highlighting how this activity built skills in teamwork, creativity, and technology use.",
            "They note that participants effectively translated complex knowledge into an accessible format, which is a crucial skill for educators and sustainability advocates.",
            "If time permits, the facilitator asks: “How did you find working with AR or imagining tech in your scripts? Do you think it can make learning about sustainability more effective?”",
            "This allows a brief reflection tying back to TEAL, and reinforces that active, creative learning can deepen understanding more effectively than passive lessons.",
          ],
        },
      ],
    },

    {
      id: "assessment",
      type: "text",
      title: "Assessment",
      body: [
        "Group Work and Script Quality: The facilitator evaluates each group’s script based on a rubric that checks content accuracy, clarity of message, creativity and innovation, and appropriateness for audience.",
        "Collaboration and Participation: The facilitator monitors group dynamics and ensures everyone contributes.",
        "Feedback Integration: Participants improve their scripts based on feedback.",
        "Self-Reflection: Each participant reflects on what they learned.",
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
          resourceType: "video",
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
