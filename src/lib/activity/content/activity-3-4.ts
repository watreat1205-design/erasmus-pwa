import type { ActivityContent } from "@/src/lib/activity/content-types";

export const activity34Content: ActivityContent = {
  slug: "activity-3-4",
  title: "Environmental education as awareness-raising on climate change",
  moduleLabel: "Module 3: From knowledge to skills for a transformative education",
  intro: "3.1 Expertise in environmental education",

  meta: [
    { label: "Duration", value: "110 minutes", icon: "⏱" },
    {
      label: "Type of activity",
      value: "Discussion, Group activity",
      icon: "👥",
    },
  ],

  sections: [
    {
      id: "learning-focus",
      type: "cards",
      title: "Learning Outcomes",
      cards: [
        {
          title: "Topic",
          items: ["From knowledge to skills for a transformative education"],
        },
        {
          title: "Knowledge",
          items: [
            "Environmental education",
            "Sustainability",
            "Active Teaching Strategies",
            "Teacher and Student Role",
            "Digital Tools for TEAL",
            "TEAL Activity Planning",
          ],
        },
        {
          title: "Skills",
          items: [
            "Analyzing the impact of your own decisions on the environment using digital tools",
            "Selecting teaching strategies",
            "Using digital tools",
            "Designing teaching activities",
          ],
        },
        {
          title: "Attitudes",
          items: [
            "Critical thinking towards sources of information about the environment.",
            "Demonstrates openness to change and individual and collective responsibility.",
            "Active involvement in the community to support environmental education initiatives.",
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
      title: "Description of activity (step-by-step)",
      steps: [
        {
          title: "Introduction",
          duration: "5 minutes",
          body: [
            "The facilitator begins by introducing the module's objectives and providing a brief overview of the session.",
          ],
        },
        {
          title: "Interactive presentation: Climate change",
          duration: "10 minutes",
          body: [
            "The facilitator will give a presentation on climate change and its causes.",
            "Students will debate environmental information to distinguish myths from facts (e.g. “global warming is just a natural phenomenon,” “it’s not humans’ fault,” “climate change doesn’t affect us.”)",
            "They will research various statements about climate change and identify myths and misinformation.",
            "They will use media channels (news, podcasts, social media, etc.).",
          ],
        },
        {
          title: "Interactive group activity (role play)",
          duration: "30 minutes",
          body: [
            "Students will be presented with the following role-play exercise:",
            '"Climate change is no longer a hypothetical risk, but a reality. From extreme heat waves to floods or forced migrations, the effects are increasingly visible. What seems abstract – CO₂ emissions, climate neutrality, decarbonization – has a direct impact on everyone\'s quality of life. In this exercise, you will step into the shoes of a social actor (mayor, citizen, NGO, company, architect) and you will be faced with a real challenge: reducing the city\'s emissions by 40% in 10 years. You will have a set of options available – some popular, others controversial – and you will have to choose 3 measures. You will have to support your decisions with arguments and compare the impact of these choices at a global level."',
            "They can make presentations using digital tools (e.g. Canva, Gamma, Google Slides, Padlet, etc.).",
            "This activity will challenge students to make decisions under pressure, analyze long-term effects, and understand the trade-offs behind environmental policies.",
            "(For example: if they support banning gasoline cars, will this affect low-income populations? If they choose solar panels, will they face a lack of urban space, etc.)",
            "Every decision comes with costs, resistance, but also opportunities.",
            "The activity does not provide “right answers,” but creates a space for reflection and collaboration.",
          ],
        },
        {
          title: "Group Discussion",
          duration: "20 minutes",
          body: [
            "There will be an analysis of the proposed solutions and the results: how much did you manage to reduce emissions? What did you ignore? What side effects occurred?",
            "This exercise not only transmits information, but also builds awareness.",
            "They will learn that sustainable solutions are not just technical – they are social, ethical and political.",
            "And each of us is part of the change.",
          ],
        },
        {
          title: "Design Thinking",
          duration: "30 minutes",
          body: [
            "Make a 2-3 minute educational video using Invideo AI about one of the climate change aspects presented.",
            "[www.invideo.io ->](https://www.invideo.io)",
          ],
        },
        {
          title: "Whole-Group Sharing and Debrief",
          duration: "15 minutes",
          body: [
            "Each group presents its findings to the whole group.",
            "The facilitator encourages participants to reflect on common themes, challenges and creative solutions for integrating TEAL principles into teaching.",
            "The facilitator concludes the session by highlighting key conclusions, emphasizing the value of blended learning, active learning strategies, and the role of technology in modern education.",
          ],
        },
      ],
    },

    {
      id: "assessment",
      type: "text",
      title: "Assessment",
      body: [
        "The trainer will assess the participants' ability to apply TEAL principles through the analysis of case studies and their participation in the role-playing activity.",
        "The assessment will focus on creativity, through the depth of their analysis and the effectiveness of the TEAL strategies used, as well as their ability to collaborate and communicate effectively within their groups.",
      ],
    },

    {
      id: "further-reading",
      type: "links",
      title: "Online resources used in the activity",
      items: [
        {
          title: "Canva",
          url: "https://www.canva.com",
          resourceType: "external",
        },
        {
          title: "Gamma",
          url: "https://www.gamma.app",
          resourceType: "external",
        },
        {
          title: "Invideo",
          url: "https://www.invideo.io",
          resourceType: "external",
        },
      ],
    },
  ],
};
