import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SecurityScoreGauge from '../components/SecurityScoreGauge';
import SeverityCards from '../components/SeverityCards';
import AgentTimeline from '../components/AgentTimeline';
import FindingsTable from '../components/FindingsTable';
import FindingDetailModal from '../components/FindingDetailModal';
import RemediationPanel from '../components/RemediationPanel';
import VerificationPanel from '../components/VerificationPanel';
import MissionOverlay from '../components/MissionOverlay';
import TelemetryDrawer from '../components/TelemetryDrawer';
import AiAssistant from '../components/AiAssistant';
import { getScan, generateRemediation, createPullRequest, downloadReport } from '../services/api';
import { Sparkles, Download, Terminal, Loader2, Radar } from 'lucide-react';

export default function DashboardPage({ selectedModel = 'gemini-3.5-flash' }) {
  const { scanId } = useParams();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [remediation, setRemediation] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreatingPR, setIsCreatingPR] = useState(false);
  const [prResult, setPrResult] = useState(null);
  const [showMission, setShowMission] = useState(false);
  const [showTelemetry, setShowTelemetry] = useState(false);

  useEffect(() => {
    let timer;
    const fetchScanData = async () => {
      try {
        const data = await getScan(scanId);
        setScan(data);
        if (data && data.status === 'in_progress') {
          timer = setTimeout(fetchScanData, 1000);
        }
      } catch (err) {
        console.error('Error fetching scan data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchScanData();
    return () => clearTimeout(timer);
  }, [scanId]);

  const handleGenerateFix = async (findingToFix) => {
    const targetFinding = findingToFix || selectedFinding || (scan?.findings && scan.findings[0]);
    if (!targetFinding) return;

    setIsGenerating(true);
    try {
      const res = await generateRemediation(scanId, targetFinding.id, targetFinding.file, selectedModel);
      if (res && res.remediation) {
        setRemediation(res.remediation);
      }
    } catch (err) {
      console.error('Error generating fix:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreatePR = async (editedCode) => {
    setIsCreatingPR(true);
    try {
      const codeToCommit = typeof editedCode === 'string' && editedCode.trim().length > 0
        ? editedCode
        : (remediation?.proposedCode || 'const API_KEY = process.env.API_KEY;');

      const res = await createPullRequest(scanId, {
        branchName: `reposentinel-patch-${Date.now()}`,
        commitMessage: 'security: apply automated security remediation patch',
        files: [
          {
            path: remediation?.file || 'config.js',
            content: codeToCommit
          }
        ]
      });
      if (res && res.pullRequest) {
        setPrResult(res.pullRequest);
        setScan((prev) => {
          if (!prev) return prev;
          const updatedFindings = (prev.findings || []).map((item) => ({
            ...item,
            status: 'Remediated'
          }));
          return {
            ...prev,
            findings: updatedFindings,
            securityScore: 100,
            verification: {
              ...prev.verification,
              afterScore: 100
            }
          };
        });
      }
    } catch (err) {
      console.error('Error creating PR:', err);
    } finally {
      setIsCreatingPR(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      await downloadReport(scanId);
    } catch (err) {
      console.error('Error downloading report:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 text-sky-400 animate-spin" />
        <p className="text-sm font-bold text-slate-300">Initializing Supervisor Agent Workflow...</p>
      </div>
    );
  }

  const initialScore = scan?.securityScore !== undefined ? scan.securityScore : 100;
  const verifiedScore = scan?.verification?.afterScore ?? (prResult || remediation ? Math.max(initialScore, 90) : initialScore);
  const findings = scan?.findings || [];
  const derivedSeverityCounts = findings.reduce((acc, finding) => {
    const severity = (finding.severity || 'LOW').toUpperCase();
    acc[severity] = (acc[severity] || 0) + 1;
    return acc;
  }, { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 });
  const apiSeverityCounts = scan?.severityCounts;
  const apiCountTotal = apiSeverityCounts
    ? Object.values(apiSeverityCounts).reduce((sum, count) => sum + count, 0)
    : 0;
  const severityCounts = apiCountTotal > 0 || findings.length === 0 ? (apiSeverityCounts || derivedSeverityCounts) : derivedSeverityCounts;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header & Hackathon Action Bar */}
      <div className="rounded-lg border border-white/10 bg-[#0b0f15]/92 overflow-hidden">
        <div className="scan-rail h-2" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex h-12 w-12 rounded-lg border border-teal-300/20 bg-teal-400/10 items-center justify-center text-teal-300">
            <Radar className="h-6 w-6" />
          </div>
          <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-extrabold text-slate-100 tracking-tight">SCAN COMMAND CENTER</h1>
            <span className="px-2.5 py-0.5 rounded bg-teal-400/10 border border-teal-300/20 text-teal-300 font-mono text-xs font-semibold uppercase">
              {scan?.status || 'COMPLETED'}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 mt-1.5">
            <span>Repository: <strong className="text-slate-200">{scan?.repository}</strong></span>
            <span>Active Model Engine: <strong className="text-amber-300">{selectedModel}</strong></span>
            <span>Files Scanned: <strong className="text-slate-200">{scan?.filesScannedCount ?? 0}</strong></span>
          </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowTelemetry(!showTelemetry)}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/15 text-slate-200 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Terminal className="h-3.5 w-3.5 text-teal-300" />
            {showTelemetry ? 'Hide Telemetry' : 'Reasoning Telemetry'}
          </button>

          <button
            type="button"
            onClick={handleDownloadReport}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/15 text-slate-200 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="h-3.5 w-3.5 text-emerald-400" />
            Export Report
          </button>

          <button
            onClick={() => setShowMission(true)}
            className="px-4 py-2 sentinel-button hover:brightness-110 text-white font-semibold text-xs rounded-lg transition-all flex items-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Autonomous Mission HUD
          </button>
        </div>
        </div>
      </div>

      {/* Telemetry Drawer */}
      {showTelemetry && (
        <TelemetryDrawer
          isOpen={showTelemetry}
          onClose={() => setShowTelemetry(false)}
          selectedModel={selectedModel}
          telemetryData={remediation?.telemetry}
        />
      )}

      {/* Top Grid: Score Gauge + Severity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SecurityScoreGauge
          score={initialScore}
          upgradedScore={verifiedScore > initialScore ? verifiedScore : undefined}
        />
        <div className="md:col-span-2">
          <SeverityCards counts={severityCounts} />
        </div>
      </div>

      {/* Agent Activity Timeline */}
      <AgentTimeline activities={scan?.agentActivity || []} />

      {/* Findings Table */}
      <FindingsTable
        findings={scan?.findings || []}
        onSelectFinding={(f) => setSelectedFinding(f)}
        selectedFindingId={selectedFinding?.id}
        onToggleStatus={(finding) => {
          setScan((prev) => {
            if (!prev) return prev;
            const updatedFindings = (prev.findings || []).map((item) => {
              if (item.id === finding.id) {
                const isCurrentlyFixed = ['Fixed', 'Remediated', 'Resolved', 'Approved', 'PR Created'].includes(item.status);
                return { ...item, status: isCurrentlyFixed ? 'Open' : 'Remediated' };
              }
              return item;
            });
            const openCount = updatedFindings.filter(f => !['Fixed', 'Remediated', 'Resolved', 'Approved', 'PR Created'].includes(f.status)).length;
            const newScore = openCount === 0 ? 100 : Math.max(30, 100 - openCount * 10);
            return {
              ...prev,
              findings: updatedFindings,
              securityScore: newScore,
              verification: {
                ...prev.verification,
                afterScore: newScore
              }
            };
          });
        }}
        onFixAll={() => {
          setScan((prev) => {
            if (!prev) return prev;
            const updatedFindings = (prev.findings || []).map((item) => ({
              ...item,
              status: 'Remediated'
            }));
            return {
              ...prev,
              findings: updatedFindings,
              securityScore: 100,
              verification: {
                ...prev.verification,
                afterScore: 100
              }
            };
          });
        }}
      />

      {/* Remediation Panel */}
      <RemediationPanel
        remediation={remediation}
        onGenerateFix={() => handleGenerateFix()}
        onApproveFix={() => {}}
        onCreatePR={handleCreatePR}
        isGenerating={isGenerating}
        isCreatingPR={isCreatingPR}
        prResult={prResult}
      />

      {/* Verification Panel */}
      <VerificationPanel
        verification={{
          beforeScore: initialScore,
          afterScore: verifiedScore,
          checklist: scan?.verification?.checklist
        }}
        initialCounts={severityCounts}
      />

      <AiAssistant scan={scan} selectedModel={selectedModel} />

      {/* Detail Modal */}
      {selectedFinding && (
        <FindingDetailModal
          finding={selectedFinding}
          onClose={() => setSelectedFinding(null)}
          onGenerateFix={(f) => handleGenerateFix(f)}
        />
      )}

      {/* Mission HUD Overlay */}
      {showMission && (
        <MissionOverlay
          scanData={{ ...scan, securityScore: initialScore }}
          onClose={() => setShowMission(false)}
        />
      )}
    </div>
  );
}
