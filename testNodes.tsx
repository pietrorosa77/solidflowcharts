import { nanoid } from "nanoid";
import { ExtendedNode } from "./definitions";
import { ISidebarNode } from "./src/sidebar/Sidebar";

export const QUESTIONNODETYPE = "question";
export const BUTTONSNODETYPE = "buttons";
export const REMOTEFEDERATEDNODETYPE = "remoteFederatedNode";
export const SNIPPETNODETYPE = "dumbotSnippet";
export const CHATNODETYPE = "humanTakeOver";
export const REACTNODETYPE = "dumbotReactSnippet";

const MessageNode: ExtendedNode = {
  id: "MessageNode",
  type: "message",
  user: false,
  content: `this is your <strong>html</strong>formatted message***this is another content block`,
  position: {
    x: 0,
    y: 0,
  },
  title: "Message",
  output: {
    id: "messageout",
    type: "null",
  },
  preventEdit: ["ports", "output"],
  ports: {
    default: {
      bgColor: "brand",
      id: "default",
      text: "default",
      index: 0,
      properties: {},
    },
  },
};

const QuestionNode: ExtendedNode = {
  id: "QuestionNode",
  type: QUESTIONNODETYPE,
  user: true,
  content: `can you answer this question?***Please give it a go`,
  position: {
    x: 0,
    y: 0,
  },
  title: "Question",
  output: {
    id: "questout",
    type: "text",
  },
  properties: {
    controlType: "input",
    type: "text",
    label: "text",
    pattern: "",
    validationErrorMessage: "",
    size: "medium",
    width: "medium",
    maxLength: 100,
    minLength: 2,
    placeholder: "",
    suggestions: [],
    textAlign: "start",
    displayAs: "message",
  },
  preventEdit: ["ports"],
  ports: {
    default: {
      bgColor: "brand",
      id: "default",
      text: "default",
      index: 0,
      properties: {},
    },
  },
};

const createNode = (data: ExtendedNode): ExtendedNode => {
  return {
    ...data,
    id: nanoid(10),
    output: {
      type: data.output.type,
      id: `${data.type}_${nanoid(10)}`,
    },
  };
};

export const availableNodes: ISidebarNode[] = [
  {
    id: "MessageNode",
    title: "Message",
    icon: "fas fa-comment",
    getNode: () => createNode(MessageNode),
  },
  {
    id: "QuestionNode",
    title: "Question",
    icon: "fas fa-question-circle",
    getNode: () => createNode(QuestionNode),
  },
];
