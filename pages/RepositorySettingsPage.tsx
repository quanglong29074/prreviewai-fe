import React, { useState } from 'react';
import { Repository, AllRepositorySettings, ActiveStatus, ScopeStatus, ProfileSettingType, ToolLanguageLevelSetting, PhpStanLevelSetting } from '../types';

// Mock data for a single repository's settings. In a real app, this would be fetched.
const initialSettings: AllRepositorySettings = {
    general: {
        review_language: 'en',
        tone_instructions: 'Be friendly and encouraging.',
        early_access: false,
        enable_free_tier: true,
    },
    autoReview: {
        automatic_review: true,
        automatic_incremental_review: false,
        ignore_title_keywords: 'WIP, DRAFT',
        labels: 'needs-review',
        drafts: false,
        base_branches: 'main,develop',
    },
    chat: {
        auto_reply: true,
        create_issue: true,
        jira: ActiveStatus.AUTO,
        linear: ActiveStatus.DISABLED,
    },
    codeGeneration: {
        code_generation_language: 'TypeScript',
        path_instructions: 'Place all new components in src/components.',
        unit_test_generation: 'Jest',
    },
    finishingTouches: {
        docstrings: true,
        unit_tests: true,
    },
    knowledgeBase: {
        out_put: false,
        web_search: true,
        learnings: ScopeStatus.AUTO,
        issues: ScopeStatus.ENABLED,
        jira_project_keys: 'PROJ,CORE',
        linear: ActiveStatus.AUTO,
        linear_team_keys: 'ENG,DESIGN',
        pull_requests: ScopeStatus.AUTO,
    },
    review: {
        path_instructions: 'Ignore all changes in the /dist folder.',
        profile: ProfileSettingType.BALANCED,
        requests_changers_workflow: false,
        high_level_summary: true,
        high_level_summary_placeholder: null,
        high_level_summary_in_walkthrough: false,
        auto_title_placeholder: null,
        auto_title_instructions: null,
        review_status: true,
        commit_status: true,
        fail_commit_status: false,
        collapse_walkthrough: false,
        changed_files_summary: true,
        sequence_diagrams: true,
        assess_linked_issues: true,
        related_issues: true,
        related_prs: true,
        suggested_labels: true,
        auto_apply_labels: false,
        suggested_reviewers: true,
        auto_assign_reviewers: false,
        poem: false,
        labeling_instructions: null,
        path_filters: '*.md,*.json',
        abort_on_close: false,
    },
    tools: {
        enable_github_checks: true,
        timeout_ms: 600000,
        enable_language_tool: false,
        enabled_rules: '',
        disabled_rules: '',
        enabled_categories: '',
        disabled_categories: '',
        enabled_only: false,
        language_level: ToolLanguageLevelSetting.DEFAULT,
        rule_dirs: '',
        util_dirs: '',
        essential_rules: false,
        packages: '',
        enable_golangci_lint: false,
        config_file: '',
        enable_php_stan: false,
        php_stan_level: PhpStanLevelSetting.LEVEL_5,
        enable_swift_lint: false,
        config_file_swift_lint: '',
        enable_detekt: false,
        config_file_detekt: '',
        enable_semgrep: false,
        config_file_semgrep: '',
        enable_shell_check: false,
        enable_ruff: true,
        enable_markdownlint: true,
        enable_biome: false,
        enable_hadolint: false,
        enable_yaml_lint: true,
        enable_gitleaks: false,
        enable_checkov: false,
        enable_es_lint: true,
        enable_rubo_cop: false,
        enable_buf: false,
        enable_regal: false,
        enable_actionlint: false,
        enable_cpp_check: false,
        enable_circle_ci: false,
        enable_sql_fluff: false,
        enable_prisma_schema_linting: false,
        enable_oxc: false,
        enable_shopify_theme_check: false,
    }
};

interface RepositorySettingsPageProps {
    repository: Repository;
    onBack: () => void;
}

type Tab = 'General' | 'Auto Review' | 'Review' | 'Chat' | 'Code Generation' | 'Finishing Touches' | 'Knowledge Base' | 'Tools';

const SettingsSection: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
    <div className="bg-slate-800/50 rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
        <p className="text-sm text-slate-400 mb-6">{description}</p>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const SubSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="pt-4 border-t border-slate-700/50 first:border-t-0 first:pt-0">
        <h4 className="text-lg font-semibold text-sky-300 mb-4">{title}</h4>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);


const Toggle: React.FC<{ label: string; checked: boolean; onChange: (checked: boolean) => void; description?: string }> = ({ label, checked, onChange, description }) => (
    <div className="flex items-center justify-between">
        <div>
            <label className="font-medium text-white">{label}</label>
            {description && <p className="text-xs text-slate-400">{description}</p>}
        </div>
        <button
            type="button"
            className={`${checked ? 'bg-sky-600' : 'bg-slate-600'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500`}
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
        >
            <span className={`${checked ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
        </button>
    </div>
);

const TextInput: React.FC<{ label: string; value: string | null | number; onChange: (value: string) => void; placeholder?: string, description?: string, type?: string }> = ({ label, value, onChange, placeholder, description, type = 'text' }) => (
    <div>
        <label className="block text-sm font-medium text-white mb-1">{label}</label>
        {description && <p className="text-xs text-slate-400 mb-2">{description}</p>}
        <input
            type={type}
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-slate-700 border-slate-600 rounded-md shadow-sm text-white placeholder-slate-400 focus:ring-sky-500 focus:border-sky-500"
        />
    </div>
);

const SelectInput: React.FC<{ label: string; value: string; onChange: (value: string) => void; options: string[] }> = ({ label, value, onChange, options }) => (
    <div>
        <label className="block text-sm font-medium text-white mb-1">{label}</label>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-slate-700 border-slate-600 rounded-md shadow-sm text-white focus:ring-sky-500 focus:border-sky-500"
        >
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);


const RepositorySettingsPage: React.FC<RepositorySettingsPageProps> = ({ repository, onBack }) => {
    const [settings, setSettings] = useState<AllRepositorySettings>(initialSettings);
    const [activeTab, setActiveTab] = useState<Tab>('General');

    const handleReviewChange = <K extends keyof AllRepositorySettings['review']>(key: K, value: AllRepositorySettings['review'][K]) => {
        setSettings(s => ({
            ...s,
            review: {
                ...s.review,
                [key]: value
            }
        }));
    };
    
    const handleKnowledgeBaseChange = <K extends keyof AllRepositorySettings['knowledgeBase']>(key: K, value: AllRepositorySettings['knowledgeBase'][K]) => {
        setSettings(s => ({
            ...s,
            knowledgeBase: {
                ...s.knowledgeBase,
                [key]: value
            }
        }));
    };

    const handleToolsChange = <K extends keyof AllRepositorySettings['tools']>(key: K, value: AllRepositorySettings['tools'][K]) => {
        setSettings(s => ({
            ...s,
            tools: {
                ...s.tools,
                [key]: value
            }
        }));
    };


    const renderContent = () => {
        switch (activeTab) {
            case 'General':
                return (
                    <SettingsSection title="General Settings" description="Configure basic repository settings.">
                        <SelectInput label="Review Language" value={settings.general.review_language} onChange={(v) => setSettings(s => ({...s, general: {...s.general, review_language: v}}))} options={['en', 'es', 'fr', 'de']} />
                        <TextInput label="Tone Instructions" value={settings.general.tone_instructions} onChange={(v) => setSettings(s => ({...s, general: {...s.general, tone_instructions: v}}))} placeholder="e.g., Be formal and professional."/>
                        <Toggle label="Early Access" checked={settings.general.early_access} onChange={(v) => setSettings(s => ({...s, general: {...s.general, early_access: v}}))} />
                        <Toggle label="Enable Free Tier" checked={settings.general.enable_free_tier} onChange={(v) => setSettings(s => ({...s, general: {...s.general, enable_free_tier: v}}))} />
                    </SettingsSection>
                );
            case 'Auto Review':
                return (
                     <SettingsSection title="Auto Review" description="Settings for automatic pull request reviews.">
                        <Toggle label="Automatic Review" checked={settings.autoReview.automatic_review} onChange={v => setSettings(s => ({...s, autoReview: {...s.autoReview, automatic_review: v}}))} description="Enable automatic reviews on new pull requests."/>
                        <Toggle label="Automatic Incremental Review" checked={settings.autoReview.automatic_incremental_review} onChange={v => setSettings(s => ({...s, autoReview: {...s.autoReview, automatic_incremental_review: v}}))} description="Review new commits on existing pull requests."/>
                        <TextInput label="Ignore Title Keywords" value={settings.autoReview.ignore_title_keywords} onChange={v => setSettings(s => ({...s, autoReview: {...s.autoReview, ignore_title_keywords: v}}))} placeholder="WIP, DRAFT" description="Comma-separated keywords in PR titles to ignore." />
                        <TextInput label="Labels" value={settings.autoReview.labels} onChange={v => setSettings(s => ({...s, autoReview: {...s.autoReview, labels: v}}))} placeholder="needs-review" description="Only review PRs with these comma-separated labels." />
                        <TextInput label="Base Branches" value={settings.autoReview.base_branches} onChange={v => setSettings(s => ({...s, autoReview: {...s.autoReview, base_branches: v}}))} placeholder="main, develop" description="Only review PRs targeting these comma-separated branches." />
                        <Toggle label="Review Drafts" checked={settings.autoReview.drafts} onChange={v => setSettings(s => ({...s, autoReview: {...s.autoReview, drafts: v}}))} description="Also review pull requests that are in a draft state."/>
                    </SettingsSection>
                );
            case 'Review':
                 return (
                    <SettingsSection title="Review Workflow" description="Customize the review process and output.">
                        <SubSection title="Content & Summaries">
                             <SelectInput label="Profile" value={settings.review.profile} onChange={v => handleReviewChange('profile', v as ProfileSettingType)} options={Object.values(ProfileSettingType)} />
                             <TextInput label="Path Instructions" value={settings.review.path_instructions} onChange={v => handleReviewChange('path_instructions', v)} placeholder="e.g., Ignore all files in /dist" />
                             <Toggle label="High-Level Summary" checked={settings.review.high_level_summary} onChange={v => handleReviewChange('high_level_summary', v)} />
                             <TextInput label="High-Level Summary Placeholder" value={settings.review.high_level_summary_placeholder} onChange={v => handleReviewChange('high_level_summary_placeholder', v)} />
                             <Toggle label="High-Level Summary in Walkthrough" checked={settings.review.high_level_summary_in_walkthrough} onChange={v => handleReviewChange('high_level_summary_in_walkthrough', v)} />
                             <TextInput label="Auto Title Placeholder" value={settings.review.auto_title_placeholder} onChange={v => handleReviewChange('auto_title_placeholder', v)} />
                             <TextInput label="Auto Title Instructions" value={settings.review.auto_title_instructions} onChange={v => handleReviewChange('auto_title_instructions', v)} />
                             <Toggle label="Changed Files Summary" checked={settings.review.changed_files_summary} onChange={v => handleReviewChange('changed_files_summary', v)} />
                             <Toggle label="Sequence Diagrams" checked={settings.review.sequence_diagrams} onChange={v => handleReviewChange('sequence_diagrams', v)} />
                             <Toggle label="Assess Linked Issues" checked={settings.review.assess_linked_issues} onChange={v => handleReviewChange('assess_linked_issues', v)} />
                             <Toggle label="Related Issues" checked={settings.review.related_issues} onChange={v => handleReviewChange('related_issues', v)} />
                             <Toggle label="Related PRs" checked={settings.review.related_prs} onChange={v => handleReviewChange('related_prs', v)} />
                             <Toggle label="Poem" checked={settings.review.poem} onChange={v => handleReviewChange('poem', v)} description="Include a fun poem in the review summary." />
                        </SubSection>

                        <SubSection title="Automation & Workflow">
                            <Toggle label="Requests Changers Workflow" checked={settings.review.requests_changers_workflow} onChange={v => handleReviewChange('requests_changers_workflow', v)} />
                            <Toggle label="Review Status" checked={settings.review.review_status} onChange={v => handleReviewChange('review_status', v)} />
                            <Toggle label="Commit Status" checked={settings.review.commit_status} onChange={v => handleReviewChange('commit_status', v)} />
                            <Toggle label="Fail Commit Status" checked={settings.review.fail_commit_status} onChange={v => handleReviewChange('fail_commit_status', v)} />
                            <Toggle label="Collapse Walkthrough" checked={settings.review.collapse_walkthrough} onChange={v => handleReviewChange('collapse_walkthrough', v)} />
                            <Toggle label="Suggested Labels" checked={settings.review.suggested_labels} onChange={v => handleReviewChange('suggested_labels', v)} />
                            <Toggle label="Auto Apply Labels" checked={settings.review.auto_apply_labels} onChange={v => handleReviewChange('auto_apply_labels', v)} />
                            <Toggle label="Suggested Reviewers" checked={settings.review.suggested_reviewers} onChange={v => handleReviewChange('suggested_reviewers', v)} />
                            <Toggle label="Auto Assign Reviewers" checked={settings.review.auto_assign_reviewers} onChange={v => handleReviewChange('auto_assign_reviewers', v)} />
                            <TextInput label="Labeling Instructions" value={settings.review.labeling_instructions} onChange={v => handleReviewChange('labeling_instructions', v)} />
                            <TextInput label="Path Filters" value={settings.review.path_filters} onChange={v => handleReviewChange('path_filters', v)} placeholder="e.g., src/**/*.js, !**/__tests__/**" />
                            <Toggle label="Abort on Close" checked={settings.review.abort_on_close} onChange={v => handleReviewChange('abort_on_close', v)} />
                        </SubSection>
                    </SettingsSection>
                );
            case 'Chat':
                return (
                    <SettingsSection title="Chat Settings" description="Configure chat and issue creation integrations.">
                        <Toggle label="Auto Reply" checked={settings.chat.auto_reply} onChange={v => setSettings(s => ({ ...s, chat: { ...s.chat, auto_reply: v } }))} description="Automatically reply to comments and questions." />
                        <Toggle label="Create Issue" checked={settings.chat.create_issue} onChange={v => setSettings(s => ({ ...s, chat: { ...s.chat, create_issue: v } }))} description="Allow creating issues from chat commands." />
                        <SelectInput label="Jira Integration" value={settings.chat.jira} onChange={v => setSettings(s => ({ ...s, chat: { ...s.chat, jira: v as ActiveStatus } }))} options={Object.values(ActiveStatus)} />
                        <SelectInput label="Linear Integration" value={settings.chat.linear} onChange={v => setSettings(s => ({ ...s, chat: { ...s.chat, linear: v as ActiveStatus } }))} options={Object.values(ActiveStatus)} />
                    </SettingsSection>
                );
            case 'Code Generation':
                 return (
                    <SettingsSection title="Code Generation" description="Settings for generating new code and tests.">
                        <TextInput label="Code Generation Language" value={settings.codeGeneration.code_generation_language} onChange={v => setSettings(s => ({ ...s, codeGeneration: { ...s.codeGeneration, code_generation_language: v } }))} placeholder="e.g., TypeScript, Python" />
                        <TextInput label="Path Instructions" value={settings.codeGeneration.path_instructions} onChange={v => setSettings(s => ({ ...s, codeGeneration: { ...s.codeGeneration, path_instructions: v } }))} placeholder="e.g., Place new components in src/components" description="Instructions for where to place generated files." />
                        <TextInput label="Unit Test Generation Framework" value={settings.codeGeneration.unit_test_generation} onChange={v => setSettings(s => ({ ...s, codeGeneration: { ...s.codeGeneration, unit_test_generation: v } }))} placeholder="e.g., Jest, Pytest, JUnit" description="Specify the framework for generating unit tests." />
                    </SettingsSection>
                );
            case 'Finishing Touches':
                return (
                    <SettingsSection title="Finishing Touches" description="Automatically add final touches to pull requests.">
                        <Toggle label="Generate Docstrings" checked={settings.finishingTouches.docstrings} onChange={v => setSettings(s => ({ ...s, finishingTouches: { ...s.finishingTouches, docstrings: v } }))} description="Automatically generate missing docstrings for functions and classes." />
                        <Toggle label="Generate Unit Tests" checked={settings.finishingTouches.unit_tests} onChange={v => setSettings(s => ({ ...s, finishingTouches: { ...s.finishingTouches, unit_tests: v } }))} description="Automatically generate missing unit tests for new code." />
                    </SettingsSection>
                );
            case 'Knowledge Base':
                return (
                    <SettingsSection title="Knowledge Base" description="Control how the AI learns from your repository and other sources.">
                        <SubSection title="Sources">
                            <Toggle label="Enable Knowledge Output" checked={settings.knowledgeBase.out_put} onChange={v => handleKnowledgeBaseChange('out_put', v)} description="Allow the model to generate and store learnings." />
                            <Toggle label="Enable Web Search" checked={settings.knowledgeBase.web_search} onChange={v => handleKnowledgeBaseChange('web_search', v)} description="Allow the model to search the web for context." />
                            <SelectInput label="Learnings Scope" value={settings.knowledgeBase.learnings} onChange={v => handleKnowledgeBaseChange('learnings', v as ScopeStatus)} options={Object.values(ScopeStatus)} />
                            <SelectInput label="Issues Scope" value={settings.knowledgeBase.issues} onChange={v => handleKnowledgeBaseChange('issues', v as ScopeStatus)} options={Object.values(ScopeStatus)} />
                            <SelectInput label="Pull Requests Scope" value={settings.knowledgeBase.pull_requests} onChange={v => handleKnowledgeBaseChange('pull_requests', v as ScopeStatus)} options={Object.values(ScopeStatus)} />
                        </SubSection>
                        <SubSection title="Integrations">
                            <TextInput label="Jira Project Keys" value={settings.knowledgeBase.jira_project_keys} onChange={v => handleKnowledgeBaseChange('jira_project_keys', v)} placeholder="PROJ,CORE" description="Comma-separated Jira project keys to learn from." />
                            <SelectInput label="Linear Integration" value={settings.knowledgeBase.linear} onChange={v => handleKnowledgeBaseChange('linear', v as ActiveStatus)} options={Object.values(ActiveStatus)} />
                            <TextInput label="Linear Team Keys" value={settings.knowledgeBase.linear_team_keys} onChange={v => handleKnowledgeBaseChange('linear_team_keys', v)} placeholder="ENG,DESIGN" description="Comma-separated Linear team keys to learn from." />
                        </SubSection>
                    </SettingsSection>
                );
            case 'Tools':
                 return (
                    <SettingsSection title="Linter & Tool Integrations" description="Enable and configure external analysis tools.">
                        <SubSection title="General">
                             <Toggle label="Enable GitHub Checks" checked={settings.tools.enable_github_checks} onChange={v => handleToolsChange('enable_github_checks', v)} description="Post tool results as GitHub check runs." />
                             <TextInput label="Tool Timeout (ms)" value={settings.tools.timeout_ms} onChange={v => handleToolsChange('timeout_ms', parseInt(v, 10) || 0)} type="number" description="Maximum execution time for any single tool." />
                        </SubSection>
                        <SubSection title="LanguageTool">
                             <Toggle label="Enable LanguageTool" checked={settings.tools.enable_language_tool} onChange={v => handleToolsChange('enable_language_tool', v)} description="Check for grammar and style in text files." />
                             {settings.tools.enable_language_tool && (
                                <div className="pl-4 border-l-2 border-slate-600 mt-4 space-y-4">
                                     <TextInput label="Enabled Rules" value={settings.tools.enabled_rules} onChange={v => handleToolsChange('enabled_rules', v)} placeholder="COMMA_SEPARATED_RULES" />
                                     <TextInput label="Disabled Rules" value={settings.tools.disabled_rules} onChange={v => handleToolsChange('disabled_rules', v)} placeholder="COMMA_SEPARATED_RULES" />
                                     <TextInput label="Enabled Categories" value={settings.tools.enabled_categories} onChange={v => handleToolsChange('enabled_categories', v)} placeholder="COMMA_SEPARATED_CATEGORIES" />
                                     <TextInput label="Disabled Categories" value={settings.tools.disabled_categories} onChange={v => handleToolsChange('disabled_categories', v)} placeholder="COMMA_SEPARATED_CATEGORIES" />
                                     <SelectInput label="Language Level" value={settings.tools.language_level} onChange={v => handleToolsChange('language_level', v as ToolLanguageLevelSetting)} options={Object.values(ToolLanguageLevelSetting)} />
                                     <TextInput label="Rule Directories" value={settings.tools.rule_dirs} onChange={v => handleToolsChange('rule_dirs', v)} placeholder="path/to/rules" />
                                     <TextInput label="Utility Directories" value={settings.tools.util_dirs} onChange={v => handleToolsChange('util_dirs', v)} placeholder="path/to/utils" />
                                     <TextInput label="Packages" value={settings.tools.packages} onChange={v => handleToolsChange('packages', v)} placeholder="e.g., org.languagetool.rules" />
                                     <Toggle label="Enabled Only" checked={settings.tools.enabled_only} onChange={v => handleToolsChange('enabled_only', v)} />
                                     <Toggle label="Essential Rules" checked={settings.tools.essential_rules} onChange={v => handleToolsChange('essential_rules', v)} />
                                </div>
                             )}
                        </SubSection>
                        <SubSection title="Linters & Security Scanners">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                <div>
                                    <Toggle label="GolangCI Lint" checked={settings.tools.enable_golangci_lint} onChange={v => handleToolsChange('enable_golangci_lint', v)} />
                                    {settings.tools.enable_golangci_lint && <TextInput label="Config File" value={settings.tools.config_file} onChange={v => handleToolsChange('config_file', v)} placeholder=".golangci.yml" />}
                                </div>
                                <div>
                                    <Toggle label="PHPStan" checked={settings.tools.enable_php_stan} onChange={v => handleToolsChange('enable_php_stan', v)} />
                                    {settings.tools.enable_php_stan && <SelectInput label="PHPStan Level" value={settings.tools.php_stan_level} onChange={v => handleToolsChange('php_stan_level', v as PhpStanLevelSetting)} options={Object.values(PhpStanLevelSetting)} />}
                                </div>
                                <div>
                                    <Toggle label="SwiftLint" checked={settings.tools.enable_swift_lint} onChange={v => handleToolsChange('enable_swift_lint', v)} />
                                    {settings.tools.enable_swift_lint && <TextInput label="Config File" value={settings.tools.config_file_swift_lint} onChange={v => handleToolsChange('config_file_swift_lint', v)} placeholder=".swiftlint.yml" />}
                                </div>
                                 <div>
                                    <Toggle label="Detekt (Kotlin)" checked={settings.tools.enable_detekt} onChange={v => handleToolsChange('enable_detekt', v)} />
                                    {settings.tools.enable_detekt && <TextInput label="Config File" value={settings.tools.config_file_detekt} onChange={v => handleToolsChange('config_file_detekt', v)} placeholder="detekt.yml" />}
                                </div>
                                 <div>
                                    <Toggle label="Semgrep" checked={settings.tools.enable_semgrep} onChange={v => handleToolsChange('enable_semgrep', v)} />
                                    {settings.tools.enable_semgrep && <TextInput label="Config File" value={settings.tools.config_file_semgrep} onChange={v => handleToolsChange('config_file_semgrep', v)} placeholder=".semgrep.yml" />}
                                </div>
                                <Toggle label="ESLint (JS/TS)" checked={settings.tools.enable_es_lint} onChange={v => handleToolsChange('enable_es_lint', v)} />
                                <Toggle label="Ruff (Python)" checked={settings.tools.enable_ruff} onChange={v => handleToolsChange('enable_ruff', v)} />
                                <Toggle label="RuboCop (Ruby)" checked={settings.tools.enable_rubo_cop} onChange={v => handleToolsChange('enable_rubo_cop', v)} />
                                <Toggle label="ShellCheck" checked={settings.tools.enable_shell_check} onChange={v => handleToolsChange('enable_shell_check', v)} />
                                <Toggle label="Markdownlint" checked={settings.tools.enable_markdownlint} onChange={v => handleToolsChange('enable_markdownlint', v)} />
                                <Toggle label="Biome (JS/TS/JSON)" checked={settings.tools.enable_biome} onChange={v => handleToolsChange('enable_biome', v)} />
                                <Toggle label="Hadolint (Dockerfile)" checked={settings.tools.enable_hadolint} onChange={v => handleToolsChange('enable_hadolint', v)} />
                                <Toggle label="YAML Lint" checked={settings.tools.enable_yaml_lint} onChange={v => handleToolsChange('enable_yaml_lint', v)} />
                                <Toggle label="Gitleaks (Secrets)" checked={settings.tools.enable_gitleaks} onChange={v => handleToolsChange('enable_gitleaks', v)} />
                                <Toggle label="Checkov (IaC)" checked={settings.tools.enable_checkov} onChange={v => handleToolsChange('enable_checkov', v)} />
                                <Toggle label="Buf (Protobuf)" checked={settings.tools.enable_buf} onChange={v => handleToolsChange('enable_buf', v)} />
                                <Toggle label="Regal (Rego)" checked={settings.tools.enable_regal} onChange={v => handleToolsChange('enable_regal', v)} />
                                <Toggle label="Actionlint (GH Actions)" checked={settings.tools.enable_actionlint} onChange={v => handleToolsChange('enable_actionlint', v)} />
                                <Toggle label="CppCheck" checked={settings.tools.enable_cpp_check} onChange={v => handleToolsChange('enable_cpp_check', v)} />
                                <Toggle label="CircleCI" checked={settings.tools.enable_circle_ci} onChange={v => handleToolsChange('enable_circle_ci', v)} />
                                <Toggle label="SQLFluff" checked={settings.tools.enable_sql_fluff} onChange={v => handleToolsChange('enable_sql_fluff', v)} />
                                <Toggle label="Prisma Schema Linting" checked={settings.tools.enable_prisma_schema_linting} onChange={v => handleToolsChange('enable_prisma_schema_linting', v)} />
                                <Toggle label="Oxc (JS/TS)" checked={settings.tools.enable_oxc} onChange={v => handleToolsChange('enable_oxc', v)} />
                                <Toggle label="Shopify Theme Check" checked={settings.tools.enable_shopify_theme_check} onChange={v => handleToolsChange('enable_shopify_theme_check', v)} />
                            </div>
                        </SubSection>
                    </SettingsSection>
                );
            default:
                return <div>Coming soon...</div>;
        }
    };
    
    const tabs: Tab[] = ['General', 'Auto Review', 'Review', 'Chat', 'Code Generation', 'Finishing Touches', 'Knowledge Base', 'Tools'];

    return (
        <div className="p-8">
            <div className="mb-6">
                <button onClick={onBack} className="text-sm text-sky-400 hover:text-sky-300 mb-2">&larr; Back to Repositories</button>
                <h1 className="text-3xl font-bold text-white">{repository.full_name}</h1>
                <p className="text-slate-400">Manage settings for your repository.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                <aside className="md:w-1/4 lg:w-1/5">
                    <nav className="flex flex-col space-y-1">
                        {tabs.map(tab => (
                             <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </aside>
                <main className="flex-1">
                    {renderContent()}
                    <div className="flex justify-end mt-8">
                        <button className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                            Save Changes
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default RepositorySettingsPage;