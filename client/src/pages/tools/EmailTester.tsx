import React, { useMemo, useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { SEND_TEST_EMAIL } from '../../lib/graphql/mutations';

type SendTestEmailResult = {
  sendTestEmail: {
    success: boolean;
    messageId?: string | null;
    skipped?: boolean | null;
    error?: string | null;
    raw?: string | null;
  };
};

export default function EmailTester() {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('Madarik test email');
  const [mode, setMode] = useState<'text' | 'html'>('text');
  const [text, setText] = useState('Hello from Madarik (test email)\nThis is a simple deliverability test.');
  const [html, setHtml] = useState('<p><strong>Hello from Madarik</strong> (test email)<br/>This is a simple deliverability test.</p>');

  const [send, { data, loading, error, called }] = useMutation<SendTestEmailResult>(SEND_TEST_EMAIL);

  const response = useMemo(() => {
    if (!data) return null;
    const res = data.sendTestEmail;
    try {
      return { ...res, parsed: res.raw ? JSON.parse(res.raw) : null };
    } catch {
      return res;
    }
  }, [data]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await send({
      variables: {
        input: {
          to,
          subject,
          text: mode === 'text' ? text : undefined,
          html: mode === 'html' ? html : undefined,
        },
      },
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto text-gray-100">
      <h1 className="text-2xl font-semibold mb-2">Email Tester</h1>
      <p className="text-gray-400 mb-6">Send a test email via Resend and view detailed response for debugging.</p>

      <form onSubmit={onSubmit} className="space-y-4 bg-slate-900 border border-slate-800 rounded p-4 shadow">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">To</label>
          <input
            type="email"
            required
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="recipient@example.com"
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-gray-100 placeholder:text-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-gray-100"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="mode" checked={mode==='text'} onChange={() => setMode('text')} />
            <span>Plain text</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="mode" checked={mode==='html'} onChange={() => setMode('html')} />
            <span>HTML</span>
          </label>
        </div>

        {mode === 'text' ? (
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Text body</label>
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 font-mono text-gray-100" />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">HTML body</label>
            <textarea value={html} onChange={(e) => setHtml(e.target.value)} rows={8} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 font-mono text-gray-100" />
          </div>
        )}

        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500 disabled:opacity-60">
            {loading ? 'Sending…' : 'Send test email'}
          </button>
          {called && !loading && (
            <span className="text-sm text-gray-400">Done</span>
          )}
        </div>
      </form>

      {/* Debug Panel */}
      <div className="mt-6 bg-slate-900 border border-slate-800 rounded p-4">
        <h2 className="font-medium mb-2 text-gray-200">Debug output</h2>
        {error && (
          <div className="text-red-400 mb-2">GraphQL error: {error.message}</div>
        )}
        {response ? (
          <pre className="whitespace-pre-wrap text-sm overflow-auto max-h-80 text-gray-200">{JSON.stringify(response, null, 2)}</pre>
        ) : (
          <div className="text-gray-400 text-sm">No response yet. Submit the form to send an email.</div>
        )}

        <div className="mt-3 text-xs text-gray-400">
          <p><strong>Tips:</strong></p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Ensure FROM_EMAIL domain is verified in Resend.</li>
            <li>Check suppression list if delivery fails.</li>
            <li>Try sending to a different provider (Gmail/Outlook).</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
