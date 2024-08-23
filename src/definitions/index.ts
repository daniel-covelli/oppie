import { type ComponentTypes } from "@prisma/client";

export enum ResponseType {
  CODE = "code",
  QUESTION = "question",
}

interface HeadingType {
  id: string;
  content: string;
  type: ComponentTypes;
}

export interface FolderType {
  id: string;
  heading: HeadingType;
  files: { id: string; heading: HeadingType }[];
  children: FolderType[];
}

export interface FolderResponseType extends FolderType {
  isOpen: boolean;
  children: FolderResponseType[];
}
