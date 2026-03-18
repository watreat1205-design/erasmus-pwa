// src/lib/activity/content/activity-3-3.ts
import type { ActivityContent } from "@/src/lib/activity/content-types";

export const activity33Content: ActivityContent = {
  slug: "activity-3-3",
  title:
    "Sustainable cities, educated citizens: how the community becomes an ecological learning space",
  moduleLabel: "Module 3: From knowledge to skills for a transformative education",
  intro: "3.1 Expertise in environmental education",

  meta: [
    { label: "Duration", value: "110 minutes", icon: "⏱" },
    {
      label: "Type of activity",
      value: "Discussion, Group activity, Case Study",
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
          title: "Introduction to the Module",
          duration: "5 minutes",
          body: [
            "The facilitator begins by introducing the module's objectives and providing a brief overview of the session.",
          ],
        },
        {
          title: "Exchange of ideas about sustainability",
          duration: "15 minutes",
          body: [
            "Students present an example of a sustainable or unsustainable practice observed in their community and describe its impact on the community.",
            "Ideas will be noted on a flipchart sheet, with 2 columns (sustainable/unsustainable).",
            "They will then be asked to reflect and analyze the diversity of perspectives.",
          ],
        },
        {
          title: "Case Study Analysis",
          duration: "40 minutes",
          body: [
            "Students will be divided into small groups. Each group will receive one of the 2 case studies.",
            'Case study 1_“La Réserve des Arts” – Creative Recycling Center, Paris, France',
            'Case study 2_“Prinzessinnengarten” – Urban Community Garden in Berlin, Germany',
            "The groups analyze the assigned case study, starting from the questions:",
            "Case study no. 1:",
            "How can we implement a similar system in schools or cultural centers in other cities?",
            "What materials do we commonly waste that could be creatively reused?",
            "What is the educational impact of learning through creative recycling?",
            "What public policies would encourage the circular economy?",
            "Case study no. 2:",
            "How can this model be replicated in other cities?",
            "What role do citizens have in initiating change?",
            "Can an educational space be both ecological and functional in a crowded city?",
            "How do we convince the authorities to support such initiatives?",
            "Students will present the strategies used, the advantages and challenges.",
            "They can work on flipchat or digital presentations (e.g. Canva, Gamma, Google Slides, Padlet, etc.) to visually represent the key aspects.",
          ],
        },
        {
          title: "Pitching simulation for a sustainable project",
          duration: "40 minutes",
          body: [
            "Based on the two models, students develop their own ecological project for the sustainable development of their city (a prototype of an urban garden, recycling center, urban education center, etc.).",
            "They present it as in a funding competition (pitch session type), in front of colleagues who play the role of investors/mayors/NGOs.",
            "They will also need to have a poster made in a Design Thinking session.",
            "Tools: PowerPoint, Canva, Gamma, Google Slides, Kahoot for judging, etc.",
          ],
        },
      ],
    },

    {
      id: "case-study-1",
      type: "text",
      title:
        'Case Study 1: “La Réserve des Arts” – Creative Recycling Center, Paris, France',
      body: [
        "Defining the problem",
        "How can we reduce the waste of materials in the creative industries (arts, theater, events) and transform them into resources for education and creation?",
        "Location: Paris",
        "Project type: Creative recycling center for the cultural and educational sector",
        "Description:",
        "La Réserve des Arts is a non-profit organization that collects unused materials from creative industries (theaters, museums, fashion, events) and redistributes them to artists, students and NGOs. The situation: Many cultural institutions were throwing away tons of materials (scenography, sets, textiles). Young artists and educators did not have access to affordable and sustainable materials. The goal is to reduce waste and promote reuse in artistic fields.",
        "Objectives:",
        "Reducing the amount of waste from the arts sector",
        "Educating the public about responsible consumption",
        "Creating a circular economy in the creative sector",
        "Supporting young artists and non-formal education",
        "Activities:",
        "Creative recycling workshops for schools, universities and the general public",
        "Selling recycled materials at affordable prices",
        "Exhibitions and awareness events",
        "Trainings for designers and creatives on sustainability",
        "Results:",
        "Over 250 tons of materials saved from garbage annually",
        "Network of over 5,000 members (designers, artists, teachers)",
        "Project recognized nationally and replicated in other cities",
        "Collaboration model between the cultural and ecological sectors",
        "Obstacles:",
        "Logistics of transportation and storage of materials",
        "Financing – the project depends on public/private support",
        "Convincing companies to donate instead of throwing away",
        "Limited space in the city for storage",
        "Talking points",
        "How can we implement a similar system in schools or cultural centers in other cities?",
        "What materials do we commonly waste that could be creatively reused?",
        "What is the educational impact of learning through creative recycling?",
        "What public policies would encourage the circular economy?",
      ],
    },

    {
      id: "case-study-1-image",
      type: "images",
      title: "Case Study 1 Image",
      items: [
        {
          title: "La Réserve des Arts – Creative Recycling Center, Paris, France",
          url: "https://pjjslpdbnwfkvlrxrkpr.supabase.co/storage/v1/object/public/course-assets/dsd-teal/Module-3/Activity-3-3/case-study-1.jpg",
          alt: "La Réserve des Arts – Creative Recycling Center, Paris, France",
        },
      ],
    },

    {
      id: "case-study-2",
      type: "text",
      title:
        'Case Study 2: “Prinzessinnengarten” – Urban Community Garden in Berlin, Germany',
      body: [
        "Defining the problem",
        "How can we transform a degraded urban space into an educational and ecological place that supports citizen participation and sustainable development?",
        "Location: Berlin, Germany",
        "Project type: Urban Community Garden",
        "Description:",
        "Prinzessinnengarten is an urban community garden in Berlin developed on a former wasteland. It became an educational and ecological space where people grow vegetables, learn about sustainability, and take part in community life.",
        "Objectives:",
        "Promoting sustainable urban living",
        "Encouraging environmental education and social inclusion",
        "Creating a shared ecological learning space",
        "Strengthening local participation and responsibility",
        "Activities:",
        "Urban gardening activities and workshops",
        "Educational visits and sustainability learning",
        "Community events and meetings",
        "Collective maintenance of green urban space",
        "Results:",
        "Transformation of unused space into an ecological community hub",
        "Increased awareness about sustainable cities and citizen participation",
        "Educational opportunities for children, youth and adults",
        "A visible example of urban ecological regeneration",
        "Obstacles:",
        "Need for continued community participation",
        "Maintenance and sustainability of the space over time",
        "Urban policy and long-term land use issues",
        "Talking points",
        "How can this model be replicated in other cities?",
        "What role do citizens have in initiating change?",
        "Can an educational space be both ecological and functional in a crowded city?",
        "How do we convince the authorities to support such initiatives?",
      ],
    },

    {
      id: "case-study-2-image",
      type: "images",
      title: "Case Study 2 Image",
      items: [
        {
          title: "Prinzessinnengarten – Urban Community Garden in Berlin, Germany",
          url: "https://pjjslpdbnwfkvlrxrkpr.supabase.co/storage/v1/object/public/course-assets/dsd-teal/Module-3/Activity-3-3/case-study-2.jpg",
          alt: "Prinzessinnengarten – Urban Community Garden in Berlin, Germany",
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
  ],
};
