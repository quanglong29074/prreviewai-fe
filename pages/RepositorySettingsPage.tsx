import React, { useState, useEffect } from 'react';
import { Repository, AllRepositorySettings, ActiveStatus, ScopeStatus, ProfileSettingType, ToolLanguageLevelSetting, PhpStanLevelSetting } from '../types';
import Spinner from '../components/Spinner';

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

const Toggle: React.FC<{ label: string; checked: boolean; description?: string; onChange: (checked: boolean) => void }> = ({ label, checked, description, onChange }) => (
    <div className="flex items-center justify-between p-3 bg-slate-900/40 rounded-lg">
        <div>
            <label className="font-medium text-white">{label}</label>
            {description && <p className="text-xs text-slate-400 max-w-xs">{description}</p>}
        </div>
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={`${checked ? 'bg-sky-600' : 'bg-slate-600'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors cursor-pointer hover:opacity-80`}
            role="switch"
            aria-checked={checked}
        >
            <span className={`${checked ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
        </button>
    </div>
);

const TextInput: React.FC<{ label: string; value: string | null | number; placeholder?: string, description?: string, type?: string; onChange: (value: string) => void }> = ({ label, value, placeholder, description, type = 'text', onChange }) => (
    <div>
        <label className="block text-sm font-medium text-white mb-1">{label}</label>
        {description && <p className="text-xs text-slate-400 mb-2">{description}</p>}
        <input
            type={type}
            value={value ?? ''}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-md shadow-sm text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 px-3 py-2"
        />
    </div>
);

const SelectInput: React.FC<{ label: string; value: string; options: string[]; onChange: (value: string) => void }> = ({ label, value, options, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-white mb-1">{label}</label>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-md shadow-sm text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 px-3 py-2"
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
    const [saving, setSaving] = useState<boolean>(false);
    const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
    const [hasChanges, setHasChanges] = useState<boolean>(false);
    
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

    const stateKeyToType: { [key in keyof AllRepositorySettings]: string } = {
        'general': 'general',
        'autoReview': 'auto_review',
        'chat': 'chat',
        'codeGeneration': 'code_generation',
        'finishingTouches': 'finishing_touches',
        'knowledgeBase': 'knowledge_base',
        'review': 'review',
        'tools': 'tools'
    };

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

            try {
                const promises = settingTypes.map(type =>
                    fetch(`http://localhost:3000/api/repo-settings?repository_id=${repository.id}&type=${type}`, {
                        headers: { 'Authorization': `Bearer ${token}` },
                        cache: 'no-cache'
                    }).then(res => {
                        if (!res.ok) {
                            if (res.status === 404) return null;
                            throw new Error(`Failed to fetch ${type} settings (status: ${res.status})`);
                        }
                        return res.json();
                    })
                );

                const results = await Promise.all(promises);
                const newSettingsState = JSON.parse(JSON.stringify(defaultSettings));

                for (const item of results) {
                    if (item) {
                        const { type, data } = item;
                        const stateKey = typeToStateKey[type];
                        if (stateKey && data && typeof data === 'object') {
                            newSettingsState[stateKey] = { ...newSettingsState[stateKey], ...data };
                        }
                    }
                }

                setSettings(newSettingsState);
                setHasChanges(false);
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

    const updateSetting = <K extends keyof AllRepositorySettings>(
        section: K,
        field: keyof AllRepositorySettings[K],
        value: any
    ) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
        setHasChanges(true);
    };

    const saveAllSettings = async () => {
        setSaving(true);
        setSaveSuccess(false);
        setError(null);

        const token = localStorage.getItem('jwt');
        if (!token) {
            setError("Authentication token not found. Please log in.");
            setSaving(false);
            return;
        }

        try {
            const sections: (keyof AllRepositorySettings)[] = [
                'general', 'autoReview', 'chat', 'codeGeneration',
                'finishingTouches', 'knowledgeBase', 'review', 'tools'
            ];

            const savePromises = sections.map(async (section) => {
                const type = stateKeyToType[section];
                const data = settings[section];

                const { created_at, updated_at, ...cleanData } = data || {};

                const body = {
                    repository_id: repository.id,
                    type,
                    data: cleanData
                };

                const response = await fetch('http://localhost:3000/api/repo-settings', {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                });

                if (!response.ok) {
                    throw new Error(`Failed to save ${section} settings (status: ${response.status})`);
                }

                return response.json();
            });

            await Promise.all(savePromises);
            
            setSaveSuccess(true);
            setHasChanges(false);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (e) {
            if (e instanceof Error) {
                setError(`Failed to save settings: ${e.message}`);
            } else {
                setError('An unknown error occurred while saving settings.');
            }
        } finally {
            setSaving(false);
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'General':
                return (
                    <SettingsSection title="General Settings" description="Configure basic repository settings.">
                        <SelectInput label="Review Language" value={settings.general.review_language} options={['en', 'es', 'fr', 'de', 'vi']} onChange={(v) => updateSetting('general', 'review_language', v)} />
                        <TextInput label="Tone Instructions" value={settings.general.tone_instructions} placeholder="e.g., Be formal and professional." onChange={(v) => updateSetting('general', 'tone_instructions', v)} />
                        <Toggle label="Early Access" checked={settings.general.early_access} onChange={(v) => updateSetting('general', 'early_access', v)} />
                        <Toggle label="Enable Free Tier" checked={settings.general.enable_free_tier} onChange={(v) => updateSetting('general', 'enable_free_tier', v)} />
                    </SettingsSection>
                );
            case 'Auto Review':
                return (
                    <SettingsSection title="Auto Review" description="Settings for automatic pull request reviews.">
                        <Toggle label="Automatic Review" checked={settings.autoReview.automatic_review} description="Enable automatic reviews on new pull requests." onChange={(v) => updateSetting('autoReview', 'automatic_review', v)} />
                        <Toggle label="Automatic Incremental Review" checked={settings.autoReview.automatic_incremental_review} description="Review new commits on existing pull requests." onChange={(v) => updateSetting('autoReview', 'automatic_incremental_review', v)} />
                        <TextInput label="Ignore Title Keywords" value={settings.autoReview.ignore_title_keywords} placeholder="WIP, DRAFT" description="Comma-separated keywords in PR titles to ignore." onChange={(v) => updateSetting('autoReview', 'ignore_title_keywords', v)} />
                        <TextInput label="Labels" value={settings.autoReview.labels} placeholder="needs-review" description="Only review PRs with these comma-separated labels." onChange={(v) => updateSetting('autoReview', 'labels', v)} />
                        <TextInput label="Base Branches" value={settings.autoReview.base_branches} placeholder="main, develop" description="Only review PRs targeting these comma-separated branches." onChange={(v) => updateSetting('autoReview', 'base_branches', v)} />
                        <Toggle label="Review Drafts" checked={settings.autoReview.drafts} description="Also review pull requests that are in a draft state." onChange={(v) => updateSetting('autoReview', 'drafts', v)} />
                    </SettingsSection>
                );
            case 'Review':
                return (
                    <SettingsSection title="Review Workflow" description="Customize the review process and output.">
                        <SubSection title="Content & Summaries">
                            <SelectInput label="Profile" value={settings.review.profile} options={Object.values(ProfileSettingType)} onChange={(v) => updateSetting('review', 'profile', v as ProfileSettingType)} />
                            <TextInput label="Path Instructions" value={settings.review.path_instructions} placeholder="e.g., Ignore all files in /dist" onChange={(v) => updateSetting('review', 'path_instructions', v)} />
                            <Toggle label="High-Level Summary" checked={settings.review.high_level_summary} onChange={(v) => updateSetting('review', 'high_level_summary', v)} />
                            <TextInput label="High-Level Summary Placeholder" value={settings.review.high_level_summary_placeholder} onChange={(v) => updateSetting('review', 'high_level_summary_placeholder', v)} />
                            <Toggle label="High-Level Summary in Walkthrough" checked={settings.review.high_level_summary_in_walkthrough} onChange={(v) => updateSetting('review', 'high_level_summary_in_walkthrough', v)} />
                            <TextInput label="Auto Title Placeholder" value={settings.review.auto_title_placeholder} onChange={(v) => updateSetting('review', 'auto_title_placeholder', v)} />
                            <TextInput label="Auto Title Instructions" value={settings.review.auto_title_instructions} onChange={(v) => updateSetting('review', 'auto_title_instructions', v)} />
                            <Toggle label="Changed Files Summary" checked={settings.review.changed_files_summary} onChange={(v) => updateSetting('review', 'changed_files_summary', v)} />
                            <Toggle label="Sequence Diagrams" checked={settings.review.sequence_diagrams} onChange={(v) => updateSetting('review', 'sequence_diagrams', v)} />
                            <Toggle label="Assess Linked Issues" checked={settings.review.assess_linked_issues} onChange={(v) => updateSetting('review', 'assess_linked_issues', v)} />
                            <Toggle label="Related Issues" checked={settings.review.related_issues} onChange={(v) => updateSetting('review', 'related_issues', v)} />
                            <Toggle label="Related PRs" checked={settings.review.related_prs} onChange={(v) => updateSetting('review', 'related_prs', v)} />
                            <Toggle label="Poem" checked={settings.review.poem} description="Include a fun poem in the review summary." onChange={(v) => updateSetting('review', 'poem', v)} />
                        </SubSection>
                        <SubSection title="Automation & Workflow">
                            <Toggle label="Requests Changers Workflow" checked={settings.review.requests_changers_workflow} onChange={(v) => updateSetting('review', 'requests_changers_workflow', v)} />
                            <Toggle label="Review Status" checked={settings.review.review_status} onChange={(v) => updateSetting('review', 'review_status', v)} />
                            <Toggle label="Commit Status" checked={settings.review.commit_status} onChange={(v) => updateSetting('review', 'commit_status', v)} />
                            <Toggle label="Fail Commit Status" checked={settings.review.fail_commit_status} onChange={(v) => updateSetting('review', 'fail_commit_status', v)} />
                            <Toggle label="Collapse Walkthrough" checked={settings.review.collapse_walkthrough} onChange={(v) => updateSetting('review', 'collapse_walkthrough', v)} />
                            <Toggle label="Suggested Labels" checked={settings.review.suggested_labels} onChange={(v) => updateSetting('review', 'suggested_labels', v)} />
                            <Toggle label="Auto Apply Labels" checked={settings.review.auto_apply_labels} onChange={(v) => updateSetting('review', 'auto_apply_labels', v)} />
                            <Toggle label="Suggested Reviewers" checked={settings.review.suggested_reviewers} onChange={(v) => updateSetting('review', 'suggested_reviewers', v)} />
                            <Toggle label="Auto Assign Reviewers" checked={settings.review.auto_assign_reviewers} onChange={(v) => updateSetting('review', 'auto_assign_reviewers', v)} />
                            <TextInput label="Labeling Instructions" value={settings.review.labeling_instructions} onChange={(v) => updateSetting('review', 'labeling_instructions', v)} />
                            <TextInput label="Path Filters" value={settings.review.path_filters} placeholder="e.g., src/**/*.js, !**/__tests__/**" onChange={(v) => updateSetting('review', 'path_filters', v)} />
                            <Toggle label="Abort on Close" checked={settings.review.abort_on_close} onChange={(v) => updateSetting('review', 'abort_on_close', v)} />
                        </SubSection>
                    </SettingsSection>
                );
            case 'Chat':
                return (
                    <SettingsSection title="Chat Settings" description="Configure chat and issue creation integrations.">
                        <Toggle label="Auto Reply" checked={settings.chat.auto_reply} description="Automatically reply to comments and questions." onChange={(v) => updateSetting('chat', 'auto_reply', v)} />
                        <Toggle label="Create Issue" checked={settings.chat.create_issue} description="Allow creating issues from chat commands." onChange={(v) => updateSetting('chat', 'create_issue', v)} />
                        <SelectInput label="Jira Integration" value={settings.chat.jira} options={Object.values(ActiveStatus)} onChange={(v) => updateSetting('chat', 'jira', v as ActiveStatus)} />
                        <SelectInput label="Linear Integration" value={settings.chat.linear} options={Object.values(ActiveStatus)} onChange={(v) => updateSetting('chat', 'linear', v as ActiveStatus)} />
                    </SettingsSection>
                );
            case 'Code Generation':
                return (
                    <SettingsSection title="Code Generation" description="Settings for generating new code and tests.">
                        <TextInput label="Code Generation Language" value={settings.codeGeneration.code_generation_language} placeholder="e.g., TypeScript, Python" onChange={(v) => updateSetting('codeGeneration', 'code_generation_language', v)} />
                        <TextInput label="Path Instructions" value={settings.codeGeneration.path_instructions} placeholder="e.g., Place new components in src/components" description="Instructions for where to place generated files." onChange={(v) => updateSetting('codeGeneration', 'path_instructions', v)} />
                        <TextInput label="Unit Test Generation Framework" value={settings.codeGeneration.unit_test_generation} placeholder="e.g., Jest, Pytest, JUnit" description="Specify the framework for generating unit tests." onChange={(v) => updateSetting('codeGeneration', 'unit_test_generation', v)} />
                    </SettingsSection>
                );
            case 'Finishing Touches':
                return (
                    <SettingsSection title="Finishing Touches" description="Automatically add final touches to pull requests.">
                        <Toggle label="Generate Docstrings" checked={settings.finishingTouches.docstrings} description="Automatically generate missing docstrings for functions and classes." onChange={(v) => updateSetting('finishingTouches', 'docstrings', v)} />
                        <Toggle label="Generate Unit Tests" checked={settings.finishingTouches.unit_tests} description="Automatically generate missing unit tests for new code." onChange={(v) => updateSetting('finishingTouches', 'unit_tests', v)} />
                    </SettingsSection>
                );
            case 'Knowledge Base':
                return (
                    <SettingsSection title="Knowledge Base" description="Control how the AI learns from your repository and other sources.">
                        <SubSection title="Sources">
                            <Toggle label="Enable Knowledge Output" checked={settings.knowledgeBase.out_put} description="Allow the model to generate and store learnings." onChange={(v) => updateSetting('knowledgeBase', 'out_put', v)} />
                            <Toggle label="Enable Web Search" checked={settings.knowledgeBase.web_search} description="Allow the model to search the web for context." onChange={(v) => updateSetting('knowledgeBase', 'web_search', v)} />
                            <SelectInput label="Learnings Scope" value={settings.knowledgeBase.learnings} options={Object.values(ScopeStatus)} onChange={(v) => updateSetting('knowledgeBase', 'learnings', v as ScopeStatus)} />
                            <SelectInput label="Issues Scope" value={settings.knowledgeBase.issues} options={Object.values(ScopeStatus)} onChange={(v) => updateSetting('knowledgeBase', 'issues', v as ScopeStatus)} />
                            <SelectInput label="Pull Requests Scope" value={settings.knowledgeBase.pull_requests} options={Object.values(ScopeStatus)} onChange={(v) => updateSetting('knowledgeBase', 'pull_requests', v as ScopeStatus)} />
                        </SubSection>
                        <SubSection title="Integrations">
                            <TextInput label="Jira Project Keys" value={settings.knowledgeBase.jira_project_keys} placeholder="PROJ,CORE" description="Comma-separated Jira project keys to learn from." onChange={(v) => updateSetting('knowledgeBase', 'jira_project_keys', v)} />
                            <SelectInput label="Linear Integration" value={settings.knowledgeBase.linear} options={Object.values(ActiveStatus)} onChange={(v) => updateSetting('knowledgeBase', 'linear', v as ActiveStatus)} />
                            <TextInput label="Linear Team Keys" value={settings.knowledgeBase.linear_team_keys} placeholder="ENG,DESIGN" description="Comma-separated Linear team keys to learn from." onChange={(v) => updateSetting('knowledgeBase', 'linear_team_keys', v)} />
                        </SubSection>
                    </SettingsSection>
                );
            case 'Tools':
                return (
                    <SettingsSection title="Linter & Tool Integrations" description="Enable and configure external analysis tools.">
                        <SubSection title="General">
                            <Toggle label="Enable GitHub Checks" checked={settings.tools.enable_github_checks} description="Post tool results as GitHub check runs." onChange={(v) => updateSetting('tools', 'enable_github_checks', v)} />
                            <TextInput label="Tool Timeout (ms)" value={settings.tools.timeout_ms} type="number" description="Maximum execution time for any single tool." onChange={(v) => updateSetting('tools', 'timeout_ms', parseInt(v) || 600000)} />
                        </SubSection>
                        <SubSection title="LanguageTool">
                            <Toggle label="Enable LanguageTool" checked={settings.tools.enable_language_tool} description="Check for grammar and style in text files." onChange={(v) => updateSetting('tools', 'enable_language_tool', v)} />
                            {settings.tools.enable_language_tool && (
                                <div className="pl-4 border-l-2 border-slate-700 mt-4 space-y-4">
                                    <TextInput label="Enabled Rules" value={settings.tools.enabled_rules} placeholder="COMMA_SEPARATED_RULES" onChange={(v) => updateSetting('tools', 'enabled_rules', v)} />
                                    <TextInput label="Disabled Rules" value={settings.tools.disabled_rules} placeholder="COMMA_SEPARATED_RULES" onChange={(v) => updateSetting('tools', 'disabled_rules', v)} />
                                    <TextInput label="Enabled Categories" value={settings.tools.enabled_categories} placeholder="COMMA_SEPARATED_CATEGORIES" onChange={(v) => updateSetting('tools', 'enabled_categories', v)} />
                                    <TextInput label="Disabled Categories" value={settings.tools.disabled_categories} placeholder="COMMA_SEPARATED_CATEGORIES" onChange={(v) => updateSetting('tools', 'disabled_categories', v)} />
                                    <SelectInput label="Language Level" value={settings.tools.language_level} options={Object.values(ToolLanguageLevelSetting)} onChange={(v) => updateSetting('tools', 'language_level', v as ToolLanguageLevelSetting)} />
                                    <TextInput label="Rule Directories" value={settings.tools.rule_dirs} placeholder="path/to/rules" onChange={(v) => updateSetting('tools', 'rule_dirs', v)} />
                                    <TextInput label="Utility Directories" value={settings.tools.util_dirs} placeholder="path/to/utils" onChange={(v) => updateSetting('tools', 'util_dirs', v)} />
                                    <TextInput label="Packages" value={settings.tools.packages} placeholder="e.g., org.languagetool.rules" onChange={(v) => updateSetting('tools', 'packages', v)} />
                                    <Toggle label="Enabled Only" checked={settings.tools.enabled_only} onChange={(v) => updateSetting('tools', 'enabled_only', v)} />
                                    <Toggle label="Essential Rules" checked={settings.tools.essential_rules} onChange={(v) => updateSetting('tools', 'essential_rules', v)} />
                                </div>
                            )}
                        </SubSection>
                        <SubSection title="Linters & Security Scanners">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                <Toggle label="ESLint (JS/TS)" checked={settings.tools.enable_es_lint} onChange={(v) => updateSetting('tools', 'enable_es_lint', v)} />
                                <Toggle label="Ruff (Python)" checked={settings.tools.enable_ruff} onChange={(v) => updateSetting('tools', 'enable_ruff', v)} />
                                <Toggle label="RuboCop (Ruby)" checked={settings.tools.enable_rubo_cop} onChange={(v) => updateSetting('tools', 'enable_rubo_cop', v)} />
                                <Toggle label="ShellCheck" checked={settings.tools.enable_shell_check} onChange={(v) => updateSetting('tools', 'enable_shell_check', v)} />
                                <Toggle label="Markdownlint" checked={settings.tools.enable_markdownlint} onChange={(v) => updateSetting('tools', 'enable_markdownlint', v)} />
                                <Toggle label="Biome (JS/TS/JSON)" checked={settings.tools.enable_biome} onChange={(v) => updateSetting('tools', 'enable_biome', v)} />
                                <Toggle label="Hadolint (Dockerfile)" checked={settings.tools.enable_hadolint} onChange={(v) => updateSetting('tools', 'enable_hadolint', v)} />
                                <Toggle label="YAML Lint" checked={settings.tools.enable_yaml_lint} onChange={(v) => updateSetting('tools', 'enable_yaml_lint', v)} />
                                <Toggle label="Gitleaks (Secrets)" checked={settings.tools.enable_gitleaks} onChange={(v) => updateSetting('tools', 'enable_gitleaks', v)} />
                                <Toggle label="Checkov (IaC)" checked={settings.tools.enable_checkov} onChange={(v) => updateSetting('tools', 'enable_checkov', v)} />
                                <Toggle label="Buf (Protobuf)" checked={settings.tools.enable_buf} onChange={(v) => updateSetting('tools', 'enable_buf', v)} />
                                <Toggle label="Regal (Rego)" checked={settings.tools.enable_regal} onChange={(v) => updateSetting('tools', 'enable_regal', v)} />
                                <Toggle label="Actionlint (GH Actions)" checked={settings.tools.enable_actionlint} onChange={(v) => updateSetting('tools', 'enable_actionlint', v)} />
                                <Toggle label="CppCheck" checked={settings.tools.enable_cpp_check} onChange={(v) => updateSetting('tools', 'enable_cpp_check', v)} />
                                <Toggle label="CircleCI" checked={settings.tools.enable_circle_ci} onChange={(v) => updateSetting('tools', 'enable_circle_ci', v)} />
                                <Toggle label="SQLFluff" checked={settings.tools.enable_sql_fluff} onChange={(v) => updateSetting('tools', 'enable_sql_fluff', v)} />
                                <Toggle label="Prisma Schema Linting" checked={settings.tools.enable_prisma_schema_linting} onChange={(v) => updateSetting('tools', 'enable_prisma_schema_linting', v)} />
                                <Toggle label="Oxc (JS/TS)" checked={settings.tools.enable_oxc} onChange={(v) => updateSetting('tools', 'enable_oxc', v)} />
                                <Toggle label="Shopify Theme Check" checked={settings.tools.enable_shopify_theme_check} onChange={(v) => updateSetting('tools', 'enable_shopify_theme_check', v)} />
                                <div>
                                    <Toggle label="GolangCI Lint" checked={settings.tools.enable_golangci_lint} onChange={(v) => updateSetting('tools', 'enable_golangci_lint', v)} />
                                    {settings.tools.enable_golangci_lint && <TextInput label="Config File" value={settings.tools.config_file} placeholder=".golangci.yml" onChange={(v) => updateSetting('tools', 'config_file', v)} />}
                                </div>
                                <div>
                                    <Toggle label="PHPStan" checked={settings.tools.enable_php_stan} onChange={(v) => updateSetting('tools', 'enable_php_stan', v)} />
                                    {settings.tools.enable_php_stan && <SelectInput label="PHPStan Level" value={settings.tools.php_stan_level} options={Object.values(PhpStanLevelSetting)} onChange={(v) => updateSetting('tools', 'php_stan_level', v as PhpStanLevelSetting)} />}
                                </div>
                                <div>
                                    <Toggle label="SwiftLint" checked={settings.tools.enable_swift_lint} onChange={(v) => updateSetting('tools', 'enable_swift_lint', v)} />
                                    {settings.tools.enable_swift_lint && <TextInput label="Config File" value={settings.tools.config_file_swift_lint} placeholder=".swiftlint.yml" onChange={(v) => updateSetting('tools', 'config_file_swift_lint', v)} />}
                                </div>
                                <div>
                                    <Toggle label="Detekt (Kotlin)" checked={settings.tools.enable_detekt} onChange={(v) => updateSetting('tools', 'enable_detekt', v)} />
                                    {settings.tools.enable_detekt && <TextInput label="Config File" value={settings.tools.config_file_detekt} placeholder="detekt.yml" onChange={(v) => updateSetting('tools', 'config_file_detekt', v)} />}
                                </div>
                                <div>
                                    <Toggle label="Semgrep" checked={settings.tools.enable_semgrep} onChange={(v) => updateSetting('tools', 'enable_semgrep', v)} />
                                    {settings.tools.enable_semgrep && <TextInput label="Config File" value={settings.tools.config_file_semgrep} placeholder=".semgrep.yml" onChange={(v) => updateSetting('tools', 'config_file_semgrep', v)} />}
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

        return (
            <>
                {renderTabContent()}
            </>
        );
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="p-4 sm:p-6 md:p-8 pb-4 flex-shrink-0">
                <button onClick={onBack} className="text-sm text-sky-400 hover:text-sky-300 mb-2 transition-colors">&larr; Back to Repositories</button>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white bg-clip-text text-transparent bg-gradient-to-r from-sky-300 to-cyan-400 pb-2 break-words">{repository.full_name}</h1>
                <p className="text-slate-400">Manage settings for your repository.</p>
            </div>

            <div className="flex-grow flex flex-col lg:flex-row gap-8 px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8 overflow-hidden">
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

                <main className="flex-1 min-w-0 overflow-y-auto pr-2 custom-scrollbar pb-20">
                    {renderSettingsPanel()}
                </main>
            </div>

            <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700 p-4 flex-shrink-0 z-10">
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                    <div>
                        {saveSuccess && (
                            <span className="text-green-400 text-sm flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                All settings saved successfully!
                            </span>
                        )}
                        {hasChanges && !saveSuccess && (
                            <span className="text-yellow-400 text-sm flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                You have unsaved changes
                            </span>
                        )}
                    </div>
                    <button
                        onClick={saveAllSettings}
                        disabled={saving || !hasChanges}
                        className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {saving ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving All Settings...
                            </>
                        ) : (
                            'Save All Changes'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RepositorySettingsPage;