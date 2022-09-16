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

import { ThreadReply, ThreadReplyReturnArgs } from './steps/ThreadReply';
import {
  ReceivedReplyMessage,
  ReceivedReplyMessageArgs,
} from './steps/ReceivedReplyMessage';

import {
  FilterIncompleteUser,
  FilterIncompleteUserReturnArgs,
} from './steps/FilterIncompleteUser';
import {
  RequestSelfIntro,
  RequestSelfIntroArgs,
} from './steps/RequestSelfIntro';

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
        userId,
        username,
        name,
        aboutYourself,
        tags,
        linkedin,
      } = returnArgs;
      return {
        client,
        trigger_id,
        userId,
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
        userId,
        name,
        aboutYourself,
        tags,
        linkedin,
      } = returnArgs;
      return {
        client,
        trigger_id,
        userId,
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

const notifyReplyFlow = new Flow();
notifyReplyFlow.addSteps([
  new ThreadReply<ReceivedReplyMessageArgs>(
    (returnArgs: ThreadReplyReturnArgs) => {
      const { threadTs, threadAuthor, replyAuthor } = returnArgs;
      return { threadTs, threadAuthor, replyAuthor };
    }
  ),
  new ReceivedReplyMessage<null>(),
]);

const requestSelfIntroFlow = new Flow();
requestSelfIntroFlow.addSteps([
  new FilterIncompleteUser<RequestSelfIntroArgs>(
    (returnArgs: FilterIncompleteUserReturnArgs) => {
      const { channelId, userId, threadTs } = returnArgs;
      return { channelId, userId, threadTs };
    }
  ),
  new RequestSelfIntro<null>(),
]);

// Flow initializations
enforcementMessageFlow.start();
ephemeralMessageFlow.start();
messageTriggerFlow.start();
commandTrigger.start();
submitFlow.start();

// hotfix: stop reply notification bug
// notifyReplyFlow.start();
requestSelfIntroFlow.start();
