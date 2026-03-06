'use client';

import { useState } from 'react';

interface ShareResultProps {
  shareText: string;
}

export default function ShareResult({ shareText }: ShareResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const el = document.createElement('textarea');
      el.value = shareText;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Tic Tac Toe Result',
          text: shareText,
        });
      } catch {
        // User cancelled
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="card w-full" style={{ maxWidth: '460px' }}>
      <h3 style={{ fontWeight: 700, marginBottom: '12px' }}>📣 Share Your Result</h3>
      <div className="share-box" style={{ marginBottom: '16px' }}>
        {shareText}
      </div>
      <div className="share-actions">
        <button className="btn btn-primary" onClick={handleCopy}>
          {copied ? '✅ Copied!' : '📋 Copy to Clipboard'}
        </button>
        <button className="btn btn-secondary" onClick={handleShare}>
          🔗 Share
        </button>
      </div>
      {copied && (
        <div className="toast">
          ✅ Result copied to clipboard!
        </div>
      )}
    </div>
  );
}
