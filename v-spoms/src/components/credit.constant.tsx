export type credit = {
  description: string;
  uni: string;
  members: string[];
  customer: string;
};

export const CREDIT_DATA: credit = {
  description: `This team was created for students who enrolled in the COMPSCI4015 Professional Software Development H and Team Projects course at `,
  uni: "the University of Glasgow.",
  members: [
    "Paulius Jankauskas",
    "Raviphas Sananpanichkul",
    "James Nurdin",
    "Emma Zhang",
    "Tianrun Zhao",
  ],
  customer: "Dan Haydon - (School of Biodiversity, One Health and Veterinary Medicine)",
};
