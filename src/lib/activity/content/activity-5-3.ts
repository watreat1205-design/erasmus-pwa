// src/lib/activity/content/activity-5-3.ts
import type { ActivityContent } from "@/src/lib/activity/content-types";

export const activity53Content: ActivityContent = {
  slug: "activity-5-3",
  title: "Community Action for Sustainability - Active Citizenship in Practice",
  moduleLabel: "Module 5: Adult education for environmental sustainability",
  meta: [
    { label: "Duration", value: "90 minutes", icon: "⏱" },
    { label: "Setting", value: "F2F", icon: "🧑‍🏫" },
    {
      label: "Type",
      value:
        "Lecture/Presentation, Group activity, Discussion, Community mapping and campaign project",
      icon: "👥",
    },
  ],

  sections: [
    {
      id: "requirements",
      type: "list",
      title: "Requirements",
      items: [
        "Projector and laptop",
        "Internet access",
        "Stationery (flipcharts, markers, sticky notes)",
        "Smartphones or computers for participants",
      ],
    },

    {
      id: "resources",
      type: "list",
      title: "Resources",
      items: [
        "Handout: Summary of local sustainability policies or Green Deal goals",
        "Flipchart paper or large map",
        "Markers/Post-its",
        "Access to government or community websites",
        "Campaign planning template",
      ],
    },

    {
      id: "steps",
      type: "steps",
      title: "Step-by-Step Activity",
      steps: [
        {
          title: "Phase 1: Introduction & Context",
          duration: "0-10 minutes",
          body: [
            "Introduce the concept of active citizenship in sustainability. Emphasize that individuals can contribute to environmental change not only through personal habits but also through community engagement and civic action.",
            "Provide examples of local sustainability initiatives (e.g., recycling programs, energy-saving campaigns, community gardens).",
            "Facilitate a short discussion: “Have you ever participated in a community or environmental initiative?”",
          ],
        },
        {
          title: "Phase 2: Community Systems Mapping",
          duration: "10-20 minutes",
          body: [
            "Divide participants into small groups.",
            "Ask each group to create a simple map of their community, identifying key stakeholders (local authorities, NGOs, schools, businesses, citizens).",
            "Participants mark areas where sustainability actions could take place (e.g., waste management, energy use, transportation, green spaces).",
            "Groups briefly present their maps.",
          ],
        },
        {
          title: "Phase 3: Policy Literacy Crash Course",
          duration: "15 minutes",
          body: [
            "Introduce key sustainability policies and frameworks (e.g., EU Green Deal, local environmental regulations).",
            "Provide a short handout summarizing relevant policies.",
            "Discuss how these policies influence everyday life and community practices.",
          ],
        },
        {
          title: "Phase 4: Micro-Campaign Design",
          duration: "20-25 minutes",
          body: [
            "In groups, participants design a small-scale sustainability campaign.",
            "They define:",
            "- Target audience",
            "- Key message",
            "- Action steps",
            "- Tools or channels (e.g., social media, posters, events)",
            "Encourage realistic and actionable ideas.",
            "Each group prepares a short pitch.",
          ],
        },
        {
          title: "Phase 5: Reflection and Next Steps",
          duration: "10 minutes",
          body: [
            "Facilitate reflection: “What challenges might arise when implementing your campaign?”",
            "Discuss possible solutions and support mechanisms.",
            "Encourage participants to consider how they can take the first step after the session.",
            "Participants are invited to implement or initiate their campaign idea over the following weeks.",
          ],
        },
        {
          title: "Wrap-Up",
          duration: "5 minutes",
          body: [
            "Summarize key insights from the activity.",
            "Reinforce the importance of combining personal responsibility with community action.",
            "Encourage continued engagement in sustainability initiatives.",
          ],
        },
      ],
    },

    {
      id: "assessment",
      type: "text",
      title: "Assessment",
      body: [
        "Assessment in this activity focuses on both participation and the quality of outputs produced by learners. During the session, facilitators can observe how effectively participants engage in stakeholder mapping and whether they can identify relevant community actors and sustainability challenges.",
        "The micro-campaign design serves as the main assessment artifact. Facilitators should evaluate whether the campaign ideas are realistic, clearly structured, and aligned with sustainability goals. Particular attention should be given to the clarity of the target audience, feasibility of actions, and coherence of the message.",
        "Group presentations (pitches) provide an opportunity to assess communication skills and understanding of sustainability concepts. Feedback can be provided based on SMART criteria (Specific, Measurable, Achievable, Relevant, Time-bound).",
        "Follow-up actions can also be considered as part of the assessment. Participants may present evidence of implementation (e.g., photos, screenshots, brief reports, testimonials), demonstrating their ability to translate ideas into real-world action.",
      ],
    },

    {
      id: "further-reading",
      type: "links",
      title: "Further Reading",
      items: [
        {
          title:
            "EPALE Blog (2025) – Active Citizenship and Community Engagement in Adult Education",
          url: "https://epale.ec.europa.eu/en/blog/active-citizenship-and-community-engagement-adult-education",
          resourceType: "external",
        },
        {
          title:
            "European Climate Pact – Quick Start Guide to Citizen Engagement",
          url: "https://climate-pact.europa.eu/get-involved/host-group-activity/quick-start-tools-citizen-engagement_en",
          resourceType: "external",
        },
        {
          title:
            "UNEP – 10 Ways You Can Help Fight the Climate Crisis",
          url: "https://www.unep.org/news-and-stories/story/10-ways-you-can-help-fight-climate-crisis",
          resourceType: "external",
        },
      ],
    },
  ],
};
