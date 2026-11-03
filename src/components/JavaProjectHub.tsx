import React, { useState } from 'react';
import JSZip from 'jszip';
import { 
  FileCode, 
  Download, 
  Copy, 
  Check, 
  Terminal, 
  Server, 
  Database, 
  Folder, 
  FileText, 
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { JAVA_PROJECT_FILES, JavaFileItem } from '../data/javaSourceFiles';

export const JavaProjectHub: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<JavaFileItem>(JAVA_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingleFile = (file: JavaFileItem) => {
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadFullZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // Folder structure inside zip
      JAVA_PROJECT_FILES.forEach((file) => {
        zip.file(file.path, file.content);
      });

      // Also add sample webapp static files
      zip.file('src/main/webapp/css/style.css', `/* Custom Tourism Planner Styles */
body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; }
.card-hover:hover { transform: translateY(-4px); transition: transform 0.2s ease-in-out; }
.badge-category { font-size: 0.75rem; text-transform: uppercase; font-weight: 600; }
`);

      zip.file('src/main/webapp/index.jsp', `<%-- Welcome Page forwarding to Destination Explorer --%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<jsp:forward page="/destinations" />
`);

      // Generate zip blob
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'LocalTourismPlanner-JavaWebProject.zip';
      link.click();
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to generate project zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const filteredFiles = JAVA_PROJECT_FILES.filter((f) =>
    activeCategoryFilter === 'all' ? true : f.category === activeCategoryFilter
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
            <Server className="w-3.5 h-3.5" />
            <span>Java Full-Stack Architecture Hub</span>
            <span aria-hidden="true">·</span>
            <span>JSP, Servlets, JDBC, MySQL & Tomcat</span>
          </div>
          <h2 className="font-display text-3xl font-bold text-slate-900 tracking-tight">
            Java Project Source Code Repository
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Complete, production-ready MVC source code including MySQL DDL schema, Java Models,
            JDBC DAOs, Business Services, Controllers, and configuration for Eclipse and IntelliJ.
          </p>
        </div>

        {/* Download Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleDownloadSingleFile(JAVA_PROJECT_FILES[0])}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export schema.sql</span>
          </button>

          <button
            onClick={handleDownloadFullZip}
            disabled={isZipping}
            className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isZipping ? 'Packaging ZIP...' : 'Download Full Project (.ZIP)'}</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2.5 text-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Project Download Complete!</strong> Extract <code>LocalTourismPlanner-JavaWebProject.zip</code> and import into Eclipse or IntelliJ via <code>pom.xml</code>.
          </span>
        </div>
      )}

      {/* Code Browser Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: File Tree / File Selector */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">
            Project Files
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1 mb-3 overflow-x-auto pb-1 no-scrollbar px-1">
            {['all', 'database', 'dao', 'model', 'service', 'servlet', 'config', 'guide'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategoryFilter(cat)}
                className={`px-2 py-1 text-[11px] font-medium rounded-md capitalize whitespace-nowrap transition-colors ${
                  activeCategoryFilter === cat
                    ? 'bg-amber-100 text-amber-900 font-semibold'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* File List */}
          <div className="space-y-1 max-h-[560px] overflow-y-auto">
            {filteredFiles.map((file) => {
              const isSelected = selectedFile.filename === file.filename;
              return (
                <button
                  key={file.filename}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-2.5 rounded-xl transition-colors flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-amber-50/80 border border-amber-300 text-amber-950 font-semibold shadow-xs'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <FileCode
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      isSelected ? 'text-amber-700' : 'text-slate-400'
                    }`}
                  />
                  <div className="overflow-hidden">
                    <div className="text-xs truncate">{file.filename}</div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">{file.path}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Environment Setup Note */}
          <div className="mt-4 pt-4 border-t border-slate-100 p-2 text-[11px] text-slate-500 space-y-1.5">
            <div className="font-semibold text-slate-800 flex items-center gap-1">
              <Terminal className="w-3 h-3 text-emerald-600" />
              Runtime Stack:
            </div>
            <div>• Java 17+ / Jakarta / J2EE</div>
            <div>• Apache Tomcat 9 / 10</div>
            <div>• MySQL 8.0+ (Port 3306)</div>
            <div>• Maven build included (pom.xml)</div>
          </div>
        </div>

        {/* Right: Code Viewer & Actions */}
        <div className="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
          {/* Code Viewer Header */}
          <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="font-mono font-bold text-amber-400 text-sm">
                {selectedFile.filename}
              </span>
              <span className="text-slate-500 font-mono text-[11px] truncate">
                ({selectedFile.path})
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleDownloadSingleFile(selectedFile)}
                className="px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save File</span>
              </button>
            </div>
          </div>

          {/* Description bar */}
          <div className="px-5 py-2 bg-slate-800/50 border-b border-slate-800 text-[11px] text-slate-300">
            {selectedFile.description}
          </div>

          {/* Code Content */}
          <div className="p-5 overflow-x-auto max-h-[580px] font-mono text-xs text-slate-200 leading-relaxed selection:bg-amber-500 selection:text-slate-950">
            <pre>
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
