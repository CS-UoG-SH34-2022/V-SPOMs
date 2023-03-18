import { BaseColonizationFunction } from "sim-spoms/src/functions/colonisation/base";
import { BaseConnectivityFunction } from "sim-spoms/src/functions/connectivity/base";
import { CorrelatedExtinctionFunction } from "sim-spoms/src/functions/correlatedExtinction/correlatedExtinction";
import { BaseDispersalFunction } from "sim-spoms/src/functions/dispersal/base";
import { BaseIntrinsicExtinctionFunction } from "sim-spoms/src/functions/intrinsic-extinction/base";
import { AVAILABLE_SETTINGS } from "sim-spoms/src/engine/base";

export interface Setting {
  equationName: string;
  equation?: string;
  type: string;
  editableParameter?: InputInfo[];
  staticParameter?: staticParameterInfo[];
  description: string | JSX.Element;
}

export interface staticParameterInfo {
  parameter: string;
  info: JSX.Element | string;
}

export interface InputInfo extends staticParameterInfo {
  info: string;
  errorMessage: string;
  lowerBound?: number;
  upperBound?: number;
  type: string;
  default: number;
}

export const SETTING_DATA: Setting[] = [
  {
    equationName: "Dispersal Kernal (Hanski, 1994 & 1999)",
    equation: "D(d_{ij}, α) = exp(−α*d_{ij})",
    type: AVAILABLE_SETTINGS.dispersalFunction,
    editableParameter: [
      {
        parameter: "α",
        info: "The coefficient describing the distribution of dispersal distances, this value is used to describe the intensity for the exponential drop off in the dispersal as distances between patches increase (Smaller alpha values allow for greater distances between patches). 1/α is the average dispersal distance.",
        errorMessage: "α need to be positive",
        lowerBound: 0,
        type: BaseDispersalFunction.DISPERSAL_PARAMETER_TYPES.a,
        default: BaseDispersalFunction.DEFAULT_ALPHA,
      },
    ],
    staticParameter: [
      {
        parameter: "d_{ij}",
        info: "The distance between patch i and j.",
      },
    ],
    description:
      "This function is used to calculate the dispersal between occupied and unoccupied patches on the network. Dispersal probabilities enter into the calculation of the connectivity of each patch patches.",
  },
  {
    equationName: "Connectivity Function (Hanski, 1994)",
    equation: "S_i​=∑(O_j * D(d_{ij​},α) * (A_j)^b​)",
    type: AVAILABLE_SETTINGS.connectivityFunction,
    editableParameter: [
      {
        parameter: "b",
        info: "The coefficient describing the scaling factor of a patch’s area. This value is used to determine how influential patch j’s area is when calculating the connectivity of patch i.",
        errorMessage: "b need to be a number.",
        type: BaseConnectivityFunction.CONNECTIVITY_PARAMETER_TYPES.b,
        default: BaseConnectivityFunction.DEFAULT_B,
      },
    ],
    staticParameter: [
      {
        parameter: "D(d_{ij}, α)",
        info: "The dispersal value between patch i and j.",
      },
      {
        parameter: "O_j",
        info: (
          <span>
            The state of patch j<sub>th</sub>.
          </span>
        ),
      },
      {
        parameter: "A_j",
        info: "The area of patch j.",
      },
    ],
    description:
      "This function is used to generate a quantifiable value for how reachable a patch is on the network. Connectivity of a patch is calculated by the summation of the product of every other occupied patches’ dispersal value and area factor. (Larger connectivity values increase the probability a patch is likely to be colonised).",
  },
  {
    equationName: "Colonization Function (Moilanen, 2004)",
    equation: "C_i​=1−exp(−y*S_i​)",
    type: AVAILABLE_SETTINGS.colonizationFunction,
    editableParameter: [
      {
        parameter: "y",
        info: "The coefficient describing probability scaling. This value is used to describe the curve at which a patch’s colonisation probability is determined. (Larger values of y increase the probability that patches with smaller connectivity values are colonised), in other words patches further away are more likely to be colonised.",
        errorMessage: "y need to be positive.",
        lowerBound: 0,
        type: BaseColonizationFunction.COLONIZATION_PARAMETER_TYPES.y,
        default: BaseColonizationFunction.DEFAULT_Y,
      },
    ],
    staticParameter: [
      {
        parameter: "S_j",
        info: "The connectivity value of the current patch.",
      },
    ],
    description:
      "This function is used to calculate a patches probability of being colonised, using the connectivity of the patch.",
  },
  {
    equationName: "Local Extinction Function (Hanski, 1994 & 1999)",
    equation: "E_i​=min(1,(e)/(A_i)^x​)",
    type: AVAILABLE_SETTINGS.intrinsicExtinctionFunction,
    editableParameter: [
      {
        parameter: "e",
        info: "The coefficient describing the extinction probability of a patch of unit area. This value is used to set the baseline extinction probability of a patch, patches smaller than this value have a much higher chance of going extinct. (Larger values of e increase all occupied patches chances of going extinct).",
        errorMessage: "e need to be positive.",
        lowerBound: 0,
        type: BaseIntrinsicExtinctionFunction
          .INTRINSIC_EXTINCTION_PARAMETER_TYPES.e,
        default: BaseIntrinsicExtinctionFunction.DEFAULT_E,
      },
      {
        parameter: "x",
        info: "This coefficient is describing the scaling extinction risk with patch area. This value is used to scale the effect area has on reducing the probability of a patch going extinct (Larger values of x will reduce the probability as area increases)",
        errorMessage: "x need to be postive",
        lowerBound: 0,
        type: BaseIntrinsicExtinctionFunction
          .INTRINSIC_EXTINCTION_PARAMETER_TYPES.x,
        default: BaseIntrinsicExtinctionFunction.DEFAULT_X,
      },
    ],
    staticParameter: [
      {
        parameter: "A_i",
        info: "The area of the patch",
      },
    ],
    description:
      "This function is used to calculate the extinction probability of every occupied patch on the network. This function uses the reciprocal of a patches area along with the coefficients to determine a patches probability of going extinct without the inclusion of the rescue effect.",
  },
  {
    equationName: "The Rescue Effect (Hanski and Gilpin, 1997)",
    equation: "E_i =min(1, (1 – C_i)E_i)",
    type: "",
    staticParameter: [
      {
        parameter: "E_i",
        info: "The extinction probability of the patch",
      },
      {
        parameter: "C_i",
        info: "The connectivity of the patch",
      },
    ],
    description:
      "This function is used to reduce the chances of a patch going extinct due to very recent possible migrations into an already colonized the patch. This will result in well connected patches having a lower probability of going extinct compared to patches that are isolated from the rest of the network.",
  },
  {
    equationName: "Correlated Extinction",
    type: AVAILABLE_SETTINGS.correlatedExtinctionFunction,
    editableParameter: [
      {
        parameter: "C",
        info: "The synchronised extinction coefficient, this value is used to determine what proportion of other occupied patches will also go extinct during an extinction of a single patch",
        errorMessage: "C need to be between 0 and 1(inclusive).",
        lowerBound: 0,
        type: CorrelatedExtinctionFunction.CORRELATED_EXTINCTION_PARAMETER_TYPES
          .c,
        default: CorrelatedExtinctionFunction.DEFAULT_C,
      },
    ],
    description: (
      <p>
        This function will allow for extinction events to have a correlated
        effect on “local” patches. Here local patches are defined as those
        positioned within a distance from the i<sub>th</sub> patch of (c x the
        radius of the i<sub>th</sub> patch) – so larger patches induce large
        extinction ‘footprints’. If an extinction event occurs for the i
        <sub>th</sub> patch, all other occupied patches considered local are
        also rendered extinct.
      </p>
    ),
  },
];
