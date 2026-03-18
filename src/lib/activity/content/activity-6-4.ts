// src/lib/activity/content/activity-6-4.ts
import type { ActivityContent } from "@/src/lib/activity/content-types";

export const activity64Content: ActivityContent = {
  slug: "activity-6-4",
  title: "ESD in Action Personal Blog",
  moduleLabel: "Module 6: Green Skills Training",
  intro:
    "A reflective writing activity that turns sustainability learning into personal voice, advocacy, and action.",

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
            "The facilitator explains that as a capstone activity, each participant will write a short article or blog post to articulate their understanding and perspective on “Green Skills for Sustainable Development.”",
            "The goal is to translate learning into a form that could influence or inform others – a key competency in advocacy and communication.",
            "This activity also serves as a reflection on their personal learning journey.",
          ],
        },
        {
          title: "Brainstorming Topics",
          duration: "15 minutes",
          body: [
            "As a group, participants brainstorm possible angles for their blog.",
            "The facilitator might prompt: “What topic are you passionate about now, after all we’ve covered? It could be an issue (like plastic pollution), a solution (like solar energy), an educational approach (like using AR in class), or your personal action plan.”",
            "Each participant shares one or two ideas aloud, and the facilitator or a volunteer lists them on a shared screen.",
            "For example, ideas might include “How I plan to green my school’s curriculum,” “Why companies should invest in green skills training,” or “My journey toward zero-waste living.”",
            "This brainstorming helps those who are unsure to get inspiration and ensures a diversity of topics.",
          ],
        },
        {
          title: "Guidance on Writing",
          duration: "20 minutes",
          body: [
            "The facilitator provides tips for writing an effective blog article.",
            "Key points include defining a main message clearly, writing in an accessible tone, using anecdotes or examples to illustrate points, and supporting arguments with facts or references to maintain credibility.",
            "Participants are reminded to leverage the knowledge they have gained. Quoting a striking statistic or referencing a concept like just transition can strengthen their piece.",
            "The facilitator also emphasizes authenticity: “Write in your voice – this is about your take on sustainable development.”",
            "Participants are encouraged to include how they have applied or plan to apply green skills in practice, making the article more compelling and personal.",
            "A quick note is also given on structure: having an introduction, body, and conclusion, while allowing a more informal or personal tone than a standard essay.",
          ],
        },
        {
          title: "Writing First Draft",
          duration: "90 minutes",
          body: [
            "Participants then exit the live call, or turn off cameras, to work on their individual blog post drafts.",
            "They should aim for about 600–800 words, roughly 1–2 pages.",
            "They are encouraged to find a quiet time during the day to write thoughtfully.",
            "The facilitator remains available via chat or email for any questions during this period.",
            "In their writing, participants may cite 1–2 references from the course to reinforce their learning.",
            "They are also encouraged to inject personal reflection, for example by describing how their views changed during the course or what actions they now feel committed to taking.",
          ],
        },
        {
          title: "Peer Review Exchange",
          duration: "30 minutes",
          body: [
            "After submitting their first drafts, participants reconvene, or asynchronously swap, for peer feedback.",
            "The facilitator pairs participants, or forms small groups of 3, ideally matching people with different topics to get fresh perspectives.",
            "Each participant reads a peer’s draft and provides constructive comments.",
            "The facilitator provides a simple checklist focusing on clarity of message, personal voice, structure, and one thing they learned from the piece.",
            "During a live session or via comments in the document, peers share their impressions.",
            "This process helps improve the blogs and reinforces learning, since each participant engages with another person’s sustainability perspective.",
          ],
        },
        {
          title: "Revision and Finalization",
          duration: "20 minutes",
          body: [
            "Participants take the peer feedback and revise their articles.",
            "They correct factual inaccuracies, tighten the writing, and implement useful suggestions.",
            "This step can be completed offline, with submissions made by a set deadline.",
            "The facilitator may also skim through final versions to ensure quality and check that no major misunderstandings remain.",
          ],
        },
        {
          title: "Sharing and Closing Discussion",
          duration: "30 minutes",
          body: [
            "In a concluding live session, volunteers are invited either to read a favorite excerpt from their blog or to summarize their key message in 2 minutes.",
            "This creates a celebratory moment to acknowledge their work.",
            "Participants hear a range of perspectives, from personal pledges to observations about sustainability in different sectors.",
            "The facilitator highlights the diversity of topics and how each connects to the common theme of green skills and sustainability.",
            "A few big-picture questions prompt final reflection, such as: “How has your attitude changed since the start of this course?” and “What action are you inspired to take next?”",
            "The facilitator notes that these pieces could even be published on a class blog or shared on LinkedIn, with participants’ permission, to amplify their impact.",
            "This reinforces the real-world relevance of their work and positions them as advocates for sustainable development in their own right.",
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
         title: "Greener Thinking, Greener Doing",
         url: "https://pjjslpdbnwfkvlrxrkpr.supabase.co/storage/v1/object/public/course-assets/dsd-teal/Module-6/Activity-6-4/Case-Studies/case-study1.pdf",
         resourceType: "pdf", // 🔥 THIS is the fix
      },
    ],
  },

    {
      id: "assessment",
      type: "text",
      title: "Assessment",
      body: [
        "Written Article Quality: The facilitator assesses each final blog article using criteria such as understanding of content, expression of personal insight, persuasiveness and communication, and writing clarity. The focus is on substance and coherence rather than perfection of grammar. A strong article accurately incorporates course concepts, reflects on their meaning for the participant or their community, and communicates a clear call to action.",
        "Peer Feedback Participation: Giving and receiving feedback is part of the learning process. The facilitator notes whether each participant completed the peer review step and the quality of feedback given. Thoughtful, constructive, and specific feedback is taken as evidence of both interpersonal skills and comprehension.",
        "Reflective Depth: The final sharing discussion and the tone of the articles themselves help assess attitudinal change. The facilitator looks for signs of empowerment, commitment, and action-oriented thinking. Statements showing that participants now see themselves as capable of making a difference are considered strong evidence of ESD impact.",
        "Knowledge Integration: Because this is a culminating activity, it assesses how well participants can integrate knowledge from across the module. A strong article may naturally connect global challenges, the concept of green skills, workplace or case-study insights, and the participant’s own plans for change. If any important concept is misinterpreted in writing, the facilitator provides corrective feedback in final comments.",
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
