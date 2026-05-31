"use client";

import dynamic from "next/dynamic";
import { useConversation } from "@/components/Signal/ConversationEngine";
import ChatPanel from "@/components/Signal/ChatPanel";

const BustScene = dynamic(() => import("@/components/Signal/BustScene"), { ssr: false });

export default function ChatEngine() {
  const conversation = useConversation();

  return (
    <>
      <div className="signal-scene-area">
        <BustScene
          amplitudeRef={conversation.amplitudeRef}
          bustState={conversation.bustState}
          onAssembled={conversation.handleAssembled}
          topic={conversation.topic}
        />
      </div>

      <ChatPanel
        audioEnabled={conversation.audioEnabled}
        isLoading={conversation.isLoading}
        messages={conversation.messages}
        onSend={conversation.sendMessage}
        onToggleAudio={conversation.toggleAudio}
        suggestions={conversation.suggestions}
      />
    </>
  );
}
