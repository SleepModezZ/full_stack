export interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

export interface CoursePartDescription extends CoursePartBase {
  description: string;
}

export interface CoursePartBasic extends CoursePartDescription {
  kind: "basic";
}

export interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group";
}

export interface CoursePartBackround extends CoursePartDescription {
  backroundMaterial: string;
  kind: "background";
}

export interface CoursePartSpecial extends CoursePartDescription {
  requirements: string[];
  kind: "special";
}

export type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackround | CoursePartSpecial;