import React, { useState, useEffect } from 'react';
import { Repository, AllRepositorySettings, ActiveStatus, ScopeStatus, ProfileSettingType, ToolLanguageLevelSetting, PhpStanLevelSetting } from '../types';
import Spinner from '../components/Spinner';

// Default settings structure to prevent errors before data is loaded.
const defaultSettings: AllRepositorySettings = {
    general: {
        review_language: 'vi',
        tone_instructions: '',
        early_access: false,
        enable_free_tier: true,
    },
    autoReview: {
        automatic_review: true,
        automatic_incremental_review: false,
        ignore_title_keywords: '',
        labels: '',
        drafts: false,
        base_branches: '',
    },
    chat: {
        auto_reply: false,
        create_issue: false,
        jira: ActiveStatus.DISABLED,
        linear: ActiveStatus.DISABLED,
    },
    codeGeneration: {
        code_generation_language: '',
        path_instructions: '',
        unit_test_generation: '',
    },
    finishingTouches: {
        docstrings: false,
        unit_tests: false,
    },
    knowledgeBase: {
        out_put: false,
        web_search: false,
        learnings: ScopeStatus.DISABLED,
        issues: ScopeStatus.DISABLED,
        jira_project_keys: '',
        linear: ActiveStatus.DISABLED,
        linear_team_keys: '',
        pull_requests: ScopeStatus.DISABLED,
    },
    review: {
        path_instructions: '',
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
        sequence_diagrams: false,
        assess_linked_issues: false,
        related_issues: false,
        related_prs: false,
        suggested_labels: false,
        auto_apply_labels: false,
        suggested_reviewers: false,
        auto_assign_reviewers: false,
        poem: false,
        labeling_instructions: null,
        path_filters: '',
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
        enable_ruff: false,
        enable_markdownlint: false,
        enable_biome: false,
        enable_hadolint: false,
        enable_yaml_lint: false,
        enable_gitleaks: false,
        enable_checkov: false,
        enable_es_lint: false,
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
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-lg p-6 mb-6">
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

const Toggle: React.FC<{ label: string; checked: boolean; description?: string }> = ({ label, checked, description }) => (
    <div className="flex items-center justify-between p-3 bg-slate-900/40 rounded-lg">
        <div>
            <label className="font-medium text-white">{label}</label>
            {description && <p className="text-xs text-slate-400 max-w-xs">{description}</p>}
        </div>
        <button
            type="button"
            className={`${checked ? 'bg-sky-600' : 'bg-slate-600'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors cursor-not-allowed opacity-60`}
            role="switch"
            aria-checked={checked}
            disabled
        >
            <span className={`${checked ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
        </button>
    </div>
);

const TextInput: React.FC<{ label: string; value: string | null | number; placeholder?: string, description?: string, type?: string }> = ({ label, value, placeholder, description, type = 'text' }) => (
    <div>
        <label className="block text-sm font-medium text-white mb-1">{label}</label>
        {description && <p className="text-xs text-slate-400 mb-2">{description}</p>}
        <input
            type={type}
            value={value ?? ''}
            placeholder={placeholder}
            className="w-full bg-slate-700/50 border-slate-600 rounded-md shadow-sm text-white placeholder-slate-400 focus:ring-sky-500 focus:border-sky-500 disabled:bg-slate-800/60 disabled:text-slate-400 disabled:cursor-not-allowed disabled:border-slate-700"
            disabled
        />
    </div>
);

const SelectInput: React.FC<{ label: string; value: string; options: string[] }> = ({ label, value, options }) => (
    <div>
        <label className="block text-sm font-medium text-white mb-1">{label}</label>
        <select
            value={value}
            className="w-full bg-slate-700/50 border-slate-600 rounded-md shadow-sm text-white focus:ring-sky-500 focus:border-sky-500 disabled:bg-slate-800/60 disabled:text-slate-400 disabled:cursor-not-allowed disabled:border-slate-700"
            disabled
        >
            {options.map(opt => <option key={opt} value={opt}>{opt.charAt(0) + opt.slice(1).toLowerCase().replace(/_/g, ' ')}</option>)}
        </select>
    </div>
);


const RepositorySettingsPage: React.FC<RepositorySettingsPageProps> = ({ repository, onBack }) => {
    const [settings, setSettings] = useState<AllRepositorySettings>(defaultSettings);
    const [activeTab, setActiveTab] = useState<Tab>('General');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('jwt');
            if (!token) {
                setError("Authentication token not found. Please log in.");
                setLoading(false);
                return;
            }

            const settingTypes = [
                'general', 'auto_review', 'chat', 'code_generation', 
                'finishing_touches', 'knowledge_base', 'review', 'tools'
            ];

            const typeToStateKey: { [key: string]: keyof AllRepositorySettings } = {
                'general': 'general',
                'auto_review': 'autoReview',
                'chat': 'chat',
                'code_generation': 'codeGeneration',
                'finishing_touches': 'finishingTouches',
                'knowledge_base': 'knowledgeBase',
                'review': 'review',
                'tools': 'tools'
            };

            try {
                const promises = settingTypes.map(type =>
                    fetch(`http://localhost:3000/api/repo-settings?repository_id=${repository.id}&type=${type}`, {
                        headers: { 'Authorization': `Bearer ${token}` },
                        cache: 'no-cache'
                    }).then(res => {
                        if (!res.ok) {
                             if (res.status === 404) return null; // Treat 404 as no settings saved yet, not an error
                            throw new Error(`Failed to fetch ${type} settings (status: ${res.status})`);
                        }
                        return res.json();
                    })
                );

                const results = await Promise.all(promises);
                
                const newSettingsState = JSON.parse(JSON.stringify(defaultSettings));

                results.forEach((data, index) => {
                    const type = settingTypes[index];
                    const stateKey = typeToStateKey[type];
                    if (stateKey && data && typeof data === 'object') {
                        newSettingsState[stateKey] = { ...newSettingsState[stateKey], ...data };
                    }
                });
                
                setSettings(newSettingsState);

            } catch (e) {
                if (e instanceof Error) {
                    setError(`Failed to load repository settings: ${e.message}`);
                } else {
                    setError('An unknown error occurred while fetching settings.');
                }
            } finally {
                setLoading(false);
            }
        };

        if (repository?.id) {
            fetchSettings();
        }
    }, [repository.id]);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'General':
                return (
                    <SettingsSection title="General Settings" description="Configure basic repository settings.">
                        <SelectInput label="Review Language" value={settings.general.review_language} options={['en', 'es', 'fr', 'de', 'vi']} />
                        <TextInput label="Tone Instructions" value={settings.general.tone_instructions} placeholder="e.g., Be formal and professional."/>
                        <Toggle label="Early Access" checked={settings.general.early_access} />
                        <Toggle label="Enable Free Tier" checked={settings.general.enable_free_tier} />
                    </SettingsSection>
                );
            case 'Auto Review':
                return (
                     <SettingsSection title="Auto Review" description="Settings for automatic pull request reviews.">
                        <Toggle label="Automatic Review" checked={settings.autoReview.automatic_review} description="Enable automatic reviews on new pull requests."/>
                        <Toggle label="Automatic Incremental Review" checked={settings.autoReview.automatic_incremental_review} description="Review new commits on existing pull requests."/>
                        <TextInput label="Ignore Title Keywords" value={settings.autoReview.ignore_title_keywords} placeholder="WIP, DRAFT" description="Comma-separated keywords in PR titles to ignore." />
                        <TextInput label="Labels" value={settings.autoReview.labels} placeholder="needs-review" description="Only review PRs with these comma-separated labels." />
                        <TextInput label="Base Branches" value={settings.autoReview.base_branches} placeholder="main, develop" description="Only review PRs targeting these comma-separated branches." />
                        <Toggle label="Review Drafts" checked={settings.autoReview.drafts} description="Also review pull requests that are in a draft state."/>
                    </SettingsSection>
                );
            case 'Review':
                 return (
                    <SettingsSection title="Review Workflow" description="Customize the review process and output.">
                        <SubSection title="Content & Summaries">
                             <SelectInput label="Profile" value={settings.review.profile} options={Object.values(ProfileSettingType)} />
                             <TextInput label="Path Instructions" value={settings.review.path_instructions} placeholder="e.g., Ignore all files in /dist" />
                             <Toggle label="High-Level Summary" checked={settings.review.high_level_summary} />
                             <TextInput label="High-Level Summary Placeholder" value={settings.review.high_level_summary_placeholder} />
                             <Toggle label="High-Level Summary in Walkthrough" checked={settings.review.high_level_summary_in_walkthrough} />
                             <TextInput label="Auto Title Placeholder" value={settings.review.auto_title_placeholder} />
                             <TextInput label="Auto Title Instructions" value={settings.review.auto_title_instructions} />
                             <Toggle label="Changed Files Summary" checked={settings.review.changed_files_summary} />
                             <Toggle label="Sequence Diagrams" checked={settings.review.sequence_diagrams} />
                             <Toggle label="Assess Linked Issues" checked={settings.review.assess_linked_issues} />
                             <Toggle label="Related Issues" checked={settings.review.related_issues} />
                             <Toggle label="Related PRs" checked={settings.review.related_prs} />
                             <Toggle label="Poem" checked={settings.review.poem} description="Include a fun poem in the review summary." />
                        </SubSection>

                        <SubSection title="Automation & Workflow">
                            <Toggle label="Requests Changers Workflow" checked={settings.review.requests_changers_workflow} />
                            <Toggle label="Review Status" checked={settings.review.review_status} />
                            <Toggle label="Commit Status" checked={settings.review.commit_status} />
                            <Toggle label="Fail Commit Status" checked={settings.review.fail_commit_status} />
                            <Toggle label="Collapse Walkthrough" checked={settings.review.collapse_walkthrough} />
                            <Toggle label="Suggested Labels" checked={settings.review.suggested_labels} />
                            <Toggle label="Auto Apply Labels" checked={settings.review.auto_apply_labels} />
                            <Toggle label="Suggested Reviewers" checked={settings.review.suggested_reviewers} />
                            <Toggle label="Auto Assign Reviewers" checked={settings.review.auto_assign_reviewers} />
                            <TextInput label="Labeling Instructions" value={settings.review.labeling_instructions} />
                            <TextInput label="Path Filters" value={settings.review.path_filters} placeholder="e.g., src/**/*.js, !**/__tests__/**" />
                            <Toggle label="Abort on Close" checked={settings.review.abort_on_close} />
                        </SubSection>
                    </SettingsSection>
                );
            case 'Chat':
                return (
                    <SettingsSection title="Chat Settings" description="Configure chat and issue creation integrations.">
                        <Toggle label="Auto Reply" checked={settings.chat.auto_reply} description="Automatically reply to comments and questions." />
                        <Toggle label="Create Issue" checked={settings.chat.create_issue} description="Allow creating issues from chat commands." />
                        <SelectInput label="Jira Integration" value={settings.chat.jira} options={Object.values(ActiveStatus)} />
                        <SelectInput label="Linear Integration" value={settings.chat.linear} options={Object.values(ActiveStatus)} />
                    </SettingsSection>
                );
            case 'Code Generation':
                 return (
                    <SettingsSection title="Code Generation" description="Settings for generating new code and tests.">
                        <TextInput label="Code Generation Language" value={settings.codeGeneration.code_generation_language} placeholder="e.g., TypeScript, Python" />
                        <TextInput label="Path Instructions" value={settings.codeGeneration.path_instructions} placeholder="e.g., Place new components in src/components" description="Instructions for where to place generated files." />
                        <TextInput label="Unit Test Generation Framework" value={settings.codeGeneration.unit_test_generation} placeholder="e.g., Jest, Pytest, JUnit" description="Specify the framework for generating unit tests." />
                    </SettingsSection>
                );
            case 'Finishing Touches':
                return (
                    <SettingsSection title="Finishing Touches" description="Automatically add final touches to pull requests.">
                        <Toggle label="Generate Docstrings" checked={settings.finishingTouches.docstrings} description="Automatically generate missing docstrings for functions and classes." />
                        <Toggle label="Generate Unit Tests" checked={settings.finishingTouches.unit_tests} description="Automatically generate missing unit tests for new code." />
                    </SettingsSection>
                );
            case 'Knowledge Base':
                return (
                    <SettingsSection title="Knowledge Base" description="Control how the AI learns from your repository and other sources.">
                        <SubSection title="Sources">
                            <Toggle label="Enable Knowledge Output" checked={settings.knowledgeBase.out_put} description="Allow the model to generate and store learnings." />
                            <Toggle label="Enable Web Search" checked={settings.knowledgeBase.web_search} description="Allow the model to search the web for context." />
                            <SelectInput label="Learnings Scope" value={settings.knowledgeBase.learnings} options={Object.values(ScopeStatus)} />
                            <SelectInput label="Issues Scope" value={settings.knowledgeBase.issues} options={Object.values(ScopeStatus)} />
                            <SelectInput label="Pull Requests Scope" value={settings.knowledgeBase.pull_requests} options={Object.values(ScopeStatus)} />
                        </SubSection>
                        <SubSection title="Integrations">
                            <TextInput label="Jira Project Keys" value={settings.knowledgeBase.jira_project_keys} placeholder="PROJ,CORE" description="Comma-separated Jira project keys to learn from." />
                            <SelectInput label="Linear Integration" value={settings.knowledgeBase.linear} options={Object.values(ActiveStatus)} />
                            <TextInput label="Linear Team Keys" value={settings.knowledgeBase.linear_team_keys} placeholder="ENG,DESIGN" description="Comma-separated Linear team keys to learn from." />
                        </SubSection>
                    </SettingsSection>
                );
            case 'Tools':
                 return (
                    <SettingsSection title="Linter & Tool Integrations" description="Enable and configure external analysis tools.">
                        <SubSection title="General">
                             <Toggle label="Enable GitHub Checks" checked={settings.tools.enable_github_checks} description="Post tool results as GitHub check runs." />
                             <TextInput label="Tool Timeout (ms)" value={settings.tools.timeout_ms} type="number" description="Maximum execution time for any single tool." />
                        </SubSection>
                        <SubSection title="LanguageTool">
                             <Toggle label="Enable LanguageTool" checked={settings.tools.enable_language_tool} description="Check for grammar and style in text files." />
                             {settings.tools.enable_language_tool && (
                                <div className="pl-4 border-l-2 border-slate-700 mt-4 space-y-4">
                                     <TextInput label="Enabled Rules" value={settings.tools.enabled_rules} placeholder="COMMA_SEPARATED_RULES" />
                                     <TextInput label="Disabled Rules" value={settings.tools.disabled_rules} placeholder="COMMA_SEPARATED_RULES" />
                                     <TextInput label="Enabled Categories" value={settings.tools.enabled_categories} placeholder="COMMA_SEPARATED_CATEGORIES" />
                                     <TextInput label="Disabled Categories" value={settings.tools.disabled_categories} placeholder="COMMA_SEPARATED_CATEGORIES" />
                                     <SelectInput label="Language Level" value={settings.tools.language_level} options={Object.values(ToolLanguageLevelSetting)} />
                                     <TextInput label="Rule Directories" value={settings.tools.rule_dirs} placeholder="path/to/rules" />
                                     <TextInput label="Utility Directories" value={settings.tools.util_dirs} placeholder="path/to/utils" />
                                     <TextInput label="Packages" value={settings.tools.packages} placeholder="e.g., org.languagetool.rules" />
                                     <Toggle label="Enabled Only" checked={settings.tools.enabled_only} />
                                     <Toggle label="Essential Rules" checked={settings.tools.essential_rules} />
                                </div>
                             )}
                        </SubSection>
                        <SubSection title="Linters & Security Scanners">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                <Toggle label="ESLint (JS/TS)" checked={settings.tools.enable_es_lint} />
                                <Toggle label="Ruff (Python)" checked={settings.tools.enable_ruff} />
                                <Toggle label="RuboCop (Ruby)" checked={settings.tools.enable_rubo_cop} />
                                <Toggle label="ShellCheck" checked={settings.tools.enable_shell_check} />
                                <Toggle label="Markdownlint" checked={settings.tools.enable_markdownlint} />
                                <Toggle label="Biome (JS/TS/JSON)" checked={settings.tools.enable_biome} />
                                <Toggle label="Hadolint (Dockerfile)" checked={settings.tools.enable_hadolint} />
                                <Toggle label="YAML Lint" checked={settings.tools.enable_yaml_lint} />
                                <Toggle label="Gitleaks (Secrets)" checked={settings.tools.enable_gitleaks} />
                                <Toggle label="Checkov (IaC)" checked={settings.tools.enable_checkov} />
                                <Toggle label="Buf (Protobuf)" checked={settings.tools.enable_buf} />
                                <Toggle label="Regal (Rego)" checked={settings.tools.enable_regal} />
                                <Toggle label="Actionlint (GH Actions)" checked={settings.tools.enable_actionlint} />
                                <Toggle label="CppCheck" checked={settings.tools.enable_cpp_check} />
                                <Toggle label="CircleCI" checked={settings.tools.enable_circle_ci} />
                                <Toggle label="SQLFluff" checked={settings.tools.enable_sql_fluff} />
                                <Toggle label="Prisma Schema Linting" checked={settings.tools.enable_prisma_schema_linting} />
                                <Toggle label="Oxc (JS/TS)" checked={settings.tools.enable_oxc} />
                                <Toggle label="Shopify Theme Check" checked={settings.tools.enable_shopify_theme_check} />
                                <div>
                                    <Toggle label="GolangCI Lint" checked={settings.tools.enable_golangci_lint} />
                                    {settings.tools.enable_golangci_lint && <TextInput label="Config File" value={settings.tools.config_file} placeholder=".golangci.yml" />}
                                </div>
                                <div>
                                    <Toggle label="PHPStan" checked={settings.tools.enable_php_stan} />
                                    {settings.tools.enable_php_stan && <SelectInput label="PHPStan Level" value={settings.tools.php_stan_level} options={Object.values(PhpStanLevelSetting)} />}
                                </div>
                                <div>
                                    <Toggle label="SwiftLint" checked={settings.tools.enable_swift_lint} />
                                    {settings.tools.enable_swift_lint && <TextInput label="Config File" value={settings.tools.config_file_swift_lint} placeholder=".swiftlint.yml" />}
                                </div>
                                 <div>
                                    <Toggle label="Detekt (Kotlin)" checked={settings.tools.enable_detekt} />
                                    {settings.tools.enable_detekt && <TextInput label="Config File" value={settings.tools.config_file_detekt} placeholder="detekt.yml" />}
                                </div>
                                 <div>
                                    <Toggle label="Semgrep" checked={settings.tools.enable_semgrep} />
                                    {settings.tools.enable_semgrep && <TextInput label="Config File" value={settings.tools.config_file_semgrep} placeholder=".semgrep.yml" />}
                                </div>
                            </div>
                        </SubSection>
                    </SettingsSection>
                );
            default:
                return <div>Coming soon...</div>;
        }
    };
    
    const tabs: Tab[] = ['General', 'Auto Review', 'Review', 'Chat', 'Code Generation', 'Finishing Touches', 'Knowledge Base', 'Tools'];

    const renderSettingsPanel = () => {
        if (loading) {
            return <div className="flex justify-center items-center h-96"><Spinner /></div>;
        }

        if (error) {
            return <div className="text-center py-10 text-red-400 bg-red-900/50 rounded-lg p-4">{error}</div>;
        }

        return renderTabContent();
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Page Header (non-scrolling part) */}
            <div className="p-4 sm:p-6 md:p-8 pb-4 flex-shrink-0">
                <button onClick={onBack} className="text-sm text-sky-400 hover:text-sky-300 mb-2 transition-colors">&larr; Back to Repositories</button>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white bg-clip-text text-transparent bg-gradient-to-r from-sky-300 to-cyan-400 pb-2 break-words">{repository.full_name}</h1>
                <p className="text-slate-400">Manage settings for your repository.</p>
            </div>

            {/* Main Content Area */}
            <div className="flex-grow flex flex-col lg:flex-row gap-8 px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8 overflow-hidden">
                
                {/* Tab Navigation */}
                <aside className="lg:w-56 flex-shrink-0">
                    <nav className="flex flex-row lg:flex-col lg:space-y-1 overflow-x-auto pb-2 lg:pb-0 custom-scrollbar">
                        {tabs.map(tab => (
                             <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 flex-shrink-0 ${activeTab === tab ? 'bg-sky-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Settings Panel (scrollable area) */}
                <main className="flex-1 min-w-0 overflow-y-auto pr-2 custom-scrollbar">
                    {renderSettingsPanel()}
                </main>
            </div>
        </div>
    );
};

export default RepositorySettingsPage;