"use client";

import AIAdminAssistantMockup from "./AIAdminAssistantMockup";
import B2BLeadSystemMockup from "./B2BLeadSystemMockup";
import GrowthAnalyticsMockup from "./GrowthAnalyticsMockup";
import SpotzMockup from "./SpotzMockup";
import WorkflowAutomationMockup from "./WorkflowAutomationMockup";
import type { MockupId, MockupProps } from "./types";

type StagePreviewProps = MockupProps & {
  mockup: MockupId;
};

export function StagePreview({ mockup, ...props }: StagePreviewProps) {
  if (mockup === "workflow") return <WorkflowAutomationMockup {...props} />;
  if (mockup === "admin") return <AIAdminAssistantMockup {...props} />;
  if (mockup === "growth") return <GrowthAnalyticsMockup {...props} />;
  if (mockup === "b2b") return <B2BLeadSystemMockup {...props} />;
  return <SpotzMockup {...props} />;
}

export function MockupSwitcher(props: StagePreviewProps) {
  return <StagePreview {...props} />;
}
