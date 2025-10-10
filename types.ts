export enum Page {
  DASHBOARD = 'Dashboard',
  REPOSITORIES = 'Repositories',
  REPOSITORY_SETTINGS = 'Repository Settings',
  PROFILE = 'Profile',
}

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  owner: string;
  private: boolean;
}

export interface PullRequestSummary {
  id: number;
  user_id: number;
  name: string;
  url: string;
  url_pull_request: string;
  comments: number;
  review_comments: number;
  commits: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  avatar_url: string;
}


// --- Enums from SQL Schema ---
export enum ActiveStatus {
    AUTO = 'AUTO',
    ENABLED = 'ENABLED',
    DISABLED = 'DISABLED',
}

export enum ScopeStatus {
    AUTO = 'AUTO',
    ENABLED = 'ENABLED',
    DISABLED = 'DISABLED',
}

export enum ProfileSettingType {
    CHILL = 'CHILL',
    STRICT = 'STRICT',
    BALANCED = 'BALANCED',
}

export enum ToolLanguageLevelSetting {
    DEFAULT = 'DEFAULT',
    STRICT = 'STRICT',
    LENIENT = 'LENIENT',
}

export enum PhpStanLevelSetting {
    LEVEL_0 = 'LEVEL_0',
    LEVEL_1 = 'LEVEL_1',
    LEVEL_2 = 'LEVEL_2',
    LEVEL_3 = 'LEVEL_3',
    LEVEL_4 = 'LEVEL_4',
    LEVEL_5 = 'LEVEL_5',
    LEVEL_6 = 'LEVEL_6',
    LEVEL_7 = 'LEVEL_7',
    LEVEL_8 = 'LEVEL_8',
    LEVEL_MAX = 'LEVEL_MAX',
}


// --- Interfaces for Settings Tables ---

export interface GeneralSettings {
    review_language: string;
    tone_instructions: string | null;
    early_access: boolean;
    enable_free_tier: boolean;
}

export interface AutoReviewSettings {
    automatic_review: boolean;
    automatic_incremental_review: boolean;
    ignore_title_keywords: string | null;
    labels: string | null;
    drafts: boolean;
    base_branches: string | null;
}

export interface ChatSettings {
    auto_reply: boolean;
    create_issue: boolean;
    jira: ActiveStatus;
    linear: ActiveStatus;
}

export interface CodeGenerationSettings {
    code_generation_language: string | null;
    path_instructions: string | null;
    unit_test_generation: string | null;
}

export interface FinishingTouchesSettings {
    docstrings: boolean;
    unit_tests: boolean;
}

export interface KnowledgeBaseSettings {
    out_put: boolean;
    web_search: boolean;
    learnings: ScopeStatus;
    issues: ScopeStatus;
    jira_project_keys: string | null;
    linear: ActiveStatus;
    linear_team_keys: string | null;
    pull_requests: ScopeStatus;
}

export interface ReviewSettings {
    path_instructions: string | null;
    profile: ProfileSettingType;
    requests_changers_workflow: boolean;
    high_level_summary: boolean;
    high_level_summary_placeholder: string | null;
    high_level_summary_in_walkthrough: boolean;
    auto_title_placeholder: string | null;
    auto_title_instructions: string | null;
    review_status: boolean;
    commit_status: boolean;
    fail_commit_status: boolean;
    collapse_walkthrough: boolean;
    changed_files_summary: boolean;
    sequence_diagrams: boolean;
    assess_linked_issues: boolean;
    related_issues: boolean;
    related_prs: boolean;
    suggested_labels: boolean;
    auto_apply_labels: boolean;
    suggested_reviewers: boolean;
    auto_assign_reviewers: boolean;
    poem: boolean;
    labeling_instructions: string | null;
    path_filters: string | null;
    abort_on_close: boolean;
}

export interface ToolsSettings {
    enable_github_checks: boolean;
    timeout_ms: number;
    enable_language_tool: boolean;
    enabled_rules: string;
    disabled_rules: string;
    enabled_categories: string;
    disabled_categories: string;
    enabled_only: boolean;
    language_level: ToolLanguageLevelSetting;
    rule_dirs: string;
    util_dirs: string;
    essential_rules: boolean;
    packages: string;
    enable_golangci_lint: boolean;
    config_file: string;
    enable_php_stan: boolean;
    php_stan_level: PhpStanLevelSetting;
    enable_swift_lint: boolean;
    config_file_swift_lint: string;
    enable_detekt: boolean;
    config_file_detekt: string;
    enable_semgrep: boolean;
    config_file_semgrep: string;
    enable_shell_check: boolean;
    enable_ruff: boolean;
    enable_markdownlint: boolean;
    enable_biome: boolean;
    enable_hadolint: boolean;
    enable_yaml_lint: boolean;
    enable_gitleaks: boolean;
    enable_checkov: boolean;
    enable_es_lint: boolean;
    enable_rubo_cop: boolean;
    enable_buf: boolean;
    enable_regal: boolean;
    enable_actionlint: boolean;
    enable_cpp_check: boolean;
    enable_circle_ci: boolean;
    enable_sql_fluff: boolean;
    enable_prisma_schema_linting: boolean;
    enable_oxc: boolean;
    enable_shopify_theme_check: boolean;
}

export interface AllRepositorySettings {
    general: GeneralSettings;
    autoReview: AutoReviewSettings;
    chat: ChatSettings;
    codeGeneration: CodeGenerationSettings;
    finishingTouches: FinishingTouchesSettings;
    knowledgeBase: KnowledgeBaseSettings;
    review: ReviewSettings;
    tools: ToolsSettings;
}

export interface PullRequestSummaryResponse {
    total_count: number;
    page: number;
    per_page: number;
    data: PullRequestSummary[];
}