import { introduct } from "./docs.constant";

export type intro = {
  title: string;
  content: string;
  childrens?: intro[];
};

export const INTRODUCTION: introduct = {
  title: "Introduction of V-SPOM",
  content:
    "V-SPOM is a web-based application for generating, editing and simulating SPOM networks. \
    It also displays statistical information of the simulation.",
};

export const INTRO_DATA: intro[] = [
  {
    title: "What are SPOMs?",
    content:
      "SPOMs is short for: Spatial Patch Occupancy Models, which have developed out of classical ecological \
        metapopulation theory, and describe how populations persist in patchy and fragmented landscapes.",
  },
  {
    title: "Why V-SPOMs?",
    content: "",
    childrens: [
      {
        title: "Strategic planning",
        content:
          "They play a key role in population ecology and conservation planning.",
      },
      {
        title: "Educational tool",
        content:
          "We teach undergraduate students about these models in Level 4 \
                and our masters students in specialized modules on single species population ecology.",
      },
      {
        title: "Visualisation of complex equations",
        content:
          "These ideas look complicated when written down, but in fact are quite simple, \
                and best understood through visualizing simulated dynamics, with a clear graphical/user interface.",
      },
    ],
  },
  {
    title: "How do SPOMs work?",
    content: "",
    childrens: [
      {
        title: "Habitat Patches",
        content:
          "The basic idea is that populations persist in a set of habitat \
                patches embedded in a matrix of less favourable habitat.",
      },
      {
        title: "Binary occupation state",
        content:
          "Patches are either occupied (colonized) or not, and transition \
                between being colonized and going locally extinct.",
      },
      {
        title: "Determined by stochastic event balance",
        content:
          "Regional persistence is determined by the balance of colonization \
                events and local extinction events.",
      },
      {
        title: "Implicit spatial process",
        content:
          "The process is 'implicitly' (rather than explicitly) spatial, \
                but the output will appear as a 'map' of patches 'blinking' in and out as \
                they transition between being occupied and going extinct.",
      },
    ],
  },
  {
    title: "Tutorial",
    content: "Short overview how to interact with the app.",
    childrens: [
      {
        title: "How to start a simulation?",
        content:
          "Either Create a new scenario, or upload an existing \
                scenario (json file), restart the simulation then click start.",
      },
      {
        title: "How to alter the SPOM functions?",
        content:
          "Every scenario is unique and should have unique function \
                paramters to ensure the SPOM runs as intended by the user. Select the settings icon in the bottom \
                left of the action page and proceed to alter the values using the documentation as guidance. \
                Once the value has been chosen press the edit button to save the changes to the function.",
      },
      {
        title: "How to alter simulation settings?",
        content:
          "To adjust the simulation settings, locate the simulation controls at the bottom of \
                action page. To adjust how long a simulation runs for increase the number of iterations to the desired length. To \
                allow for multiple simulations to occur simultaneously enter the desired amount of replicates \
                into the field box, please note that running an exessive amount of replicates (over 100) noticeably increases \
                the time to calcualte the simulation, users should avoid running over 1000 replicates to avoid complications.",
      },
      {
        title: "How to traverse simulation snapshots?",
        content:
          "After the simulation has finished calculating, the spom will be ready to present the \
                results to the user. To watch the network and graph play out automatically, click the start button. \
                During the play out of the simulation the pause button can be pressed to hault the animation. The user \
                is also able to manually go forwards and backwards through time in order to explore changes \
                to the network and the graph in further detail by clicking the buttons to the right and left of the start/stop \
                button respectively. Finally the user can skip the animation entirely by clicking \
                the skip button located at the far right of the controls. ",
      },
      {
        title: "How to edit patches?",
        content:
          "New patches can be added by enabling new patch addition \
                and clicking anywhere in the network view. Existing patch data can be \
                edited by first selecting the patch, editing the patch values in the \
                `Parameters` section and clicking `Save!`",
      },
      {
        title: "How to save scenario with patches?",
        content:
          "When you are happy with your patch network, you can save it \
                by exporting it into a json file using the `Export` button.",
      },
    ],
  },
];
