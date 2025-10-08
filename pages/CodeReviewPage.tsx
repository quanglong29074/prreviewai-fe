import React, { useState, useCallback } from 'react';
import { reviewCode } from '../services/geminiService';
import Spinner from '../components/Spinner';

const CodeReviewPage: React.FC = () => {
    const [code, setCode] = useState<string>('');
    const [review, setReview] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleReview = useCallback(async () => {
        if (!code.trim()) {
            setError("Please enter some code to review.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setReview('');

        try {
            const result = await reviewCode(code);
            setReview(result);
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            setError(`Failed to get review: ${errorMessage}`);
            setReview('');
        } finally {
            setIsLoading(false);
        }
    }, [code]);
    
    const formatReview = (text: string): { __html: string } => {
        // This is a simplified markdown to HTML converter.
        // It's not exhaustive but handles the expected format from the Gemini prompt.
        const html = text
            .replace(/### (.*)/g, '<h3 class="text-xl font-semibold mt-4 mb-2 text-sky-300">$1</h3>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/^\* (.*)$/gm, '<li class="ml-4 list-disc">$1</li>')
            .replace(/`([^`]+)`/g, '<code class="bg-slate-700 text-amber-300 px-1 py-0.5 rounded text-sm">$1</code>')
            .replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-800 p-4 rounded-md my-2 overflow-x-auto"><code class="text-sm">$1</code></pre>')
            .replace(/\n/g, '<br />')
            .replace(/(<br \/>){2,}/g, '<br />')
            .replace(/<\/li><br \/>/g, '</li>');

        return { __html: html };
    };

    return (
        <div className="p-4 md:p-8 h-full flex flex-col">
            <h1 className="text-3xl font-bold mb-6 text-white">Automated Code Review</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow">
                {/* Input Panel */}
                <div className="flex flex-col bg-slate-800/50 rounded-lg shadow-lg">
                    <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Your Code</h2>
                    </div>
                    <div className="flex-grow p-1">
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Paste your code here..."
                            className="w-full h-full bg-slate-900 text-slate-300 p-4 rounded-b-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sky-500"
                            style={{minHeight: '400px'}}
                            aria-label="Code Input Area"
                        />
                    </div>
                     <div className="p-4 border-t border-slate-700">
                         <button
                            onClick={handleReview}
                            disabled={isLoading}
                            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                    Analyzing...
                                </>
                            ) : (
                                '✨ Review Code'
                            )}
                        </button>
                    </div>
                </div>

                {/* Output Panel */}
                <div className="flex flex-col bg-slate-800/50 rounded-lg shadow-lg">
                    <div className="p-4 border-b border-slate-700">
                        <h2 className="text-xl font-semibold">Gemini's Feedback</h2>
                    </div>
                    <div className="flex-grow p-4 overflow-y-auto" style={{minHeight: '400px'}} aria-live="polite">
                        {isLoading && <Spinner />}
                        {error && <div className="text-red-400 bg-red-900/50 p-4 rounded-md" role="alert">{error}</div>}
                        {!isLoading && !error && !review && (
                            <div className="text-slate-400 text-center py-10">
                                <p>Your code review feedback will appear here.</p>
                            </div>
                        )}
                        {review && (
                            <div
                                className="prose prose-invert max-w-none"
                                dangerouslySetInnerHTML={formatReview(review)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeReviewPage;