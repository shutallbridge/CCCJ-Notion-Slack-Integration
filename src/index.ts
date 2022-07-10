import 'dotenv/config';
import { Flow } from './Flow';

import { NewMemberWelcome } from './steps/NewMemberWelcome';
import { MessageFilterReturnArgs, MessageFilter } from './steps/MessageFilter';
import {
  EnforcementMessage,
  EnforcementMessageArgs,
} from './steps/EnforcementMessage';

import {
  SelfIntroCommandTrigger,
  SelfIntroCommandTriggerReturnArgs,
} from './steps/SelfIntroCommandTrigger';
import {
  SelfIntroButtonTrigger,
  SelfIntroButtonTriggerReturnArgs,
} from './steps/SelfIntroButtonTrigger';

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

const enforcementMessageFlow = new Flow();
enforcementMessageFlow.addSteps([
  new MessageFilter<EnforcementMessageArgs>(
    (returnArgs: MessageFilterReturnArgs) => {
      const { client, user, aboutYourself } = returnArgs;
      return { client, user, aboutYourself };
    }
  ),
  new EnforcementMessage<null>(),
]);

const ephemeralMessageFlow = new Flow();
ephemeralMessageFlow.addSteps([new NewMemberWelcome<null>()]);

const messageTriggerFlow = new Flow();
messageTriggerFlow.addSteps([
  new SelfIntroButtonTrigger<SelfIntroModalArgs>(
    (returnArgs: SelfIntroButtonTriggerReturnArgs) => {
      const { client, trigger_id, messageText } = returnArgs;
      return { client, trigger_id, aboutYourself: messageText };
    }
  ),
  new SelfIntroModal<null>(),
]);

const commandTrigger = new Flow();
commandTrigger.addSteps([
  new SelfIntroCommandTrigger<SelfIntroModalArgs>(
    (returnArgs: SelfIntroCommandTriggerReturnArgs) => {
      const { client, trigger_id } = returnArgs;
      return { client, trigger_id };
    }
  ),
  new SelfIntroModal<null>(),
]);

const submitFlow = new Flow();
submitFlow.addSteps([
  new SubmitTrigger<PostMessageAsArgs>(
    (returnArgs: SubmitTriggerReturnArgs) => {
      const {
        client,
        trigger_id,
        username,
        name,
        aboutYourself,
        tags,
        linkedin,
      } = returnArgs;
      return {
        client,
        trigger_id,
        username,
        name,
        aboutYourself,
        tags,
        linkedin,
      };
    }
  ),
  new PostMessageAs<NewNotionEntryArgs>(
    (returnArgs: PostMessageAsReturnArgs) => {
      const {
        client,
        trigger_id,
        username,
        name,
        aboutYourself,
        tags,
        linkedin,
      } = returnArgs;
      return {
        client,
        trigger_id,
        username,
        name,
        aboutYourself,
        tags,
        linkedin,
      };
    }
  ),
  new NewNotionEntry<AllDoneModalArgs>(
    (returnArgs: NewNotionEntryReturnArgs) => {
      const { client, trigger_id } = returnArgs;
      return { client, trigger_id };
    }
  ),
  new AllDoneModal<null>(),
]);

// Flow initializations
enforcementMessageFlow.start();
ephemeralMessageFlow.start();
messageTriggerFlow.start();
commandTrigger.start();
submitFlow.start();
