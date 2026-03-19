// src/lib/activity/content/activity-5-4.ts
import type { ActivityContent } from "@/src/lib/activity/content-types";

export const activity54Content: ActivityContent = {
  slug: "activity-5-4",
  title: "Local Voices: The Sustainability Forum Simulation",
  moduleLabel: "Module 5: Adult education for environmental sustainability",
  meta: [
    { label: "Duration", value: "90 minutes", icon: "⏱" },
    { label: "Setting", value: "F2F", icon: "🧑‍🏫" },
    {
      label: "Type",
      value: "Role-play simulation, Group activity, Discussion, argument mapping",
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
        "Stationery (flipcharts, markers, sticky notes) or collaborative mapping software",
      ],
    },

    {
      id: "resources",
      type: "list",
      title: "Resources",
      items: [
        "Role cards (Community Member, Business Owner, NGO Advocate, Council Representative, Journalist)",
        "“Sustainability Issue Brief” handout (localized scenario)",
        "Timer and name cards",
        "Flipcharts or shared document for proposals",
      ],
    },

    {
      id: "steps",
      type: "steps",
      title: "Step-by-Step Activity",
      steps: [
        {
          title: "Phase 1: Introduction",
          duration: "10 min",
          body: [
            "Facilitator presents scenario background and explains that civic participation means deliberating—not just voting. Stress that sustainable decisions require balancing ecological, social, and economic factors.",
          ],
        },
        {
          title: "Phase 2: Stakeholder Briefing",
          duration: "15 min",
          body: [
            "Distribute role cards detailing each stakeholder’s perspective:",
            "Community Member: wants visible local benefits, low disruption.",
            "Business Owner: cares about costs and attracting customers.",
            "NGO Advocate: prioritizes ecological impact and education.",
            "Council Representative: must balance public opinion, fairness, and long-term policy goals.",
            "Journalist: observes and reports, can ask questions or clarify claims.",
            "Allow 5 minutes for reading, then groups plan their argument.",
          ],
        },
        {
          title: "Phase 3: The Forum Debate",
          duration: "30 min",
          body: [
            "Simulate a public meeting:",
            "Each group gives a 2-minute opening statement supporting one funding choice.",
            "Round 2: open debate and cross-questioning (10 min).",
            "Round 3: negotiation and coalition-building (10 min).",
            "Final: a collective vote must reach at least 70% agreement to allocate the grant.",
            "Encourage respectful advocacy and evidence-based arguments (linking actions to sustainability impact).",
          ],
        },
        {
          title: "Phase 4: Decision Reflection",
          duration: "20 min",
          body: [
            "After voting, step out of roles. Discuss:",
            "Which proposal won, and why?",
            "What trade-offs were considered?",
            "How did communication style affect influence?",
            "What would real citizens need to know or do to participate effectively?",
            "Facilitator highlights that civic processes rely on collaboration, not confrontation, and that sustainability outcomes improve when communities deliberate inclusively.",
          ],
        },
        {
          title: "Phase 5: From Simulation to Action",
          duration: "15 min",
          body: [
            "Groups brainstorm one real initiative they could support locally, based on what they learned (e.g., contacting the local council, joining an NGO, forming a volunteer group).",
            "Each writes a “Local Voices Action Pledge”: one concrete civic step to take within the next month.",
          ],
        },
      ],
    },

    {
      id: "scenario-mockup",
      type: "text",
      title: "Scenario Mockup - “Local Voices: The Sustainability Forum Simulation”",
      body: [
        "Title: The Riverbank Renewal Dilemma",
        "Background Narrative (for facilitator briefing or projection):",
        "The town of Valea Verde has recently received a €50,000 community sustainability grant from the regional council. The goal is to fund one project that improves both environmental quality and residents’ wellbeing. After an open call for ideas, four proposals have reached the final stage. A public forum has been scheduled to debate and select the winning initiative.",
        "The town has about 12,000 residents, mixed urban-rural characteristics, and moderate tourism potential. Environmental challenges include flooding along the riverbank, waste management inefficiencies, limited cycling infrastructure, and youth migration due to low engagement opportunities.",
        "The mayor has asked for community consultation before any final decision. Citizens, NGOs, and businesses have been invited to participate in a Sustainability Forum, moderated by the City Council Environment Committee.",
        "Participants in this simulation represent various local actors with differing priorities. The objective is to negotiate and collectively decide how to allocate the grant in a way that benefits the community and supports sustainability goals.",
      ],
    },

    {
      id: "funding-proposals",
      type: "text",
      title: "Funding Proposals",
      body: [
        "Riverbank Regeneration Project",
        "Restore 1.5 km of the polluted riverbank.",
        "Build walking paths, plant native trees, and create a small public green space.",
        "Expected benefits: flood mitigation, biodiversity, tourism appeal.",
        "Estimated cost: €45,000.",
        "Managed by: local environmental NGO with municipal support.",
        "",
        "Green Mobility Pilot",
        "Introduce a network of 30 shared bicycles and install racks at key locations.",
        "Promote eco-commuting to reduce car use.",
        "Estimated cost: €48,000.",
        "Managed by: local youth association + transport department.",
        "",
        "Community Composting Hub",
        "Construct two compost collection stations for food waste.",
        "Offer monthly workshops on composting and urban gardening.",
        "Estimated cost: €35,000.",
        "Managed by: waste management company + community volunteers.",
        "",
        "Eco-Fair & Awareness Week",
        "Organize a one-week event promoting local sustainable products and eco-living practices.",
        "Expected to engage at least 2,000 citizens.",
        "Estimated cost: €25,000.",
        "Managed by: local business alliance + cultural center.",
      ],
    },

    {
      id: "stakeholder-roles",
      type: "text",
      title: "Stakeholder Roles",
      body: [
        "City Council Representative (Chair/Moderator)",
        "Must ensure fairness and public participation.",
        "Responsible for guiding discussion and calling for a final vote.",
        "Concerned about project feasibility, visibility, and political balance.",
        "",
        "Environmental NGO Advocate",
        "Strongly supports the Riverbank Regeneration Project.",
        "Emphasizes biodiversity, climate resilience, and citizen well-being.",
        "Argument: “Long-term benefits outweigh short-term costs.”",
        "",
        "Local Business Owner (Chamber of Commerce)",
        "Prefers the Eco-Fair & Awareness Week to attract visitors and stimulate local economy.",
        "Concerned that long-term projects like river restoration don’t bring immediate returns.",
        "",
        "Youth Representative (from local high school association)",
        "Advocates for the Green Mobility Pilot.",
        "Argues that young people need visible, modern solutions for climate action and mobility.",
        "",
        "Resident of Riverside District",
        "Lives near the polluted area; supports river restoration but worries about maintenance and possible noise during construction.",
        "Concerned with fairness and consultation of affected neighborhoods.",
        "",
        "Waste Management Officer",
        "Supports the Composting Hub as low-cost and achievable.",
        "Believes it can engage citizens practically and reduce landfill burden.",
        "",
        "Local Journalist (Observer Role)",
        "Takes notes, asks clarifying questions during the forum.",
        "Writes a summary article at the end (optional debrief task).",
      ],
    },

    {
      id: "forum-rules",
      type: "list",
      title: "Forum Rules",
      items: [
        "Each stakeholder gives a 2-minute opening statement.",
        "Open debate follows (questions, responses, counterarguments).",
        "The council chair ensures all voices are heard.",
        "After debate, all participants propose possible compromises or project merges.",
        "A final vote is held; at least 70% agreement required to pass.",
      ],
    },

    {
      id: "facilitator-notes",
      type: "list",
      title: "Facilitator Notes",
      items: [
        "Encourage realistic advocacy and evidence-based arguments (economic, social, ecological).",
        "Ensure quieter voices (residents, youth) are invited to speak.",
        "Optionally, allow coalitions: e.g., composting hub + awareness week merge for joint funding.",
        "Use a visible decision matrix to track pros and cons of each proposal.",
      ],
    },

    {
      id: "expected-learning-outcomes",
      type: "list",
      title: "Expected Learning Outcomes Demonstrated in Simulation",
      items: [
        "Understanding local sustainability decision-making processes.",
        "Recognition of conflicting priorities and negotiation dynamics.",
        "Practice in civic communication and collaboration.",
        "Application of systems thinking to community-level sustainability choices.",
      ],
    },

    {
      id: "extension",
      type: "text",
      title: "Extension (optional homework or follow-up)",
      body: [
        "Participants draft a short press release or social media post (100 words) summarizing the forum’s decision and its sustainability value — reinforcing civic communication as part of active citizenship.",
        "This mockup provides all materials necessary to run the simulation realistically within 90 minutes. It anchors civic participation in a tangible sustainability dilemma, giving adults a practical way to experience democratic engagement and collective environmental problem-solving.",
      ],
    },

    {
      id: "assessment",
      type: "text",
      title: "Assessment",
      body: [
        "Assessment: Assessment for this submodule is centered on both the process (during the session) and the product/outcome (the follow-up pledge and reflection). During the session, evaluate learning through active participation in the role-play and negotiation phases: as groups act out stakeholder positions and deliberate in the forum, the facilitator observes for comprehension - Are participants clearly articulating the perspectives and constraints of different community actors (citizens, businesses, NGOs, government)? Are they recognizing trade-offs between ecological, social, and economic factors? A dynamic and balanced debate, where participants respond with reasoned arguments and seek compromise, is evidence that outcome 1 (mapping civic roles and understanding stakeholder relationships) is being achieved.",
        "The decision-making and debrief phases function as real-time assessments of analytical and civic reasoning. Listen for participants who can connect actions to sustainability objectives (e.g., “The bike lane supports emission reduction and health goals” or “The food-waste program builds community engagement”). Note whether they can justify collective decisions using sustainability logic rather than personal preference. The facilitator can use a simple observation checklist: Did the participant present a clear argument? Did they collaborate respectfully? Did they consider evidence and community benefit? Asking clarifying questions (“What made this option most sustainable?”) serves as formative guidance and reinforces critical thinking.",
      ],
    },

    {
      id: "further-reading",
      type: "links",
      title: "Further Reading",
      items: [
        {
          title: "The Deliberative Democracy Consortium",
          url: "https://deliberative-democracy.net/",
          resourceType: "external",
        },
        {
          title: "World Bank - Participatory Decision-Making Toolkit",
          url: "https://openknowledge.worldbank.org/handle/10986/37203",
          resourceType: "external",
        },
        {
          title: "Climate Interactive - World Climate Simulation",
          url: "https://www.climateinteractive.org/world-climate-simulation/",
          resourceType: "external",
        },
        {
          title: "EU Science Hub - GreenComp: European Sustainability Competence Framework",
          url: "https://joint-research-centre.ec.europa.eu/greencomp_en",
          resourceType: "external",
        },
      ],
    },
  ],
};
