import { RewardRequestStatus } from "./enums/reward-request-status.enum";

export interface HistoryFilter {
  userCode?:  string;
  eventCode?: string;
  status?:    RewardRequestStatus;
}