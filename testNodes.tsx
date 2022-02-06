import { nanoid } from "nanoid";
import { ExtendedNode } from "./definitions";
import { ISidebarNode } from "./src/sidebar/Sidebar";
import {
  BsChatFill,
  BsQuestionCircleFill,
  BsMenuButtonWide,
} from "solid-icons/bs";
import { AiFillCode } from "solid-icons/ai";
import { IoLogoReact } from "solid-icons/io";
import { ImAccessibility } from "solid-icons/im";
import { HiSolidLibrary } from "solid-icons/hi";

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
  content: "Type your message here",
  position: {
    x: 0,
    y: 0,
  },
  title: "Message",
  output: {
    id: "messageout",
    type: "null",
  },
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
  content: "Can you answer this?",
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

const ButtonsNode: ExtendedNode = {
  id: "ButtonsNode",
  type: BUTTONSNODETYPE,
  user: true,
  content: "pick the option!",
  position: {
    x: 0,
    y: 0,
  },
  title: "Buttons",
  output: {
    id: "buttonsout",
    type: "text",
  },
  properties: {
    multiple: false,
    min: 1,
    max: 1,
    direction: "row",
    label: "buttons",
    displayAs: "message",
  },
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

const RemoteNode: ExtendedNode = {
  id: "remoteNode",
  type: REMOTEFEDERATEDNODETYPE,
  user: true,
  content: "Remote hosted federated module",
  position: {
    x: 0,
    y: 0,
  },
  title: "Remote federated module node",
  output: {
    id: "cutomComponent",
    type: "object",
  },
  properties: {
    displayAs: "message",
    label: "test",
    module: "./RemoteNodeExample",
    scope: "DumbotFederatedModulesScope",
    remoteUrl:
      "https://dumbot-federatednode-dt44z.ondigitalocean.app/remoteEntry.js",
  },
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

const HumanTakeOverNode: ExtendedNode = {
  id: "humanTakeOver",
  type: CHATNODETYPE,
  user: true,
  content: "",
  position: {
    x: 0,
    y: 0,
  },
  title: "Human Take Over",
  output: {
    id: "chatOutput",
    type: "array",
  },
  properties: {
    label: "",
    displayAs: "footer",
    background: "transparent",
    hideInteractionLabel: true,
    chatInitMessage:
      "An agent is going to connect and answer all your questions. Please wait...",
  },
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
const UserSnippet: ExtendedNode = {
  id: "UserSnippet",
  type: SNIPPETNODETYPE,
  user: true,
  content: "Javascript Snippet",
  position: {
    x: 0,
    y: 0,
  },
  title: "User snippet",
  properties: {
    displayAs: "message",
    label: "snippet",
    code: 'async function _dumbot_user_snippet(SnippetContext){ /* -- readonly -- */ \n  const callApi = async (label) => {\n    //onCallHost will call a function passed as a property into the bot instance if defined. You can cal an api\n    // from the host and provide data out\n    const data = await SnippetContext.onCallHost(label, SnippetContext.variables);\n    return data;\n  }\n\n  // you can use await \n  const res = await callApi("testlabel");\n  // set variables on the Bot\n  SnippetContext.onSetVariable("aaa", res);\n  // read variables from the bot\n  console.log("Available variables",SnippetContext.variables);\n  console.log("Available ports",SnippetContext.ports);\n  // proceed with the flow on one of the available ports (if it returns invalid port it will fallback to default)\n  return SnippetContext.ports.exit1\n} /* -- readonly -- */',
  },
  output: {
    id: "myScript",
    type: "object",
  },
  silent: true,
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

const ReactSnippet: ExtendedNode = {
  id: "ReactSnippet",
  type: REACTNODETYPE,
  user: true,
  content: "My custom react node",
  position: {
    x: 0,
    y: 0,
  },
  title: "React Component",
  properties: {
    displayAs: "message",
    label: "react snippet",
    code: `function dumbot_react_customNode(React, ReactDOM, Grommet, Icons, _, UUID, StyledLibrary) {/* -- readonly -- */
const {useState,useEffect} = React;
const {Box, Button, Spinner} = Grommet;
const {nanoid} = UUID;

const ChildComponent = (props) => {
return(<Box  background="bars" pad="xlarge">
{props.loading?<Spinner size="medium" color="red" /> : <Box>I'm a child component</Box> }
</Box>);
}

return function CustomUserComponent(nodeProps) { /* -- readonly -- */
// lines in gray are readonly and you can't modify them.
// the library imported are the ones yu can use for your component
// this is just an example on what you can do
const [loading, setLoading] = useState(true);
const res = _.chunk(['a', 'b', 'c', 'd'], 2);
const uuid = nanoid();
useEffect(() => {
    if(loading) {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }

},[loading])
const onUserActioncall = () => {
  nodeProps.onUserAction({test:123, res, uuid },"default","object");
}
return(<Box  background="brand" pad="xlarge">
    {loading?<Spinner size="medium" /> : <Button  label="test remote prop" primary onClick={onUserActioncall} /> }
    <ChildComponent loading={loading}/>
</Box>);
}} /* -- readonly -- */
`,
  },
  output: {
    id: "customReactComponentOut",
    type: "object",
  },
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
    icon: () => <BsChatFill />,
    getNode: () => createNode(MessageNode),
  },
  {
    id: "QuestionNode",
    title: "Question",
    icon: () => <BsQuestionCircleFill />,
    getNode: () => createNode(QuestionNode),
  },
  {
    id: "ButtonsNode",
    title: "Buttons",
    icon: () => <BsMenuButtonWide />,
    getNode: () => createNode(ButtonsNode),
  },
  {
    id: "RemoteNode",
    title: "Federated Module",
    icon: () => <HiSolidLibrary />,
    getNode: () => createNode(RemoteNode),
  },
  {
    id: "UserSnippet",
    title: "Script",
    icon: () => <AiFillCode />,
    getNode: () => createNode(UserSnippet),
  },
  {
    id: "RreactSnippet",
    title: "React Node",
    icon: () => <IoLogoReact />,
    getNode: () => createNode(ReactSnippet),
  },
  {
    id: "HumanTakeOverNode",
    title: "Human Take Over",
    icon: () => <ImAccessibility />,
    getNode: () => createNode(HumanTakeOverNode),
  },
];
