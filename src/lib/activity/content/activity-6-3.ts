// src/lib/activity/content/activity-6-3.ts
import type { ActivityContent } from "@/src/lib/activity/content-types";

export const activity63Content: ActivityContent = {
  slug: "activity-6-3",
  title: "Greening the Workplace",
  moduleLabel: "Module 6: Green Skills Training",
  intro:
    "Using case study analysis to understand green skills, workplace transition, and sustainability practice.",

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
            "The facilitator sets the stage by briefly presenting the case study to ensure everyone has the key facts fresh in mind.",
            "For instance: “EcoFuture Manufacturing, with 200 employees, set a goal to cut carbon emissions by 50% in 5 years. They invested in energy-efficient machinery and launched a green skills training program for their staff. Let’s see how they managed this transition.”",
            "The context is related back to course content: participants are reminded of concepts like the green economy, upskilling, and stakeholder engagement that will be relevant in analysis.",
            "The facilitator might note that according to the ILO, such efforts are crucial since “the green transition can generate millions of jobs, but these are conditional on the availability of relevant skills and training”, underlining why employee training is a focal point in the case.",
          ],
        },
        {
          title: "Clarify Task and Form Groups",
          duration: "5 minutes",
          body: [
            "Participants are divided into groups of around 4, using different grouping than Activity 2 to vary collaboration.",
            "The facilitator explains that each group will analyse the case, identifying successes, challenges, and lessons learned.",
            "Specific guiding questions are provided, for example: What were the key green skills needed by the company’s workforce and how were they developed? What challenges (technical, financial, human) did the company face in implementing changes? How did management and employees’ attitudes affect the project? What outcomes were achieved and what could be improved?",
            "Each group is tasked to discuss and prepare a brief report or presentation addressing these questions.",
            "Optionally, the facilitator might assign each group a particular perspective or stakeholder role to focus on, such as management, employees, or environmental experts/community. This can enrich the discussion with multiple angles.",
          ],
        },
        {
          title: "Group Analysis in Breakouts",
          duration: "40 minutes",
          body: [
            "Groups go into breakout rooms to delve into the case.",
            "They use the worksheet or a shared document to note their analysis, and members may take roles such as moderator, note-taker, and spokesperson.",
            "They pull evidence from the case text, for example: “On page 2, it says 50 workers needed training in energy auditing, so a key skill was learning to conduct energy audits.”",
            "They identify which actions succeeded and which problems arose, such as training improving efficiency or older workers showing resistance to new procedures, indicating an attitudinal barrier.",
            "The groups also consider course concepts: Did the company demonstrate a just transition, for example no layoffs and retraining offered? Did they use any technology like an energy management system that workers had to learn?",
            "The discussion is rich: participants apply theory to a tangible scenario, honing their analytical and problem-solving skills.",
            "The facilitator moves between groups to answer questions or nudge deeper thinking, for example: “Have you considered how the workers’ existing skills were assessed? What about the role of government policy in this case?”",
          ],
        },
        {
          title: "Group Presentations",
          duration: "30 minutes",
          body: [
            "Back in the plenary session, each group or stakeholder perspective presents its findings.",
            "They summarise answers to the guiding questions.",
            "For example, Group A (Management) might report that management identified a skills gap in operating the new solar-powered equipment and addressed it by hiring a consultant to run workshops, while a challenge was the initial cost and skepticism from the board until energy savings became evident.",
            "Group B (Employees) might add that employees were concerned about job security initially, but involving them in training design and showing how green skills improved job safety and prospects increased buy-in, reflecting the importance of participation for a just transition.",
            "Each group uses evidence from the case to support its points.",
          ],
        },
        {
          title: "Facilitated Discussion",
          duration: "20 minutes",
          body: [
            "After all presentations, the facilitator leads a discussion to synthesize insights.",
            "The groups’ perspectives are compared, highlighting common threads such as the crucial role of continuous learning and communication.",
            "If any perspective was missing, such as the community or customers, the facilitator prompts consideration of it.",
            "The discussion also connects back to broader lessons: greening a workplace requires both technical changes and human capital development, including training programs, attitude shifts, and leadership commitment.",
            "This echoes research that integrating new technical and digital skills in the context of the green transition, combined with effective stakeholder cooperation, paves the way for transformational change.",
            "The facilitator might cite how the GRÆDUCATION project showed that hands-on collaboration between companies and training institutions can drive successful skill-building and innovation.",
            "These real examples reinforce the case study’s lessons and show participants that such approaches are happening in the world.",
          ],
        },
        {
          title: "Conclusion and Lessons Learned",
          duration: "10 minutes",
          body: [
            "The facilitator asks each group to quickly state one key lesson they are taking away from the case.",
            "Responses might include: “Investing in employees’ green skills is not a cost but an investment with high returns,” “Transparency and communication across all levels were crucial to success,” or “Technical solutions alone won’t work without addressing mindsets.”",
            "The facilitator writes these on a shared screen for all to see.",
            "To conclude, the facilitator emphasizes how the case study illustrated ESD in action: knowledge (technical solutions) coupled with skills (training and problem-solving) and attitudes (culture change) all had to come together.",
            "Participants are encouraged to reflect on how they might apply these insights in their own context, such as in their workplace or teaching practice.",
          ],
        },
      ],
    },

        {
          id: "case-study",
          type: "links",
          title: "Case Study",
          items: [
        {
          title: "Greek-German “GRÆDUCATION” project",
          url: "https://pjjslpdbnwfkvlrxrkpr.supabase.co/storage/v1/object/public/course-assets/Case-Studies/dsd-teal/Module-6/Activity-6-3/Case-Studies/case-study.pdf",
          resourceType: "pdf",
        },
       ],
     },

    {
      id: "assessment",
      type: "text",
      title: "Assessment",
      body: [
        "Case Study Report (Group Output): Each group’s notes or presentation on the case questions serves as an artifact of their analysis. The facilitator reviews these for depth of understanding and for connection to course concepts such as green skills, just transition, and stakeholder engagement.",
        "Critical Thinking and Discussion: The quality of the discussion is assessed through observation. The facilitator looks for whether participants make connections to prior knowledge, offer solutions rather than only identify problems, and contribute critical insights or relevant parallels.",
        "Participation and Collaboration: Since this activity is discussion-based, assessment focuses on whether everyone contributed analysis points, whether the group stayed on task, and whether multiple voices participated in the full-group discussion.",
        "Reflection on Application: After the activity, participants answer a short prompt in the course forum: “What one change would you implement in your own workplace or community based on what you learned from the case study?” This helps assess how well they can transfer the case lessons to real-life thinking and action.",
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
          title: "Greek-German “GRÆDUCATION” project",
          url: "https://unevoc.unesco.org/pub/nqc_graeducation_fiap.pdf",
          resourceType: "external",
        },
        {
          title: "ILO Brief on Green Jobs and Skills",
          url: "https://www.ilo.org/sites/default/files/wcmsp5/groups/public/@dgreports/@dcomm/@publ/documents/publication/wcms_159585.pdf",
          resourceType: "external",
        },
        {
          title: "Relevant Article – “Lessons in Change Management for Sustainability”",
          url: "https://www.prosci.com/blog/change-management-for-sustainability",
          resourceType: "external",
        },
      ],
    },
  ],
};
