import { useState, useEffect } from 'react';
import { 
  Table, 
  Kanban, 
  X, 
  Save, 
  User, 
  Building2, 
  Mail, 
  Tag, 
  FileText, 
  AlertCircle,
  ChevronRight
} from 'lucide-react';

// --- TYPES ---
export type Stage = 'Lead' | 'Prospect' | 'Qualified' | 'Customer';

export interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  owner: string;
  labels: string[];
  stage: Stage;
  notes?: string;
}

// --- INITIAL MOCK DATA (10 Contacts) ---
// Intentionally leaving 'Customer' empty and omitting some notes/labels to test edge cases
const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'c-1',
    name: 'Aravind Swaminathan',
    email: 'aravind@nexuscloud.io',
    company: 'NexusCloud',
    role: 'VP of Engineering',
    owner: 'Sarah Jenkins',
    labels: ['High Intent', 'Enterprise'],
    stage: 'Qualified',
    notes: 'Demo completed. Very interested in real-time streaming capabilities.'
  },
  {
    id: 'c-2',
    name: 'Meera Nambiar',
    email: 'meera@finflow.dev',
    company: 'FinFlow',
    role: 'Product Lead',
    owner: 'Sarah Jenkins',
    labels: ['Fintech'],
    stage: 'Prospect',
    notes: 'Evaluating our API against internal legacy tooling.'
  },
  {
    id: 'c-3',
    name: 'Karthik Raja',
    email: 'karthik@hypergrowth.ai',
    company: 'HyperGrowth AI',
    role: 'Founding Engineer',
    owner: 'Alex Rivera',
    labels: ['Inbound', 'AI'],
    stage: 'Lead',
    notes: 'Signed up via homepage waitlist. Needs team workspace seats.'
  },
  {
    id: 'c-4',
    name: 'Divya Krishnan',
    email: 'divya@pulseops.com',
    company: 'PulseOps',
    role: 'Head of Operations',
    owner: 'Sarah Jenkins',
    labels: ['Mid-Market'],
    stage: 'Prospect'
    // Missing notes intentionally
  },
  {
    id: 'c-5',
    name: 'Rohan Deshmukh',
    email: 'rohan@scalegrid.io',
    company: 'ScaleGrid',
    role: 'CTO',
    owner: 'Alex Rivera',
    labels: ['Cloud', 'High Intent'],
    stage: 'Qualified',
    notes: 'Technical security review passed. Discussing 15-seat pilot contract.'
  },
  {
    id: 'c-6',
    name: 'Sneha Rao',
    email: 'sneha@retailstack.in',
    company: 'RetailStack',
    role: 'Engineering Manager',
    owner: 'Sarah Jenkins',
    labels: [], // Empty labels intentionally
    stage: 'Lead',
    notes: 'Requested product teardown documentation for internal review.'
  },
  {
    id: 'c-7',
    name: 'Vikram Joshi',
    email: 'vikram@apextech.co',
    company: 'Apex Technologies',
    role: 'Director of Architecture',
    owner: 'Alex Rivera',
    labels: ['Enterprise'],
    stage: 'Lead'
  },
  {
    id: 'c-8',
    name: 'Ananya Sharma',
    email: 'ananya@syncflow.ai',
    company: 'SyncFlow',
    role: 'Chief AI Architect',
    owner: 'Sarah Jenkins',
    labels: ['AI', 'Partner'],
    stage: 'Qualified',
    notes: 'Wants custom webhook ingestion for automated campaign triggers.'
  },
  {
    id: 'c-9',
    name: 'Gautam Menon',
    email: 'gautam@veritas.systems',
    company: 'Veritas Systems',
    role: 'Solutions Architect',
    owner: 'Alex Rivera',
    labels: ['Security'],
    stage: 'Prospect',
    notes: 'Scheduled follow-up architecture review call.'
  }
];

const STAGES: Stage[] = ['Lead', 'Prospect', 'Qualified', 'Customer'];

const STAGE_CONFIG: Record<Stage, { bg: string; text: string; border: string; dot: string }> = {
  Lead: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  Prospect: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
  Qualified: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  Customer: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' }
};

export default function App() {
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [activeView, setActiveView] = useState<'table' | 'board'>('table');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Draft state for side drawer
  const [draftStage, setDraftStage] = useState<Stage>('Lead');
  const [draftNotes, setDraftNotes] = useState<string>('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Sync draft state whenever a contact is selected
  useEffect(() => {
    if (selectedContact) {
      setDraftStage(selectedContact.stage);
      setDraftNotes(selectedContact.notes || '');
      setHasUnsavedChanges(false);
    }
  }, [selectedContact]);

  // Keyboard accessibility: ESC closes panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedContact) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedContact, hasUnsavedChanges]);

  const handleStageChange = (newStage: Stage) => {
    setDraftStage(newStage);
    setHasUnsavedChanges(true);
  };

  const handleNotesChange = (newNotes: string) => {
    setDraftNotes(newNotes);
    setHasUnsavedChanges(true);
  };

  const saveChanges = () => {
    if (!selectedContact) return;
    
    setContacts(prev => prev.map(c => 
      c.id === selectedContact.id 
        ? { ...c, stage: draftStage, notes: draftNotes.trim() ? draftNotes : undefined }
        : c
    ));
    
    // Update local selection so views remain consistent
    setSelectedContact(prev => prev ? {
      ...prev,
      stage: draftStage,
      notes: draftNotes.trim() ? draftNotes : undefined
    } : null);

    setHasUnsavedChanges(false);
  };

  const closeDrawer = () => {
    if (hasUnsavedChanges) {
      const confirmDiscard = window.confirm('You have unsaved changes. Discard them?');
      if (!confirmDiscard) return;
    }
    setSelectedContact(null);
    setHasUnsavedChanges(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 z-20">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">Workspace Contacts</h1>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {contacts.length} total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Manage pipeline status, interaction notes, and account ownership.</p>
        </div>

        {/* View Switcher Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveView('table')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeView === 'table'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            Table View
          </button>
          <button
            onClick={() => setActiveView('board')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeView === 'board'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            Board View
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto overflow-x-auto">
        {activeView === 'table' ? (
          /* TABLE VIEW */
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Company & Role</th>
                    <th className="py-3 px-4">Stage</th>
                    <th className="py-3 px-4">Owner</th>
                    <th className="py-3 px-4">Labels</th>
                    <th className="py-3 px-4">Notes Preview</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {contacts.map((contact) => (
                    <tr
                      key={contact.id}
                      onClick={() => setSelectedContact(contact)}
                      className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                        selectedContact?.id === contact.id ? 'bg-indigo-50/40' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-medium text-slate-900">
                        <div>{contact.name}</div>
                        <div className="text-xs text-slate-400 font-normal">{contact.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-800">{contact.company}</div>
                        <div className="text-xs text-slate-400">{contact.role}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${STAGE_CONFIG[contact.stage].bg} ${STAGE_CONFIG[contact.stage].text} ${STAGE_CONFIG[contact.stage].border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${STAGE_CONFIG[contact.stage].dot}`}></span>
                          {contact.stage}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600">
                        {contact.owner}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {contact.labels.length > 0 ? (
                            contact.labels.map(label => (
                              <span key={label} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-normal border border-slate-200">
                                {label}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-300 italic">—</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500 max-w-xs truncate">
                        {contact.notes || <span className="text-slate-300 italic">No notes</span>}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-slate-400 hover:text-slate-600 text-xs inline-flex items-center">
                          View <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* BOARD VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
            {STAGES.map((stage) => {
              const stageContacts = contacts.filter((c) => c.stage === stage);
              return (
                <div key={stage} className="bg-slate-100/70 rounded-xl p-3 border border-slate-200/80 flex flex-col min-h-[450px]">
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${STAGE_CONFIG[stage].dot}`}></span>
                      <h2 className="text-sm font-semibold text-slate-800">{stage}</h2>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white text-slate-500 border border-slate-200">
                      {stageContacts.length}
                    </span>
                  </div>

                  {/* Cards List */}
                  <div className="flex-1 flex flex-col gap-2.5">
                    {stageContacts.length > 0 ? (
                      stageContacts.map((contact) => (
                        <div
                          key={contact.id}
                          onClick={() => setSelectedContact(contact)}
                          className={`bg-white p-4 rounded-lg border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm cursor-pointer transition-all ${
                            selectedContact?.id === contact.id ? 'ring-2 ring-indigo-500 border-transparent' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2 mb-1.5">
                            <h3 className="text-sm font-semibold text-slate-900 leading-snug">{contact.name}</h3>
                            <span className="text-[11px] text-slate-400 font-normal shrink-0">{contact.owner}</span>
                          </div>
                          
                          <p className="text-xs text-slate-500 mb-3">{contact.role} · {contact.company}</p>

                          {contact.notes && (
                            <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 mb-3 line-clamp-2 italic">
                              "{contact.notes}"
                            </p>
                          )}

                          <div className="flex flex-wrap gap-1">
                            {contact.labels.map(label => (
                              <span key={label} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-normal border border-slate-200">
                                {label}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      /* Empty State for Empty Stage Group */
                      <div className="h-44 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center p-4 text-center">
                        <AlertCircle className="w-5 h-5 text-slate-300 mb-1.5" />
                        <p className="text-xs font-medium text-slate-500">No {stage.toLowerCase()}s</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Move records here from other stages.</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* DETAILS SLIDE-OVER DRAWER (Shared across Table and Board) */}
      {selectedContact && (
        <div className="fixed inset-0 z-40 overflow-hidden">
          {/* Backdrop */}
          <div 
            onClick={closeDrawer} 
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity" 
          />

          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            <aside className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col z-50">
              {/* Drawer Header */}
              <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-slate-500" />
                  <h2 className="font-semibold text-slate-900">Contact Details</h2>
                </div>
                <button
                  onClick={closeDrawer}
                  aria-label="Close panel"
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Contact Hero Info */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedContact.name}</h3>
                  <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {selectedContact.email}
                  </p>
                </div>

                {/* Read-Only Metadata */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5 flex items-center gap-1">
                      <Building2 className="w-3 h-3" /> Company
                    </span>
                    <span className="font-medium text-slate-700">{selectedContact.company}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Role</span>
                    <span className="font-medium text-slate-700">{selectedContact.role}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Account Owner</span>
                    <span className="font-medium text-slate-700">{selectedContact.owner}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5 flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Labels
                    </span>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {selectedContact.labels.length > 0 ? (
                        selectedContact.labels.map(l => (
                          <span key={l} className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-600 text-[10px]">
                            {l}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 italic">None</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* EDITABLE FIELD 1: Stage */}
                <div>
                  <label htmlFor="stage-select" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Pipeline Stage
                  </label>
                  <select
                    id="stage-select"
                    value={draftStage}
                    onChange={(e) => handleStageChange(e.target.value as Stage)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer font-medium"
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* EDITABLE FIELD 2: Notes */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="notes-textarea" className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      Interaction Notes
                    </label>
                  </div>
                  <textarea
                    id="notes-textarea"
                    rows={5}
                    value={draftNotes}
                    onChange={(e) => handleNotesChange(e.target.value)}
                    placeholder="Record meeting outcomes, next steps, or customer preferences..."
                    className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-y text-slate-800"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Changes are staged locally until you click Save.</p>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {hasUnsavedChanges ? (
                    <span className="text-amber-600 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Unsaved changes
                    </span>
                  ) : (
                    'All changes saved'
                  )}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={closeDrawer}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveChanges}
                    disabled={!hasUnsavedChanges}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save Changes
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}