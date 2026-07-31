'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { BookOpen, Upload, TrendingUp, FileBarChart, ChevronDown, ChevronUp, Mail, MessageCircle, ExternalLink, Search,  } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How do I upload my sales data?',
    answer:
      'Navigate to Data Upload in the sidebar. You can drag and drop a CSV or Excel file, or click to browse. The wizard will guide you through column mapping, validation, and import. Supported formats: .csv, .xlsx, .xls.',
  },
  {
    question: 'What file formats are supported for data upload?',
    answer:
      'SalesForecast supports CSV (.csv) and Excel (.xlsx, .xls) files. Your file should include at minimum a date column and a sales/revenue column. Additional columns like product, region, or channel are optional but improve forecast segmentation.',
  },
  {
    question: 'How do I generate a forecast?',
    answer:
      'Go to Forecast Configuration, select your dataset, set the forecast horizon (how many periods ahead), choose a model (Auto, ARIMA, Prophet, or Exponential Smoothing), and click Run Forecast. Results appear in Forecast Analysis once the run completes.',
  },
  {
    question: 'What do the accuracy metrics mean?',
    answer:
      'MAPE (Mean Absolute Percentage Error) measures average percentage error — lower is better. MAE (Mean Absolute Error) shows average absolute deviation in your units. RMSE (Root Mean Square Error) penalises large errors more heavily. A MAPE below 10% is generally considered a good forecast.',
  },
  {
    question: 'How do I export a forecast report?',
    answer:
      'Open Reports & Export from the sidebar. Choose a report template, select your date range and segments, then click Export. You can download as CSV, Excel, or PDF. Scheduled exports can be configured to run automatically on a recurring basis.',
  },
  {
    question: 'Can I invite team members to my workspace?',
    answer:
      'Yes. Go to Workspace Admin and enter the email address of the person you want to invite. Assign them a role — Viewer (read-only), Editor (can upload data and run forecasts), or Admin (full access including user management).',
  },
  {
    question: 'How does dark mode work?',
    answer:
      'Click the sun/moon icon in the top navigation bar to toggle between light and dark mode. Your preference is saved automatically and persists across sessions.',
  },
  {
    question: 'Why is my forecast showing no data?',
    answer:
      'Forecasts require at least one uploaded dataset. If you see an empty state, start by uploading your sales data via Data Upload, then return to Forecast Configuration to run your first forecast.',
  },
];

const guides = [
  {
    icon: Upload,
    title: 'Getting Started: Upload Data',
    description: 'Learn how to prepare and upload your sales data for the first time.',
    steps: [
      'Go to Data Upload in the left sidebar.',
      'Drag and drop your CSV or Excel file onto the upload area.',
      'Map your columns to the required fields (Date, Sales Value).',
      'Review the validation summary and fix any errors.',
      'Click Import to save the dataset.',
    ],
  },
  {
    icon: TrendingUp,
    title: 'Running Your First Forecast',
    description: 'Configure and execute a sales forecast in minutes.',
    steps: [
      'Navigate to Forecast Configuration.',
      'Select the dataset you uploaded.',
      'Set the forecast horizon (e.g. 12 months).',
      'Choose Auto-select model or pick manually.',
      'Click Run Forecast and wait for results.',
    ],
  },
  {
    icon: FileBarChart,
    title: 'Exporting Reports',
    description: 'Download or schedule forecast reports for stakeholders.',
    steps: [
      'Open Reports & Export from the sidebar.',
      'Select a report template (Summary, Detailed, or Custom).',
      'Choose your date range and any segment filters.',
      'Pick your export format: CSV, Excel, or PDF.',
      'Click Export Now or set up a Scheduled Export.',
    ],
  },
];

export default function HelpDocsPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--primary-bg)' }}
            >
              <BookOpen size={20} style={{ color: 'var(--primary)' }} />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Help & Documentation</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Everything you need to get the most out of SalesForecast.
          </p>
        </div>

        {/* Quick Start Guides */}
        <section>
          <h2 className="text-base font-semibold text-foreground mb-4">Quick Start Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {guides.map((guide) => {
              const GuideIcon = guide.icon;
              return (
                <div
                  key={guide.title}
                  className="rounded-xl p-5 space-y-3"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: 'var(--primary-bg)' }}
                    >
                      <GuideIcon size={16} style={{ color: 'var(--primary)' }} />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground leading-tight">{guide.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">{guide.description}</p>
                  <ol className="space-y-1.5">
                    {guide.steps.map((step, i) => (
                      <li key={i} className="flex gap-2 text-xs text-foreground">
                        <span
                          className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5"
                          style={{ background: 'var(--primary)', color: '#fff' }}
                        >
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-base font-semibold text-foreground mb-4">Frequently Asked Questions</h2>

          {/* Search */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg mb-4"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <Search size={15} className="text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search FAQs…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>

          <div className="space-y-2">
            {filteredFAQs.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No FAQs match your search.
              </p>
            ) : (
              filteredFAQs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-xl overflow-hidden"
                  style={{ border: '1px solid var(--border)' }}
                >
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors"
                    style={{ background: 'var(--card)' }}
                  >
                    <span className="text-sm font-medium text-foreground pr-4">{faq.question}</span>
                    {openFAQ === index ? (
                      <ChevronUp size={16} className="text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown size={16} className="text-muted-foreground shrink-0" />
                    )}
                  </button>
                  {openFAQ === index && (
                    <div
                      className="px-4 pb-4 pt-1 text-sm text-muted-foreground leading-relaxed"
                      style={{ background: 'var(--card)' }}
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Contact / Support */}
        <section>
          <h2 className="text-base font-semibold text-foreground mb-4">Contact Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className="rounded-xl p-5 flex gap-4 items-start"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'var(--info-bg)' }}
              >
                <Mail size={18} style={{ color: 'var(--info)' }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Email Support</p>
                <p className="text-xs text-muted-foreground mt-0.5 mb-2">
                  Send us a message and we'll respond within one business day.
                </p>
                <a
                  href="mailto:support@salesforecast.app"
                  className="text-xs font-medium inline-flex items-center gap-1"
                  style={{ color: 'var(--primary)' }}
                >
                  support@salesforecast.app
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>

            <div
              className="rounded-xl p-5 flex gap-4 items-start"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'var(--positive-bg)' }}
              >
                <MessageCircle size={18} style={{ color: 'var(--positive)' }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Live Chat</p>
                <p className="text-xs text-muted-foreground mt-0.5 mb-2">
                  Chat with our support team in real time during business hours (Mon–Fri, 9am–6pm).
                </p>
                <button
                  className="text-xs font-medium"
                  style={{ color: 'var(--positive)' }}
                >
                  Start a chat session
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
