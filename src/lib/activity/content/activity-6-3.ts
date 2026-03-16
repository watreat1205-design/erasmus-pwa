import type { ActivityContent } from "@/src/lib/activity/content-types";

export const activity63Content: ActivityContent = {
  slug: "activity-6-3",
  title: "Greening the Workplace",
  moduleLabel: "Module 6: Green Skills Training",
  intro: "Using case study analysis to understand green skills, workplace transition, and sustainability practice.",

  meta: [
    { label: "Duration", value: "120 minutes", icon: "⏱" },
    { label: "Setting", value: "Self-directed learning / online", icon: "💻" },
    { label: "Type", value: "Discussion, Case study review", icon: "🧩" },
  ],

  sections: [
    {
      id: "learning-focus",
      type: "cards",
      title: "Learning Focus",
      cards: [
        {
          title: "Topic",
          items: ["Greening the Workplace"],
        },
        {
          title: "Knowledge",
          items: [
            "Understand the role of green skills in workplace transition",
            "Recognize the importance of upskilling and stakeholder engagement",
            "Explore how sustainability initiatives affect organizations and employees",
          ],
        },
        {
          title: "Skills",
          items: [
            "Analyse case studies critically",
            "Identify challenges and success factors in sustainability transitions",
            "Apply theory to real workplace scenarios",
            "Present group findings clearly",
          ],
        },
        {
          title: "Attitudes",
          items: [
            "Commitment to sustainable workplace practices",
            "Appreciation for continuous learning",
            "Openness to collaboration and change",
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
          title: "Case Background Presentation",
          duration: "15 minutes",
          body: [
            "The facilitator presents the case study background and key facts.",
            "Participants are reminded of concepts such as the green economy, upskilling, and stakeholder engagement.",
          ],
        },
        {
          title: "Clarify Task and Form Groups",
          duration: "5 minutes",
          body: [
            "Participants are divided into groups and given guiding questions.",
            "Each group analyses the case from one or more perspectives.",
          ],
        },
        {
          title: "Group Analysis in Breakouts",
          duration: "40 minutes",
          body: [
            "Groups analyse the case using a worksheet or shared document.",
            "They identify key green skills, challenges, attitudes, and outcomes.",
          ],
        },
        {
          title: "Group Presentations",
          duration: "30 minutes",
          body: [
            "Groups present their findings and support their points with evidence from the case.",
            "Different perspectives are shared and compared.",
          ],
        },
        {
          title: "Facilitated Discussion",
          duration: "20 minutes",
          body: [
            "The facilitator leads a synthesis discussion, highlighting common lessons and broader implications.",
            "Connections are made to real examples of green transition and workplace learning.",
          ],
        },
        {
          title: "Conclusion and Lessons Learned",
          duration: "10 minutes",
          body: [
            "Each group shares one key lesson from the case study.",
            "The facilitator emphasizes how knowledge, skills, and attitudes must come together for sustainable change.",
          ],
        },
      ],
    },

    {
      id: "assessment",
      type: "text",
      title: "Assessment",
      body: [
        "Each group’s case study report or presentation is reviewed for depth of understanding and connection to course concepts.",
        "Critical thinking, discussion quality, participation, and collaboration are observed.",
        "Participants also reflect on how the case study lessons could be applied in their own workplace or community.",
      ],
    },

    {
      id: "further-reading",
      type: "links",
      title: "Further Reading",
      items: [
        {
          title: "Greener Skills for a Sustainable Workforce",
          url: "https://www.gan-global.org/videos/greener-skills-for-a-sustainable-workforce/?utm_source=chatgpt.com",
          resourceType: "external",
        },
        {
          title: "Understanding Green Skills and Their Importance",
          url: "https://www.youtube.com/watch?v=3-SGCyRxLFY",
          resourceType: "external",
        },
        {
          title: "Cedefop & OECD (2022), Apprenticeships for Greener Economies and Societies",
          url: "https://www.cedefop.europa.eu/en/publications/3091",
          resourceType: "external",
        },
        {
          title: "GRÆDUCATION project",
          url: "https://unevoc.unesco.org/pub/nqc_graeducation_fiap.pdf",
          resourceType: "external",
        },
        {
          title: "ILO Brief on Green Jobs and Skills",
          url: "https://www.ilo.org/sites/default/files/wcmsp5/groups/public/@dgreports/@dcomm/@publ/documents/publication/wcms_159585.pdf",
          resourceType: "external",
        },
        {
          title: "Lessons in Change Management for Sustainability",
          url: "https://www.prosci.com/blog/change-management-for-sustainability",
          resourceType: "external",
        },
      ],
    },
  ],
};
