// src/lib/activity/content/activity-4-1.ts
import type { ActivityContent } from "@/src/lib/activity/content-types";

export const activity41Content: ActivityContent = {
  slug: "activity-4-1",
  title: "Walking the Green Path – What is Ecological Transition?",
  moduleLabel:
    "Module 4: Ecological transition: scenario, political and regulatory framework",
  intro:
    "The facilitator introduces the concept of ecological transition in the EU context, explaining its links with climate change, resource management, social justice and the economy.",

  meta: [
    { label: "Duration", value: "90 minutes", icon: "⏱" },
    { label: "Setting", value: "F2F", icon: "🧑‍🏫" },
    {
      label: "Type",
      value: "Lecture, Discussion, Group activity",
      icon: "👥",
    },
  ],

  sections: [
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
          title: "Intro",
          duration: "10 min",
          body: [
            "The facilitator introduces the concept of ecological transition in the EU context, explaining its links with climate change, resource management, social justice and the economy.",
            "The key frameworks introduced include the Green Deal, using online resources.",
            "Participants are encouraged to share their own associations or experiences with sustainability and change (e.g., switching heating systems, new farming regulations, rising fuel costs).",
          ],
        },
        {
          title: "Scenario Cards and dramatization",
          duration: "30 min",
          body: [
            'Participants are divided into small groups (3–5 people). Each group randomly draws a "scenario card" – a short, relatable story inspired by real situations affected by ecological transition.',
            "Examples include:",
            "Groups work together to turn their scenario into a short sketch, either in role-play form or using dramatic narration.",
            "If available, a drama pedagogue supports the groups by guiding them through expressive methods, use of space, body language and voice.",
            "The aim is not performance perfection but expressive engagement with the topic and empathic understanding.",
          ],
          bullets: [
            "An elderly farmer struggling with digital CAP forms.",
            "A young eco-farmer trying to get a sustainability grant.",
            "A family that needs to renovate their home for energy efficiency but lacks funds.",
            "A local policymaker organizing climate adaptation workshops.",
          ],
        },
        {
          title: "Sketch presentation",
          duration: "30 min",
          body: [
            "Groups perform or narrate their dramatized scenario.",
            "After each, the facilitator guides a brief reflection:",
            "These reflections are written visually on a flipchart to draw connections between personal experiences and abstract policy frameworks.",
          ],
          bullets: [
            "What problem was presented?",
            "Which EU policy or support measure might apply (e.g. Just Transition Fund, ETS revenues, Social Climate Fund)?",
            "Who benefits and who may be excluded?",
            "What actions are possible at local or personal level?",
          ],
        },
        {
          title: "Reflection",
          duration: "15 min",
          body: [
            "Participants individually or in pairs write down one idea they learned and one idea they can apply in their own work, community, or teaching.",
            "A few volunteers share insights with the whole group.",
          ],
        },
        {
          title: "Conclusion",
          duration: "5 min",
          body: [
            "The facilitator summarizes key EU instruments discussed (Green Deal, Fit for 55, CBAM, ETS, Social Climate Fund), and introduces the next steps in ecological transition which will focus on deeper exploration of these goals.",
          ],
        },
      ],
    },

    {
      id: "assessment",
      type: "text",
      title: "Assessment",
      body: [
        "Observation of group work and dramatization: The facilitator monitors group cooperation, role distribution, and engagement with the scenario. Key indicators include how creatively the group interprets the scenario and whether the role-play connects to real-world policy challenges.",
        "Content accuracy and relevance: During sketch presentations, the facilitator notes whether participants make meaningful links to EU policies and show awareness of key transition concepts (e.g., justice, accessibility, funding mechanisms).",
        "Debrief participation: The depth of participants' reflections in the group discussion is assessed—especially their ability to relate individual or group actions to systemic frameworks.",
        "Written reflection quality: The facilitator collects or observes reflection notes, evaluating their thoughtfulness, clarity, and potential for application in learners' own contexts.",
        "Optional peer feedback: Groups may be invited to briefly comment on each other's performances—what they found insightful, surprising or well-expressed—which encourages mutual learning and peer recognition.",
      ],
    },

    {
      id: "further-reading",
      type: "links",
      title: "Further Reading",
      items: [
        {
          title: "The European Green Deal - European Commission",
          url: "https://commission.europa.eu/strategy-and-policy/priorities-2019-2024/european-green-deal_en",
          resourceType: "external",
        },
        {
          title: "European Green Deal story page",
          url: "https://ec.europa.eu/stories/european-green-deal/",
          resourceType: "external",
        },
        {
          title: "EU Green Deal documents",
          url: "https://commission.europa.eu/strategy-and-policy/priorities-2019-2024/european-green-deal_en",
          resourceType: "external",
        },
        {
          title: "Legal documents on Delivering the European Green Deal",
          url: "https://commission.europa.eu/strategy-and-policy/priorities-2019-2024/european-green-deal/delivering-european-green-deal_en",
          resourceType: "external",
        },
        {
          title: "EU Climate Action",
          url: "https://climate.ec.europa.eu/index_en",
          resourceType: "external",
        },
        {
          title: "CAP Strategic Plan 2023–2027",
          url: "https://agriculture.ec.europa.eu/cap-my-country/cap-strategic-plans_en",
          resourceType: "external",
        },
      ],
    },
  ],
};
