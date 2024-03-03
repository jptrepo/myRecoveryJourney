export interface JournalEntry {
  id: number;
  entry_date: Date;
  title: string;
  description: string;
  memory_date: Date;
  auto_category: string;
  manual_category: string;
  user_id: string;
}
export interface Journal {
  entries: JournalEntry[];
}
export interface SpeakerSummary {
  id: number;
  entry_date: Date;
  title: string;
  description: string;
  autosummary: string;
}
export interface Amend {
  id: number;
  entry_date: Date;
  title: string;
  description: string;
  memory_date: Date;
  complete: Boolean;
  completed_date: Date;
  auto_category: string;
  manual_category: string;
}
export interface InventoryItem {
  id: number;
  entry_date: Date;
  title: string;
  description: string;
  type: "fear" | "harm/sex" | "resentment | regret";
  target_id: number;
  step: number;
}
export interface Entity {
  id: number;
  entry_date: Date;
  name: string;
  description: string;
  entity: "person" | "organization | thing";
}
