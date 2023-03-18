export type docs = {
  title: string;
  equation: JSX.Element | string;
  parameters: parameter[];
  usage: JSX.Element;
  childrens?: docs[];
};

export type parameter = {
  variable: JSX.Element;
  definition: JSX.Element;
};

export type introduct = {
  title: string;
  content: string;
};

export const INTRO: introduct = {
  title: "Introduction",
  content:
    "As mentioned in the project description, a SPOM is a metapopulation model used to describe the colonisation and extinction of patches in a network. While other models may use an ODE (ordinary differential equation) approach, SPOM uses a stochastic one where at random intervals of time every patch will perform an action based on numerous conditions like the probability it may go extinct or it may be colonised. These probabilites for a patch are calculated by a series of functions that take into consideration every other patch in the network including their distance and whether or not they are colonised. There are four core functions that are used and are as follows:",
};

export const DOCS_DATA: docs[] = [
  {
    title: "Dispersal Function (Hanski, 1994 and 1999)",
    equation: (
      <text>
        D(d<sub>ij</sub>, α) = exp(−α*d<sub>ij</sub>)
      </text>
    ),
    parameters: [
      {
        variable: <text>α</text>,
        definition: (
          <text>
            – The coefficient describing the shape of the species dispersal
            kernel, this value is used to describe the intensity for the
            exponential decline in the probability of dispersal as distances
            between patches increases (Smaller alpha values allow for greater
            distances between patches). 1/α is the average dispersal distance.
          </text>
        ),
      },
      {
        variable: (
          <text>
            d<sub>ij</sub>
          </text>
        ),
        definition: <text>- The distance between patches i and j.</text>,
      },
    ],
    usage: (
      <text>
        This function is used to calculate the dispersal between occupied and
        unoccupied patches on the network. Dispersal probabilities enter into
        the calculation of the connectivity of each patch patches.
      </text>
    ),
  },
  {
    title: "Connectivity Function (Moilanen, 2004)",
    equation: (
      <text>
        S<sub>i</sub>​=∑(O<sub>j</sub> * D(d<sub>ij</sub>, α) * (A<sub>j</sub>)
        <sup>b</sup>​)
      </text>
    ),
    parameters: [
      {
        variable: (
          <text>
            D(d<sub>ij</sub>, α)
          </text>
        ),
        definition: (
          <text>
            - The dispersal probability between the ith occupied patch and patch
            the jth unoccupied patch (See Dispersal Kernel).
          </text>
        ),
      },
      {
        variable: (
          <text>
            O<sub>j</sub>
          </text>
        ),
        definition: (
          <text>
            - The state of the j<sub>th</sub> patch, 0 if unoccupied, 1 if
            occupied.
          </text>
        ),
      },
      {
        variable: <text>b</text>,
        definition: (
          <text>
            – The coefficient describing the scaling factor of a patch’s area.
            This value is used to determine how influential the area of the j
            <sub>th</sub> patch is when calculating the connectivity of the i
            <sub>th</sub> patch.{" "}
          </text>
        ),
      },
      {
        variable: (
          <text>
            A<sub>j</sub>
          </text>
        ),
        definition: (
          <text>
            – The area of the j<sub>th</sub> patch.
          </text>
        ),
      },
    ],
    usage: (
      <text>
        This function is used to generate a quantifiable value for how reachable
        a patch is on the network. Connectivity of a patch is calculated by the
        summation of the product of every other occupied patches’ dispersal
        value and area factor. (Larger connectivity values increase the
        probability a patch is likely to be colonised).
      </text>
    ),
  },
  {
    title: "Colonization Function (Moilanen, 2004) ",
    equation: (
      <text>
        C<sub>i</sub>​=1−exp(−y*S<sub>i</sub>​)
      </text>
    ),
    parameters: [
      {
        variable: <text>y</text>,
        definition: (
          <text>
            – The coefficient linking the connectivity of the i<sub>th</sub>{" "}
            patch to its probability of it being colonized. (Larger values of y
            increase the probability that patches with smaller connectivity
            values are colonised).
          </text>
        ),
      },
      {
        variable: (
          <text>
            S<sub>i</sub>
          </text>
        ),
        definition: (
          <text>
            – The connectivity value of the i<sub>th</sub> patch.
          </text>
        ),
      },
    ],
    usage: (
      <text>
        This function is used to calculate a patches probability of being
        colonised, using the connectivity of the patch.
      </text>
    ),
  },
  {
    title: "Local Extinction Function (Hanski, 1994 and 1999)",
    equation: (
      <text>
        E<sub>i</sub>​=min(1,e/A<sub>i</sub>
        <sup>x</sup>​)
      </text>
    ),
    parameters: [
      {
        variable: <text>e</text>,
        definition: (
          <text>
            - The coefficient describing the extinction probability of a patch
            of unit area. This value is used to set the baseline extinction
            probability of a patch, patches smaller than this value have a
            higher chance of going extinct. (Larger values of e increase all
            occupied patches chances of going extinct).
          </text>
        ),
      },
      {
        variable: (
          <text>
            A<sub>i</sub>
          </text>
        ),
        definition: (
          <text>
            – The area of the i<sub>th</sub> patch.
          </text>
        ),
      },
      {
        variable: <text>x</text>,
        definition: (
          <text>
            – This coefficient describes how area scales with extinction
            probability. (Larger values of x will reduce the probability as area
            increases).
          </text>
        ),
      },
    ],
    usage: (
      <text>
        This function is used to calculate the extinction probability of every
        occupied patch on the network. This function uses the reciprocal of a
        patches area along with the coefficients to determine a patches
        probability of going extinct without the inclusion of the rescue effect.
      </text>
    ),
  },
  {
    title: "The Rescue effect (Hanski and Gilpin, 1997)",
    equation: (
      <text>
        E<sub>i</sub> =min(1, (1 – C<sub>i</sub>)*E<sub>i</sub>)
      </text>
    ),
    parameters: [
      {
        variable: (
          <text>
            E<sub>i</sub>
          </text>
        ),
        definition: <text>– The extinction probability of the patch.</text>,
      },
      {
        variable: (
          <text>
            C<sub>i</sub>
          </text>
        ),
        definition: <text>– The connectivity of the patch</text>,
      },
    ],
    usage: (
      <text>
        This function is used to reduce the chances of a patch going extinct due
        to very recent possible migrations into an already colonized the patch.
        This will result in well connected patches having a lower probability of
        going extinct compared to patches that are isolated from the rest of the
        network.
      </text>
    ),
  },
  {
    title: "Correlated Extinction",
    equation: "",
    parameters: [
      {
        variable: <text>C</text>,
        definition: <text>– The scaling factor of the radius.</text>,
      },
    ],
    usage: (
      <text>
        This function will allow for extinction events to have a correlated
        effect on “local” patches. Here local patches are defined as those
        positioned within a distance from the i<sub>th</sub> patch of (c x the
        radius of the i<sub>th</sub> patch) – so larger patches induce large
        extinction ‘footprints’. If an extinction event occurs for the i
        <sub>th</sub> patch, all other occupied patches considered local are
        also rendered extinct. To keep overall extinction rates independent of
        the extent of these spatial correlations in extinction, the
        (uncorrelated) probability of each patches extinction is divided by the
        total number of patches that would go extinct during such an event, so
        introducing this form of correlation should not change the overall
        intensity of extinction across the network.
      </text>
    ),
  },
];
