import 'dotenv/config';
import { Flow } from './Flow';

import { NewMemberWelcome } from './steps/NewMemberWelcome';
import {
  SelfIntroTrigger,
  SelfIntroTriggerReturnArgs,
} from './steps/SelfIntroTrigger';
import { SelfIntroModal, SelfIntroModalArgs } from './steps/SelfIntroModal';
import { SubmitTrigger, SubmitTriggerReturnArgs } from './steps/SubmitTrigger';
import {
  PostMessageAs,
  PostMessageAsArgs,
  PostMessageAsReturnArgs,
} from './steps/PostMessageAs';
import {
  NewNotionEntry,
  NewNotionEntryArgs,
  NewNotionEntryReturnArgs,
} from './steps/NewNotionEntry';
import { AllDoneModal, AllDoneModalArgs } from './steps/AllDoneModal';

const stepsArr = [
  new NewMemberWelcome<null>(),
  new SelfIntroTrigger<SelfIntroModalArgs>(
    (returnArgs: SelfIntroTriggerReturnArgs) => {
      const { client, trigger_id } = returnArgs;
      return { client, trigger_id };
    }
  ),
  new SelfIntroModal<null>(),
  new SubmitTrigger<PostMessageAsArgs>(
    (returnArgs: SubmitTriggerReturnArgs) => {
      const { client, trigger_id, username, name, aboutYourself, tags } =
        returnArgs;
      return { client, trigger_id, username, name, aboutYourself, tags };
    }
  ),
  new PostMessageAs<NewNotionEntryArgs>(
    (returnArgs: PostMessageAsReturnArgs) => {
      const { client, trigger_id, username, name, aboutYourself, tags } =
        returnArgs;
      return { client, trigger_id, username, name, aboutYourself, tags };
    }
  ),
  new NewNotionEntry<AllDoneModalArgs>(
    (returnArgs: NewNotionEntryReturnArgs) => {
      const { client, trigger_id } = returnArgs;
      return { client, trigger_id };
    }
  ),
  new AllDoneModal<null>(),
];

const flow = new Flow();
flow.addSteps(stepsArr);
flow.start();
