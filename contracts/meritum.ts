/* Generated from meritum-core src/meritum_core/checks/contracts/ by scripts/generate-contracts.sh. Do not edit. */

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
/**
 * Uploaded screenshot or photo with text; read by OCR in an EU region, then checked like text. Excludes text, url and audio_id.
 */
export type ImageId = string | null;
/**
 * Discord, SMS and MCP only: user id, phone number or MCP client id. The API hashes it with a salt into channel_user_hash and never stores it.
 */
export type ChannelUserId = string | null;
/**
 * Web and extension only: random id kept in the browser session; the API copies it to CheckRecord.session_id.
 */
export type RequestSessionId = string | null;
export type AiGenerated = true;
export type MarkerProvider = string;
export type MarkerModel = string;
export type GeneratedAt = string;
export type Id = string;
export type Title = string;
export type Publisher = string;
/**
 * Publisher id from the catalogue; independence is counted on it.
 */
export type PublisherId = string;
export type Url1 = string;
export type Domain = string;
export type Kind = "akt_prawny" | "dane_publiczne" | "instytucja" | "fact_check" | "media" | "transcript";
export type Tier = "primary" | "secondary";
export type PublishedAt = string | null;
export type FetchedAt = string;
export type Language = string;
export type Via = "corpus" | "rss" | "web_search" | "mcp";
/**
 * Age threshold from the source's catalogue entry (since v14); absent means 365 days.
 */
export type MaxAgeHours = number | null;
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
export type ClaimDate = string;
export type ClaimDateSource = "text" | "input_published_at" | "today";
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
 * Distinct IFCN/EFCSN fact-checkers (publisher_id) whose ClaimReview rating agrees with the verdict; one is enough for at least moderate strength.
 */
export type SignatoryReviews = number;
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
export type MaxAgeHours1 = number;
export type Validity1 = "expires" | "in_force" | "updated_in_place" | "past_event" | "superseded";
export type Agreement = "consistent" | "conflicting";
export type Citations = Citation[];
export type Publisher1 = string;
export type PublisherId1 = string;
/**
 * IFCN or EFCSN membership from the publisher's catalogue entry; required for a premise.
 *
 * @minItems 1
 */
export type SignatoryOf = ["ifcn" | "efcsn", ...("ifcn" | "efcsn")[]];
/**
 * textualRating, verbatim.
 */
export type Rating = string;
export type Title1 = string;
export type ReviewedAt = string;
export type Url2 = string;
/**
 * When Google Fact Check Tools API returned it.
 */
export type FetchedAt1 = string;
export type Stance1 = "supports" | "refutes" | "context";
/**
 * IFCN or EFCSN fact-checkers' ratings that back the verdict without a page fragment (ADR-34).
 */
export type ClaimReviewPremises = ClaimReviewPremise[];
export type Explanation = string;
/**
 * What could not be established.
 */
export type Unresolved = string | null;
/**
 * What would change the verdict, computed by a rule from the premises; the channel words it from copy/pl.json.
 */
export type WouldChangeVerdict = (
  | "needs_primary_source"
  | "needs_second_publisher"
  | "needs_fresh_evidence"
  | "needs_resolving_source"
  | "needs_named_source"
)[];
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
/**
 * fact_check: the entry matched an already checked publication.
 */
export type Database = "organiser" | "euvsdisinfo" | "fact_check";
export type IncidentId = string;
export type MatchedOn = "content" | "domain";
/**
 * What agreed; shown with the match.
 *
 * @minItems 1
 */
export type MatchBasis = ["title" | "topic" | "date" | "domain", ...("title" | "topic" | "date" | "domain")[]];
export type Title2 = string;
export type Date = string;
export type Url3 = string;
export type Similarity = number;
export type Publisher2 = string;
/**
 * textualRating as published.
 */
export type Rating1 = string;
export type Url4 = string;
export type ReviewedAt1 = string | null;
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
/**
 * technical_failure only; never names a key or a provider.
 */
export type FailureCode =
  ("provider_unavailable" | "web_search_unavailable" | "transcription_failed" | "url_unavailable" | "not_ready") | null;
/**
 * out_of_scope only: what is not handled; the channel picks the text from copy/pl.json and falls back to the generic one when it is empty. A rejected recording is audio; why it was rejected is in limitation_codes.
 */
export type OutOfScopeCode = ("image" | "audio" | "not_informational") | null;
export type Limitations = string[];
/**
 * Codes of the limitations the channel words from copy/pl.json; they never set the status, though the audio codes explain an out_of_scope recording. Paired with limitations by index: one code per text, same order.
 */
export type LimitationCodes = (
  | "fact_check_unavailable"
  | "image_search_not_run"
  | "audio_format_unsupported"
  | "audio_too_long"
  | "image_format_unsupported"
  | "image_too_large"
  | "corpus_scope"
  | "no_publications"
)[];
/**
 * Audio input only: the automatic transcript, with personal data masked.
 */
export type Transcript = string | null;
/**
 * Image input only: the text read from the image, with personal data masked.
 */
export type ImageText = string | null;
/**
 * Id of the scheduled corpus snapshot.
 */
export type CorpusVersion = string;
export type AiDisclosure = true;
export type Status1 = "done" | "needs_clarification" | "out_of_scope";
export type Claims1 = ClaimResult[];
export type Message1 = string | null;
/**
 * out_of_scope only: what is not handled; the channel picks the text from copy/pl.json and falls back to the generic one when it is empty. A rejected recording is audio; why it was rejected is in limitation_codes.
 */
export type OutOfScopeCode1 = ("image" | "audio" | "not_informational") | null;
export type Limitations1 = string[];
/**
 * Codes of the limitations the channel words from copy/pl.json; they never set the status, though the audio codes explain an out_of_scope recording. Paired with limitations by index: one code per text, same order.
 */
export type LimitationCodes1 = (
  | "fact_check_unavailable"
  | "image_search_not_run"
  | "audio_format_unsupported"
  | "audio_too_long"
  | "image_format_unsupported"
  | "image_too_large"
  | "corpus_scope"
  | "no_publications"
)[];
/**
 * Audio input only: the automatic transcript, with personal data masked.
 */
export type Transcript1 = string | null;
/**
 * Image input only: the text read from the image, with personal data masked.
 */
export type ImageText1 = string | null;
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
/**
 * Streamed draft of the answer, personal data masked; a preview, never a verdict.
 */
export type Draft = string | null;
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
 * Embedding similarity to the admin list above a threshold, or the keyword list as a fallback (ADR-35).
 */
export type HighRiskClassifiedBy = ("embeddings" | "keywords") | null;
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
export type Publisher3 = string;
export type PublisherId2 = string;
export type Kind1 = "akt_prawny" | "dane_publiczne" | "instytucja" | "fact_check" | "media" | "transcript";
export type Tier1 = "primary" | "secondary";
/**
 * source_status: a list (sanctions, CERT warnings) that ingest skips; a check uses it only for a neutral source-status warning, never as evidence.
 */
export type Role = "evidence" | "source_status";
export type License = string;
/**
 * mcp: the local EUvsDisinfo copy; api: a public API (IMGW, GIOS, Sejm ELI, dane.gov.pl, statistics) ingested into the corpus; live: queried at check time (Fact Check API, short-lived measurements), never in the corpus snapshot.
 */
export type Ingest = "static" | "rss" | "sitemap" | "web_search" | "mcp" | "api" | "live";
export type RefreshMinutes = number | null;
/**
 * Age override for every document of this entry; past_event and superseded are set per evidence.
 */
export type Validity2 = "expires" | "in_force" | "updated_in_place" | "past_event" | "superseded";
/**
 * Shorter threshold for short-lived sources (warnings, roads, weather: hours or days).
 */
export type MaxAgeHours2 = number | null;
export type QualifiedBecause = string;
/**
 * Machine-readable text and data mining opt-out (robots.txt incl. Content-Signal, meta tags, tdmrep), checked per domain.
 */
export type TdmReservation = "none" | "reserved" | "unknown";
/**
 * IFCN or EFCSN membership; only such publishers' ClaimReview ratings may be premises (ADR-34).
 */
export type SignatoryOf1 = ("ifcn" | "efcsn")[];
export type Excluded = boolean;
export type ExclusionReason = string | null;
export type Disclaimer = string | null;
export type Id2 = string;
export type Kind2 =
  "check_progress" | "check_done" | "moderator_answer" | "new_evidence" | "case_assigned" | "system" | "eval_run_done";
export type Status4 = "unread" | "read";
export type SessionId1 = string | null;
export type UserId1 = string | null;
export type CheckId3 = string | null;
export type CaseId1 = string | null;
/**
 * check_progress only: the finished pipeline step; the text is analysis.steps.<code> in copy/pl.json.
 */
export type StepCode =
  | (
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
      | "save_record"
    )
  | null;
/**
 * system only: what the message says; the text is notifications.system_message.<code> in copy/pl.json, never free text.
 */
export type MessageCode = ("maintenance_planned" | "service_degraded" | "service_restored") | null;
/**
 * In-app path to open.
 */
export type Link = string;
export type CreatedAt = string;
export type RetentionUntil1 = string;
export type CaseId2 = string;
export type Scenario = string;
export type CheckId4 = string | null;
/**
 * This interface was referenced by `MeritumContracts`'s JSON-Schema
 * via the `definition` "EvalLabel".
 */
export type EvalLabel =
  | ("confirmed" | "false" | "misleading" | "insufficient_evidence" | "not_verifiable")
  | ("done" | "needs_clarification" | "out_of_scope" | "technical_failure");
export type Outcome = "wrong_decisive" | "non_verdict" | "wrong_abstention" | "correct";
export type ReceivedAt1 = string;
export type AnsweredAt1 = string;
export type Cases = number;
export type MacroF1 = number;
/**
 * This interface was referenced by `MeritumContracts`'s JSON-Schema
 * via the `definition` "Ratio".
 */
export type Ratio = number | null;
/**
 * This interface was referenced by `MeritumContracts`'s JSON-Schema
 * via the `definition` "NonNegative".
 */
export type NonNegative = number;
export type Scenario1 = string;
export type Cases1 = number;
export type Correct = number;
export type Accuracy = number;
export type Id3 = string;
export type CaseSet = "golden" | "user_file";
export type CaseFile = string | null;
export type Status5 = "queued" | "running" | "done" | "failed";
export type CorpusVersion3 = string;
export type UserId2 = string | null;
export type Models1 = string[];
export type StartedAt = string;
export type FinishedAt = string | null;
export type Scenarios = EvalScenarioScore[];
export type Cases2 = EvalCaseResult[];

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
  image_id?: ImageId;
  channel_user_id?: ChannelUserId;
  session_id?: RequestSessionId;
}
/**
 * Machine-readable marker that an AI system wrote the verdicts and justifications.
 *
 * Every channel gets the same marker from the result; how a channel shows it is up to
 * the channel.
 *
 * This interface was referenced by `MeritumContracts`'s JSON-Schema
 * via the `definition` "AiMarker".
 */
export interface AiMarker {
  ai_generated?: AiGenerated;
  provider: MarkerProvider;
  model: MarkerModel;
  generated_at: GeneratedAt;
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
  max_age_hours?: MaxAgeHours;
}
/**
 * One checked claim. Citations (source material) are kept apart from `explanation` (model interpretation).
 *
 * This interface was referenced by `MeritumContracts`'s JSON-Schema
 * via the `definition` "ClaimResult".
 */
export interface ClaimResult {
  claim: Claim;
  claim_date: ClaimDate;
  claim_date_source: ClaimDateSource;
  verdict: Verdict;
  strength?: EvidenceStrength | null;
  citations?: Citations;
  claim_review_premises?: ClaimReviewPremises;
  explanation: Explanation;
  unresolved?: Unresolved;
  would_change_verdict?: WouldChangeVerdict;
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
  signatory_reviews?: SignatoryReviews;
  newest_source_published_at?: NewestSourcePublishedAt;
  newest_source_age_hours?: NewestSourceAgeHours;
  max_age_hours?: MaxAgeHours1;
  validity?: Validity1;
  agreement: Agreement;
}
/**
 * A fact-checker's ClaimReview rating used as a premise of the verdict, next to the citations (ADR-34).
 *
 * Found through Google Fact Check Tools API. It has no page fragment: the rating, title,
 * date and link are the evidence. Only publishers the catalogue lists as IFCN or EFCSN
 * signatories qualify; the pipeline copies `signatory_of` from their catalogue entry.
 * Counted per publisher like a secondary-tier citation.
 *
 * This interface was referenced by `MeritumContracts`'s JSON-Schema
 * via the `definition` "ClaimReviewPremise".
 */
export interface ClaimReviewPremise {
  publisher: Publisher1;
  publisher_id: PublisherId1;
  signatory_of: SignatoryOf;
  rating: Rating;
  title: Title1;
  reviewed_at: ReviewedAt;
  url: Url2;
  fetched_at: FetchedAt1;
  stance: Stance1;
}
/**
 * Similarity to a known incident (organiser's database, the local EUvsDisinfo copy or a checked fact-check). Context only.
 *
 * Never a basis for the verdict by itself, and never changes it. An EUvsDisinfo `fact` text is cited as a Citation,
 * not carried here.
 *
 * `domain` is the one explicitly defined warning case: the checked URL is on a domain the incident database lists
 * (for EUvsDisinfo: linksToDisinformation), and the incident's topic matches the claim. A content match needs a
 * matching title, topic and date; the domain alone never makes one. `match_basis` lists what matched and is shown.
 *
 * This interface was referenced by `MeritumContracts`'s JSON-Schema
 * via the `definition` "IncidentMatch".
 */
export interface IncidentMatch {
  database?: Database;
  incident_id: IncidentId;
  matched_on?: MatchedOn;
  match_basis: MatchBasis;
  title: Title2;
  date: Date;
  url: Url3;
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
  publisher: Publisher2;
  rating: Rating1;
  url: Url4;
  reviewed_at?: ReviewedAt1;
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
  failure_code?: FailureCode;
  out_of_scope_code?: OutOfScopeCode;
  limitations?: Limitations;
  limitation_codes?: LimitationCodes;
  transcript?: Transcript;
  image_text?: ImageText;
  source_warning?: SourceStatusWarning | null;
  escalation?: Escalation | null;
  corpus_version: CorpusVersion;
  ai_disclosure?: AiDisclosure;
  /**
   * Machine-readable marker that an AI system wrote the answer (AI Act art. 50(2)); required on a finished check.
   */
  ai_marker?: AiMarker | null;
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
  out_of_scope_code?: OutOfScopeCode1;
  limitations?: Limitations1;
  limitation_codes?: LimitationCodes1;
  transcript?: Transcript1;
  image_text?: ImageText1;
  source_warning?: SourceStatusWarning | null;
  /**
   * Machine-readable marker that an AI system wrote the answer (AI Act art. 50(2)); required on a finished check.
   */
  ai_marker?: AiMarker | null;
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
  draft?: Draft;
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
  publisher: Publisher3;
  publisher_id: PublisherId2;
  kind: Kind1;
  kind_by_path?: KindByPath;
  tier: Tier1;
  role?: Role;
  license: License;
  ingest: Ingest;
  refresh_minutes?: RefreshMinutes;
  validity?: Validity2;
  max_age_hours?: MaxAgeHours2;
  qualified_because: QualifiedBecause;
  tdm_reservation?: TdmReservation;
  signatory_of?: SignatoryOf1;
  excluded?: Excluded;
  exclusion_reason?: ExclusionReason;
  disclaimer?: Disclaimer;
}
export interface KindByPath {
  [k: string]: "akt_prawny" | "dane_publiczne" | "instytucja" | "fact_check" | "media" | "transcript";
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
  step_code?: StepCode;
  message_code?: MessageCode;
  link: Link;
  created_at: CreatedAt;
  retention_until: RetentionUntil1;
}
/**
 * One case of a run: expected and predicted label, outcome, time and cost.
 *
 * A state that is not a verdict (technical_failure included) stays the predicted
 * label and falls into one separate error class.
 *
 * This interface was referenced by `MeritumContracts`'s JSON-Schema
 * via the `definition` "EvalCaseResult".
 */
export interface EvalCaseResult {
  case_id: CaseId2;
  scenario: Scenario;
  check_id?: CheckId4;
  expected: EvalLabel;
  predicted: EvalLabel;
  outcome: Outcome;
  received_at: ReceivedAt1;
  answered_at: AnsweredAt1;
  cost_usd?: number;
}
/**
 * The metrics of one run, as the meritum-eval report computes them.
 *
 * This interface was referenced by `MeritumContracts`'s JSON-Schema
 * via the `definition` "EvalMetrics".
 */
export interface EvalMetrics {
  cases: Cases;
  macro_f1: MacroF1;
  citation_coverage: Ratio;
  citation_correctness: Ratio;
  abstention: Ratio;
  robustness: Ratio;
  median_seconds: NonNegative;
  p95_seconds: NonNegative;
  max_seconds: NonNegative;
  input_tokens_per_check: NonNegative;
  output_tokens_per_check: NonNegative;
  cost_per_check_usd: NonNegative;
  cost_100_checks_usd: NonNegative;
  channel_consistency: Ratio;
  information_loop: Ratio;
}
/**
 * Quality per scenario, so runs on different models compare by scenario.
 *
 * This interface was referenced by `MeritumContracts`'s JSON-Schema
 * via the `definition` "EvalScenarioScore".
 */
export interface EvalScenarioScore {
  scenario: Scenario1;
  cases: Cases1;
  correct: Correct;
  accuracy: Accuracy;
}
/**
 * One evaluation run on the golden set or a staff user's case file.
 *
 * This interface was referenced by `MeritumContracts`'s JSON-Schema
 * via the `definition` "EvalRun".
 */
export interface EvalRun {
  id: Id3;
  case_set: CaseSet;
  case_file?: CaseFile;
  status: Status5;
  corpus_version: CorpusVersion3;
  user_id?: UserId2;
  models?: Models1;
  started_at: StartedAt;
  finished_at?: FinishedAt;
  metrics?: EvalMetrics | null;
  scenarios?: Scenarios;
  cases?: Cases2;
}
