import 'dotenv/config';

import { Flow } from './Flow';

import {
  NewMemberWelcome,
  SelfIntroTrigger,
  SelfIntroModal,
  SubmitTrigger,
  AllDoneModal,
  PostMessageAs,
  NewNotionEntry,
} from './steps';

const newMemberWelcome = new NewMemberWelcome();
const selfIntroTrigger = new SelfIntroTrigger();
const selfIntroModal = new SelfIntroModal();
const submitTrigger = new SubmitTrigger();
const postMessageAs = new PostMessageAs();
const newNotionEntry = new NewNotionEntry();
const allDoneModal = new AllDoneModal();

const flow = new Flow();

flow.addSteps([
  newMemberWelcome,
  selfIntroTrigger,
  selfIntroModal,
  submitTrigger,
  postMessageAs,
  newNotionEntry,
  allDoneModal,
]);
flow.start();
