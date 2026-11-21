/* Generated from meritum-core src/meritum_core/checks/contracts.py by scripts/generate-contracts.sh. Do not edit. */

export type Channel = "web" | "extension" | "discord" | "sms" | "mcp";
export type Text = string | null;
export type Url = string | null;
/**
 * Extension only: the post the text came from.
 */
export type PageUrl = string | null;
/**
 * Uploaded audio file or Discord voice message; transcribed in an EU region, then checked like text.
 */
export type AudioId = string | null;
export type Id = string;
export type Title = string;
export type Publisher = string;
/**
 * Publisher id from the catalogue; independence is counted on it.
 */
export type PublisherId = string;
export type Url1 = string;
export type Domain = string;
export type Kind = "akt_prawny" | "dane_publiczne" | "instytucja" | "fact_check" | "media";
export type Tier = "primary" | "secondary";
export type PublishedAt = string | null;
export type FetchedAt = string;
export type Language = string;
export type Via = "corpus" | "rss" | "web_search" | "mcp";
export type Fragment = string;
export type Stance = "supports" | "refutes" | "context";
/**
 * Age rule for this piece of evidence: the catalogue entry's validity, or past_event / superseded set per evidence.
 */
export type Validity = "expires" | "in_force" | "updated_in_place" | "past_event" | "superseded";
export type FragmentFoundVerbatim = true;
export type Claim = string;
/**
 * The date the claim refers to; evidence age is measured against it.
 */
export type ClaimDate = string | null;
export type ClaimDateSource = ("text" | "input_published_at" | "today") | null;
export type Verdict = "confirmed" | "false" | "misleading" | "insufficient_evidence" | "not_verifiable";
export type Level = "strong" | "moderate" | "weak";
/**
 * Distinct publishers (publisher_id) among the citations whose stance agrees with the verdict.
 */
export type IndependentSources = number;
/**
 * Distinct primary-tier publishers among the agreeing citations.
 */
export type PrimarySources = number;
/**
 * Publication date of the newest agreeing source, shown as a date.
 */
export type NewestSourcePublishedAt = string | null;
/**
 * Hours from the newest agreeing source to the claim date (ClaimResult.claim_date), not to now; 0 when the source is newer.
 */
export type NewestSourceAgeHours = number | null;
/**
 * Threshold from the catalogue entry of the newest source.
 */
export type MaxAgeHours = number;
export type Validity1 = "expires" | "in_force" | "updated_in_place" | "past_event" | "superseded";
export type Agreement = "consistent" | "conflicting";
export type Citations = Citation[];
export type Explanation = string;
/**
 * What could not be established.
 */
export type Unresolved = string | null;
/**
 * Newest evidence is older than the claim's context needs.
 */
export type Archival = boolean;
export type Technique =
  | (
      | "false_authority"
      | "conspiracy_theory"
      | "out_of_context"
      | "outdated"
      | "fabricated_quote"
      | "manipulated_media"
      | "impersonation"
      | "cherry_picking"
    )
  | null;
export type Database = "organiser" | "euvsdisinfo";
export type IncidentId = string;
export type MatchedOn = "content" | "domain";
export type Title1 = string;
export type Date = string;
export type Url2 = string;
export type Similarity = number;
export type Publisher1 = string;
/**
 * textualRating as published.
 */
export type Rating = string;
export type Url3 = string;
export type ReviewedAt = string | null;
export type ClaimReviews = ClaimReviewContext[];
export type State = "recommended" | "created" | "updated";
export type CaseId = string | null;
export type Code = "eu_sanctioned_entity";
export type Entity = string;
export type BasisUrl = string;
export type CheckId = string;
export type Status = "done" | "needs_clarification" | "out_of_scope" | "technical_failure";
export type Claims = ClaimResult[];
/**
 * For non-verdict statuses: what to do next.
 */
export type Message = string | null;
export type Limitations = string[];
/**
 * Id of the scheduled corpus snapshot.
 */
export type CorpusVersion = string;
export type AiDisclosure = true;
export type Status1 = "done" | "needs_clarification" | "out_of_scope";
export type Claims1 = ClaimResult[];
export type Message1 = string | null;
export type Limitations1 = string[];
export type CorpusVersion1 = string;
/**
 * Ids of the sources cited in the claims.
 */
export type SourceIds = string[];
export type CachedAt = string;
export type ExpiresAt = string;
export type Code1 =
  | "receive"
  | "fetch_url"
  | "transcribe_audio"
  | "screen_injection"
  | "extract_claims"
  | "search_corpus"
  | "search_web"
  | "search_fact_checks"
  | "assess_evidence"
  | "verify_citations"
  | "write_answer"
  | "save_record";
export type Status2 = "pending" | "active" | "done" | "skipped" | "failed";
export type CheckId1 = string;
/**
 * @minItems 1
 */
export type Steps = [AnalysisStep, ...AnalysisStep[]];
export type Location = "input" | "source";
export type Action = "instruction_removed" | "source_dropped";
export type SourceUrl = string | null;
export type Excerpt = string;
export type Provider = string;
export type Model = string;
/**
 * Where the data was processed.
 */
export type Region = string;
export type InputTokens = number;
export type OutputTokens = number;
export type CostUsd = number;
export type CheckId2 = string;
/**
 * Web and extension: random id kept in the browser session. Discord, SMS, MCP: the salted hash of the channel user id (equal to channel_user_hash).
 */
export type SessionId = string;
/**
 * Signed-in users only (Google or Microsoft account); None for anonymous checks.
 */
export type UserId = string | null;
export type Channel1 = "web" | "extension" | "discord" | "sms" | "mcp";
/**
 * Discord, SMS and MCP only: salted SHA-256 of the user id, phone number or MCP client id, used to reply and count repeats; never shown to moderators.
 */
export type ChannelUserHash = string | null;
export type ReceivedAt = string;
export type AnsweredAt = string;
/**
 * Input with obvious personal data masked.
 */
export type QuestionMasked = string;
export type Status3 = "done" | "needs_clarification" | "out_of_scope" | "technical_failure";
export type Verdicts = ("confirmed" | "false" | "misleading" | "insufficient_evidence" | "not_verifiable")[];
export type SourceIds1 = string[];
export type CorpusVersion2 = string;
export type Models = ModelUsage[];
export type WebSearchCalls = number;
export type RetrievalErrors = string[];
export type InjectionEvents = InjectionEvent[];
/**
 * Substantive part served from the result cache; escalation was still computed.
 */
export type CacheHit = boolean;
export type RetentionUntil = string;
export type Claim1 = string;
/**
 * @minItems 1
 */
export type CheckIds = [string, ...string[]];
export type Id1 = string;
export type State1 = "open" | "answered" | "closed";
/**
 * @minItems 1
 */
export type Reasons = [
  "insufficient_evidence" | "high_risk" | "repeated_unanswered" | "user_dispute",
  ...("insufficient_evidence" | "high_risk" | "repeated_unanswered" | "user_dispute")[]
];
/**
 * Topic from the admin's high-risk list that matched.
 */
export type HighRiskTopic = string | null;
/**
 * Model classification against the admin list, or the keyword list as a fallback.
 */
export type HighRiskClassifiedBy = ("model" | "keywords") | null;
export type Summary = string;
/**
 * @minItems 1
 */
export type Claims2 = [CaseClaim, ...CaseClaim[]];
/**
 * Distinct sessions or users who asked; raises the case's priority only, never decides whether it exists.
 */
export type DistinctAskers = number;
export type FirstSeen = string;
export type LastSeen = string;
export type AssigneeRole = "moderator" | "analyst";
export type Domain1 = string;
export type Publisher2 = string;
export type PublisherId1 = string;
export type Kind1 = "akt_prawny" | "dane_publiczne" | "instytucja" | "fact_check" | "media";
export type Tier1 = "primary" | "secondary";
export type License = string;
/**
 * mcp: the local EUvsDisinfo copy; api: Google Fact Check Tools, used only to discover URLs and show the rating as context.
 */
export type Ingest = "static" | "rss" | "sitemap" | "web_search" | "mcp" | "api";
export type RefreshHours = number | null;
/**
 * Age override for every document of this entry; past_event and superseded are set per evidence.
 */
export type Validity2 = "expires" | "in_force" | "updated_in_place" | "past_event" | "superseded";
/**
 * Shorter threshold for short-lived sources (warnings, roads, weather: hours or days).
 */
export type MaxAgeHours1 = number | null;
export type QualifiedBecause = string;
/**
 * Machine-readable text and data mining opt-out (robots.txt incl. Content-Signal, meta tags, tdmrep), checked per domain.
 */
export type TdmReservation = "none" | "reserved" | "unknown";
export type Excluded = boolean;
export type ExclusionReason = string | null;
export type Id2 = string;
export type Kind2 = "check_progress" | "check_done" | "moderator_answer" | "new_evidence" | "case_assigned" | "system";
export type Status4 = "unread" | "read";
export type SessionId1 = string | null;
export type UserId1 = string | null;
export type CheckId3 = string | null;
export type CaseId1 = string | null;
/**
 * In-app path to open.
 */
export type Link = string;
export type CreatedAt = string;
export type RetentionUntil1 = string;

export interface MeritumContracts {
  [k: string]: unknown;
}
/**
 * What a channel adapter sends to the verification core. The core is channel-agnostic.
 *
 * This interface was referenced by `MeritumContracts`'s JSON-Schema
 * via the `definition` "CheckRequest".
 */
export interface CheckRequest {
  channel: Channel;
  text?: Text;
  url?: Url;
  page_url?: PageUrl;
  audio_id?: AudioId;
}
/**
 * A fragment of a source and how it bears on the claim. The pipeline drops fragments it cannot find verbatim.
 *
 * This interface was referenced by `MeritumContracts`'s JSON-Schema
 * via the `definition` "Citation".
 */
export interface Citation {
  source: Source;
  fragment: Fragment;
  stance: Stance;
  validity?: Validity;
  fragment_found_verbatim?: FragmentFoundVerbatim;
}
/**
 * A document from the audited corpus. Title, publisher, date and link are mandatory to show (MSZ section 2).
 *
 * This interface was referenced by `MeritumContracts`'s JSON-Schema
 * via the `definition` "Source".
 */
export interface Source {
  id: Id;
  title: Title;
  publisher: Publisher;
  publisher_id: PublisherId;
  url: Url1;
  domain: Domain;
  kind: Kind;
  tier: Tier;
  published_at?: PublishedAt;
  fetched_at: FetchedAt;
  language?: Language;
  via?: Via;
}
/**
 * One checked claim. Citations (source material) are kept apart from `explanation` (model interpretation).
 *
 * This interface was referenced by `MeritumContracts`'s JSON-Schema
 * via the `definition` "ClaimResult".
 */
export interface ClaimResult {
  claim: Claim;
  claim_date?: ClaimDate;
  claim_date_source?: ClaimDateSource;
  verdict: Verdict;
  strength?: EvidenceStrength | null;
  citations?: Citations;
  explanation: Explanation;
  unresolved?: Unresolved;
  archival?: Archival;
  technique?: Technique;
  incident?: IncidentMatch | null;
  claim_reviews?: ClaimReviews;
}
/**
 * Strength level together with the premises it follows from.
 *
 * This interface was referenced by `MeritumContracts`'s JSON-Schema
 * via the `definition` "EvidenceStrength".
 */
export interface EvidenceStrength {
  level: Level;
  premises: Premises;
}
/**
 * Explicit premises behind a verdict (MSZ: strength must follow from quality, recency, agreement, independence).
 *
 * This interface was referenced by `MeritumContracts`'s JSON-Schema
 * via the `definition` "Premises".
 */
export interface Premises {
  independent_sources: IndependentSources;
  primary_sources: PrimarySources;
  newest_source_published_at?: NewestSourcePublishedAt;
  newest_source_age_hours?: NewestSourceAgeHours;
  max_age_hours?: MaxAgeHours;
  validity?: Validity1;
  agreement: Agreement;
}
/**
 * Similarity to a known incident (organiser's database or the local EUvsDisinfo copy). Context only.
 *
 * Never a basis for the verdict by itself, and never changes it. An EUvsDisinfo `fact` text is cited as a Citation,
 * not carried here.
 *
 * `domain` is the one explicitly defined warning case: the checked URL is on a domain the incident database lists
 * (for EUvsDisinfo: linksToDisinformation), and the incident's topic matches the claim.
 *
 * This interface was referenced by `MeritumContracts`'s JSON-Schema
 * via the `definition` "IncidentMatch".
 */
export interface IncidentMatch {
  database?: Database;
  incident_id: IncidentId;
  matched_on?: MatchedOn;
  title: Title1;
  date: Date;
  url: Url2;
  similarity: Similarity;
}
/**
 * A fact-checker's ClaimReview rating found through Google Fact Check Tools API, shown as context with a link.
 *
 * Never a citation, never counted towards strength, kept no longer than the API's cache headers allow.
 *
 * This interface was referenced by `MeritumContracts`'s JSON-Schema
 * via the `definition` "ClaimReviewContext".
 */
export interface ClaimReviewContext {
  publisher: Publisher1;
  rating: Rating;
  url: Url3;
  reviewed_at?: ReviewedAt;
}
/**
 * Hand-off to the moderator queue. 'recommended' means nobody was notified yet.
 *
 * Computed on every request, cache hits included: the result cache never stores it.
 *
 * This interface was referenced by `MeritumContracts`'s JSON-Schema
 * via the `definition` "Escalation".
 */
export interface Escalation {
  state: State;
  case_id?: CaseId;
}
/**
 * Neutral note that the checked content comes from an entity on the official EU sanctions list. Never a verdict.
 *
 * This interface was referenced by `MeritumContracts`'s JSON-Schema
 * via the `definition` "SourceStatusWarning".
 */
export interface SourceStatusWarning {
  code: Code;
  entity: Entity;
  basis_url: BasisUrl;
}
/**
 * The answer every channel renders. The same normalised input within the result cache's lifetime gets the same substantive result on every channel.
 *
 * out_of_scope: an unsupported input type or a request that is not about information. needs_clarification: no claim
 * could be extracted. Any factual claim gets a verdict, "insufficient_evidence" included.
 *
 * This interface was referenced by `MeritumContracts`'s JSON-Schema
 * via the `definition` "CheckResult".
 */
export interface CheckResult {
  check_id: CheckId;
  status: Status;
  claims?: Claims;
  message?: Message;
  limitations?: Limitations;
  source_warning?: SourceStatusWarning | null;
  escalation?: Escalation | null;
  corpus_version: CorpusVersion;
  ai_disclosure?: AiDisclosure;
}
/**
 * What the result cache keeps: only the substantive part of a CheckResult.
 *
 * The key is the normalised input. The entry lives a fixed time, whatever snapshots appear meanwhile.
 * Escalation and the repeat counter are not here: they are computed on every request.
 * A technical failure is never cached.
 *
 * This interface was referenced by `MeritumContracts`'s JSON-Schema
 * via the `definition` "CachedResult".
 */
export interface CachedResult {
  status: Status1;
  claims?: Claims1;
  message?: Message1;
  limitations?: Limitations1;
  source_warning?: SourceStatusWarning | null;
  corpus_version: CorpusVersion1;
  source_ids?: SourceIds;
  cached_at: CachedAt;
  expires_at: ExpiresAt;
}
/**
 * One step of the processing strip shown between „Sprawdź” and the result.
 *
 * This interface was referenced by `MeritumContracts`'s JSON-Schema
 * via the `definition` "AnalysisStep".
 */
export interface AnalysisStep {
  code: Code1;
  status: Status2;
}
/**
 * Polled (or streamed) by every channel while a check runs; mirrors the DBOS workflow.
 *
 * This interface was referenced by `MeritumContracts`'s JSON-Schema
 * via the `definition` "AnalysisStatus".
 */
export interface AnalysisStatus {
  check_id: CheckId1;
  steps: Steps;
  result?: CheckResult | null;
}
/**
 * Instructions found in the input or a source. Logged and never executed.
 *
 * In user content the instruction is cut out and the rest is analysed as data; a catalogue source
 * with an instruction drops out of the evidence.
 *
 * This interface was referenced by `MeritumContracts`'s JSON-Schema
 * via the `definition` "InjectionEvent".
 */
export interface InjectionEvent {
  location: Location;
  action: Action;
  source_url?: SourceUrl;
  excerpt: Excerpt;
}
/**
 * One model call: provider, model, region of processing, tokens and cost.
 *
 * This interface was referenced by `MeritumContracts`'s JSON-Schema
 * via the `definition` "ModelUsage".
 */
export interface ModelUsage {
  provider: Provider;
  model: Model;
  region: Region;
  input_tokens: InputTokens;
  output_tokens: OutputTokens;
  cost_usd: CostUsd;
}
/**
 * Audit log of one check (MSZ MVP: question, time, sources, result; plus observability).
 *
 * This interface was referenced by `MeritumContracts`'s JSON-Schema
 * via the `definition` "CheckRecord".
 */
export interface CheckRecord {
  check_id: CheckId2;
  session_id: SessionId;
  user_id?: UserId;
  channel: Channel1;
  channel_user_hash?: ChannelUserHash;
  received_at: ReceivedAt;
  answered_at: AnsweredAt;
  question_masked: QuestionMasked;
  status: Status3;
  verdicts: Verdicts;
  source_ids: SourceIds1;
  corpus_version: CorpusVersion2;
  models: Models;
  web_search_calls?: WebSearchCalls;
  retrieval_errors?: RetrievalErrors;
  injection_events?: InjectionEvents;
  escalation?: Escalation | null;
  cache_hit?: CacheHit;
  retention_until: RetentionUntil;
}
/**
 * One claim in a case and the checks that asked it: unanswered ("insufficient_evidence"), or disputed by a user.
 *
 * This interface was referenced by `MeritumContracts`'s JSON-Schema
 * via the `definition` "CaseClaim".
 */
export interface CaseClaim {
  claim: Claim1;
  check_ids: CheckIds;
}
/**
 * One case per group of similar unanswered claims. Similarity is measured per claim; a repeated claim joins the case.
 *
 * This interface was referenced by `MeritumContracts`'s JSON-Schema
 * via the `definition` "ModeratorCase".
 */
export interface ModeratorCase {
  id: Id1;
  state: State1;
  reasons: Reasons;
  high_risk_topic?: HighRiskTopic;
  high_risk_classified_by?: HighRiskClassifiedBy;
  summary: Summary;
  claims: Claims2;
  distinct_askers?: DistinctAskers;
  first_seen: FirstSeen;
  last_seen: LastSeen;
  assignee_role?: AssigneeRole;
}
/**
 * One domain in the open source catalogue: why it qualifies, how it is refreshed, whether it is excluded.
 *
 * This interface was referenced by `MeritumContracts`'s JSON-Schema
 * via the `definition` "CatalogEntry".
 */
export interface CatalogEntry {
  domain: Domain1;
  publisher: Publisher2;
  publisher_id: PublisherId1;
  kind: Kind1;
  tier: Tier1;
  license: License;
  ingest: Ingest;
  refresh_hours?: RefreshHours;
  validity?: Validity2;
  max_age_hours?: MaxAgeHours1;
  qualified_because: QualifiedBecause;
  tdm_reservation?: TdmReservation;
  excluded?: Excluded;
  exclusion_reason?: ExclusionReason;
}
/**
 * An inbox entry, pushed live over SSE or WebSocket from DBOS events and shown as a toast.
 *
 * A toast the recipient did not act on stays in the inbox as unread. Addressed to one browser session or one
 * signed-in user (staff included). Text comes from copy/pl.json by `kind`.
 *
 * This interface was referenced by `MeritumContracts`'s JSON-Schema
 * via the `definition` "Notification".
 */
export interface Notification {
  id: Id2;
  kind: Kind2;
  status?: Status4;
  session_id?: SessionId1;
  user_id?: UserId1;
  check_id?: CheckId3;
  case_id?: CaseId1;
  link: Link;
  created_at: CreatedAt;
  retention_until: RetentionUntil1;
}
