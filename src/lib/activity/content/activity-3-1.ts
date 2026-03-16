// src/lib/activity/content/activity-3-1.ts
import type { ActivityContent } from "@/src/lib/activity/content-types";

export const activity31Content: ActivityContent = {
  slug: "activity-3-1",
  title: '"Digital Eco Quest" – Exploring sustainability in virtual space',
  moduleLabel: "Module 3: From knowledge to skills for a transformative education",
  intro: "3.1 Expertise in environmental education",

  meta: [
    {
      label: "Duration",
      value: "115 minutes",
      icon: "⏱",
    },
    {
      label: "Type of activity",
      value: "Video, Discussion, Group activity, Individual activity",
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
    id: "steps-part-1",
    type: "steps",
    title: "Step-by-Step Activity (Part 1)",
    steps: [
      {
        title: "Introduction to the Module",
        duration: "5 minutes",
        body: [
          "The facilitator begins by introducing the module's objectives and providing a brief overview of the session.",
        ],
      },
      {
        title: "Icebreaker",
        duration: "10 minutes",
        body: [
          "The facilitator starts with an icebreaking exercise “What green idea defines you?”",
          "Each student must describe a sustainable idea that they apply in their daily lives.",
          "A digital document will be used to record the answers (Padlet).",
        ],
      },
      {
        title: "Video presentation",
        duration: "15 minutes",
        body: [
          "The facilitator will present the video The Environmental Impact of Big Tech (https://www.youtube.com/watch?v=UL1n5QTJaL8).",
          "Participants will discuss in groups the main ideas presented in the video and formulate conclusions related to individual and collective responsibility.",
        ],
      },
    ],
  },

  {
    id: "videos",
    type: "videos",
    title: "Videos",
    items: [
      {
        title: "The Environmental Impact of Big Tech",
        url: "https://www.youtube.com/watch?v=UL1n5QTJaL8",
        thumbnailUrl: "https://img.youtube.com/vi/UL1n5QTJaL8/hqdefault.jpg",
      },
    ],
  },

  {
    id: "slides",
    type: "links",
    title: "Presentation Slides",
    items: [
    {
      title: "Activity presentation",
      url: "https://pjjslpdbnwfkvlrxrkpr.supabase.co/storage/v1/object/public/course-assets/dsd-teal/Module-3/Activity-3-1/a3-1-presentation.pdf",
      resourceType: "pdf",
     },
   ],
  },  

  {
    id: "steps-part-2",
    type: "steps",
    title: "Step-by-Step Activity (Part 2)",
    steps: [
      {
        title: "Creating a virtual poster about sustainability",
        duration: "30 minutes",
        body: [
          "Using Padlet, each student creates a virtual poster explaining an aspect of sustainability in the digital space.",
          "These could include ideas such as renewable energy for data centers or optimizing digital consumption.",
          "(https://padlet.com/claudiadoroftei2017/virtual-poster-nzplbltk82z6woyp).",
        ],
      },
      {
        title: "The “data minimization” challenge",
        duration: "10 minutes",
        body: [
          "Students experiment with reducing data consumption by optimizing digital content.",
          "Example: reducing file size, resizing images etc.",
          "They will record the impact using Padlet.",
        ],
      },
      {
        title: "Quick research: sustainable applications",
        duration: "20 minutes",
        body: [
          "In small teams, it is proposed to search for digital applications that promote sustainability.",
          "Examples: Ecosia, Treedom, Greenspector, Website Carbon Calculator, JOULE (from Microsoft Sustainability Manager), GitHub + Green Software Foundation, etc.",
          "Teams must present the applications and their features.",
        ],
      },
      {
        title: "Digital Impact Mapping (Padlet)",
        duration: "10 minutes",
        body: [
          "Students indicate on a digital map locations where technology has an impact (positive or negative) on the environment.",
          "(https://padlet.com/claudiadoroftei2017/maparea-impactului-digital-4k5kraxhhu4j2j5f).",
          "After each student indicates a location on the world map, the environmental impact will be comparatively analyzed (the negative impact will probably predominate).",
          "Conclusions will be drawn regarding the sustainability of the global digital ecosystem.",
        ],
      },
      {
        title: "Assessment",
        duration: "10 minutes",
        body: [
          "Padlet: Discussion board.",
          "To obtain feedback on the activity carried out, the facilitator will ask students to complete comments, concerns and solutions on the Padlet platform, in a discussion board, to the three questions related to digital sustainability.",
          "(https://padlet.com/claudiadoroftei2017/questions-comments-and-concerns-2b297nwqfukfrymk).",
        ],
      },
      {
        title: "Conclusion",
        duration: "5 minutes",
        body: [
          "The facilitator will formulate some conclusions regarding the topic addressed in this activity: sustainability is not limited to our actions in the physical world, but also includes the way we use technology.",
          "Every online search, every saved file or minute of streaming contributes to energy consumption and, implicitly, to the impact on the environment.",
          "By adopting more responsible digital habits and using applications that promote sustainability, we can reduce our virtual footprint and actively contribute to protecting the planet.",
        ],
      },
    ],
  },

  {
    id: "further-reading",
    type: "links",
    title: "Online resources used in the activity",
    items: [
      {
        title: "Padlet virtual poster board",
        url: "https://padlet.com/claudiadoroftei2017/virtual-poster-nzplbltk82z6woyp",
        resourceType: "external",
      },
      {
        title: "Padlet digital impact mapping",
        url: "https://padlet.com/claudiadoroftei2017/maparea-impactului-digital-4k5kraxhhu4j2j5f",
        resourceType: "external",
      },
      {
        title: "Padlet discussion board",
        url: "https://padlet.com/claudiadoroftei2017/questions-comments-and-concerns-2b297nwqfukfrymk",
        resourceType: "external",
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
      id: "steps-part-1",
      type: "steps",
      title: "Step-by-Step Activity (Part 1)",
      steps: [
        {
          title: "Introduction to the Module",
          duration: "5 minutes",
          body: [
            "The facilitator begins by introducing the module's objectives and providing a brief overview of the session.",
          ],
        },
        {
          title: "Icebreaker",
          duration: "10 minutes",
          body: [
            "The facilitator starts with an icebreaking exercise “What green idea defines you?”",
            "Each student must describe a sustainable idea that they apply in their daily lives.",
            "A digital document will be used to record the answers (Padlet).",
          ],
        },
        {
          title: "Video presentation",
          duration: "15 minutes",
          body: [
            'The facilitator will present the video The Environmental Impact of Big Tech (<a href="https://www.youtube.com/watch?v=UL1n5QTJaL8" target="_blank" rel="noopener noreferrer">https://www.youtube.com/watch?v=UL1n5QTJaL8</a>).',
            "Participants will discuss in groups the main ideas presented in the video and formulate conclusions related to individual and collective responsibility.",
          ],
        },
      ],
    },

    {
      id: "videos",
      type: "videos",
      title: "Videos",
      items: [
        {
          title: "The Environmental Impact of Big Tech",
          url: "https://www.youtube.com/watch?v=UL1n5QTJaL8",
          thumbnailUrl: "https://img.youtube.com/vi/UL1n5QTJaL8/hqdefault.jpg",
        },
      ],
    },

    {
      id: "steps-part-2",
      type: "steps",
      title: "Step-by-Step Activity (Part 2)",
      steps: [
        {
          title: "Creating a virtual poster about sustainability",
          duration: "30 minutes",
          body: [
            "Using Padlet, each student creates a virtual poster explaining an aspect of sustainability in the digital space.",
            "These could include ideas such as renewable energy for data centers or optimizing digital consumption.",
            '(<a href="https://padlet.com/claudiadoroftei2017/virtual-poster-nzplbltk82z6woyp" target="_blank" rel="noopener noreferrer">https://padlet.com/claudiadoroftei2017/virtual-poster-nzplbltk82z6woyp</a>).',
          ],
        },
        {
          title: "The “data minimization” challenge",
          duration: "10 minutes",
          body: [
            "Students experiment with reducing data consumption by optimizing digital content.",
            "Example: reducing file size, resizing images etc.",
            "They will record the impact using Padlet.",
          ],
        },
        {
          title: "Quick research: sustainable applications",
          duration: "20 minutes",
          body: [
            "In small teams, it is proposed to search for digital applications that promote sustainability.",
            "Examples: Ecosia, Treedom, Greenspector, Website Carbon Calculator, JOULE (from Microsoft Sustainability Manager), GitHub + Green Software Foundation, etc.",
            "Teams must present the applications and their features.",
          ],
        },
        {
          title: "Digital Impact Mapping (Padlet)",
          duration: "10 minutes",
          body: [
            "Students indicate on a digital map locations where technology has an impact (positive or negative) on the environment.",
            '(<a href="https://padlet.com/claudiadoroftei2017/maparea-impactului-digital-4k5kraxhhu4j2j5f" target="_blank" rel="noopener noreferrer">https://padlet.com/claudiadoroftei2017/maparea-impactului-digital-4k5kraxhhu4j2j5f</a>).',
            "After each student indicates a location on the world map, the environmental impact will be comparatively analyzed (the negative impact will probably predominate).",
            "Conclusions will be drawn regarding the sustainability of the global digital ecosystem.",
          ],
        },
        {
          title: "Assessment",
          duration: "10 minutes",
          body: [
            "Padlet: Discussion board.",
            "To obtain feedback on the activity carried out, the facilitator will ask students to complete comments, concerns and solutions on the Padlet platform, in a discussion board, to the three questions related to digital sustainability.",
            '(<a href="https://padlet.com/claudiadoroftei2017/questions-comments-and-concerns-2b297nwqfukfrymk" target="_blank" rel="noopener noreferrer">https://padlet.com/claudiadoroftei2017/questions-comments-and-concerns-2b297nwqfukfrymk</a>).',
          ],
        },
        {
          title: "Conclusion",
          duration: "5 minutes",
          body: [
            "The facilitator will formulate some conclusions regarding the topic addressed in this activity: sustainability is not limited to our actions in the physical world, but also includes the way we use technology.",
            "Every online search, every saved file or minute of streaming contributes to energy consumption and, implicitly, to the impact on the environment.",
            "By adopting more responsible digital habits and using applications that promote sustainability, we can reduce our virtual footprint and actively contribute to protecting the planet.",
          ],
        },
      ],
    },

    {
      id: "further-reading",
      type: "links",
      title: "Online resources used in the activity",
      items: [
        {
          title: "Padlet virtual poster board",
          url: "https://padlet.com/claudiadoroftei2017/virtual-poster-nzplbltk82z6woyp",
          resourceType: "external",
        },
        {
          title: "Padlet digital impact mapping",
          url: "https://padlet.com/claudiadoroftei2017/maparea-impactului-digital-4k5kraxhhu4j2j5f",
          resourceType: "external",
        },
        {
          title: "Padlet discussion board",
          url: "https://padlet.com/claudiadoroftei2017/questions-comments-and-concerns-2b297nwqfukfrymk",
          resourceType: "external",
        },
      ],
    },
  ],
};
